-- ============================================================
-- PALTRUEKE — Esquema de base de datos (Fase 1)
-- Pegá este archivo completo en Supabase → SQL Editor → Run
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Tabla principal: publicaciones (necesito / ofrezco / informo)
-- ------------------------------------------------------------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,

  tipo text not null check (tipo in ('necesito', 'ofrezco', 'informo')),
  categoria text not null,
  titulo text not null,
  descripcion text,
  cantidad text,
  colectivo boolean not null default false,

  departamento text not null,
  pais text not null default 'Colombia',
  municipio text not null,
  sector text,

  urgente boolean not null default false,
  contacto text not null,

  estado text not null default 'activa' check (estado in ('activa', 'en_proceso', 'resuelta')),
  verificado boolean not null default false,
  helper_id uuid references auth.users(id)
);

-- Ayuda remota: alguien que ofrece desde otra ciudad o país (por ejemplo,
-- una donación que se envía). "create table if not exists" no agrega
-- columnas a una tabla que ya existe, así que van con ALTER aparte —
-- esto es seguro de volver a correr, no borra nada.
alter table posts add column if not exists remoto boolean not null default false;
alter table posts add column if not exists origen text;

create index if not exists posts_estado_idx on posts (estado);
create index if not exists posts_tipo_idx on posts (tipo);
create index if not exists posts_urgente_idx on posts (urgente);
create index if not exists posts_municipio_idx on posts (municipio);
create index if not exists posts_owner_idx on posts (owner_id);

alter table posts enable row level security;

-- Cualquiera puede leer las publicaciones (la red es pública)
create policy "Cualquiera puede leer publicaciones"
  on posts for select
  using (true);

-- Solo se puede publicar como uno mismo (requiere sesión, incluso anónima)
create policy "Publicar solo como uno mismo"
  on posts for insert
  with check (auth.uid() = owner_id);

-- Solo el autor puede editar su propia publicación
create policy "El autor edita su publicación"
  on posts for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Solo el autor puede eliminar su propia publicación
create policy "El autor elimina su publicación"
  on posts for delete
  using (auth.uid() = owner_id);

-- Nadie puede "autoverificarse": el campo verificado solo lo cambia
-- una operación con la service role key (ej. futuro panel de administración)
create or replace function prevent_self_verify()
returns trigger as $$
begin
  if NEW.verificado is distinct from OLD.verificado and auth.role() <> 'service_role' then
    NEW.verificado := OLD.verificado;
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists posts_prevent_self_verify on posts;
create trigger posts_prevent_self_verify
  before update on posts
  for each row execute function prevent_self_verify();

-- ------------------------------------------------------------
-- Funciones RPC: acciones puntuales y seguras sobre una publicación
-- ------------------------------------------------------------

-- Cualquier usuario con sesión puede marcar "Estoy ayudando", pero solo
-- tiene sentido sobre publicaciones de tipo 'necesito' (una convocatoria
-- que se cierra); en 'ofrezco' el contacto es directo y no se "reclama".
-- Guarda quién ayuda (helper_id) para que esa persona también pueda
-- cerrar la publicación si quien la publicó no vuelve a confirmar.
create or replace function mark_helping(p_id uuid)
returns void as $$
begin
  update posts
  set estado = 'en_proceso', helper_id = auth.uid()
  where id = p_id and estado = 'activa' and tipo = 'necesito';
end;
$$ language plpgsql security definer;

-- Actualiza "updated_at" automáticamente en cualquier cambio,
-- para poder detectar publicaciones olvidadas sin depender de la memoria de nadie.
create or replace function touch_updated_at()
returns trigger as $$
begin
  NEW.updated_at := now();
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists posts_touch_updated_at on posts;
create trigger posts_touch_updated_at
  before update on posts
  for each row execute function touch_updated_at();

-- El autor o quien ayuda pueden marcar como resuelto, cada uno por su cuenta,
-- sin esperar al otro: en una emergencia, menos pasos es más importante
-- que la doble confirmación.
create or replace function mark_resolved(p_id uuid)
returns void as $$
begin
  update posts
  set estado = 'resuelta'
  where id = p_id and (owner_id = auth.uid() or helper_id = auth.uid());
end;
$$ language plpgsql security definer;

-- Se puede "liberar" un pedido desde cualquiera de los dos lados:
-- el autor, si quien dijo que iba a ayudar no aparece; o quien ayuda,
-- si se equivocó al tocar "Ayudar" o ya no puede cumplir.
create or replace function release_helper(p_id uuid)
returns void as $$
begin
  update posts
  set estado = 'activa', helper_id = null
  where id = p_id and estado = 'en_proceso' and (owner_id = auth.uid() or helper_id = auth.uid());
end;
$$ language plpgsql security definer;

grant execute on function mark_helping(uuid) to anon, authenticated;
grant execute on function mark_resolved(uuid) to anon, authenticated;
grant execute on function release_helper(uuid) to anon, authenticated;

-- ------------------------------------------------------------
-- Límites para un uso justo y equitativo de la red
-- ------------------------------------------------------------

-- Máximo 3 pedidos de "necesito" activos a la vez por persona, y
-- máximo 6 publicaciones por día en total (cualquier tipo). Se puede
-- ajustar cambiando estos dos números si hace falta más adelante.
create or replace function enforce_post_limits()
returns trigger as $$
declare
  active_necesito_count int;
  daily_count int;
begin
  if NEW.tipo = 'necesito' then
    select count(*) into active_necesito_count
    from posts
    where owner_id = NEW.owner_id
      and tipo = 'necesito'
      and estado <> 'resuelta';

    if active_necesito_count >= 3 then
      raise exception 'Ya tienes 3 pedidos de ayuda activos. Marca alguno como resuelto antes de crear uno nuevo, para que la red sea justa con todos.';
    end if;
  end if;

  select count(*) into daily_count
  from posts
  where owner_id = NEW.owner_id
    and created_at > now() - interval '24 hours';

  if daily_count >= 6 then
    raise exception 'Llegaste al máximo de 6 publicaciones por día. Probá de nuevo mañana.';
  end if;

  return NEW;
end;
$$ language plpgsql;

drop trigger if exists posts_enforce_limits on posts;
create trigger posts_enforce_limits
  before insert on posts
  for each row execute function enforce_post_limits();

-- ------------------------------------------------------------
-- Tabla de reportes (moderación — base para el panel futuro)
-- ------------------------------------------------------------
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  post_id uuid not null references posts(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  motivo text not null check (
    motivo in ('informacion_falsa', 'spam', 'contenido_ofensivo', 'estafa', 'publicacion_peligrosa', 'otro')
  ),
  detalle text
);

alter table reports enable row level security;

-- Cualquiera con sesión puede reportar, pero solo como uno mismo
create policy "Reportar solo como uno mismo"
  on reports for insert
  with check (auth.uid() = reporter_id);

-- A propósito NO hay política de SELECT/UPDATE/DELETE en "reports":
-- por defecto RLS deniega todo lo que no tenga política explícita,
-- así que solo se pueden leer los reportes con la service role key
-- (por ejemplo, desde un futuro panel de administración).

-- ------------------------------------------------------------
-- Perfil mínimo: el teléfono con el que cada persona se identifica.
-- Se pide una sola vez al entrar por primera vez. Sirve para
-- auto-completar el contacto al publicar, y para poder bloquear
-- a alguien si abusa de la red (ver "blocked_numbers" más abajo).
-- ------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  telefono text not null,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Cada quien ve su propio perfil"
  on profiles for select
  using (auth.uid() = id);

create policy "Cada quien crea su propio perfil"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Cada quien actualiza su propio perfil"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ------------------------------------------------------------
-- Números bloqueados: se gestiona a mano por ahora, desde el
-- SQL Editor o el Table Editor de Supabase (no hay política pública
-- de lectura/escritura a propósito, solo el administrador la toca).
-- ------------------------------------------------------------
create table if not exists blocked_numbers (
  telefono text primary key,
  motivo text,
  created_at timestamptz not null default now()
);

alter table blocked_numbers enable row level security;

-- Compara solo los dígitos, para que "300 123 4567" y "3001234567"
-- se reconozcan como el mismo número.
create or replace function solo_digitos(txt text)
returns text as $$
  select regexp_replace(coalesce(txt, ''), '\\D', '', 'g');
$$ language sql immutable;

-- Antes de publicar, revisa si el teléfono del perfil o el contacto
-- puesto en la publicación están bloqueados.
create or replace function enforce_not_blocked()
returns trigger as $$
declare
  v_telefono text;
begin
  select telefono into v_telefono from profiles where id = NEW.owner_id;

  if exists (
    select 1 from blocked_numbers b
    where (v_telefono is not null and solo_digitos(b.telefono) = solo_digitos(v_telefono))
       or solo_digitos(b.telefono) = solo_digitos(NEW.contacto)
  ) then
    raise exception 'Esta cuenta no puede publicar por el momento. Si crees que es un error, contacta a quienes administran la red.';
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists posts_enforce_not_blocked on posts;
create trigger posts_enforce_not_blocked
  before insert on posts
  for each row execute function enforce_not_blocked();
