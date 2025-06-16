
import { useState } from 'react';

export const useExecutePlaybook = () => {
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [error, setError] = useState(null);

  const execute = async ({ playbookId, steps, executedBy, context = {} }) => {
    setExecuting(true);
    setError(null);
    
    try {
      console.log(`🤖 Executing playbook: ${playbookId}`, { steps: steps.length, executedBy });
      
      const res = await fetch('/.netlify/functions/ai/execute-playbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          playbookId, 
          steps, 
          executedBy,
          context 
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      
      if (json.success === false) {
        throw new Error(json.error || 'Playbook execution failed');
      }

      setExecutionResult(json);
      console.log(`✅ Playbook executed: ${playbookId}`, json.execution_summary);
      
      return json;
    } catch (err) {
      setError(err.message);
      console.error('❌ Playbook Execution Error:', err);
      throw err;
    } finally {
      setExecuting(false);
    }
  }
  return { execute, executing, executionResult, error }
}