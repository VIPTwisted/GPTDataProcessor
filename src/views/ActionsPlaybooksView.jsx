// src/views/ActionsPlaybooksView.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ActionListItem from '../components/actions/ActionListItem';
import ActionDetailModal from '../components/actions/ActionDetailModal';
import { mockAIPrescriptiveActions } from '../data/mockGlobalData';

const ActionsPlaybooksView = () => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const handleActionClick = (action) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAction(null);
  };

  // Filter actions based on search and filters
  const filteredActions = mockAIPrescriptiveActions.filter(action => {
    const matchesSearch = action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'All' || action.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || action.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Get unique priorities and statuses for filter options
  const priorities = ['All', ...new Set(mockAIPrescriptiveActions.map(action => action.priority))];
  const statuses = ['All', ...new Set(mockAIPrescriptiveActions.map(action => action.status))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                to="/" 
                className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Actions & Playbooks Center
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Review, approve, and execute AI-recommended actions with detailed playbooks
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Actions: {mockAIPrescriptiveActions.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Filtered: {filteredActions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Actions
              </label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions List */}
        <div className="space-y-6">
          {filteredActions.length > 0 ? (
            filteredActions.map((action) => (
              <ActionListItem
                key={action.id}
                action={action}
                onClick={handleActionClick}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No actions found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>

        {/* Action Detail Modal */}
        <ActionDetailModal
          action={selectedAction}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default ActionsPlaybooksView;