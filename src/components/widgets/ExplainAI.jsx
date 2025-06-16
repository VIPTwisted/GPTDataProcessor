// src/components/widgets/ExplainAI.jsx
import React from 'react';

const ExplainAI = ({ 
  decision = 'Optimize checkout process', 
  confidence = 94, 
  reasoning = 'Analysis of user behavior patterns indicates 23% cart abandonment increase',
  impact = 'Expected 15% improvement in conversion rates',
  source = 'E-commerce Analytics Engine',
  timestamp = new Date().toISOString(),
  metadata = {}
}) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
          <span className="text-xl">🧠</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Decision Explanation</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Transparency in AI reasoning</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Decision Made</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">{decision}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Confidence Level</h4>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getConfidenceBg(confidence)}`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
            <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>{confidence}%</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Based on {source} • {new Date(timestamp).toLocaleTimeString()}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Reasoning Process</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{reasoning}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Impact</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">{impact}</p>
        </div>

        {metadata && Object.keys(metadata).length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Context</h4>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">{key.replace(/_/g, ' ').toUpperCase()}:</span>
                  <span className="text-gray-700 dark:text-gray-300">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">AI Transparency Engine v2.0</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
              View Details
            </button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainAI;