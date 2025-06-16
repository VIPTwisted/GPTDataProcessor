
// src/components/actions/PlaybookViewer.jsx
import React from 'react';

const getStatusIcon = (status) => {
  switch (status) {
    case 'Completed':
      return '✅';
    case 'In Progress':
      return '🔄';
    case 'Failed':
      return '❌';
    case 'Pending':
    default:
      return '⏳';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'System':
      return '🤖';
    case 'Human':
      return '👤';
    case 'Approval':
      return '✋';
    default:
      return '📋';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Pending':
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const PlaybookViewer = ({ playbook }) => {
  if (!playbook) {
    return (
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No playbook associated with this action.</p>
      </div>
    );
  }

  const completedSteps = playbook.steps.filter(step => step.status === 'Completed').length;
  const totalSteps = playbook.steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              {playbook.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              by {playbook.author} • v{playbook.version}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progress: {completedSteps}/{totalSteps} steps
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Est. Duration</span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{playbook.estimatedDuration}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Risk Level</span>
            <p className={`text-sm font-semibold ${
              playbook.riskLevel === 'High' ? 'text-red-600' : 
              playbook.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {playbook.riskLevel}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Data Source</span>
            <p className="text-sm text-gray-900 dark:text-white">{playbook.dataSource}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Execution Steps</h5>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
            {playbook.steps.map((step, index) => (
              <div key={step.id} className="relative flex items-start mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center text-lg z-10">
                  {getStatusIcon(step.status)}
                </div>
                <div className="ml-4 flex-grow">
                  <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(step.type)}</span>
                        <h6 className="font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h6>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(step.status)}`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {step.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <div>
                        {step.executingUser && (
                          <span>Executed by: <strong>{step.executingUser}</strong></span>
                        )}
                        {step.assignedTo && !step.executingUser && (
                          <span>Assigned to: <strong>{step.assignedTo}</strong></span>
                        )}
                      </div>
                      {step.timestamp && (
                        <span>{new Date(step.timestamp).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybookViewer;
