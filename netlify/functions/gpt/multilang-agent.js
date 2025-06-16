
const { getGitHubToken } = require('../../../universal-secret-loader.js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { prompt, lang = 'en', agent = 'general', userId } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      }
    }

    // Language-specific system prompts
    const systemPrompts = {
      en: "You are a helpful AI assistant. Respond clearly and professionally.",
      es: "Eres un asistente de IA útil. Responde de manera clara y profesional en español.",
      fr: "Vous êtes un assistant IA utile. Répondez clairement et professionnellement en français.",
      de: "Sie sind ein hilfreicher KI-Assistent. Antworten Sie klar und professionell auf Deutsch.",
      it: "Sei un assistente IA utile. Rispondi chiaramente e professionalmente in italiano.",
      pt: "Você é um assistente de IA útil. Responda de forma clara e profissional em português.",
      zh: "你是一个有用的AI助手。请用中文清晰、专业地回答。",
      ja: "あなたは役立つAIアシスタントです。日本語で明確かつ専門的に回答してください。",
      ko: "당신은 도움이 되는 AI 어시스턴트입니다. 한국어로 명확하고 전문적으로 답변해주세요.",
      ru: "Вы полезный ИИ-помощник. Отвечайте ясно и профессионально на русском языке."
    }
    const systemPrompt = systemPrompts[lang] || systemPrompts['en'];
    
    // Construct the full prompt with language context
    const fullPrompt = `${systemPrompt}

User Query: ${prompt}

Additional Context:
- Agent Type: ${agent}
- Language: ${lang}
- User ID: ${userId || 'anonymous'}

Please respond in ${lang === 'en' ? 'English' : getLanguageName(lang)}.`;

    // Mock GPT response for demonstration
    const mockResponses = {
      en: `I understand your request. As a ${agent} agent, I'm ready to help you with: "${prompt}". How can I assist you further?`,
      es: `Entiendo tu solicitud. Como agente ${agent}, estoy listo para ayudarte con: "${prompt}". ¿Cómo puedo asistirte más?`,
      fr: `Je comprends votre demande. En tant qu'agent ${agent}, je suis prêt à vous aider avec: "${prompt}". Comment puis-je vous aider davantage?`,
      de: `Ich verstehe Ihre Anfrage. Als ${agent}-Agent bin ich bereit, Ihnen zu helfen mit: "${prompt}". Wie kann ich Ihnen weiter helfen?`,
      it: `Capisco la tua richiesta. Come agente ${agent}, sono pronto ad aiutarti con: "${prompt}". Come posso assisterti ulteriormente?`,
      pt: `Entendo sua solicitação. Como agente ${agent}, estou pronto para ajudá-lo com: "${prompt}". Como posso ajudá-lo mais?`,
      zh: `我理解您的请求。作为${agent}代理，我准备帮助您处理："${prompt}"。我还能如何为您提供帮助？`,
      ja: `あなたのリクエストを理解しました。${agent}エージェントとして、「${prompt}」についてお手伝いする準備ができています。他にどのようにお手伝いできますか？`,
      ko: `요청을 이해했습니다. ${agent} 에이전트로서 "${prompt}"에 대해 도움을 드릴 준비가 되어 있습니다. 더 어떻게 도와드릴까요？`,
      ru: `Я понимаю ваш запрос. Как агент ${agent}, я готов помочь вам с: "${prompt}". Как я могу помочь вам дальше?`
    }
    const response = mockResponses[lang] || mockResponses['en'];

    // Log the multilingual interaction
    console.log(`🌐 Multilingual GPT Request: Agent=${agent}, Lang=${lang}, User=${userId}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        response,
        language: lang,
        agent,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Multilingual GPT Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    }
  }
}
function getLanguageName(code) {
  const names = {
    es: 'Spanish',
    fr: 'French', 
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ru: 'Russian'
  }
  return names[code] || 'English';
}
