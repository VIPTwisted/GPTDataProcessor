
import React, { useState, useEffect } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const WebhookIntegrationsView = () => {
  const [webhookLogs, setWebhookLogs] = useState([]);
  const [testEvent, setTestEvent] = useState({ eventType: 'rep-joined', payload: {} });

  const webhookTypes = [
    { type: 'rep-joined', description: 'New rep registration', enabled: true },
    { type: 'course-completed', description: 'LMS module completion', enabled: true },
    { type: 'sale-completed', description: 'Sale transaction completed', enabled: true },
    { type: 'ai-alert', description: 'AI anomaly detection', enabled: false },
    { type: 'tier-upgraded', description: 'Rep tier advancement', enabled: true },
    { type: 'playbook-executed', description: 'AI playbook execution', enabled: false }
  ];

  const testWebhook = async () => {
    const testPayload = {
      'rep-joined': { repId: 'test123', repName: 'Test Rep', email: 'test@example.com' },
      'course-completed': { repId: 'test123', moduleTitle: 'Product Basics' },
      'sale-completed': { saleId: 'sale123', repId: 'test123', amount: 250.00 }
    };

    try {
      const response = await fetch('/.netlify/functions/integrations/webhook-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: testEvent.eventType,
          payload: testPayload[testEvent.eventType] || {}
        })
      });

      const result = await response.json();
      setWebhookLogs(prev => [{
        timestamp: new Date().toISOString(),
        eventType: testEvent.eventType,
        status: response.ok ? 'success' : 'failed',
        result
      }, ...prev.slice(0, 9)]);
    } catch (error) {
      setWebhookLogs(prev => [{
        timestamp: new Date().toISOString(),
        eventType: testEvent.eventType,
        status: 'error',
        error: error.message
      }, ...prev.slice(0, 9)]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">🔗 Webhook Integrations</h1>
      
      <AnimatedCard>
        <h2 className="text-lg font-semibold mb-4">📋 Available Webhooks</h2>
        <div className="space-y-3">
          {webhookTypes.map((webhook, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{webhook.type}</span>
                <p className="text-sm text-gray-600">{webhook.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                webhook.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {webhook.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          ))}
        </div>
      </AnimatedCard>

      <AnimatedCard>
        <h2 className="text-lg font-semibold mb-4">🧪 Test Webhook</h2>
        <div className="flex gap-2 mb-4">
          <select 
            value={testEvent.eventType}
            onChange={(e) => setTestEvent({...testEvent, eventType: e.target.value})}
            className="border rounded px-3 py-2"
          >
            {webhookTypes.filter(w => w.enabled).map(w => (
              <option key={w.type} value={w.type}>{w.type}</option>
            ))}
          </select>
          <button
            onClick={testWebhook}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Webhook
          </button>
        </div>
      </AnimatedCard>

      <AnimatedCard>
        <h2 className="text-lg font-semibold mb-4">📊 Recent Webhook Activity</h2>
        <div className="space-y-2">
          {webhookLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No webhook activity yet</p>
          ) : (
            webhookLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div>
                  <span className="font-medium">{log.eventType}</span>
                  <span className="text-gray-500 ml-2">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {log.status}
                </span>
              </div>
            ))
          )}
        </div>
      </AnimatedCard>

      <AnimatedCard>
        <h2 className="text-lg font-semibold mb-4">⚙️ Configuration</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Environment Variables Required:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>ZAPIER_REP_JOINED_WEBHOOK</li>
            <li>ZAPIER_COURSE_COMPLETED_WEBHOOK</li>
            <li>SLACK_AI_ALERT_WEBHOOK</li>
            <li>ZAPIER_SALE_WEBHOOK</li>
            <li>ZAPIER_TIER_WEBHOOK</li>
          </ul>
          <p className="mt-3"><strong>Webhook URLs:</strong> Configure in Replit Secrets</p>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default WebhookIntegrationsView;
