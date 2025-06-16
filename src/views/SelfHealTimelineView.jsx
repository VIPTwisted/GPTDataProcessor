
import React, { useState, useEffect } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const SelfHealTimelineView = () => {
  const [logs, setLogs] = useState([
    { 
      time: '14:12', 
      action: 'Flush Redis Cache', 
      status: 'Success', 
      duration: '2.3s',
      trigger: 'AI Detected Slow Response'
    },
    { 
      time: '13:45', 
      action: 'Restart GPT Agent', 
      status: 'Success', 
      duration: '12.1s',
      trigger: 'Error Rate Threshold'
    },
    { 
      time: '13:30', 
      action: 'Execute Fallback Playbook', 
      status: 'Executed', 
      duration: '8.7s',
      trigger: 'Service Unavailable'
    },
    { 
      time: '12:58', 
      action: 'Scale Database Resources', 
      status: 'Success', 
      duration: '45.2s',
      trigger: 'High CPU Usage'
    },
    { 
      time: '12:12', 
      action: 'Clear Application Cache', 
      status: 'Success', 
      duration: '1.8s',
      trigger: 'Memory Limit Warning'
    }
  ]);

  const [systemHealth, setSystemHealth] = useState({
    overall: 94,
    api: 98,
    database: 91,
    cache: 96,
    ai: 89
  });

  const [retryStats, setRetryStats] = useState({
    totalAttempts: 23,
    successRate: 91.3,
    avgRetryTime: '8.2s',
    failuresEscalated: 2
  });

  // Simulate new healing events
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newLog = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          action: [
            'Optimize Database Queries',
            'Restart Service Worker',
            'Clear Temporary Files',
            'Reset Connection Pool',
            'Update Cache Strategy'
          ][Math.floor(Math.random() * 5)],
          status: Math.random() > 0.1 ? 'Success' : 'Failed',
          duration: `${(Math.random() * 30 + 1).toFixed(1)}s`,
          trigger: [
            'Performance Degradation',
            'Memory Usage Alert',
            'Response Time Spike',
            'Connection Error',
            'AI Anomaly Detected'
          ][Math.floor(Math.random() * 5)]
        };
        
        setLogs(prev => [newLog, ...prev.slice(0, 9)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Success': return 'text-green-600 bg-green-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Executed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 95) return 'text-green-600';
    if (health >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">🛠️ Self-Healing Intelligence Dashboard</h1>
      
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(systemHealth).map(([component, health]) => (
          <AnimatedCard key={component}>
            <div className="text-center">
              <p className={`text-2xl font-bold ${getHealthColor(health)}`}>{health}%</p>
              <p className="text-sm text-gray-500 capitalize">{component}</p>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Healing Event Timeline */}
        <div className="lg:col-span-2">
          <AnimatedCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Healing Events</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Auto-Monitoring Active</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{log.action}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Time: {log.time}</span>
                      <span>Duration: {log.duration}</span>
                    </div>
                    <div>Trigger: {log.trigger}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <AnimatedCard>
            <h3 className="font-semibold mb-3">Retry & Recovery Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total Attempts:</span>
                <span className="font-medium">{retryStats.totalAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-medium text-green-600">{retryStats.successRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Retry Time:</span>
                <span className="font-medium">{retryStats.avgRetryTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Escalated:</span>
                <span className="font-medium text-orange-600">{retryStats.failuresEscalated}</span>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard>
            <h3 className="font-semibold mb-3">Manual Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                Force System Check
              </button>
              <button className="w-full bg-yellow-600 text-white py-2 px-3 rounded text-sm hover:bg-yellow-700">
                Clear All Caches
              </button>
              <button className="w-full bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700">
                Emergency Reset
              </button>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* AI Recommendations */}
      <AnimatedCard>
        <h2 className="text-lg font-semibold mb-4">🤖 AI Healing Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Proactive Optimization</h4>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              Consider scaling database resources during peak hours (2-4 PM) to prevent slowdowns.
            </p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-200">Performance Boost</h4>
            <p className="text-sm text-green-600 dark:text-green-300 mt-1">
              Cache optimization successful. Response times improved by 23% this hour.
            </p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default SelfHealTimelineView;
