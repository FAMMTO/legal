export type Tone = "accent" | "warning" | "neutral";

export type NavigationItem = {
  href: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
};

export type Stat = {
  label: string;
  value: string;
  hint: string;
  tone?: Tone;
};

export type FeedItem = {
  title: string;
  description: string;
  meta: string;
  statusLabel: string;
  tone?: Tone;
};

export type ChecklistItem = {
  title: string;
  description: string;
};

export type ModuleSection = {
  title: string;
  description: string;
  items: FeedItem[];
};

export type ModuleDefinition = {
  label: string;
  eyebrow: string;
  summary: string;
  highlight: string;
  stats: Stat[];
  checklist: ChecklistItem[];
  sections: ModuleSection[];
  nextIntegration: string[];
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/panel-de-control",
    label: "Panel de control",
    shortLabel: "Panel",
    description: "Vista general de prioridades, actividad y automatizaciones.",
    icon: "PC",
  },
  {
    href: "/empresas",
    label: "Empresas",
    shortLabel: "Empresas",
    description: "Catalogo maestro de sociedades, expedientes y vencimientos.",
    icon: "EM",
  },
  {
    href: "/clientes",
    label: "Clientes",
    shortLabel: "Clientes",
    description: "Relacion con clientes, intake legal y seguimiento comercial.",
    icon: "CL",
  },
  {
    href: "/materialidad",
    label: "Materialidad",
    shortLabel: "Materialidad",
    description: "Evaluacion de riesgos, impacto legal y niveles de escalamiento.",
    icon: "MT",
  },
  {
    href: "/notificaciones",
    label: "Notificaciones",
    shortLabel: "Alertas",
    description: "Alertas operativas, recordatorios y eventos automatizados.",
    icon: "NT",
  },
  {
    href: "/perfil",
    label: "Perfil",
    shortLabel: "Perfil",
    description: "Datos del usuario, seguridad y preferencias del workspace.",
    icon: "PF",
  },
];

export const dashboardStats: Stat[] = [
  {
    label: "Asuntos activos",
    value: "24",
    hint: "12 requieren seguimiento esta semana",
    tone: "accent",
  },
  {
    label: "Revisiones pendientes",
    value: "08",
    hint: "Contratos, poderes y anexos en espera",
    tone: "warning",
  },
  {
    label: "Alertas criticas",
    value: "03",
    hint: "Renovaciones y plazos regulatorios detectados",
    tone: "neutral",
  },
];

export const dashboardSections: ModuleSection[] = [
  {
    title: "Bandeja de prioridades",
    description: "Muestra el trabajo mas urgente que despues conectaremos a Supabase y n8n.",
    items: [
      {
        title: "Actualizar expediente de Grupo Aurora",
        description: "Completar poderes, acta constitutiva y renovacion documental.",
        meta: "Empresas | Alta prioridad",
        statusLabel: "Urgente",
        tone: "warning",
      },
      {
        title: "Validar intake de cliente nuevo",
        description: "Preparar checklist de onboarding y responsables internos.",
        meta: "Clientes | En revision",
        statusLabel: "Listo para flujo",
        tone: "accent",
      },
      {
        title: "Escalamiento por materialidad alta",
        description: "Caso con impacto contractual y reputacional pendiente de asignacion.",
        meta: "Materialidad | Escalar hoy",
        statusLabel: "Escalar",
        tone: "neutral",
      },
    ],
  },
  {
    title: "Actividad reciente",
    description: "Resumen de eventos que despues pueden llegar por webhooks, edge functions o workflows.",
    items: [
      {
        title: "Recordatorio de renovacion programado",
        description: "Workflow de ejemplo para enviar alertas 30 dias antes del vencimiento.",
        meta: "Notificaciones | n8n-ready",
        statusLabel: "Automatizable",
        tone: "accent",
      },
      {
        title: "Perfil de acceso revisado",
        description: "Se dejo preparado el espacio para roles, permisos y auditoria.",
        meta: "Perfil | Seguridad",
        statusLabel: "Preparado",
        tone: "neutral",
      },
      {
        title: "Matriz de materialidad actualizada",
        description: "Se definio el layout para segmentar bajo, medio y alto impacto.",
        meta: "Materialidad | UI base",
        statusLabel: "Visible",
        tone: "warning",
      },
    ],
  },
];

export const dashboardChecklist: ChecklistItem[] = [
  {
    title: "Centralizar intake legal",
    description:
      "Crear un punto de entrada unico para solicitudes internas, clientes y hallazgos automaticos.",
  },
  {
    title: "Activar trazabilidad por asunto",
    description:
      "Cada expediente debera tener propietario, estado, fecha limite y evidencia documental.",
  },
  {
    title: "Preparar tableros automatizados",
    description:
      "La UI ya considera bloques listos para poblarse con datos desde Supabase y notificaciones desde n8n.",
  },
];


export const moduleDefinitions: Record<string, ModuleDefinition> = {
  empresas: {
    label: "Empresas",
    eyebrow: "Gobierno corporativo",
    summary:
      "Modulo preparado para administrar sociedades, responsables, documentos clave y vencimientos corporativos.",
    highlight:
      "Este apartado funcionara como catalogo maestro para expedientes societarios y sus relaciones documentales.",
    stats: [
      {
        label: "Entidades registradas",
        value: "16",
        hint: "Con espacio para filiales, holdings y vehiculos especiales",
        tone: "accent",
      },
      {
        label: "Expedientes por regularizar",
        value: "05",
        hint: "Concentrados en sociedades con poderes desactualizados",
        tone: "warning",
      },
      {
        label: "Proximos vencimientos",
        value: "11",
        hint: "Renovaciones documentales previstas este trimestre",
        tone: "neutral",
      },
    ],
    checklist: [
      {
        title: "Ficha unica por empresa",
        description: "Cada sociedad tendra datos base, representantes, estatus documental y riesgos.",
      },
      {
        title: "Repositorio documental",
        description: "Preparado para conectar a Supabase Storage y versionar documentos criticos.",
      },
      {
        title: "Alertas de cumplimiento",
        description: "n8n podra disparar recordatorios por vencimientos y eventos regulatorios.",
      },
    ],
    sections: [
      {
        title: "Vistas sugeridas",
        description: "Estructura pensada para operar sin friccion desde escritorio y movil.",
        items: [
          {
            title: "Listado ejecutivo",
            description: "Tabla con razon social, jurisdiccion, responsable y nivel de riesgo.",
            meta: "Vista principal",
            statusLabel: "Listo para datos",
            tone: "accent",
          },
          {
            title: "Panel de cumplimiento",
            description: "Bloques para vencimientos, pendientes notariales y obligaciones recurrentes.",
            meta: "Resumen operativo",
            statusLabel: "Planeado",
            tone: "warning",
          },
        ],
      },
      {
        title: "Relaciones futuras",
        description: "La UI ya contempla cruces que despues podremos activar con datos reales.",
        items: [
          {
            title: "Representantes legales",
            description: "Asociacion de personas, poderes y fechas de vigencia por empresa.",
            meta: "Relacion uno a muchos",
            statusLabel: "Modelable",
            tone: "neutral",
          },
          {
            title: "Documentacion clave",
            description: "Actas, poderes, certificados y constancias con versionado posterior.",
            meta: "Storage + metadata",
            statusLabel: "Escalable",
            tone: "accent",
          },
        ],
      },
    ],
    nextIntegration: [
      "Tabla `companies` en Supabase con metadatos societarios y owner interno.",
      "Storage para actas, poderes, certificados y anexos por empresa.",
      "Workflow n8n para avisos de renovacion y disparos por cambios de estado.",
    ],
  },
  clientes: {
    label: "Clientes",
    eyebrow: "Operacion comercial y legal",
    summary:
      "Modulo listo para centralizar intake, segmentacion, seguimiento y documentacion por cliente.",
    highlight:
      "La idea es que este modulo una contexto comercial, legal y operativo sin duplicar informacion entre equipos.",
    stats: [
      {
        label: "Clientes activos",
        value: "43",
        hint: "Separados por cuenta, industria y tipo de relacion",
        tone: "accent",
      },
      {
        label: "Onboardings abiertos",
        value: "07",
        hint: "Con checklist visual para aprobacion interna",
        tone: "warning",
      },
      {
        label: "Solicitudes recientes",
        value: "19",
        hint: "Canalizadas desde intake manual o automatizado",
        tone: "neutral",
      },
    ],
    checklist: [
      {
        title: "Ficha consolidada",
        description: "Datos comerciales, contractuales y de contacto dentro del mismo registro.",
      },
      {
        title: "Seguimiento por etapas",
        description: "Prospecto, onboarding, activo, revision contractual y renovacion.",
      },
      {
        title: "Relacion con expedientes",
        description: "Cada cliente podra vincular asuntos, documentos y notificaciones relevantes.",
      },
    ],
    sections: [
      {
        title: "Embudo recomendado",
        description: "Pensado para visualizar carga y tiempos de respuesta.",
        items: [
          {
            title: "Entrada de solicitudes",
            description: "Tarjetas con origen, prioridad y responsable asignado.",
            meta: "Intake legal",
            statusLabel: "Ideal para n8n",
            tone: "accent",
          },
          {
            title: "Seguimiento comercial-legal",
            description: "Vista para coordinar aprobaciones, redlines y entrega de documentos.",
            meta: "Operacion compartida",
            statusLabel: "Visible",
            tone: "neutral",
          },
        ],
      },
      {
        title: "Espacios de control",
        description: "Componentes preparados para escalar el uso del modulo.",
        items: [
          {
            title: "Historial de interacciones",
            description: "Linea de tiempo para correos, acuerdos, entregas y eventos claves.",
            meta: "Auditoria",
            statusLabel: "Preparado",
            tone: "warning",
          },
          {
            title: "Documentos asociados",
            description: "Contratos, anexos y evidencias con vista previa posterior.",
            meta: "Storage",
            statusLabel: "Conectable",
            tone: "accent",
          },
        ],
      },
    ],
    nextIntegration: [
      "Tabla `clients` con estatus, segmento, responsables y referencias externas.",
      "Relacion `client_requests` para intake y seguimiento por etapas.",
      "Automatizacion n8n para intake desde formularios, correo o APIs externas.",
    ],
  },
  materialidad: {
    label: "Materialidad",
    eyebrow: "Riesgo y priorizacion",
    summary:
      "Pantalla preparada para evaluar impacto legal, reputacional y economico de cada asunto.",
    highlight:
      "Aqui podremos convertir criterios subjetivos en reglas claras de priorizacion, escalamiento y respuesta.",
    stats: [
      {
        label: "Casos en analisis",
        value: "14",
        hint: "Con espacio para clasificacion por severidad e impacto",
        tone: "accent",
      },
      {
        label: "Escalamientos altos",
        value: "04",
        hint: "Listos para activar protocolos y aprobacion senior",
        tone: "warning",
      },
      {
        label: "Matrices vigentes",
        value: "03",
        hint: "Laboral, corporativa y contractual",
        tone: "neutral",
      },
    ],
    checklist: [
      {
        title: "Criterios configurables",
        description: "Impacto financiero, reputacional, operativo y normativo.",
      },
      {
        title: "Motor de priorizacion",
        description: "La UI ya deja el espacio para reglas de semaforo y rutas de escalamiento.",
      },
      {
        title: "Trazabilidad de decisiones",
        description: "Cada cambio de nivel podra quedar auditado con comentario y responsable.",
      },
    ],
    sections: [
      {
        title: "Bloques sugeridos",
        description: "Diseño pensado para una lectura ejecutiva rapida.",
        items: [
          {
            title: "Matriz de impacto",
            description: "Cruce visual entre probabilidad, impacto y urgencia.",
            meta: "Componente principal",
            statusLabel: "Clave",
            tone: "accent",
          },
          {
            title: "Casos priorizados",
            description: "Listado con razones de escalamiento y fecha objetivo de respuesta.",
            meta: "Operacion diaria",
            statusLabel: "Atencion",
            tone: "warning",
          },
        ],
      },
      {
        title: "Capas futuras",
        description: "Preparado para analitica, reglas y automatizaciones.",
        items: [
          {
            title: "Reglas automáticas",
            description: "n8n podra etiquetar o alertar cuando un caso cruce cierto umbral.",
            meta: "Workflow",
            statusLabel: "Automatizable",
            tone: "neutral",
          },
          {
            title: "Historico de evaluaciones",
            description: "Comparativo para entender cambios de riesgo a lo largo del tiempo.",
            meta: "Analitica",
            statusLabel: "Escalable",
            tone: "accent",
          },
        ],
      },
    ],
    nextIntegration: [
      "Tabla `materiality_assessments` con reglas, puntajes y responsable.",
      "Relacion con empresas, clientes y asuntos para evaluacion transversal.",
      "Disparadores n8n para escalar eventos de materialidad alta.",
    ],
  },
  notificaciones: {
    label: "Notificaciones",
    eyebrow: "Alertas y seguimiento",
    summary:
      "Seccion base para centralizar alertas internas, recordatorios y eventos enviados por workflows.",
    highlight:
      "Este modulo sera la capa de visibilidad de n8n: quien debe enterarse, cuando y por que canal.",
    stats: [
      {
        label: "Alertas activas",
        value: "29",
        hint: "Con prioridad, destinatarios y origen del evento",
        tone: "accent",
      },
      {
        label: "Recordatorios criticos",
        value: "06",
        hint: "Pensados para fechas de vencimiento o renovacion",
        tone: "warning",
      },
      {
        label: "Canales contemplados",
        value: "04",
        hint: "App, correo, webhook y resumen diario",
        tone: "neutral",
      },
    ],
    checklist: [
      {
        title: "Centro unificado",
        description: "Una bandeja para eventos humanos y automatizados.",
      },
      {
        title: "Priorizacion visual",
        description: "Alertas por color, severidad y modulo de origen.",
      },
      {
        title: "Historial de entrega",
        description: "Preparado para registrar enviado, leido, descartado o escalado.",
      },
    ],
    sections: [
      {
        title: "Escenarios previstos",
        description: "La interfaz ya cubre casos comunes del flujo legal.",
        items: [
          {
            title: "Vencimientos documentales",
            description: "Avisos previos y alertas el mismo dia segun criticidad.",
            meta: "Empresas",
            statusLabel: "Recurrente",
            tone: "warning",
          },
          {
            title: "Solicitudes nuevas",
            description: "Entrada automatica cuando llegue un caso desde formularios o correo.",
            meta: "Clientes",
            statusLabel: "Intake",
            tone: "accent",
          },
        ],
      },
      {
        title: "Canales y reglas",
        description: "Listo para crecer sin rediseñar la experiencia.",
        items: [
          {
            title: "Centro de bandeja",
            description: "Vista principal con filtros por prioridad, modulo y estado.",
            meta: "App interna",
            statusLabel: "Base",
            tone: "neutral",
          },
          {
            title: "Resumen automatizado",
            description: "Digest diario o semanal enviado por correo o webhook.",
            meta: "n8n + Vercel",
            statusLabel: "Programable",
            tone: "accent",
          },
        ],
      },
    ],
    nextIntegration: [
      "Tabla `notifications` con actor, origen, severidad, payload y estado de lectura.",
      "Tabla `notification_preferences` por usuario y canal.",
      "Workflows n8n para recordatorios, digests y escalaciones por evento.",
    ],
  },
  perfil: {
    label: "Perfil",
    eyebrow: "Identidad y seguridad",
    summary:
      "Vista base del usuario para datos personales, permisos, preferencias y postura de seguridad.",
    highlight:
      "Aunque hoy es solo frontend, esta pantalla ya deja claro el lugar de roles, sesiones y configuracion personal.",
    stats: [
      {
        label: "Rol actual",
        value: "Lead",
        hint: "Preparado para roles por workspace y permisos granulares",
        tone: "accent",
      },
      {
        label: "Sesiones registradas",
        value: "02",
        hint: "Espacio previsto para auditoria y cierre remoto",
        tone: "warning",
      },
      {
        label: "Preferencias activas",
        value: "09",
        hint: "Tema, idioma, alertas y vistas preferidas",
        tone: "neutral",
      },
    ],
    checklist: [
      {
        title: "Datos del usuario",
        description: "Nombre, correo, area, cargo y datos de contacto.",
      },
      {
        title: "Seguridad operativa",
        description: "Proximo espacio para MFA, sesiones y auditoria de accesos.",
      },
      {
        title: "Preferencias del workspace",
        description: "Configuracion de notificaciones, filtros y vistas favoritas.",
      },
    ],
    sections: [
      {
        title: "Capas del perfil",
        description: "Ordenado para que seguridad y experiencia convivan sin ruido.",
        items: [
          {
            title: "Resumen personal",
            description: "Tarjeta principal con rol, area y datos base del usuario.",
            meta: "Identidad",
            statusLabel: "Visible",
            tone: "accent",
          },
          {
            title: "Preferencias de trabajo",
            description: "Panel para idioma, horarios, alertas y vista inicial.",
            meta: "Experiencia",
            statusLabel: "Configurable",
            tone: "neutral",
          },
        ],
      },
      {
        title: "Controles futuros",
        description: "Pensado para integrar autenticacion robusta sin romper la UI.",
        items: [
          {
            title: "Control de sesiones",
            description: "Historial, ubicaciones y opcion de revocar accesos.",
            meta: "Seguridad",
            statusLabel: "Prioritario",
            tone: "warning",
          },
          {
            title: "Permisos por modulo",
            description: "Visualizacion clara de alcance por rol y feature flags.",
            meta: "RLS + autorizacion",
            statusLabel: "Escalable",
            tone: "accent",
          },
        ],
      },
    ],
    nextIntegration: [
      "Supabase Auth para identidad real, sesiones y recuperacion de acceso.",
      "Tabla `profiles` enlazada a `auth.users` con datos operativos del usuario.",
      "Politicas RLS y permisos por modulo para un acceso seguro en multiusuario.",
    ],
  },
};
