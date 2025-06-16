
// src/views/ReasonGraphView.jsx
import React from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const mockReasonGraph = [
  { id: 'anomaly', label: 'Cart Failures ↑', type: 'event' },
  { id: 'metric', label: 'Checkout Errors 600% ↑', type: 'metric' },
  { id: 'gpt', label: 'AI Recommendation', type: 'gpt' },
  { id: 'playbook', label: 'Run API Optimize v2', type: 'playbook' },
  { id: 'module', label: 'Affected: Ecommerce + Infra', type: 'impact' }
];

const edges = [
  { from: 'anomaly', to: 'metric' },
  { from: 'metric', to: 'gpt' },
  { from: 'gpt', to: 'playbook' },
  { from: 'playbook', to: 'module' }
];

const nodeStyle = {
  event: 'bg-red-100 border-red-400 text-red-800',
  metric: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  gpt: 'bg-blue-100 border-blue-400 text-blue-800',
  playbook: 'bg-green-100 border-green-400 text-green-800',
  impact: 'bg-indigo-100 border-indigo-400 text-indigo-800'
};

const ReasonGraphView = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Visual Reason Graph</h1>
      <AnimatedCard>
        <div className="relative w-full h-[480px]">
          {mockReasonGraph.map((node, i) => (
            <div
              key={node.id}
              className={`absolute px-4 py-2 rounded shadow border text-sm font-semibold text-center w-max 
                ${nodeStyle[node.type]}`}
              style={{
                top: `${i * 80 + 20}px`,
                left: `${i * 60 + 40}px`,
                zIndex: 10
              }}
            >
              {node.label}
            </div>
          ))}

          {edges.map((e, i) => {
            const fromIdx = mockReasonGraph.findIndex((n) => n.id === e.from);
            const toIdx = mockReasonGraph.findIndex((n) => n.id === e.to);
            return (
              <svg
                key={i}
                className="absolute"
                width="800"
                height="500"
                style={{ top: 0, left: 0 }}
              >
                <line
                  x1={fromIdx * 60 + 100}
                  y1={fromIdx * 80 + 35}
                  x2={toIdx * 60 + 40}
                  y2={toIdx * 80 + 35}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
                <defs>
                  <marker
                    id="arrow"
                    markerWidth="10"
                    markerHeight="10"
                    refX="0"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
                  </marker>
                </defs>
              </svg>
            );
          })}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default ReasonGraphView;
