import { BankFolder, DocumentTypeDefinition, ProfileRequirementRule } from "@/src/types/bankForm";

export const DEFAULT_BANKS: BankFolder[] = [
  {
    id: "bbva",
    name: "BBVA Colombia",
    code: "BBVA",
    color: "#004481",
    description: "Formularios y radicación de solicitudes de crédito BBVA",
    active: true,
    portalUrl: "https://www.bbva.com.co",
    order: 1,
    templates: [
      {
        id: "tpl_bbva_solicitud",
        bankId: "bbva",
        title: "Solicitud Única de Crédito BBVA",
        description: "Formulario oficial en PDF editable para crédito de consumo e hipotecario",
        fileUrl: "",
        fileName: "solicitud_credito_bbva_editable.pdf",
        formType: "pdf_acroform",
        createdAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: "itau",
    name: "Banco Itaú",
    code: "ITAU",
    color: "#ec7000",
    description: "Documentación y solicitudes crédito de vehículo y consumo Itaú",
    active: true,
    portalUrl: "https://www.itau.co",
    order: 2,
    templates: [
      {
        id: "tpl_itau_solicitud",
        bankId: "itau",
        title: "Formulario Digital de Crédito Itaú",
        description: "Planilla de radicación de crédito de libre inversión y vehículos",
        fileUrl: "",
        fileName: "formulario_solicitud_itau.pdf",
        formType: "pdf_acroform",
        createdAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: "av_villas",
    name: "Banco AV Villas",
    code: "AV_VILLAS",
    color: "#007a33",
    description: "Radicación de líneas de crédito AV Villas",
    active: true,
    portalUrl: "https://www.avvillas.com.co",
    order: 3,
    templates: [
      {
        id: "tpl_villas_solicitud",
        bankId: "av_villas",
        title: "Solicitud Crédito Personal AV Villas",
        description: "Formulario oficial de vinculación y solicitud de crédito",
        fileUrl: "",
        fileName: "solicitud_av_villas_consumo.pdf",
        formType: "pdf_acroform",
        createdAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: "bogota",
    name: "Banco de Bogotá",
    code: "BOGOTA",
    color: "#002b66",
    description: "Formatos y solicitudes Banco de Bogotá",
    active: true,
    portalUrl: "https://www.bancodebogota.com",
    order: 4,
    templates: [
      {
        id: "tpl_bogota_solicitud",
        bankId: "bogota",
        title: "Solicitud Productos Financieros Banco de Bogotá",
        description: "Formato integral de radicación para crédito comercial y personal",
        fileUrl: "",
        fileName: "solicitud_banco_bogota.pdf",
        formType: "pdf_acroform",
        createdAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: "bancolombia",
    name: "Bancolombia",
    code: "BANCOLOMBIA",
    color: "#fdc300",
    description: "Solicitud y anexos de crédito persona natural y jurídica Bancolombia",
    active: true,
    portalUrl: "https://www.bancolombia.com",
    order: 5,
    templates: [
      {
        id: "tpl_bancolombia_solicitud",
        bankId: "bancolombia",
        title: "Solicitud Única de Vinculación y Crédito Bancolombia",
        description: "Planilla de radicación oficial Bancolombia en PDF",
        fileUrl: "",
        fileName: "solicitud_credito_bancolombia.pdf",
        formType: "pdf_acroform",
        createdAt: new Date().toISOString(),
      }
    ]
  }
];

export const ALL_DOCUMENT_TYPES: DocumentTypeDefinition[] = [
  { id: "cedula", label: "Cédula de Ciudadanía", category: "personal", description: "Copia ampliada de la cédula al 150%" },
  { id: "certificacion_laboral", label: "Certificación Laboral", category: "laboral", description: "Fecha de expedición no mayor a 30 días" },
  { id: "desprendibles_nomina", label: "Desprendibles de Nómina", category: "laboral", description: "Últimos 2 o 3 meses de desprendibles de pago" },
  { id: "declaracion_renta", label: "Declaración de Renta", category: "financiero", description: "Último año gravable presentado" },
  { id: "extractos_bancarios", label: "Extractos Bancarios", category: "financiero", description: "Últimos 3 meses completos de extractos" },
  { id: "certificacion_ingresos_retenciones", label: "Certificado de Ingresos y Retenciones", category: "laboral", description: "Formulario 220 de la DIAN" },
  { id: "certificado_pension", label: "Certificado o Resolución de Pensión", category: "laboral", description: "Resolución de fondo de pensiones" },
  { id: "desprendibles_pension", label: "Desprendibles de Pensión", category: "laboral", description: "Últimos 3 comprobantes de pensión" },
  { id: "contrato", label: "Contrato de Prestación de Servicios", category: "laboral", description: "Contratos vigentes firmados" },
  { id: "rut", label: "Registro Único Tributario (RUT)", category: "personal", description: "Actualizado con código CIIU visible" },
  { id: "tarjeta_propiedad_vehiculo", label: "Tarjeta de Propiedad del Vehículo", category: "vehiculo", description: "Licencia de tránsito del vehículo" },
  { id: "certificacion_empresa_vehiculo", label: "Certificación Empresa de Vehículo", category: "vehiculo", description: "Certificado de vinculación a la empresa de transporte" },
  { id: "camara_comercio", label: "Cámara y Comercio", category: "empresa", description: "Certificado de existencia con vigencia no mayor a 30 días" },
  { id: "composicion_accionaria", label: "Composición Accionaria", category: "empresa", description: "Certificación firmada por contador/revisor fiscal" },
  { id: "estados_financieros", label: "Estados Financieros", category: "financiero", description: "Balance general y P&G del último corte" },
  { id: "tarjeta_profesional_contador", label: "Tarjeta Profesional Contador", category: "empresa", description: "Copia de TP y antecedentes de la Junta Central" },
  { id: "contratos_arrendamiento", label: "Contratos de Arrendamiento", category: "propiedad", description: "Contratos de alquiler de inmuebles vigentes" },
  { id: "certificacion_tradicion_libertad", label: "Certificado de Tradición y Libertad", category: "propiedad", description: "Vigencia no mayor a 30 días de los inmuebles" },
];

export const PROFILE_REQUIREMENT_MATRIX: ProfileRequirementRule[] = [
  {
    activityProfile: "asalariado_empleado",
    profileLabel: "Empleado (Asalariado)",
    activityCategory: "ASALARIADO",
    requiredDocuments: {
      bbva: ["cedula", "certificacion_laboral", "desprendibles_nomina", "certificacion_ingresos_retenciones"],
      itau: ["cedula", "certificacion_laboral", "desprendibles_nomina", "declaracion_renta", "certificacion_ingresos_retenciones"],
      av_villas: ["cedula", "certificacion_laboral", "desprendibles_nomina", "declaracion_renta"],
      bogota: ["cedula", "certificacion_laboral", "desprendibles_nomina", "declaracion_renta", "certificacion_ingresos_retenciones"],
      bancolombia: ["cedula", "certificacion_laboral", "desprendibles_nomina"],
    },
  },
  {
    activityProfile: "pensionado",
    profileLabel: "Pensionado",
    activityCategory: "PENSIONADO",
    requiredDocuments: {
      bbva: ["cedula", "certificado_pension", "desprendibles_pension"],
      itau: ["cedula", "certificado_pension", "extractos_bancarios", "desprendibles_pension"],
      av_villas: ["cedula", "certificado_pension", "desprendibles_pension"],
      bogota: ["cedula", "certificado_pension", "extractos_bancarios", "desprendibles_pension"],
      bancolombia: ["cedula", "extractos_bancarios", "desprendibles_pension"],
    },
  },
  {
    activityProfile: "independiente_prestador",
    profileLabel: "Prestador de Servicios",
    activityCategory: "INDEPENDIENTES",
    requiredDocuments: {
      bbva: ["cedula", "contrato", "rut", "declaracion_renta", "extractos_bancarios"],
      itau: ["cedula", "contrato", "rut", "declaracion_renta", "extractos_bancarios"],
      av_villas: ["cedula", "contrato", "rut", "declaracion_renta", "extractos_bancarios"],
      bogota: ["cedula", "contrato", "rut", "declaracion_renta", "extractos_bancarios"],
      bancolombia: ["cedula", "contrato", "rut", "declaracion_renta", "extractos_bancarios"],
    },
  },
  {
    activityProfile: "independiente_transportador",
    profileLabel: "Independiente Transportador",
    activityCategory: "INDEPENDIENTES",
    requiredDocuments: {
      bbva: ["cedula", "rut", "declaracion_renta", "extractos_bancarios", "tarjeta_propiedad_vehiculo", "certificacion_empresa_vehiculo"],
      itau: ["cedula", "rut", "declaracion_renta", "extractos_bancarios", "tarjeta_propiedad_vehiculo", "certificacion_empresa_vehiculo"],
      av_villas: ["cedula", "rut", "declaracion_renta", "extractos_bancarios", "tarjeta_propiedad_vehiculo", "certificacion_empresa_vehiculo"],
      bogota: ["cedula", "rut", "declaracion_renta", "extractos_bancarios", "tarjeta_propiedad_vehiculo", "certificacion_empresa_vehiculo"],
      bancolombia: ["cedula", "rut", "declaracion_renta", "extractos_bancarios", "tarjeta_propiedad_vehiculo", "certificacion_empresa_vehiculo"],
    },
  },
  {
    activityProfile: "socio_empresa",
    profileLabel: "Socio de Empresa",
    activityCategory: "INDEPENDIENTES",
    requiredDocuments: {
      bbva: ["cedula", "rut", "camara_comercio", "composicion_accionaria", "estados_financieros", "declaracion_renta", "extractos_bancarios", "tarjeta_profesional_contador"],
      itau: ["cedula", "camara_comercio", "composicion_accionaria", "estados_financieros", "declaracion_renta", "extractos_bancarios", "tarjeta_profesional_contador"],
      av_villas: ["cedula", "camara_comercio", "composicion_accionaria", "estados_financieros", "declaracion_renta", "extractos_bancarios"],
      bogota: ["cedula", "rut", "camara_comercio", "composicion_accionaria", "estados_financieros", "declaracion_renta", "extractos_bancarios", "tarjeta_profesional_contador"],
      bancolombia: ["cedula", "rut", "camara_comercio", "composicion_accionaria", "estados_financieros", "declaracion_renta", "extractos_bancarios", "tarjeta_profesional_contador"],
    },
  },
  {
    activityProfile: "rentista_capital",
    profileLabel: "Rentista de Capital",
    activityCategory: "INDEPENDIENTES",
    requiredDocuments: {
      bbva: ["cedula", "contratos_arrendamiento", "declaracion_renta", "extractos_bancarios", "rut", "certificacion_tradicion_libertad"],
      itau: ["cedula", "contratos_arrendamiento", "declaracion_renta", "extractos_bancarios", "rut", "certificacion_tradicion_libertad"],
      av_villas: ["cedula", "contratos_arrendamiento", "declaracion_renta", "certificacion_tradicion_libertad"],
      bogota: ["cedula", "contratos_arrendamiento", "declaracion_renta", "extractos_bancarios", "rut", "certificacion_tradicion_libertad"],
      bancolombia: ["cedula", "contratos_arrendamiento", "declaracion_renta", "extractos_bancarios", "rut", "certificacion_tradicion_libertad"],
    },
  },
  {
    activityProfile: "profesional_independiente",
    profileLabel: "Profesional Independiente",
    activityCategory: "INDEPENDIENTES",
    requiredDocuments: {
      bbva: ["cedula", "declaracion_renta", "rut", "extractos_bancarios"],
      itau: ["cedula", "declaracion_renta", "extractos_bancarios"],
      av_villas: ["cedula", "declaracion_renta", "rut", "extractos_bancarios"],
      bogota: ["cedula", "declaracion_renta", "rut", "extractos_bancarios"],
      bancolombia: ["cedula", "declaracion_renta", "rut", "extractos_bancarios"],
    },
  },
  {
    activityProfile: "otros_independientes",
    profileLabel: "Otros Independientes",
    activityCategory: "INDEPENDIENTES",
    requiredDocuments: {
      bbva: ["cedula", "camara_comercio", "rut", "declaracion_renta", "extractos_bancarios"],
      itau: ["cedula", "camara_comercio", "rut", "declaracion_renta", "extractos_bancarios"],
      av_villas: ["cedula", "camara_comercio", "rut", "declaracion_renta", "extractos_bancarios"],
      bogota: ["cedula", "camara_comercio", "rut", "declaracion_renta", "extractos_bancarios"],
      bancolombia: ["cedula", "camara_comercio", "rut", "declaracion_renta", "extractos_bancarios"],
    },
  },
];
