
import React, { useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const mockTraces = [
  {
    id: 'trace-001',
    name: 'Ecommerce Auto-Scale Decision',
    startTime: '2025-01-17T14:12:01Z',
    totalLatency: 740,
    status: 'success',
    steps: [
      { 
        label: 'GPT Trigger', 
        component: 'Reason Engine', 
        time: '14:12:01', 
        latency: 140,
        status: 'success',
        details: 'Traffic spike detected, analyzing patterns'
      },
      { 
        label: 'Playbook Selection', 
        component: 'Orchestrator Brain', 
        time: '14:12:03', 
        latency: 320,
        status: 'success',
        details: 'Selected ecommerce-scale-v2 playbook with 89% confidence'
      },
      { 
        label: 'Action Execution', 
        component: 'Execute API', 
        time: '14:12:06', 
        latency: 210,
        status: 'success',
        details: 'Scaled infrastructure from 2 to 4 instances'
      },
      { 
        label: 'Notification Sent', 
        component: 'Webhook Dispatcher', 
        time: '14:12:07', 
        latency: 70,
        status: 'success',
        details: 'Slack notification sent to #ops-alerts'
      }
    ]
  },
  {
    id: 'trace-002',
    name: 'Support Ticket Anomaly Detection',
    startTime: '2025-01-17T13:50:00Z',
    totalLatency: 580,
    status: 'warning',
    steps: [
      { 
        label: 'Data Ingestion', 
        component: 'Support Module', 
        time: '13:50:00', 
        latency: 90,
        status: 'success',
        details: 'Ingested 847 tickets from last 24h'
      },
      { 
        label: 'Anomaly Detection', 
        component: 'AI Analyzer', 
        time: '13:50:02', 
        latency: 420,
        status: 'success',
        details: 'Detected 300% spike in weekend support requests'
      },
      { 
        label: 'Alert Generation', 
        component: 'Alert Processor', 
        time: '13:50:06', 
        latency: 70,
        status: 'warning',
        details: 'Generated medium-priority alert for review'
      }
    ]
  }
];

const TraceView = () => {
  const [selectedTrace, setSelectedTrace] = useState(mockTraces[0]);
  const [expandedStep, setExpandedStep] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getLatencyColor = (latency) => {
    if (latency > 500) return 'text-red-600';
    if (latency > 200) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        🔍 Distributed Execution Traces
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Trace List */}
        <div className="lg:col-span-1">
          <AnimatedCard title="Recent Traces">
            <div className="space-y-2">
              {mockTraces.map((trace) => (
                <div
                  key={trace.id}
                  onClick={() => setSelectedTrace(trace)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTrace.id === trace.id 
                      ? 'bg-indigo-100 border-indigo-300' 
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  } border`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium truncate">
                      {trace.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(trace.status)}`}>
                      {trace.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>{new Date(trace.startTime).toLocaleTimeString()}</div>
                    <div className={`font-medium ${getLatencyColor(trace.totalLatency)}`}>
                      {trace.totalLatency}ms total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>

        {/* Trace Details */}
        <div className="lg:col-span-3">
          <AnimatedCard>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedTrace.name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Started: {new Date(selectedTrace.startTime).toLocaleString()}</span>
                <span className={`font-medium ${getLatencyColor(selectedTrace.totalLatency)}`}>
                  Total: {selectedTrace.totalLatency}ms
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTrace.status)}`}>
                  {selectedTrace.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Execution Timeline */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
              
              <div className="space-y-6">
                {selectedTrace.steps.map((step, i) => (
                  <div key={i} className="relative flex items-start">
                    <div className={`absolute left-6 w-4 h-4 rounded-full border-2 bg-white ${
                      step.status === 'success' ? 'border-green-500' :
                      step.status === 'warning' ? 'border-yellow-500' :
                      step.status === 'error' ? 'border-red-500' : 'border-gray-400'
                    }`}></div>
                    
                    <div className="ml-12 flex-1">
                      <div
                        onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                        className="cursor-pointer"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">
                            {step.label}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${getLatencyColor(step.latency)}`}>
                              {step.latency}ms
                            </span>
                            <span className="text-xs text-gray-500">
                              {step.time}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Component: {step.component}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(step.status)}`}>
                            {step.status}
                          </span>
                        </div>
                      </div>
                      
                      {expandedStep === i && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {step.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default TraceView;
