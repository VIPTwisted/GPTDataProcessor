
// src/components/widgets/AuditTrailWidget.jsx
import React, { useState, useEffect } from 'react';
import { useAuditTrail } from '../../hooks/useAuditTrail';

const AuditTrailWidget = () => {
  const [mockAuditData, setMockAuditData] = useState([]);
  const { logAIAction, sendNotification, loading, error } = useAuditTrail();

  useEffect(() => {
    // Simulate some audit data
    setMockAuditData([
      {
        id: 'audit_001',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        actionType: 'playbook_executed',
        actor: 'AI_Agent',
        confidence: 0.94,
        notes: 'Executed ecommerce optimization playbook due to checkout failures',
        context: { playbookId: 'ecommerce-api-optimize-v2' }
      },
      {
        id: 'audit_002',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        actionType: 'anomaly_detected',
        actor: 'monitoring_system',
        confidence: 0.87,
        notes: 'API response time increased by 40%',
        context: { metric: 'response_time', threshold: '2s' }
      },
      {
        id: 'audit_003',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        actionType: 'manual_override',
        actor: 'admin@toyparty.com',
        confidence: 1.0,
        notes: 'Manually scaled resources during peak traffic',
        context: { action: 'scale_up', resources: 'api_servers' }
      }
    ]);
  }, []);

  const handleTestLog = async () => {
    try {
      await logAIAction(
        'test_action',
        'frontend_user',
        0.95,
        'Testing audit trail functionality',
        { test: true, timestamp: new Date().toISOString() }
      );
      alert('✅ Test log entry created successfully!');
    } catch (err) {
      alert(`❌ Failed to create log entry: ${err.message}`);
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendNotification(
        'Test Alert',
        'Info',
        'Testing notification system from audit trail widget',
        { source: 'audit_trail_widget', test: true }
      );
      alert('✅ Test notification sent successfully!');
    } catch (err) {
      alert(`❌ Failed to send notification: ${err.message}`);
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'playbook_executed': return '🤖';
      case 'anomaly_detected': return '🚨';
      case 'manual_override': return '👤';
      case 'notification_sent': return '📢';
      case 'system_error': return '❌';
      default: return '📝';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">📜</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Audit Trail</h3>
            <p className="text-sm text-gray-500">Decision transparency & compliance</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleTestLog}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Log
          </button>
          <button
            onClick={handleTestNotification}
            disabled={loading}
            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Alert
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">⚠️ {error}</p>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {mockAuditData.map((entry) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getActionIcon(entry.actionType)}</span>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {entry.actionType.replace(/_/g, ' ').toUpperCase()}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Actor: {entry.actor}</p>
                <p className={`text-xs font-medium ${getConfidenceColor(entry.confidence)}`}>
                  Confidence: {Math.round(entry.confidence * 100)}%
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-2">{entry.notes}</p>
            
            {entry.context && Object.keys(entry.context).length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                <p className="font-medium text-gray-600 mb-1">Context:</p>
                {Object.entries(entry.context).map(([key, value]) => (
                  <p key={key} className="text-gray-500">
                    <span className="font-medium">{key}:</span> {String(value)}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditTrailWidget;
