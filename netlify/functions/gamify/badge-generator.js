
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const { milestone, context: achievementContext, repName } = JSON.parse(event.body || '{}');

    const prompt = `
You are a gamification designer for ToyParty's rep achievement system. Create a motivational badge for this accomplishment:

Milestone: ${milestone}
Context: ${achievementContext || 'General achievement'}
Rep: ${repName || 'Team member'}

Create a fun, memorable badge that fits ToyParty's vibrant brand. Respond in JSON format:
{
  "badgeName": "catchy, fun badge name",
  "description": "encouraging description of the achievement",
  "rarity": "Common/Uncommon/Rare/Epic/Legendary",
  "emoji": "relevant emoji for the badge",
  "flavorText": "fun, motivational tagline",
  "xpBonus": numerical_bonus_amount
}

Make it celebratory and aligned with ToyParty's fun, inclusive culture.
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
        temperature: 0.8,
        max_tokens: 300
      })
    });

    const json = await res.json();
    const badge = JSON.parse(json.choices[0].message.content);
    badge.awardedAt = new Date().toISOString();
    badge.milestone = milestone;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(badge)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}