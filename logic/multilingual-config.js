
export const SUPPORTED_LANGUAGES = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US',
    currency: 'USD'
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'es-ES',
    currency: 'EUR'
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'fr-FR',
    currency: 'EUR'
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    dateFormat: 'DD.MM.YYYY',
    numberFormat: 'de-DE',
    currency: 'EUR'
  },
  it: {
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'it-IT',
    currency: 'EUR'
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'pt-PT',
    currency: 'EUR'
  },
  zh: {
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    rtl: false,
    dateFormat: 'YYYY/MM/DD',
    numberFormat: 'zh-CN',
    currency: 'CNY'
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
    dateFormat: 'YYYY/MM/DD',
    numberFormat: 'ja-JP',
    currency: 'JPY'
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    rtl: false,
    dateFormat: 'YYYY.MM.DD',
    numberFormat: 'ko-KR',
    currency: 'KRW'
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    rtl: false,
    dateFormat: 'DD.MM.YYYY',
    numberFormat: 'ru-RU',
    currency: 'RUB'
  }
}
export const GPT_AGENT_PROMPTS = {
  en: {
    general: "You are a helpful AI assistant. Respond clearly and professionally.",
    sales: "You are a sales AI agent focused on helping with customer acquisition and revenue growth.",
    support: "You are a customer support AI agent dedicated to resolving issues efficiently.",
    trainer: "You are a training AI agent specialized in creating educational content and programs.",
    analyzer: "You are a data analysis AI agent focused on insights and business intelligence."
  },
  es: {
    general: "Eres un asistente de IA útil. Responde de manera clara y profesional en español.",
    sales: "Eres un agente de IA de ventas enfocado en ayudar con la adquisición de clientes y el crecimiento de ingresos.",
    support: "Eres un agente de IA de soporte al cliente dedicado a resolver problemas de manera eficiente.",
    trainer: "Eres un agente de IA de entrenamiento especializado en crear contenido educativo y programas.",
    analyzer: "Eres un agente de IA de análisis de datos enfocado en insights e inteligencia de negocios."
  },
  fr: {
    general: "Vous êtes un assistant IA utile. Répondez clairement et professionnellement en français.",
    sales: "Vous êtes un agent IA de vente axé sur l'aide à l'acquisition de clients et la croissance des revenus.",
    support: "Vous êtes un agent IA de support client dédié à résoudre les problèmes efficacement.",
    trainer: "Vous êtes un agent IA de formation spécialisé dans la création de contenu éducatif et de programmes.",
    analyzer: "Vous êtes un agent IA d'analyse de données axé sur les insights et l'intelligence d'affaires."
  },
  de: {
    general: "Sie sind ein hilfreicher KI-Assistent. Antworten Sie klar und professionell auf Deutsch.",
    sales: "Sie sind ein Verkaufs-KI-Agent, der sich auf die Kundenakquise und das Umsatzwachstum konzentriert.",
    support: "Sie sind ein Kundensupport-KI-Agent, der sich der effizienten Problemlösung widmet.",
    trainer: "Sie sind ein Trainings-KI-Agent, der auf die Erstellung von Bildungsinhalten und -programmen spezialisiert ist.",
    analyzer: "Sie sind ein Datenanalyse-KI-Agent, der sich auf Erkenntnisse und Business Intelligence konzentriert."
  }
}
export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.slice(0, 2);
  return Object.keys(SUPPORTED_LANGUAGES).includes(langCode) ? langCode : 'en';
}
export const formatDate = (date, language = 'en') => {
  const config = SUPPORTED_LANGUAGES[language];
  if (!config) return date.toLocaleDateString();
  
  return new Intl.DateTimeFormat(config.numberFormat, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}
export const formatNumber = (number, language = 'en') => {
  const config = SUPPORTED_LANGUAGES[language];
  if (!config) return number.toLocaleString();
  
  return new Intl.NumberFormat(config.numberFormat).format(number);
}
export const formatCurrency = (amount, language = 'en') => {
  const config = SUPPORTED_LANGUAGES[language];
  if (!config) return `$${amount}`;
  
  return new Intl.NumberFormat(config.numberFormat, {
    style: 'currency',
    currency: config.currency
  }).format(amount);
}