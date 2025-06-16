
// src/components/actions/PrioritizedActionQueue.jsx
import React, { useState, useMemo } from 'react';
import AnimatedCard from '../widgets/AnimatedCard';
import { mockAIPrescriptiveActions, getStatusColor, getStatusIcon } from '../../data/mockGlobalData';
import { FaArrowRight, FaSortAmountDown, FaFilter } from 'react-icons/fa';

const PRIORITY_ORDER = ['Critical', 'High', 'Medium'];

const groupByPriority = (actions) => {
  return PRIORITY_ORDER.reduce((acc, level) => {
    acc[level] = actions.filter((a) => a.priority === level);
    return acc;
  }, {});
};

const PrioritizedActionQueue = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('priority');

  const filteredActions = useMemo(() => {
    return mockAIPrescriptiveActions.filter((action) =>
      filterStatus === 'All' ? true : action.status === filterStatus
    );
  }, [filterStatus]);

  const groupedActions = useMemo(() => {
    const base = [...filteredActions];

    if (sortField === 'eta') {
      base.sort((a, b) => {
        const parse = (eta) => (eta === 'Immediate' ? 0 : parseInt(eta));
        return parse(a.eta) - parse(b.eta);
      });
    }

    return groupByPriority(base);
  }, [filteredActions, sortField]);

  return (
    <AnimatedCard
      title="🎯 Prioritized Action Queue"
      subTitle="Cross-Domain AI Recommendations"
      className="col-span-1 lg:col-span-2"
    >
      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center text-sm">
          <FaFilter className="text-gray-400" />
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm"
          >
            <option value="All">All</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved, Executing">Approved, Executing</option>
            <option value="New Suggestion">New Suggestion</option>
          </select>
        </div>

        <div className="flex gap-2 items-center text-sm">
          <FaSortAmountDown className="text-gray-400" />
          <label>Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm"
          >
            <option value="priority">Priority</option>
            <option value="eta">ETA</option>
          </select>
        </div>
      </div>

      {/* Grouped Display */}
      <div className="space-y-6">
        {PRIORITY_ORDER.map((priority) => {
          const actions = groupedActions[priority];
          if (!actions || actions.length === 0) return null;

          return (
            <div key={priority}>
              <h3 className="text-md font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                {getStatusIcon(priority === 'Critical' ? 'RED' : priority === 'High' ? 'ORANGE' : 'YELLOW')}
                {priority} Priority
              </h3>

              <div className="space-y-3">
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{action.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Status:</span> {action.status} &bull; <span className="font-medium">ETA:</span> {action.eta}
                        </div>
                      </div>

                      <button
                        className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                        onClick={() => console.log(`Drill into action ${action.id}`)}
                      >
                        View Playbook <FaArrowRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredActions.length === 0 && (
        <div className="text-center text-gray-400 mt-8">No actions found with current filters.</div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-3 mt-6">
        <div className="flex justify-between">
          <span>🤖 AI-Generated Cross-Domain Actions</span>
          <span>Total Actions: {filteredActions.length}</span>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default PrioritizedActionQueue;
