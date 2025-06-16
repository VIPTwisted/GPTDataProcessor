// src/views/SystemGridView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaChartBar, FaCloud, FaStore, FaCogs, FaRobot, FaUsers } from 'react-icons/fa';
import AutopilotToggle from '../components/ai/AutopilotToggle';

const systemModules = [
  { name: 'Finance', route: '/finance', icon: FaChartBar, status: 'OK' },
  { name: 'Ecommerce', route: '/ecommerce', icon: FaStore, status: 'Critical' },
  { name: 'HR', route: '/hr', icon: FaUsers, status: 'OK' },
  { name: 'Operations', route: '/operations', icon: FaCogs, status: 'Warning' },
  { name: 'Marketing', route: '/marketing', icon: FaChartBar, status: 'OK' },
  { name: 'Support', route: '/support', icon: FaHeartbeat, status: 'OK' },
  { name: 'AI Engine', route: '/execution', icon: FaRobot, status: 'OK' },
  { name: 'Global Health', route: '/kpi', icon: FaHeartbeat, status: 'OK' },
  { name: 'Reason Graph', route: '/reason-graph', icon: FaCloud, status: 'OK' },
  { name: 'Logs', route: '/logs', icon: FaCloud, status: 'OK' },
  { name: 'Trace', route: '/trace', icon: FaCloud, status: 'OK' },
  { name: 'Diagnostics', route: '/diagnostics', icon: FaCogs, status: 'OK' }
];

const statusColors = {
  OK: 'bg-green-100 text-green-800 border-green-200',
  Warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse',
  Critical: 'bg-red-100 text-red-800 border-red-200 animate-pulse'
};

const SystemGridView = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Command Grid</h1>
        <AutopilotToggle />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemModules.map((mod, i) => {
          const Icon = mod.icon;
          const color = statusColors[mod.status] || 'bg-gray-100';

          return (
            <div
              key={i}
              onClick={() => navigate(mod.route)}
              className={`cursor-pointer p-6 rounded-xl shadow-md border-2 hover:scale-105 transition transform duration-300 ${color}`}
            >
              <div className="flex items-center gap-4">
                <Icon className="text-2xl" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{mod.name}</p>
                  <p className="text-xs text-gray-500">{mod.status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">GPT Command Prompt</h2>
        <form className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-700"
            placeholder="Ask Orchestrator... (e.g. 'Run ecommerce fix', 'Check all systems')"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Execute
          </button>
        </form>
      </div>
    </div>
  );
};

export default SystemGridView;