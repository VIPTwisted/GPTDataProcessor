// netlify/functions/brain/orchestrator-brain.js
const fetch = require('node-fetch');
const fs = require('fs');

exports.handler = async (event) => {
  const { module, metrics, context, availablePlaybooks = [] } = JSON.parse(event.body || '{}');

  try {
    // Fetch AI configuration from self-tuner
    let aiConfig = {
      confidenceThreshold: 0.85,
      aggressiveness: 0.7,
      successRate: 0.5
    }
    try {
      const configPath = '/tmp/ai-config.json';
      if (fs.existsSync(configPath)) {
        aiConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    } catch (configError) {
      console.warn('Could not load AI config, using defaults:', configError.message);
    }

    // Fetch recent memory/logs for context
    let memoryContext = '';
    try {
      const memoryRes = await fetch(`${process.env.URL || 'http://localhost:8888'}/.netlify/functions/log/list-recent?limit=5`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (memoryRes.ok) {
        const memoryLog = await memoryRes.json();
        if (memoryLog.length > 0) {
          memoryContext = `
RECENT DECISION HISTORY:
${memoryLog.map(log => 
  `• ${log.playbookId} | Confidence: ${(log.confidence * 100).toFixed(0)}% | Outcome: ${log.outcome} | Impact: ${log.impact}`
).join('\n')}

Current AI Performance:
- Success Rate: ${(aiConfig.successRate * 100).toFixed(0)}%
- Confidence Threshold: ${(aiConfig.confidenceThreshold * 100).toFixed(0)}%
- Aggressiveness Level: ${(aiConfig.aggressiveness * 100).toFixed(0)}%
`;
        }
      }
    } catch (memoryError) {
      console.warn('Could not fetch memory context:', memoryError.message);
    }

    // Enhanced GPT SYSTEM PROMPT with memory and self-tuning awareness
    const prompt = `
You are the AI Orchestrator Brain for ToyParty's real-time enterprise dashboard.
You have learned from past decisions and adjust your recommendations accordingly.

${memoryContext}

CURRENT SITUATION:
Module: ${module}
Context: ${context}
Metrics: ${JSON.stringify(metrics, null, 2)}
Available Playbooks: ${availablePlaybooks.map((p) => p.title || p.id).join(', ')}

DECISION GUIDELINES:
- Your current confidence threshold is ${(aiConfig.confidenceThreshold * 100).toFixed(0)}%
- Your aggressiveness level is ${(aiConfig.aggressiveness * 100).toFixed(0)}%
- Your recent success rate is ${(aiConfig.successRate * 100).toFixed(0)}%

Based on your past performance and current configuration:
${aiConfig.successRate > 0.8 ? '• You can be more aggressive with recommendations' : 
  aiConfig.successRate < 0.6 ? '• You should be more conservative with recommendations' : 
  '• Maintain balanced approach to recommendations'}

TASK:
Analyze the situation and decide whether to recommend a playbook execution.
Consider the metrics, available playbooks, and your learning from past decisions.

OUTPUT FORMAT (JSON only):
{
  "recommendation": "Yes" or "No",
  "playbookId": "specific playbook ID if recommended, null otherwise",
  "reason": "detailed explanation of your decision",
  "confidence": 0.0 to 1.0,
  "urgency": "Low" | "Medium" | "High" | "Critical",
  "estimatedImpact": "brief description of expected impact",
  "memoryInfluence": "how past decisions influenced this recommendation"
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
        temperature: aiConfig.aggressiveness * 0.3, // Dynamic temperature based on aggressiveness
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const message = json.choices[0].message.content;

    // Parse and validate GPT response
    let parsed;
    try {
      // Clean up the response in case GPT adds extra text
      const jsonMatch = message.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : message;
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse GPT response:', message);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate required fields
    if (!parsed.hasOwnProperty('recommendation') || !parsed.hasOwnProperty('confidence')) {
      throw new Error('AI response missing required fields');
    }

    // Apply confidence threshold check
    const confidence = parsed.confidence;
    const mode = event.queryStringParameters?.mode || 'manual';
    const threshold = mode === 'auto' ? 0.85 : 0.95;

    const shouldExecute = parsed.recommendation === 'Yes' && 
                         confidence >= threshold;

    // Enhanced response with self-tuning metadata
    const enhancedDecision = {
      ...parsed,
      shouldExecute,
      appliedThreshold: aiConfig.confidenceThreshold,
      aiConfig: {
        successRate: aiConfig.successRate,
        aggressiveness: aiConfig.aggressiveness,
        lastTuned: aiConfig.lastTuned
      },
      metadata: {
        temperature: aiConfig.aggressiveness * 0.3,
        memoryContextUsed: memoryContext.length > 0,
        timestamp: new Date().toISOString()
      }
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        module,
        decision: enhancedDecision,
        processing: {
          memoryLoaded: memoryContext.length > 0,
          configLoaded: true,
          confidenceThreshold: aiConfig.confidenceThreshold
        }
      })
    }
  } catch (err) {
    console.error('Orchestrator Brain error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'AI Orchestrator Brain processing failed',
        details: err.message,
        module
      })
    }
  }
}