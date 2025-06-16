
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const { decisions = [] } = JSON.parse(event.body || '{}');

    const agentSummaries = decisions.map(d => 
      `${d.agentId}: ${d.suggestion} (Impact: ${d.impactLevel}, Confidence: ${d.confidence})`
    ).join('\n');

    const prompt = `
You are the Executive AI Strategist for ToyParty. Based on department agent recommendations, synthesize a unified 24-hour strategic action plan.

Agent Decisions:
${agentSummaries}

Create a cohesive strategy that:
1. Prioritizes high-impact, high-confidence recommendations
2. Identifies synergies between departments
3. Addresses any conflicts or resource constraints
4. Provides clear next steps

Respond in JSON format:
{
  "strategicSummary": "2-3 sentence overview of the unified plan",
  "topPriorities": ["Priority 1", "Priority 2", "Priority 3"],
  "synergies": ["Cross-department opportunity 1", "Cross-department opportunity 2"],
  "risks": ["Potential risk 1", "Potential risk 2"],
  "resourceAllocation": "brief guidance on resource priorities",
  "confidence": 0.0-1.0,
  "executionTimeframe": "24 hours"
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.2,
        max_tokens: 500
      })
    });

    const result = await response.json();
    const strategy = JSON.parse(result.choices[0].message.content);
    strategy.timestamp = new Date().toISOString();
    strategy.basedOnAgents = decisions.length;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(strategy)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}