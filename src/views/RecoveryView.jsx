
import React, { useState, useEffect } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const mockEvents = [
  { time: '14:12', action: 'Flush Cache', status: 'Success', system: 'Redis', type: 'Auto-Heal' },
  { time: '13:45', action: 'Restart GPT Agent', status: 'Pending', system: 'Orchestrator', type: 'Retry' },
  { time: '13:30', action: 'Escalate', status: 'Escalated', system: 'Auth', type: 'Slack Alert' },
  { time: '13:15', action: 'Redeploy API', status: 'Success', system: 'Core API', type: 'Auto-Heal' },
  { time: '12:58', action: 'Clear Browser Cache', status: 'Success', system: 'Frontend', type: 'Auto-Heal' }
];

const RecoveryView = () => {
  const [events, setEvents] = useState(mockEvents);
  const [realTimeMode, setRealTimeMode] = useState(false);

  useEffect(() => {
    if (realTimeMode) {
      const interval = setInterval(() => {
        const newEvent = {
          time: new Date().toLocaleTimeString(),
          action: 'System Health Check',
          status: Math.random() > 0.8 ? 'Failed' : 'Success',
          system: 'Monitor',
          type: 'Auto-Check'
        };
        setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [realTimeMode]);

  const triggerSelfHeal = async (action) => {
    try {
      const response = await fetch('/.netlify/functions/self-heal/remediation-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue: 'Manual trigger',
          component: action,
          errorRate: 0.1,
          context: 'User initiated'
        })
      });
      
      const result = await response.json();
      console.log('Self-heal triggered:', result);
    } catch (error) {
      console.error('Self-heal failed:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Autonomous Recovery Log</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setRealTimeMode(!realTimeMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              realTimeMode 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {realTimeMode ? '🟢 Live' : '⚪ Paused'}
          </button>
          <button
            onClick={() => triggerSelfHeal('Cache')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Test Self-Heal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <AnimatedCard className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {events.filter(e => e.status === 'Success').length}
            </div>
            <div className="text-sm text-gray-500">Successful Heals</div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {events.filter(e => e.status === 'Pending').length}
            </div>
            <div className="text-sm text-gray-500">Pending Actions</div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {events.filter(e => e.status === 'Failed' || e.status === 'Escalated').length}
            </div>
            <div className="text-sm text-gray-500">Escalations</div>
          </div>
        </AnimatedCard>
      </div>

      <AnimatedCard className="bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recovery Events</h2>
          <span className="text-sm text-gray-500">Last 10 events</span>
        </div>
        
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  event.status === 'Success' ? 'bg-green-500' :
                  event.status === 'Pending' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{event.action}</p>
                  <p className="text-xs text-gray-500">{event.type} on {event.system}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${
                  event.status === 'Success' ? 'text-green-600' :
                  event.status === 'Pending' ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {event.status}
                </p>
                <p className="text-xs text-gray-400">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default RecoveryView;
