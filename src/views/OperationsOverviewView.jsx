
// src/views/OperationsOverviewView.jsx
import React from 'react';
import { mockSystemComponents, mockOutageForecasts, mockRootCauseChain, mockSecurityEvents } from '../data/mockOpsData';
import AnimatedCard from '../components/widgets/AnimatedCard';

const getStatusColor = (status) => {
  switch (status) {
    case 'GREEN': return 'text-green-600 dark:text-green-400';
    case 'YELLOW': return 'text-yellow-600 dark:text-yellow-400';
    case 'ORANGE': return 'text-orange-600 dark:text-orange-400';
    case 'RED': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

const RiskBar = ({ score }) => (
  <div className="w-full h-2 rounded bg-gray-200 dark:bg-gray-700">
    <div
      className={`h-2 rounded ${score >= 0.7 ? 'bg-red-500' : score >= 0.5 ? 'bg-orange-500' : 'bg-green-500'}`}
      style={{ width: `${Math.min(score * 100, 100)}%` }}
    />
  </div>
);

const OperationsOverviewView = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        🏗️ Infrastructure Operations Center
      </h1>
      <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
        Live system health, AI outage prediction, and root cause tracing.
      </p>

      {/* Topology Summary */}
      <AnimatedCard title="🔄 Live System Components" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockSystemComponents.map((comp) => (
            <div key={comp.id} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{comp.name}</h4>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(comp.status)} bg-opacity-20`}>
                    {comp.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Latency:</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{comp.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate:</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{(comp.errorRate * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            🤖 AI Alert: CDN Edge showing elevated latency. Auto-scaling protocols engaged.
          </p>
        </div>
      </AnimatedCard>

      {/* Outage Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnimatedCard title="🔮 Predictive Outage Forecaster" subTitle="AI Risk Analysis">
          <div className="space-y-4">
            {mockOutageForecasts.map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{r.component}</span>
                  <span className={`font-semibold ${r.riskScore >= 0.7 ? 'text-red-500' : r.riskScore >= 0.5 ? 'text-orange-500' : 'text-green-500'}`}>
                    {(r.riskScore * 100).toFixed(0)}% Risk
                  </span>
                </div>
                <RiskBar score={r.riskScore} />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ High-risk components detected. Consider preemptive maintenance.
            </p>
          </div>
        </AnimatedCard>

        {/* Root Cause Analysis */}
        <AnimatedCard title="🧠 AI Root Cause Analysis" subTitle="Failure Path Prediction">
          <div className="space-y-4">
            {mockRootCauseChain.map((step, i) => (
              <div key={i} className="border-l-4 border-indigo-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{step.from}</span>
                  <span className="text-indigo-500">➡</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{step.to}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">{step.reason}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <p className="text-sm text-indigo-800 dark:text-indigo-200">
              🔬 AI Recommendation: Focus remediation efforts on CDN Edge to break failure cascade.
            </p>
          </div>
        </AnimatedCard>
      </div>

      {/* Security Events & Self-Healing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnimatedCard title="🛡️ Threat Intelligence Feed" subTitle="Live Security Events">
          <div className="space-y-3">
            {mockSecurityEvents.map((e) => (
              <div key={e.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{e.type}</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    e.severity === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                    e.severity === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                  }`}>
                    {e.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{e.message}</p>
              </div>
            ))}
          </div>
        </AnimatedCard>

        <AnimatedCard title="🔧 Self-Healing Protocols" subTitle="Autonomous Recovery Status">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Auto-Scaling</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Circuit Breaker</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">ARMED</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Failover Routes</span>
              <span className="text-orange-600 dark:text-orange-400 font-semibold">STANDBY</span>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              🚀 Trigger Manual Recovery
            </button>
          </div>
        </AnimatedCard>
      </div>

      {/* System Topology Graph Placeholder */}
      <AnimatedCard title="🌐 Live System Topology" subTitle="Interactive Component Map">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">API</div>
            <div className="w-8 h-0.5 bg-gray-400"></div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">AUTH</div>
            <div className="w-8 h-0.5 bg-gray-400"></div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">DB</div>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">CDN</div>
            <div className="w-8 h-0.5 bg-gray-400"></div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">ML</div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            🚧 Full interactive topology graph coming soon (Deck.gl integration)
          </p>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default OperationsOverviewView;
