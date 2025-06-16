
import React, { useEffect, useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';
import ExplainAI from '../components/ai/ExplainAI';
import { FaCheck, FaTimes, FaBrain, FaSearch, FaFilter, FaClock, FaUser } from 'react-icons/fa';

const mockExecutions = [
  {
    id: 'PB-001',
    title: 'API Gateway Scaling Playbook',
    origin: 'GPT-Agent',
    status: 'Success',
    confidence: 0.94,
    reason: 'API latency exceeded 300ms in 2 regions',
    recommendation: 'Auto-scale + flush Redis cache',
    steps: ['Trigger Auto-Scaler', 'Flush Redis Cache', 'Log Metrics'],
    timestamp: '2025-01-15T14:05:00Z',
    user: 'AI-System',
    module: 'Infrastructure'
  },
  {
    id: 'PB-002',
    title: 'Retail Staffing Rebalance',
    origin: 'Human Admin',
    status: 'Pending',
    confidence: 0.79,
    reason: 'Forecasted foot traffic spike Sat AM',
    recommendation: 'Reassign key holders from underused shift',
    steps: ['Shift Alert', 'Override Block', 'Update HR Schedule'],
    timestamp: '2025-01-15T13:10:00Z',
    user: 'John Manager',
    module: 'HR Operations'
  },
  {
    id: 'PB-003',
    title: 'E-commerce Inventory Alert',
    origin: 'GPT-Agent',
    status: 'Failed',
    confidence: 0.88,
    reason: 'Low stock detected on high-velocity items',
    recommendation: 'Auto-reorder from preferred suppliers',
    steps: ['Check Stock Levels', 'Contact Suppliers', 'Place Orders'],
    timestamp: '2025-01-15T12:30:00Z',
    user: 'AI-System',
    module: 'Supply Chain'
  },
  {
    id: 'PB-004',
    title: 'Marketing Campaign Optimization',
    origin: 'Human Admin',
    status: 'Success',
    confidence: 0.92,
    reason: 'Campaign performance below threshold',
    recommendation: 'Adjust targeting and increase budget',
    steps: ['Analyze Performance', 'Update Targeting', 'Increase Budget'],
    timestamp: '2025-01-15T11:45:00Z',
    user: 'Sarah Marketing',
    module: 'Marketing'
  }
];

const ExecutionCenterView = () => {
  const [executions, setExecutions] = useState([]);
  const [filteredExecutions, setFilteredExecutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [originFilter, setOriginFilter] = useState('All');
  const [selectedExecution, setSelectedExecution] = useState(null);

  useEffect(() => {
    setExecutions(mockExecutions);
    setFilteredExecutions(mockExecutions);
  }, []);

  useEffect(() => {
    let filtered = executions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(exec => 
        exec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exec.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exec.module.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(exec => exec.status === statusFilter);
    }

    // Apply origin filter
    if (originFilter !== 'All') {
      filtered = filtered.filter(exec => exec.origin === originFilter);
    }

    setFilteredExecutions(filtered);
  }, [searchTerm, statusFilter, originFilter, executions]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Success':
        return <FaCheck className="text-green-500" />;
      case 'Failed':
        return <FaTimes className="text-red-500" />;
      case 'Pending':
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'Failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎯 Execution Center
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Mission control for all AI and user-triggered playbooks
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search playbooks, IDs, users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Origin Filter */}
          <div className="relative">
            <FaBrain className="absolute left-3 top-3 text-gray-400" />
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Origins</option>
              <option value="GPT-Agent">AI-Driven</option>
              <option value="Human Admin">Human-Triggered</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredExecutions.length} of {executions.length} executions
            </span>
          </div>
        </div>
      </div>

      {/* Execution Timeline */}
      <div className="space-y-4">
        {filteredExecutions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No executions found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredExecutions.map((exec, i) => (
            <AnimatedCard 
              key={exec.id} 
              className="cursor-pointer hover:shadow-xl transition-all duration-200"
              onClick={() => setSelectedExecution(exec)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {exec.title}
                    </h2>
                    {exec.origin === 'GPT-Agent' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                        <FaBrain className="w-3 h-3" />
                        AI-Driven
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <strong>ID:</strong> {exec.id}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUser className="w-3 h-3" />
                      {exec.user}
                    </span>
                    <span>{exec.module}</span>
                    <span className="flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      {new Date(exec.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(exec.status)}`}>
                    {getStatusIcon(exec.status)}
                    {exec.status}
                  </span>
                </div>
              </div>

              <ExplainAI
                source={exec.origin}
                confidence={exec.confidence}
                reason={exec.reason}
                recommendation={exec.recommendation}
              />

              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Executed Steps:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exec.steps.map((step, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {idx + 1}. {step}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          ))
        )}
      </div>

      {/* Detailed Modal (optional enhancement) */}
      {selectedExecution && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedExecution(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {selectedExecution.title}
                </h2>
                <button
                  onClick={() => setSelectedExecution(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              
              {/* Detailed execution information would go here */}
              <div className="space-y-4">
                <div>
                  <strong>Playbook ID:</strong> {selectedExecution.id}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span className={`ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedExecution.status)}`}>
                    {getStatusIcon(selectedExecution.status)}
                    {selectedExecution.status}
                  </span>
                </div>
                <div>
                  <strong>Executed by:</strong> {selectedExecution.user}
                </div>
                <div>
                  <strong>Module:</strong> {selectedExecution.module}
                </div>
                <div>
                  <strong>Timestamp:</strong> {new Date(selectedExecution.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionCenterView;
