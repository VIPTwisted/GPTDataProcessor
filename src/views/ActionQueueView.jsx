
// src/views/ActionQueueView.jsx
import React, { useEffect, useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';
import ExplainAI from '../components/widgets/ExplainAI';
import { useAuth } from '../context/AuthContext';
import { useAuditTrail } from '../hooks/useAuditTrail';
import { FaRobot, FaClock, FaCheckCircle, FaTimesCircle, FaPlay, FaPause, FaEye, FaFilter } from 'react-icons/fa';

const mockQueue = [
  {
    id: 'ACT-001',
    playbookId: 'ecommerce-api-optimize-v2',
    title: 'Ecommerce Latency Fix',
    status: 'Executed',
    by: 'GPT-Agent',
    eta: '1m ago',
    confidence: 0.94,
    priority: 'High',
    category: 'Performance',
    estimatedImpact: '$2,400 recovered revenue',
    executionTime: '45s',
    reasoning: 'API response time increased by 340ms, causing 12% cart abandonment spike'
  },
  {
    id: 'ACT-002',
    playbookId: 'inventory-markdown-product-x',
    title: 'Overstock Reduction - Product X',
    status: 'Pending Approval',
    by: 'AI Suggestion',
    eta: '5m ago',
    confidence: 0.87,
    priority: 'Medium',
    category: 'Inventory',
    estimatedImpact: '$8,900 cost reduction',
    executionTime: 'N/A',
    reasoning: 'Product X has 340% excess inventory vs. seasonal demand patterns'
  },
  {
    id: 'ACT-003',
    playbookId: 'southington-staff-rebalance-v1',
    title: 'Staffing Rebalance - Southington',
    status: 'Rejected',
    by: 'Human Admin',
    eta: '12m ago',
    confidence: 0.61,
    priority: 'Low',
    category: 'HR',
    estimatedImpact: 'Staff efficiency +15%',
    executionTime: 'N/A',
    reasoning: 'Low confidence score - insufficient historical data for location'
  },
  {
    id: 'ACT-004',
    playbookId: 'marketing-budget-reallocate-q1',
    title: 'Q1 Marketing Budget Reallocation',
    status: 'Queued',
    by: 'AI Scheduler',
    eta: 'Just now',
    confidence: 0.91,
    priority: 'Critical',
    category: 'Marketing',
    estimatedImpact: '+23% conversion rate',
    executionTime: 'N/A',
    reasoning: 'Social media ROI dropped 67% while email marketing shows 340% increase'
  }
];

const ActionQueueView = () => {
  const { user } = useAuth();
  const { logAction } = useAuditTrail();
  const [queue, setQueue] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('priority');

  useEffect(() => {
    setQueue(mockQueue);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Executed':
        return <FaCheckCircle className="text-green-500" />;
      case 'Pending Approval':
        return <FaClock className="text-yellow-500" />;
      case 'Queued':
        return <FaPlay className="text-blue-500" />;
      case 'Rejected':
        return <FaTimesCircle className="text-red-500" />;
      case 'Paused':
        return <FaPause className="text-gray-500" />;
      default:
        return <FaRobot className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Executed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Queued':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Paused':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500 text-white';
      case 'High':
        return 'bg-orange-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      case 'Low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleApproveAction = async (actionId) => {
    try {
      const action = queue.find(a => a.id === actionId);
      
      // Update status
      setQueue(prev => prev.map(item => 
        item.id === actionId 
          ? { ...item, status: 'Executed', eta: 'Just now', by: user?.email || 'Admin' }
          : item
      ));

      // Log the approval
      await logAction({
        actionType: 'action_approved',
        actor: user?.email || 'admin',
        confidence: action.confidence,
        notes: `Approved action: ${action.title}`,
        context: { actionId, playbookId: action.playbookId }
      });

      // Simulate execution API call
      await fetch('/.netlify/functions/ai/execute-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playbookId: action.playbookId,
          actionId: actionId,
          approvedBy: user?.email || 'admin'
        })
      });

    } catch (error) {
      console.error('Failed to approve action:', error);
    }
  };

  const handleRejectAction = async (actionId) => {
    try {
      const action = queue.find(a => a.id === actionId);
      
      setQueue(prev => prev.map(item => 
        item.id === actionId 
          ? { ...item, status: 'Rejected', eta: 'Just now', by: user?.email || 'Admin' }
          : item
      ));

      await logAction({
        actionType: 'action_rejected',
        actor: user?.email || 'admin',
        confidence: action.confidence,
        notes: `Rejected action: ${action.title}`,
        context: { actionId, playbookId: action.playbookId }
      });

    } catch (error) {
      console.error('Failed to reject action:', error);
    }
  };

  const filteredQueue = queue.filter(item => {
    if (filter === 'All') return true;
    return item.status === filter;
  });

  const sortedQueue = [...filteredQueue].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'confidence') {
      return b.confidence - a.confidence;
    }
    return 0;
  });

  const statusCounts = {
    All: queue.length,
    'Pending Approval': queue.filter(q => q.status === 'Pending Approval').length,
    'Queued': queue.filter(q => q.status === 'Queued').length,
    'Executed': queue.filter(q => q.status === 'Executed').length,
    'Rejected': queue.filter(q => q.status === 'Rejected').length
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🤖 AI Action Queue Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Mission control for AI decisions — track, approve, and audit all autonomous actions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                onClick={() => setFilter(status)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  filter === status 
                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{status}</div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <AnimatedCard>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-4">
                <FaFilter className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="priority">Sort by Priority</option>
                  <option value="confidence">Sort by Confidence</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                Showing {sortedQueue.length} of {queue.length} actions
              </div>
            </div>

            {/* Queue List */}
            <div className="space-y-4">
              {sortedQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className={`px-2 py-1 rounded border text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)} {item.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Playbook:</span> {item.playbookId}
                        </div>
                        <div>
                          <span className="font-medium">Triggered by:</span> {item.by}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {item.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(item.confidence * 100)}% Confidence
                      </div>
                      <div className="text-xs text-gray-500">{item.eta}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600 font-medium">
                        💰 {item.estimatedImpact}
                      </span>
                      {item.executionTime !== 'N/A' && (
                        <span className="text-gray-500">
                          ⏱️ {item.executionTime}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedAction(item)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors flex items-center gap-1"
                      >
                        <FaEye /> Details
                      </button>
                      
                      {item.status === 'Pending Approval' && (
                        <>
                          <button
                            onClick={() => handleApproveAction(item.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleRejectAction(item.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {sortedQueue.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No actions found for the selected filter.
                </div>
              )}
            </div>
          </AnimatedCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Detail Panel */}
          {selectedAction && (
            <AnimatedCard>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📋 Action Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">ID:</span>
                  <span className="ml-2 font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {selectedAction.id}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Title:</span>
                  <div className="mt-1 text-gray-600 dark:text-gray-400">
                    {selectedAction.title}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Reasoning:</span>
                  <div className="mt-1 text-gray-600 dark:text-gray-400 text-xs">
                    {selectedAction.reasoning}
                  </div>
                </div>
              </div>
            </AnimatedCard>
          )}

          {/* AI Explanation */}
          {selectedAction && (
            <ExplainAI
              decision={selectedAction.title}
              confidence={Math.round(selectedAction.confidence * 100)}
              reasoning={selectedAction.reasoning}
              impact={selectedAction.estimatedImpact}
              source="AI Action Queue System"
              metadata={{
                playbook_id: selectedAction.playbookId,
                category: selectedAction.category,
                priority: selectedAction.priority,
                triggered_by: selectedAction.by
              }}
            />
          )}

          {/* Queue Statistics */}
          <AnimatedCard>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Queue Statistics
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Confidence:</span>
                <span className="font-medium">
                  {Math.round(queue.reduce((acc, q) => acc + q.confidence, 0) / queue.length * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Auto-Executed:</span>
                <span className="font-medium text-green-600">
                  {queue.filter(q => q.status === 'Executed' && q.by.includes('GPT')).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Awaiting Approval:</span>
                <span className="font-medium text-yellow-600">
                  {queue.filter(q => q.status === 'Pending Approval').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                <span className="font-medium text-blue-600">
                  {Math.round(
                    queue.filter(q => q.status === 'Executed').length / 
                    queue.filter(q => q.status !== 'Queued').length * 100
                  )}%
                </span>
              </div>
            </div>
          </AnimatedCard>

          {/* Real-time Activity */}
          <AnimatedCard>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ⚡ Live Activity
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Action ACT-001 completed successfully</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>New playbook queued for execution</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Action ACT-002 awaiting approval</span>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default ActionQueueView;
