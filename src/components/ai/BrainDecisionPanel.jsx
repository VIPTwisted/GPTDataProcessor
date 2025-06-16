
// src/components/ai/BrainDecisionPanel.jsx
import React, { useState } from 'react';
import { useOrchestratorBrain } from '../../hooks/useOrchestratorBrain';
import ExplainAI from './ExplainAI';

const BrainDecisionPanel = ({ 
  module = 'Test', 
  metrics = { test: 'example' },
  context = 'Sample analysis request',
  onDecisionReceived = () => {},
  className = ''
}) => {
  const { requestDecision, isAnalyzing, lastDecision, error } = useOrchestratorBrain();
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = async () => {
    try {
      const availablePlaybooks = [
        { id: 'generic-optimization-v1', title: 'Generic Optimization Protocol' },
        { id: 'emergency-response-v1', title: 'Emergency Response Procedure' },
        { id: 'maintenance-mode-v1', title: 'Maintenance Mode Activation' }
      ];

      const result = await requestDecision(module, metrics, context, availablePlaybooks);
      onDecisionReceived(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'immediate': return 'text-red-600 bg-red-100';
      case 'within 1 hour': return 'text-orange-600 bg-orange-100';
      case 'within 4 hours': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <span className="text-xl">🧠</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Orchestrator Brain</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Intelligent decision analysis for {module}</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Analyzing...
            </>
          ) : (
            <>
              <span>🔍</span>
              Analyze Metrics
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <span>⚠️</span>
            <span className="font-medium">Analysis Error</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Input Metrics Preview */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Input Data</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Module:</span>
            <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{module}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Context:</span>
            <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{context}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-gray-500 dark:text-gray-400">Metrics:</span>
          <pre className="mt-1 text-xs bg-white dark:bg-gray-800 p-2 rounded border overflow-x-auto">
            {JSON.stringify(metrics, null, 2)}
          </pre>
        </div>
      </div>

      {/* AI Decision Results */}
      {lastDecision && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 dark:text-white">AI Decision Results</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Source: {lastDecision.source}</span>
              <span>•</span>
              <span>{new Date(lastDecision.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Decision Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Recommendation</div>
              <div className={`font-bold text-lg ${
                lastDecision.decision.recommendation === 'Yes' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {lastDecision.decision.recommendation}
              </div>
            </div>

            <div className="p-3 rounded-lg border">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Severity</div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(lastDecision.decision.severity)}`}>
                {lastDecision.decision.severity}
              </span>
            </div>

            <div className="p-3 rounded-lg border">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Urgency</div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(lastDecision.decision.urgency)}`}>
                {lastDecision.decision.urgency}
              </span>
            </div>
          </div>

          {/* Recommended Playbook */}
          {lastDecision.decision.playbookTitle && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-500">📋</span>
                <span className="font-medium text-blue-700 dark:text-blue-300">Recommended Playbook</span>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {lastDecision.decision.playbookTitle}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                ID: {lastDecision.decision.playbookId}
              </div>
            </div>
          )}

          {/* Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            {showDetails ? '▼ Hide Details' : '▶ Show AI Analysis Details'}
          </button>

          {/* Detailed Analysis */}
          {showDetails && (
            <div className="space-y-4">
              <ExplainAI
                source={`AI Orchestrator Brain - ${module} Module`}
                confidence={lastDecision.decision.confidence}
                reason={lastDecision.decision.reason}
                recommendation={lastDecision.decision.playbookTitle || 'No action required'}
                metadata={{
                  module: lastDecision.module,
                  severity: lastDecision.decision.severity,
                  urgency: lastDecision.decision.urgency,
                  estimated_impact: lastDecision.decision.estimatedImpact,
                  affected_systems: lastDecision.decision.affectedSystems?.join(', ') || 'None',
                  primary_metric: lastDecision.decision.keyMetrics?.primary || 'Unknown',
                  trend: lastDecision.decision.keyMetrics?.trend || 'Unknown',
                  ai_source: lastDecision.source
                }}
                timestamp={lastDecision.timestamp}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrainDecisionPanel;
