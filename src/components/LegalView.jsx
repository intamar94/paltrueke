import { ArrowLeft, CheckCircle2, ShieldCheck, FileText, HeartHandshake, Mail, Cookie, Scale } from "lucide-react";

const RESPONSIBLE = {
  name: "Ingrid Tatiana Mendoza Ariza",
  address: "Bahnhofstraße 5",
  city: "65474 Bischofsheim",
  country: "Deutschland",
  email: "info@paltrueke.co",
};

const pages = {
  "/impressum": {
    title: "Aviso legal",
    icon: Scale,
    intro: "Información de identificación y contacto de la responsable de Pa'l Trueke.",
    sections: [
      ["Responsable del servicio", `${RESPONSIBLE.name}.`],
      ["Domicilio", `${RESPONSIBLE.address}, ${RESPONSIBLE.city}, ${RESPONSIBLE.country}.`],
      ["Contacto", `Correo electrónico: ${RESPONSIBLE.email}.`],
      ["Actividad", "Pa'l Trueke es una plataforma digital orientada a facilitar la conexión entre personas para compartir necesidades, ofertas de ayuda e información comunitaria, principalmente en Colombia."],
      ["Responsabilidad sobre contenidos", "Las publicaciones son aportadas por las personas usuarias. Cada usuario responde por la legalidad, exactitud y derechos asociados al contenido que publica. Pa'l Trueke puede retirar contenido que infrinja la ley, estos términos o que represente un riesgo para la comunidad."],
      ["Resolución de conflictos", "Las cuestiones legales relacionadas con la plataforma se atenderán conforme a las normas imperativas que resulten aplicables. Cuando una norma permita elegir jurisdicción o legislación, se determinará de acuerdo con la situación concreta y la normativa aplicable."],
    ],
    note: "Última actualización: 26 de agosto de 2026. Este aviso legal es informativo y no sustituye asesoría jurídica individual.",
  },
  "/privacidad": {
    title: "Privacidad y datos personales",
    icon: ShieldCheck,
    intro: "Esta política explica qué datos tratamos, para qué los usamos y cómo puedes ejercer tus derechos.",
    sections: [
      ["Quién es la responsable", `La responsable del tratamiento es ${RESPONSIBLE.name}, con domicilio en ${RESPONSIBLE.city}, ${RESPONSIBLE.country}. Para consultas sobre privacidad y ejercicio de derechos: ${RESPONSIBLE.email}.`],
      ["Qué datos podemos tratar", "Podemos tratar datos de cuenta e identificación técnica, número de teléfono o WhatsApp, información que incluyas en tus publicaciones (por ejemplo, departamento, municipio, sector, descripción y contacto), reportes que presentes y datos técnicos necesarios para mantener la sesión y la seguridad del servicio. Las notificaciones push solo se habilitan si las solicitas expresamente."],
      ["Para qué los usamos", "Usamos estos datos para crear y mostrar publicaciones, permitir que las personas coordinen ayudas, mantener la cuenta y la sesión, prevenir abusos, gestionar reportes, resolver publicaciones, enviar notificaciones cuando las hayas activado y atender solicitudes de privacidad o soporte."],
      ["Qué información queda visible", "Una publicación puede mostrar la información que decidas incluir para que otra persona pueda coordinar contigo. En particular, si proporcionas un teléfono o WhatsApp como contacto, puede quedar disponible para las personas que necesiten comunicarse contigo en relación con esa publicación. No publiques contraseñas, códigos, datos bancarios ni información de terceros."],
      ["Base y autorización", "Cuando la ley exige autorización para el tratamiento, Pa'l Trueke solicitará una autorización previa, expresa e informada. Puedes retirar una autorización cuando proceda, sin afectar la legalidad del tratamiento realizado antes del retiro. Algunas operaciones estrictamente necesarias para prestar el servicio o cumplir obligaciones legales pueden tener una base distinta."],
      ["Tus derechos", `Puedes solicitar conocer, actualizar o rectificar tus datos; pedir información sobre su uso; presentar consultas o reclamos; y solicitar la supresión o revocatoria cuando legalmente proceda. Para ejercerlos, escribe a ${RESPONSIBLE.email} indicando el correo asociado a tu cuenta y explicando la solicitud.`],
      ["Con quién se tratan los datos", "Pa'l Trueke utiliza proveedores tecnológicos necesarios para operar el servicio, como alojamiento, base de datos, autenticación, correo y entrega de notificaciones. Estos proveedores deben recibir únicamente la información necesaria para prestar sus servicios. No vendemos datos personales."],
      ["Conservación y seguridad", "Conservamos la información mientras sea necesaria para las finalidades descritas, para mantener la cuenta, atender responsabilidades y cumplir obligaciones legales. Aplicamos controles técnicos y organizativos razonables, pero ningún servicio conectado a Internet puede garantizar seguridad absoluta."],
      ["Transferencias internacionales", "La operación de Pa'l Trueke puede implicar el uso de proveedores tecnológicos cuyos servicios o infraestructura estén ubicados en distintos países. Cuando corresponda, estas transferencias o transmisiones se gestionarán conforme a la normativa aplicable y con las garantías exigidas para la protección de los datos personales."],
      ["Menores de edad", "Pa'l Trueke no busca recopilar deliberadamente datos personales de niños, niñas o adolescentes. Cuando resulte aplicable, cualquier tratamiento de datos de menores se realizará respetando su interés superior, sus derechos fundamentales y las condiciones exigidas por la normativa."],
      ["Cambios a esta política", "Podemos actualizar esta política cuando cambien el servicio, la tecnología o las obligaciones aplicables. Publicaremos la versión vigente en esta página e indicaremos la fecha de actualización."],
    ],
    note: "Marco de referencia: normativa colombiana de protección de datos personales y, cuando resulte aplicable, normativa europea y alemana. Esta política es información general y no sustituye asesoría jurídica profesional.",
  },
  "/terminos": {
    title: "Términos y condiciones",
    icon: FileText,
    intro: "Pa'l Trueke es una red para conectar personas que necesitan ayuda con personas dispuestas a ayudar.",
    sections: [
      ["1. Qué es Pa'l Trueke", "La plataforma facilita la publicación y consulta de necesidades, ofertas e información comunitaria. Pa'l Trueke no es una empresa de transporte, comercio, asistencia médica, seguridad privada ni servicio de emergencias."],
      ["2. Responsabilidad del usuario", "Cada persona responde por la información que publica, por sus contactos y por las acciones que realice a partir de una publicación. No publiques información falsa, engañosa, ilegal, peligrosa o que pueda poner en riesgo a otra persona."],
      ["3. Contacto entre personas", "Una publicación puede generar contacto directo entre desconocidos. Verifica la información antes de actuar, protege tus datos y utiliza lugares y medios seguros cuando una ayuda implique un encuentro presencial."],
      ["4. Prohibiciones", "No utilices la plataforma para estafas, amenazas, acoso, suplantación, venta de bienes o servicios prohibidos, solicitudes fraudulentas, difusión de datos privados de terceros, spam o cualquier actividad contraria a la ley."],
      ["5. Reportes y moderación", "Puedes reportar una publicación que consideres peligrosa, fraudulenta, abusiva o contraria a estas reglas. Pa'l Trueke puede ocultar o retirar contenido y limitar el acceso cuando sea necesario para proteger la comunidad o cumplir la ley."],
      ["6. Ayudas y acuerdos", "Pa'l Trueke no garantiza que una ayuda se concrete, que una persona cumpla lo ofrecido o que la información publicada sea verdadera. Las condiciones de una ayuda deben acordarse directamente entre las personas involucradas."],
      ["7. Disponibilidad", "Intentamos mantener el servicio disponible y seguro, pero pueden existir interrupciones, mantenimiento, errores o cambios de infraestructura. No garantizamos disponibilidad permanente."],
      ["8. Cambios y terminación", "Podemos modificar estas condiciones para adaptarlas al funcionamiento del servicio. También podemos limitar o cerrar cuentas cuando exista abuso, fraude, riesgo para terceros o incumplimiento de estas reglas."],
      ["9. Contacto", `Para dudas, reportes generales o cuestiones relacionadas con estas condiciones: ${RESPONSIBLE.email}.`],
    ],
    note: "Estos términos son una base de uso de la plataforma y deben revisarse jurídicamente antes de una explotación comercial a gran escala.",
  },
  "/seguridad": {
    title: "Seguridad de la comunidad",
    icon: HeartHandshake,
    intro: "Pa'l Trueke conecta vecinos. La seguridad de cada encuentro depende también de las decisiones de las personas que participan.",
    sections: [
      ["Antes de aceptar una ayuda", "Comprueba qué se necesita, qué se ofrece y desde dónde. Si algo parece extraño, urgente de una forma sospechosa o demasiado bueno para ser verdad, no continúes sin verificar."],
      ["Protege tus datos", "Nunca compartas contraseñas, códigos de verificación, claves bancarias, documentos completos ni datos privados innecesarios. Publica únicamente el contacto y la ubicación que necesites para coordinar la ayuda."],
      ["Encuentros presenciales", "Cuando sea posible, coordina en un lugar público o seguro y avisa a alguien de confianza. No te pongas en una situación que te haga sentir en riesgo."],
      ["Emergencias reales", "Pa'l Trueke no sustituye a los servicios oficiales de emergencia. Ante un riesgo inmediato para la vida, la salud o la seguridad, utiliza los servicios de emergencia correspondientes."],
      ["Si ves algo sospechoso", "Utiliza la opción de reportar de la publicación y, si existe un riesgo inmediato, contacta también a la autoridad o servicio de emergencia correspondiente. No confrontes a una persona si hacerlo puede ponerte en peligro."],
      ["Comunidad", "La plataforma funciona mejor cuando las personas son honestas, respetuosas y cuidadosas. Si una ayuda se completa, confirma su resolución para que la información de la red se mantenga útil."],
    ],
    note: "La seguridad física y la actuación ante emergencias siempre tienen prioridad sobre el uso de la plataforma.",
  },
  "/contacto": {
    title: "Contacto",
    icon: Mail,
    intro: "Para consultas sobre Pa'l Trueke, privacidad, reportes o funcionamiento de la plataforma, puedes escribirnos.",
    sections: [
      ["Responsable", `${RESPONSIBLE.name}.`],
      ["Dirección", `${RESPONSIBLE.address}, ${RESPONSIBLE.city}, ${RESPONSIBLE.country}.`],
      ["Correo general", RESPONSIBLE.email],
      ["Privacidad y datos personales", `Utiliza ${RESPONSIBLE.email} para consultas, solicitudes o reclamos relacionados con tus datos personales. Incluye suficiente información para identificar tu cuenta y entender la solicitud, pero no envíes documentos sensibles si no son necesarios.`],
      ["Reportes de seguridad", "Para una publicación problemática, utiliza primero el botón Reportar dentro de la aplicación. Si existe un riesgo inmediato, utiliza además los canales oficiales de emergencia correspondientes."],
      ["Horario y respuesta", "El correo es un canal de contacto de la plataforma. Los tiempos de respuesta pueden variar y no debe utilizarse como canal de emergencias."],
    ],
    note: "Pa'l Trueke está orientada principalmente a Colombia. El correo oficial de contacto es info@paltrueke.co.",
  },
};

const links = [
  ["Aviso legal", "/impressum"],
  ["Privacidad", "/privacidad"],
  ["Términos", "/terminos"],
  ["Seguridad", "/seguridad"],
  ["Contacto", "/contacto"],
];

export default function LegalView({ path, onBack, onNavigate }) {
  const page = pages[path] || pages["/privacidad"];
  const Icon = page.icon;

  const go = (next) => {
    window.history.pushState({}, "", next);
    onNavigate(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "18px 18px 48px" }}>
      <button onClick={onBack} style={{ border: "none", background: "transparent", color: "var(--ink-soft)", padding: "8px 0", display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700 }}>
        <ArrowLeft size={17} /> Volver a Pa'l Trueke
      </button>

      <header style={{ background: "linear-gradient(135deg, #fff, #fff8ed)", border: "1px solid var(--border)", borderRadius: 22, padding: "22px 20px", marginTop: 10, boxShadow: "0 4px 14px rgba(74,51,40,0.05)" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, var(--naranja), #d9a441)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <Icon size={22} />
        </div>
        <h1 className="disp" style={{ margin: 0, fontSize: 30, lineHeight: 1.05, color: "var(--ink)" }}>{page.title}</h1>
        <p style={{ margin: "10px 0 0", color: "var(--ink-soft)", fontSize: 13.5, lineHeight: 1.6 }}>{page.intro}</p>
      </header>

      {page.sections.map(([heading, text]) => (
        <section key={heading} style={{ marginTop: 18, background: "#fff", border: "1px solid var(--border)", borderRadius: 16, padding: "16px 17px" }}>
          <h2 style={{ margin: 0, fontSize: 15, color: "var(--ink)", display: "flex", alignItems: "center", gap: 7 }}>
            <CheckCircle2 size={15} color="var(--verde)" /> {heading}
          </h2>
          <p style={{ margin: "8px 0 0", color: "var(--ink-soft)", fontSize: 13, lineHeight: 1.65 }}>{text}</p>
        </section>
      ))}

      {path === "/privacidad" && (
        <section style={{ marginTop: 18, background: "#fffaf1", border: "1px solid var(--border)", borderRadius: 16, padding: "16px 17px" }}>
          <h2 style={{ margin: 0, fontSize: 15, color: "var(--ink)", display: "flex", alignItems: "center", gap: 7 }}>
            <Cookie size={15} color="var(--naranja)" /> Cookies y almacenamiento local
          </h2>
          <p style={{ margin: "8px 0 0", color: "var(--ink-soft)", fontSize: 13, lineHeight: 1.65 }}>
            Pa'l Trueke utiliza almacenamiento técnico necesario para mantener la sesión y determinadas preferencias, además de tecnologías propias del funcionamiento de la aplicación. Actualmente no usamos cookies de publicidad ni herramientas de seguimiento de terceros con fines de perfilado. Si en el futuro incorporamos tecnologías no necesarias para prestar el servicio, informaremos y solicitaremos el consentimiento que corresponda antes de activarlas.
          </p>
        </section>
      )}

      <div style={{ marginTop: 20, padding: "13px 15px", background: "#f7ecdc", borderRadius: 14, color: "var(--muted)", fontSize: 11.5, lineHeight: 1.55 }}>
        {page.note}
      </div>

      <nav aria-label="Documentos legales" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 22 }}>
        {links.map(([label, target]) => (
          <button key={target} onClick={() => go(target)} style={{ border: "1px solid var(--border)", background: "#fff", color: "var(--ink-soft)", borderRadius: 999, padding: "7px 11px", fontSize: 11.5 }}>
            {label}
          </button>
        ))}
      </nav>
    </main>
  );
}
