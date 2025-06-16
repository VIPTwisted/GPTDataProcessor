
// src/hooks/useAIAgent.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAIAgent = () => {
  const { secureApi } = useAuth();
  const [agentStatus, setAgentStatus] = useState('idle');
  const [lastExecution, setLastExecution] = useState(null);
  const [error, setError] = useState(null);

  const triggerAgent = async () => {
    setAgentStatus('running');
    setError(null);
    
    try {
      const response = await secureApi('/.netlify/functions/ai/agent-orchestrator', {
        method: 'POST'
      });
      
      const result = await response.json();
      setLastExecution({
        ...result,
        timestamp: new Date().toISOString()
      });
      setAgentStatus('completed');
      
      return result;
    } catch (err) {
      setError(err.message);
      setAgentStatus('error');
      throw err;
    }
  }
  // Auto-trigger every 5 minutes in production
  useEffect(() => {
    const interval = setInterval(() => {
      if (process.env.NODE_ENV === 'production') {
        triggerAgent();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    triggerAgent,
    agentStatus,
    lastExecution,
    error
  }
}