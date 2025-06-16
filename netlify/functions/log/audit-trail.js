
// netlify/functions/log/audit-trail.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    // Create audit logs directory
    const logDir = '/tmp/audit-logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const { actionType, actor, confidence, notes, context, metadata = {} } = JSON.parse(event.body || '{}');

    const entry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      actionType: actionType || 'unknown',
      actor: actor || 'system',
      confidence: confidence || 0,
      notes: notes || '',
      context: context || {},
      metadata: {
        userAgent: event.headers['user-agent'] || 'unknown',
        sourceIP: event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown',
        ...metadata
      },
      version: '1.0'
    }
    // Write to temporary log file
    const logPath = path.join(logDir, `audit_${Date.now()}.json`);
    fs.writeFileSync(logPath, JSON.stringify(entry, null, 2));

    // Also maintain a rolling log file
    const rollingLogPath = path.join(logDir, 'audit_rolling.jsonl');
    const logLine = JSON.stringify(entry) + '\n';
    fs.appendFileSync(rollingLogPath, logLine);

    console.log(`📜 AI Decision Logged: ${actionType} by ${actor} (confidence: ${confidence})`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        status: 'audit_logged', 
        entry_id: entry.id,
        timestamp: entry.timestamp
      })
    }
  } catch (error) {
    console.error('❌ Audit Trail Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'audit_logging_failed',
        message: error.message 
      })
    }
  }
}
// netlify/functions/log/audit-trail.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { actionType, actor, confidence, notes, context } = JSON.parse(event.body || '{}');

    // Create log entry
    const entry = {
      timestamp: new Date().toISOString(),
      actionType: actionType || 'unknown',
      actor: actor || 'system',
      confidence: confidence || 0,
      notes: notes || '',
      context: context || {},
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    // In production, this would go to a real database
    // For now, we'll simulate storage and return success
    console.log('📝 Audit Trail Entry:', JSON.stringify(entry, null, 2));

    // Simulate file storage for demo
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      try {
        const logDir = '/tmp/audit-logs';
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        
        const logPath = path.join(logDir, `${entry.id}.json`);
        fs.writeFileSync(logPath, JSON.stringify(entry, null, 2));
      } catch (fileError) {
        console.log('File write skipped in serverless environment');
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        status: 'Logged', 
        entry: {
          id: entry.id,
          timestamp: entry.timestamp,
          actionType: entry.actionType,
          actor: entry.actor
        }
      })
    }
  } catch (error) {
    console.error('❌ Audit trail error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Audit trail logging failed',
        message: error.message 
      })
    }
  }
}