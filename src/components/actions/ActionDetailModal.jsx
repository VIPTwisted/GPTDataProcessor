// src/components/actions/ActionDetailModal.jsx
import React from 'react';
import ExplainAI from '../ai/ExplainAI';
import PlaybookViewer from './PlaybookViewer';
import { mockPlaybooks } from '../../data/mockPlaybookData';

const ActionDetailModal = ({ action, isOpen, onClose }) => {
  if (!isOpen || !action) return null;

  const playbook = mockPlaybooks[action.id];

  const handleApprove = () => {
    console.log(`Approving action: ${action.id}`);
    // Add approval logic here
  };

  const handleReject = () => {
    console.log(`Rejecting action: ${action.id}`);
    // Add rejection logic here
  };

  const handleExecute = () => {
    console.log(`Executing action: ${action.id}`);
    // Add execution logic here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Action Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</h3>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                action.priority === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                action.priority === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              }`}>
                {action.priority}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                action.status === 'Ready to Execute' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                action.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                action.status === 'Urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              }`}>
                {action.status}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Confidence</h3>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${action.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {Math.round(action.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {action.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {action.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Estimated Time</h4>
              <p className="text-gray-900 dark:text-white">{action.eta}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Action ID</h4>
              <p className="text-gray-900 dark:text-white font-mono text-sm">{action.id}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Action Details</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{action.description}</p>

            {/* AI Explanation Panel */}
            <ExplainAI
              source={action.source || `${action.type} Anomaly Detection`}
              confidence={action.confidence || 0.85}
              reason={action.aiReasoning || `AI detected ${action.type.toLowerCase()} patterns requiring attention based on historical data and current metrics.`}
              recommendation={action.recommendedAction || `Execute ${action.title} to resolve identified issues`}
              metadata={{
                action_id: action.id,
                priority: action.priority,
                estimated_impact: action.estimatedImpact || 'Medium',
                execution_time: action.estimatedDuration || '5-10 minutes',
                affected_systems: action.affectedSystems || ['Primary Systems']
              }}
              timestamp={action.timestamp}
            />
          </div>

          <PlaybookViewer playbook={playbook} />
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
          >
            Reject
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg transition-colors"
          >
            Approve
          </button>
          <button
            onClick={handleExecute}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            Execute Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionDetailModal;