
import React from 'react';
import { useAutopilot } from '../../context/AutopilotContext';

const AutopilotToggle = () => {
  const { enabled, toggle } = useAutopilot();

  return (
    <button 
      onClick={toggle} 
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
        enabled 
          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
      }`}
    >
      {enabled ? '🧠 Autopilot: ON' : '🛑 Autopilot: OFF'}
    </button>
  );
};

export default AutopilotToggle;
