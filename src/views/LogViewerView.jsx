
import React, { useEffect, useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const mockLogs = [
  {
    id: 'log-001',
    timestamp: '2025-01-17T14:12:00Z',
    source: 'GPT-Agent',
    type: 'Playbook Executed',
    context: 'Ecommerce scaling playbook triggered by GPT',
    status: 'Success',
    confidence: 0.93,
    severity: 'info'
  },
  {
    id: 'log-002',
    timestamp: '2025-01-17T13:59:00Z',
    source: 'Human Admin',
    type: 'Approval',
    context: 'Marketing budget freeze approved',
    status: 'Executed',
    confidence: null,
    severity: 'success'
  },
  {
    id: 'log-003',
    timestamp: '2025-01-17T13:50:00Z',
    source: 'Support Module',
    type: 'Anomaly',
    context: 'Ticket spike flagged for weekend hours',
    status: 'Flagged',
    confidence: 0.77,
    severity: 'warning'
  },
  {
    id: 'log-004',
    timestamp: '2025-01-17T13:45:00Z',
    source: 'AI Orchestrator',
    type: 'Decision',
    context: 'Auto-scaled infrastructure due to traffic spike',
    status: 'Executed',
    confidence: 0.89,
    severity: 'info'
  },
  {
    id: 'log-005',
    timestamp: '2025-01-17T13:30:00Z',
    source: 'Webhook System',
    type: 'Error',
    context: 'Slack webhook failed with 502 error',
    status: 'Failed',
    confidence: null,
    severity: 'error'
  }
];

const LogViewerView = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLogs(mockLogs);
    // Future: Real-time WebSocket connection
    // const ws = new WebSocket('ws://localhost:3000/logs');
    // ws.onmessage = (event) => {
    //   const newLog = JSON.parse(event.data);
    //   setLogs(prev => [newLog, ...prev]);
    // };
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.severity === filter;
    const matchesSearch = log.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'success': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🛡️ Unified System Logs
        </h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Logs</option>
            <option value="error">Errors</option>
            <option value="warning">Warnings</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      <AnimatedCard>
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(log.severity)}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {log.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                    {log.severity.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {log.context}
              </p>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Source: <strong>{log.source}</strong></span>
                <div className="flex gap-4">
                  <span>Status: <strong>{log.status}</strong></span>
                  {log.confidence !== null && (
                    <span>Confidence: <strong>{(log.confidence * 100).toFixed(0)}%</strong></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default LogViewerView;
