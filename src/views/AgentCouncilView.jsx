
import React, { useEffect, useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const AgentCouncilView = () => {
  const [agents, setAgents] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentDecisions();
  }, []);

  const loadAgentDecisions = async () => {
    try {
      setLoading(true);
      
      // Get agent decisions
      const agentResponse = await fetch('/.netlify/functions/org/agent-orchestrator', {
        method: 'POST'
      });
      const agentData = await agentResponse.json();
      setAgents(agentData.decisions || []);

      // Get unified strategy
      const strategyResponse = await fetch('/.netlify/functions/org/strategy-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisions: agentData.decisions })
      });
      const strategyData = await strategyResponse.json();
      setStrategy(strategyData);
    } catch (error) {
      console.error('Failed to load agent council data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (level) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Coordinating AI agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🤖 AI Agent Council</h1>
        <button 
          onClick={loadAgentDecisions}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh Council
        </button>
      </div>

      {/* Strategic Overview */}
      {strategy && (
        <div className="mb-8">
          <AnimatedCard>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">📊 Executive Strategy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{strategy.strategicSummary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Top Priorities</h3>
                <ul className="space-y-1 text-sm">
                  {strategy.topPriorities?.map((priority, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">• {priority}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Cross-Department Synergies</h3>
                <ul className="space-y-1 text-sm">
                  {strategy.synergies?.map((synergy, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">• {synergy}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
              <span>Confidence: {Math.round((strategy.confidence || 0) * 100)}%</span>
              <span>Based on {strategy.basedOnAgents} agents</span>
            </div>
          </AnimatedCard>
        </div>
      )}

      {/* Agent Decisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, i) => (
          <AnimatedCard key={i}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">
                {agent.agentId.replace('-agent', '').toUpperCase()}
              </h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(agent.impactLevel)}`}>
                {agent.impactLevel}
              </span>
            </div>
            
            <p className="text-sm text-gray-800 dark:text-gray-300 mb-3">{agent.suggestion}</p>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Confidence: {Math.round((agent.confidence || 0) * 100)}%</span>
              {agent.urgency && (
                <span className={`px-2 py-1 rounded ${getImpactColor(agent.urgency)}`}>
                  {agent.urgency} urgency
                </span>
              )}
            </div>
            
            {agent.resourcesNeeded && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                <strong>Resources:</strong> {agent.resourcesNeeded}
              </div>
            )}
          </AnimatedCard>
        ))}
      </div>

      {agents.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No agent decisions available. Click "Refresh Council" to coordinate agents.</p>
        </div>
      )}
    </div>
  );
};

export default AgentCouncilView;
