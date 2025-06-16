
const fetch = require('node-fetch');

exports.handler = async () => {
  let attempts = 0;
  const maxAttempts = 3;
  let result = null;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      // Simulated GPT call - replace with actual OpenAI endpoint
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'System health check' }],
          max_tokens: 100
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        result = data;
        break;
      }
    } catch (err) {
      console.error(`Attempt ${attempts} failed:`, err.message);
      await new Promise((res) => setTimeout(res, 1000 * attempts)); // exponential backoff
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: result ? 'Success' : 'Failed',
      attempts,
      data: result || null
    })
  }
}