
import React, { useState, useEffect } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const mockDiagnostics = {
  systemPulse: {
    uptime: 99.98,
    avgLatency: 220,
    errorsToday: 3,
    activeConnections: 847,
    memoryUsage: 78.3,
    cpuUsage: 42.1
  },
  recentFailures: [
    { 
      time: '14:12', 
      type: 'Webhook', 
      detail: 'Slack 502 Error - Retry successful',
      severity: 'warning',
      resolved: true
    },
    { 
      time: '13:40', 
      type: 'GPT', 
      detail: 'LLM timeout during playbook reasoning',
      severity: 'error',
      resolved: false
    },
    { 
      time: '12:19', 
      type: 'Function', 
      detail: 'Redis flush delay (600ms)',
      severity: 'warning',
      resolved: true
    }
  ],
  gptDiagnosis: `🧠 AI SYSTEM ANALYSIS:

System Health: 91% - GOOD
- Infrastructure: Stable, minor latency spikes detected
- AI Orchestrator: Operating normally, 1 timeout incident
- Data Pipeline: Healthy, processing 2.3k events/min
- Webhooks: 99.7% success rate, temporary Slack issues resolved

⚠️ RECOMMENDATIONS:
1. Monitor GPT timeout patterns - may need increased timeout threshold
2. Consider auto-scale trigger if latency exceeds 300ms sustained
3. Implement fallback webhook queue for external service failures

🎯 PREDICTED ACTIONS:
- Auto-scale likely triggered in next 2 hours based on traffic patterns
- Recommend preemptive cache warming for peak hours`,
  performanceMetrics: {
    coreWebVitals: {
      lcp: 1.2, // Largest Contentful Paint
      fid: 89,  // First Input Delay
      cls: 0.08 // Cumulative Layout Shift
    },
    apiLatency: {
      p50: 145,
      p95: 380,
      p99: 720
    },
    functionStats: {
      totalInvocations: 12847,
      errorRate: 0.23,
      coldStarts: 45
    }
  }
};

const DiagnosticsView = () => {
  const [diagnostics, setDiagnostics] = useState(mockDiagnostics);
  const [isExecuting, setIsExecuting] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // Simulate real-time updates
      setDiagnostics(prev => ({
        ...prev,
        systemPulse: {
          ...prev.systemPulse,
          avgLatency: prev.systemPulse.avgLatency + (Math.random() - 0.5) * 20,
          activeConnections: prev.systemPulse.activeConnections + Math.floor((Math.random() - 0.5) * 50),
          memoryUsage: Math.max(0, Math.min(100, prev.systemPulse.memoryUsage + (Math.random() - 0.5) * 5)),
          cpuUsage: Math.max(0, Math.min(100, prev.systemPulse.cpuUsage + (Math.random() - 0.5) * 10))
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAction = async (actionType) => {
    setIsExecuting(actionType);
    
    // Simulate action execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`🔧 ${actionType} executed successfully!`);
    setIsExecuting(null);
  };

  const getHealthColor = (value, thresholds) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🛠️ System Diagnostics Command Center
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* System Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <AnimatedCard className="p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">System Uptime</p>
            <p className={`text-2xl font-bold ${getHealthColor(diagnostics.systemPulse.uptime, {good: 99.5, warning: 99})}`}>
              {diagnostics.systemPulse.uptime}%
            </p>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Avg Latency</p>
            <p className={`text-2xl font-bold ${getHealthColor(300 - diagnostics.systemPulse.avgLatency, {good: 200, warning: 100})}`}>
              {Math.round(diagnostics.systemPulse.avgLatency)}ms
            </p>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Active Connections</p>
            <p className="text-2xl font-bold text-blue-600">
              {diagnostics.systemPulse.activeConnections}
            </p>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Memory Usage</p>
            <p className={`text-2xl font-bold ${getHealthColor(100 - diagnostics.systemPulse.memoryUsage, {good: 40, warning: 20})}`}>
              {Math.round(diagnostics.systemPulse.memoryUsage)}%
            </p>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">CPU Usage</p>
            <p className={`text-2xl font-bold ${getHealthColor(100 - diagnostics.systemPulse.cpuUsage, {good: 30, warning: 20})}`}>
              {Math.round(diagnostics.systemPulse.cpuUsage)}%
            </p>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Errors Today</p>
            <p className={`text-2xl font-bold ${getHealthColor(10 - diagnostics.systemPulse.errorsToday, {good: 8, warning: 5})}`}>
              {diagnostics.systemPulse.errorsToday}
            </p>
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* GPT Diagnosis Panel */}
        <AnimatedCard title="🧠 AI System Diagnosis" className="lg:col-span-2">
          <pre className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line font-mono bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            {diagnostics.gptDiagnosis}
          </pre>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Failures */}
        <AnimatedCard title="📡 Real-Time Error Feed">
          <div className="space-y-3">
            {diagnostics.recentFailures.map((error, i) => (
              <div key={i} className={`p-3 rounded-lg border ${getSeverityColor(error.severity)}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">
                    {error.type}: {error.detail}
                  </span>
                  <span className="text-xs">{error.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(error.severity)}`}>
                    {error.severity.toUpperCase()}
                  </span>
                  {error.resolved && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      ✓ RESOLVED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Performance Metrics */}
        <AnimatedCard title="📈 Core Performance Metrics">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Core Web Vitals</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium">LCP</div>
                  <div className={getHealthColor(2.5 - diagnostics.performanceMetrics.coreWebVitals.lcp, {good: 1, warning: 0.5})}>
                    {diagnostics.performanceMetrics.coreWebVitals.lcp}s
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium">FID</div>
                  <div className={getHealthColor(100 - diagnostics.performanceMetrics.coreWebVitals.fid, {good: 50, warning: 25})}>
                    {diagnostics.performanceMetrics.coreWebVitals.fid}ms
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium">CLS</div>
                  <div className={getHealthColor(0.1 - diagnostics.performanceMetrics.coreWebVitals.cls, {good: 0.05, warning: 0.02})}>
                    {diagnostics.performanceMetrics.coreWebVitals.cls}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">API Latency Percentiles</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium">P50</div>
                  <div className="text-green-600">{diagnostics.performanceMetrics.apiLatency.p50}ms</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium">P95</div>
                  <div className="text-yellow-600">{diagnostics.performanceMetrics.apiLatency.p95}ms</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium">P99</div>
                  <div className="text-red-600">{diagnostics.performanceMetrics.apiLatency.p99}ms</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Admin Action Buttons */}
      <AnimatedCard title="🔧 System Administration Tools">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleAction('Flush Cache')}
            disabled={isExecuting === 'Flush Cache'}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            {isExecuting === 'Flush Cache' ? (
              <>⏳ Executing...</>
            ) : (
              <>⚡ Flush Cache</>
            )}
          </button>

          <button
            onClick={() => handleAction('Restart GPT Agent')}
            disabled={isExecuting === 'Restart GPT Agent'}
            className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            {isExecuting === 'Restart GPT Agent' ? (
              <>⏳ Executing...</>
            ) : (
              <>🔄 Restart GPT</>
            )}
          </button>

          <button
            onClick={() => handleAction('Scale Infrastructure')}
            disabled={isExecuting === 'Scale Infrastructure'}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            {isExecuting === 'Scale Infrastructure' ? (
              <>⏳ Executing...</>
            ) : (
              <>📈 Auto-Scale</>
            )}
          </button>

          <button
            onClick={() => handleAction('Redeploy Functions')}
            disabled={isExecuting === 'Redeploy Functions'}
            className="px-4 py-3 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-600 text-white rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            {isExecuting === 'Redeploy Functions' ? (
              <>⏳ Executing...</>
            ) : (
              <>🚀 Redeploy</>
            )}
          </button>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default DiagnosticsView;
