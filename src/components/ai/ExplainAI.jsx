
// src/components/ai/ExplainAI.jsx
import React from 'react';

const ExplainAI = ({ 
  source = 'Ecom API Spike', 
  confidence = 0.91, 
  reason = 'AI detected anomalous patterns requiring immediate attention',
  recommendation = 'Execute recommended playbook to resolve issues',
  metadata = {},
  timestamp = new Date().toISOString()
}) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceBgColor = (confidence) => {
    if (confidence >= 0.9) return 'bg-green-100 dark:bg-green-900';
    if (confidence >= 0.7) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-lg max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
          <span className="text-xl">🧠</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Why AI Suggested This</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Decision transparency & reasoning</p>
        </div>
      </div>

      {/* Trigger Source */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-500">🔍</span>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Trigger Source</p>
        </div>
        <p className="text-gray-800 dark:text-gray-200 font-medium">{source}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Detected at {new Date(timestamp).toLocaleString()}
        </p>
      </div>

      {/* Confidence Score */}
      <div className={`mb-4 p-3 rounded-lg ${getConfidenceBgColor(confidence)}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📊</span>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Confidence Score</p>
        </div>
        <div className="flex items-center gap-3">
          <p className={`font-bold text-2xl ${getConfidenceColor(confidence)}`}>
            {(confidence * 100).toFixed(1)}%
          </p>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                confidence >= 0.9 ? 'bg-green-500' : 
                confidence >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {confidence >= 0.9 ? 'High confidence - Auto-execution enabled' :
           confidence >= 0.7 ? 'Medium confidence - Review recommended' :
           'Low confidence - Manual approval required'}
        </p>
      </div>

      {/* Reasoning */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💡</span>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Reasoning</p>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{reason}</p>
      </div>

      {/* Recommended Action */}
      <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-purple-500">✅</span>
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Recommended Action</p>
        </div>
        <p className="font-semibold text-indigo-600 dark:text-indigo-300">{recommendation}</p>
      </div>

      {/* Metadata */}
      {metadata && Object.keys(metadata).length > 0 && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔧</span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Technical Details</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {key.replace(/_/g, ' ').toUpperCase()}:
                </span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>🤖</span>
            <span>AI Decision Engine v2.0</span>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              View Full Analysis
            </button>
            <button className="px-3 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors">
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainAI;
