// src/views/PlaybookEditorView.jsx
import React, { useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';
import { useAuth } from '../context/AuthContext';

const emptyStep = { title: '', description: '', type: 'System' };

const PlaybookEditorView = () => {
  const { user } = useAuth();
  const [steps, setSteps] = useState([{ ...emptyStep }]);
  const [title, setTitle] = useState('New AI-Recommended Playbook');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleAdd = () => setSteps([...steps, { ...emptyStep }]);

  const handleRemove = (index) => {
    if (steps.length > 1) {
      const copy = [...steps];
      copy.splice(index, 1);
      setSteps(copy);
    }
  };

  const handleChange = (index, field, value) => {
    const copy = [...steps];
    copy[index][field] = value;
    setSteps(copy);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        playbookId: `pb-${Date.now()}`,
        title,
        createdBy: user?.email || 'admin@toyparty.com',
        steps: steps.filter(s => s.title.trim()),
        metadata: {
          createdAt: new Date().toISOString(),
          source: 'manual_creation',
          approvalRequired: steps.some(s => s.type === 'Approval'),
          estimatedDuration: steps.length * 2 // minutes
        }
      };

      const res = await fetch('/.netlify/functions/ai/execute-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      setLastResult(result);

      // Reset form on success
      if (result.status === 'success' || result.status === 'queued') {
        setTitle('New AI-Recommended Playbook');
        setSteps([{ ...emptyStep }]);
      }
    } catch (error) {
      setLastResult({ status: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTypeColor = (type) => {
    switch (type) {
      case 'System': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Human': return 'bg-green-100 text-green-800 border-green-200';
      case 'Approval': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🧠 Prescriptive Playbook Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Build automated decision trees and action sequences for AI execution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2">
          <AnimatedCard className="mb-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Playbook Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Emergency API Recovery Protocol"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  🛠️ Execution Steps
                </h3>
                <span className="text-sm text-gray-500">
                  {steps.filter(s => s.title.trim()).length} steps defined
                </span>
              </div>

              {steps.map((step, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Step {index + 1}
                    </span>
                    {steps.length > 1 && (
                      <button
                        onClick={() => handleRemove(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      value={step.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Step Title (e.g., Scale API Servers)"
                    />
                    <select
                      value={step.type}
                      onChange={(e) => handleChange(index, 'type', e.target.value)}
                      className={`px-3 py-2 rounded border font-medium ${getStepTypeColor(step.type)} focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="System">🤖 System (Automated)</option>
                      <option value="Human">👤 Human (Manual)</option>
                      <option value="Approval">✅ Approval (Review)</option>
                    </select>
                  </div>

                  <textarea
                    value={step.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="2"
                    placeholder="Detailed description of what this step does..."
                  />
                </div>
              ))}

              <div className="flex gap-3">
                <button 
                  onClick={handleAdd} 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  ➕ Add Step
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !title.trim() || !steps.some(s => s.title.trim())}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? '🔄 Submitting...' : '🚀 Submit Playbook'}
                </button>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Playbook Stats */}
          <AnimatedCard>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Playbook Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Steps:</span>
                <span className="font-medium">{steps.filter(s => s.title.trim()).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Automated:</span>
                <span className="font-medium text-blue-600">
                  {steps.filter(s => s.type === 'System' && s.title.trim()).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Manual:</span>
                <span className="font-medium text-green-600">
                  {steps.filter(s => s.type === 'Human' && s.title.trim()).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Approvals:</span>
                <span className="font-medium text-yellow-600">
                  {steps.filter(s => s.type === 'Approval' && s.title.trim()).length}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600 dark:text-gray-400">Est. Time:</span>
                <span className="font-medium">{steps.filter(s => s.title.trim()).length * 2} min</span>
              </div>
            </div>
          </AnimatedCard>

          {/* Last Execution Result */}
          {lastResult && (
            <AnimatedCard>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🎯 Last Execution
              </h3>
              <div className={`p-3 rounded-lg ${
                lastResult.status === 'success' || lastResult.status === 'queued' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className="font-medium mb-1">
                  Status: {lastResult.status}
                </div>
                <div className="text-sm">
                  {lastResult.message || lastResult.playbookId || 'Executed successfully'}
                </div>
                {lastResult.executionId && (
                  <div className="text-xs mt-2 opacity-75">
                    ID: {lastResult.executionId}
                  </div>
                )}
              </div>
            </AnimatedCard>
          )}

          {/* AI Recommendations */}
          <AnimatedCard>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🧠 AI Recommendations
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                  💡 Optimization Tip
                </div>
                <div className="text-blue-700 dark:text-blue-400">
                  Consider grouping similar system tasks for parallel execution
                </div>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
                <div className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                  ⚠️ Best Practice
                </div>
                <div className="text-yellow-700 dark:text-yellow-400">
                  Add approval steps for high-impact system changes
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default PlaybookEditorView;