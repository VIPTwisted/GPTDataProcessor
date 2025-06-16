
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const { product, theme, platform = 'Instagram', tone = 'fun', targetAudience = 'young adults' } = JSON.parse(event.body || '{}');

    const prompt = `
You are a social media marketing expert for ToyParty, a vibrant adult party brand. Create an engaging ${platform} caption for:

Product/Theme: ${product || theme}
Tone: ${tone}
Target Audience: ${targetAudience}

Guidelines:
- Keep it authentic and engaging
- Include relevant emojis
- Suggest 3-5 hashtags
- Include a clear call-to-action
- Match ToyParty's fun, inclusive brand voice
- Optimize for ${platform} best practices

Respond in JSON format:
{
  "caption": "main caption text with emojis",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "callToAction": "specific CTA",
  "platform": "${platform}",
  "estimatedReach": "predicted engagement level"
}
`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.7,
        max_tokens: 400
      })
    });

    const json = await res.json();
    const result = JSON.parse(json.choices[0].message.content);
    result.generatedAt = new Date().toISOString();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}