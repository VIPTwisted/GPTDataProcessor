// src/components/widgets/AIPrescriptiveActions.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedCard from './AnimatedCard';
import { mockAIPrescriptiveActions, getStatusColor, getStatusIcon } from '../../data/mockGlobalData';
import { mockPlaybooks } from '../../data/mockPlaybookData';
import { useExecutePlaybook } from '../../hooks/useExecutePlaybook';

const AIPrescriptiveActions = ({ onClick, onShowToast }) => {
  const { execute, executing, executionResult, error } = useExecutePlaybook();
  const [executingActions, setExecutingActions] = useState(new Set());

  const topActions = mockAIPrescriptiveActions.slice(0, 3);

  const handleActionClick = (action) => {
    console.log(`AI Action Clicked: ${action.id}`);
    if (onShowToast) {
      onShowToast(`Executing AI Action: ${action.title}`, 'info');
    }
    if (onClick) onClick();
  };

  const handleExecute = async (action) => {
    const playbook = mockPlaybooks[action.playbookId];
    if (!playbook) {
      alert('❌ Playbook not found');
      return;
    }

    setExecutingActions(prev => new Set(prev).add(action.id));

    try {
      const result = await execute({
        playbookId: action.playbookId,
        executedBy: 'admin@toyparty.com',
        steps: playbook.steps,
        context: {
          actionId: action.id,
          priority: action.priority,
          department: action.department
        }
      });

      alert(`✅ Playbook "${action.title}" executed successfully!\n\nCompleted: ${result.execution_summary.completed_steps}/${result.execution_summary.total_steps} steps\nStatus: ${result.execution_summary.status}`);

      console.log('🎯 Playbook Execution Result:', result);
    } catch (err) {
      alert(`❌ Execution failed: ${err.message}`);
    } finally {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(action.id);
        return newSet;
      });
    }
  };

  return (
    <AnimatedCard
      title="AI Prescriptive Actions"
      subTitle="Prioritized & Actionable Playbooks"
      onClick={onClick}
      className="col-span-1 lg:col-span-2"
    >
      <div className="space-y-4">
        {topActions.length > 0 ? (
          topActions.map((action) => (
            <div
              key={action.id}
              className="flex items-start bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={() => handleActionClick(action)}
            >
              <div className={`flex-shrink-0 mr-3 mt-1 text-lg ${getStatusColor(action.priority)}`}>
                {getStatusIcon(action.priority === 'Critical' ? 'RED' : (action.priority === 'High' ? 'ORANGE' : 'YELLOW'))}
              </div>
              <div className="flex-grow">
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-tight mb-1">
                  {action.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Status: <span className="font-medium">{action.status}</span></span>
                  <span>ETA: <span className="font-medium">{action.eta}</span></span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No pressing AI actions at this moment. All clear!</p>
        )}
      </div>
      {mockAIPrescriptiveActions.length > 0 && (
        <div className="mt-6 text-center">
          <Link
            to="/actions"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            View All ({mockAIPrescriptiveActions.length}) AI Actions & Playbooks &rarr;
          </Link>
        </div>
      )}
    </AnimatedCard>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-100 text-red-800';
    case 'High':
      return 'bg-orange-100 text-orange-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default AIPrescriptiveActions;