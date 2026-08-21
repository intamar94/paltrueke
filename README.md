# PalTrueke

Red comunitaria de ayuda mutua para emergencias en Colombia: **NECESITO → OFREZCO → INFORMO → CONTACTAR → RESUELTO.**

Esta es la **Fase 1**: publicar, ver publicaciones de toda la comunidad, filtrar, contactar y marcar como resuelto.
Las fases 2 y 3 (moderación con panel, tiempo real, mapas, notificaciones) quedan preparadas en la base de datos pero no construidas todavía, tal como se pidió.

---

## 1. Crear el proyecto en Supabase

1. Andá a [supabase.com](https://supabase.com) → **New project**.
2. Cuando esté creado, andá a **Project Settings → API** y copiá:
   - `Project URL`
   - `anon public key`
3. Andá a **Authentication → Providers** y activá **"Anonymous Sign-Ins"**.
   Esto permite que cada persona use la app sin registrarse, pero cada dispositivo tiene una identidad estable para poder editar solo sus propias publicaciones.
4. Andá a **SQL Editor**, pegá el contenido completo de [`supabase/schema.sql`](./supabase/schema.sql) y ejecutalo (**Run**).
   Esto crea las tablas `posts` y `reports`, la seguridad a nivel de fila (RLS), y las funciones necesarias.

---

## 2. Configurar el proyecto localmente

```bash
npm install
cp .env.example .env
```

Abrí `.env` y completá con los datos que copiaste en el paso 1:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-publica
```

Probar en local:

```bash
npm run dev
```

Se abre en `http://localhost:5173`.

---

## 3. Subir a GitHub

```bash
git init
git add .
git commit -m "PalTrueke - Fase 1"
```

Creá un repositorio vacío en GitHub y luego:

```bash
git remote add origin https://github.com/TU-USUARIO/paltrueke.git
git branch -M main
git push -u origin main
```

(El archivo `.env` **no se sube** porque está en `.gitignore` — las claves nunca deben quedar en el repositorio.)

---

## 4. Desplegar en Vercel

1. Andá a [vercel.com](https://vercel.com) → **Add New → Project** → importá el repo de GitHub.
2. En **Environment Variables**, agregá las mismas dos variables del `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy. Vercel detecta Vite automáticamente.

---

## Estructura del proyecto

```
src/
  lib/            → conexión a Supabase, sesión anónima, validación de contacto
  data/           → categorías, tipos, departamentos (listas fijas)
  hooks/usePosts  → carga y refresco periódico de publicaciones
  components/     → pantallas y piezas de UI
```

## Qué quedó listo para las fases siguientes

- La tabla `reports` ya guarda reportes, pero no hay panel para verlos todavía (Fase 2).
- El campo `verificado` existe y está protegido para que nadie se autoverifique (solo se puede cambiar con la *service role key*, es decir, desde un futuro panel admin).
- `mark_helping` / `mark_resolved` / `reopen_post` son funciones separadas de la base de datos, listas para conectarse a tiempo real y notificaciones más adelante.
- Por ahora el municipio se escribe libremente (ne hay una lista cerrada de los ~1100 municipios de Colombia) para no complicar el formulario; se puede sumar un listado oficial (DIVIPOLA) más adelante sin tocar el resto de la app.
