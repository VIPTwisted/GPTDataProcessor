
// src/components/actions/ActionListItem.jsx
import React from 'react';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'High':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'Critical':
      return '🚨';
    case 'High':
      return '⚠️';
    case 'Medium':
      return '📋';
    default:
      return 'ℹ️';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Ready to Execute':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Pending Approval':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Analysis Complete':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const ActionListItem = ({ action, onClick }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onClick(action)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="text-2xl flex-shrink-0 mt-1">
            {getPriorityIcon(action.priority)}
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {action.title}
              </h3>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPriorityColor(action.priority)}`}>
                {action.priority}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
              {action.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <span className="font-medium">ETA:</span>
                  <span className="ml-1">{action.eta}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Confidence:</span>
                  <span className="ml-1">{Math.round(action.confidence * 100)}%</span>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(action.status)}`}>
                {action.status}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ID: {action.id}
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            View Details & Playbook →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionListItem;
