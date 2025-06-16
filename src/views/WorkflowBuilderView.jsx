
import React, { useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const WorkflowBuilderView = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState('manual');
  const [steps, setSteps] = useState([{ type: 'GPT', action: '', module: '', delay: 0 }]);
  const [savedWorkflows, setSavedWorkflows] = useState([
    { id: 1, title: 'End-of-Month Promo Flow', steps: 4, trigger: 'scheduled' },
    { id: 2, title: 'LMS Reminder & GPT Trainer Push', steps: 3, trigger: 'event' },
    { id: 3, title: 'Churn Risk Recovery Campaign', steps: 5, trigger: 'ai_detected' }
  ]);

  const addStep = () => {
    setSteps([...steps, { type: 'GPT', action: '', module: '', delay: 0 }]);
  };

  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const saveWorkflow = () => {
    if (!title.trim()) return;
    
    const newWorkflow = {
      id: Date.now(),
      title,
      description,
      trigger,
      steps: steps.length,
      created: new Date().toISOString()
    };
    
    setSavedWorkflows([newWorkflow, ...savedWorkflows]);
    setTitle('');
    setDescription('');
    setSteps([{ type: 'GPT', action: '', module: '', delay: 0 }]);
  };

  const stepTypes = ['GPT', 'Function', 'Notification', 'Delay', 'Condition'];
  const modules = ['Finance', 'Marketing', 'LMS', 'Support', 'Ecommerce', 'Social'];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">⚙️ Workflow Automation Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder */}
        <div className="space-y-4">
          <AnimatedCard>
            <h2 className="text-lg font-semibold mb-4">Create New Workflow</h2>
            
            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Workflow Title"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
              
              <select 
                value={trigger} 
                onChange={(e) => setTrigger(e.target.value)} 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="manual">Manual Trigger</option>
                <option value="scheduled">Scheduled</option>
                <option value="event">Event-Based</option>
                <option value="ai_detected">AI Detected</option>
              </select>
            </div>
          </AnimatedCard>

          <AnimatedCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Workflow Steps</h3>
              <button onClick={addStep} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                Add Step
              </button>
            </div>
            
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Step {i + 1}</span>
                    {steps.length > 1 && (
                      <button 
                        onClick={() => removeStep(i)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <select 
                      value={step.type} 
                      onChange={(e) => handleStepChange(i, 'type', e.target.value)} 
                      className="p-2 border rounded"
                    >
                      {stepTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    
                    <select 
                      value={step.module} 
                      onChange={(e) => handleStepChange(i, 'module', e.target.value)} 
                      className="p-2 border rounded"
                    >
                      <option value="">Select Module</option>
                      {modules.map(module => (
                        <option key={module} value={module}>{module}</option>
                      ))}
                    </select>
                  </div>
                  
                  <input 
                    value={step.action} 
                    onChange={(e) => handleStepChange(i, 'action', e.target.value)} 
                    placeholder="Action description or function name" 
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
              ))}
            </div>
            
            <button 
              onClick={saveWorkflow}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              disabled={!title.trim()}
            >
              Save Workflow
            </button>
          </AnimatedCard>
        </div>

        {/* Saved Workflows */}
        <div>
          <AnimatedCard>
            <h2 className="text-lg font-semibold mb-4">Saved Workflows</h2>
            
            <div className="space-y-3">
              {savedWorkflows.map((workflow) => (
                <div key={workflow.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{workflow.title}</h3>
                      <p className="text-sm text-gray-500">
                        {workflow.steps} steps • {workflow.trigger}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button className="text-green-600 hover:text-green-800 text-sm">Run</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilderView;
