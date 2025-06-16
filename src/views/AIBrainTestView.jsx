// src/views/AIBrainTestView.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BrainDecisionPanel from '../components/ai/BrainDecisionPanel';
import SelfTuningPanel from '../components/ai/SelfTuningPanel';
import AnimatedCard from '../components/widgets/AnimatedCard';

const AIBrainTestView = () => {
  const [selectedModule, setSelectedModule] = useState('Finance');
  const [customMetrics, setCustomMetrics] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [decisions, setDecisions] = useState([]);

  const modulePresets = {
    Finance: {
      metrics: {
        cashFlow: -150000,
        variance: -0.23,
        burnRate: 45000,
        runway: 8.2
      },
      context: 'Q4 budget variance exceeded 20% threshold in marketing and R&D departments'
    },
    Operations: {
      metrics: {
        errorRate: 0.087,
        responseTime: 8500,
        uptime: 0.923,
        throughput: 1250
      },
      context: 'System performance degradation detected across 3 data centers'
    },
    HR: {
      metrics: {
        turnoverRate: 0.18,
        satisfactionScore: 2.8,
        absenteeism: 0.12,
        timeToHire: 45
      },
      context: 'Employee satisfaction scores dropped 15% following recent restructuring'
    },
    Marketing: {
      metrics: {
        cac: 285,
        ltv: 890,
        conversionRate: 0.023,
        roas: 1.8
      },
      context: 'Paid acquisition campaigns underperforming against Q4 targets'
    },
    Ecommerce: {
      metrics: {
        cartAbandonmentRate: 0.73,
        avgOrderValue: 145,
        conversionRate: 0.034,
        inventoryTurnover: 2.1
      },
      context: 'High cart abandonment rate detected during holiday shopping season'
    }
  };

  const getCurrentMetrics = () => {
    if (customMetrics.trim()) {
      try {
        return JSON.parse(customMetrics);
      } catch (e) {
        return modulePresets[selectedModule].metrics;
      }
    }
    return modulePresets[selectedModule].metrics;
  };

  const getCurrentContext = () => {
    return customContext.trim() || modulePresets[selectedModule].context;
  };

  const handleDecisionReceived = (decision) => {
    setDecisions(prev => [decision, ...prev.slice(0, 4)]); // Keep last 5 decisions
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '📋';
      case 'low': return '📝';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🧠 AI Orchestrator Brain Test Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the LLM-powered decision engine with different modules and metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <AnimatedCard>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🔧 Test Configuration
              </h3>

              {/* Module Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Module
                </label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  {Object.keys(modulePresets).map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>

              {/* Custom Metrics */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Metrics (JSON)
                </label>
                <textarea
                  value={customMetrics}
                  onChange={(e) => setCustomMetrics(e.target.value)}
                  placeholder={JSON.stringify(modulePresets[selectedModule].metrics, null, 2)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 font-mono text-xs"
                  rows="6"
                />
              </div>

              {/* Custom Context */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Context
                </label>
                <textarea
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder={modulePresets[selectedModule].context}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Presets
                </label>
                <div className="space-y-2">
                  {Object.keys(modulePresets).map(module => (
                    <button
                      key={module}
                      onClick={() => {
                        setSelectedModule(module);
                        setCustomMetrics('');
                        setCustomContext('');
                      }}
                      className="w-full text-left px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
                    >
                      <div className="font-medium">{module}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {modulePresets[module].context}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Main Test Panel */}
          <div className="lg:col-span-2">
             {/* Self-Tuning Panel */}
            <SelfTuningPanel />

            <BrainDecisionPanel
              module={selectedModule}
              metrics={getCurrentMetrics()}
              context={getCurrentContext()}
              onDecisionReceived={handleDecisionReceived}
            />

            {/* Decision History */}
            {decisions.length > 0 && (
              <div className="mt-6">
                <AnimatedCard>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📊 Recent AI Decisions
                  </h3>
                  <div className="space-y-3">
                    {decisions.map((decision, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span>{getSeverityIcon(decision.decision.severity)}</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {decision.module} Module
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              decision.decision.recommendation === 'Yes' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {decision.decision.recommendation}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(decision.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {decision.decision.playbookTitle && (
                          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                            → {decision.decision.playbookTitle}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {decision.decision.reason}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Confidence: {Math.round(decision.decision.confidence * 100)}%</span>
                          <span>Source: {decision.source}</span>
                          <span>Urgency: {decision.decision.urgency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBrainTestView;