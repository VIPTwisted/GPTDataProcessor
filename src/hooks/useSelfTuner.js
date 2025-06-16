
// src/hooks/useSelfTuner.js
import { useState, useCallback } from 'react';

export function useSelfTuner() {
  const [tuningData, setTuningData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runTuning = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/.netlify/functions/brain/self-tuner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Tuning failed: ${response.status}`);
      }

      const result = await response.json();
      setTuningData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAIConfig = useCallback(async () => {
    try {
      const response = await fetch('/.netlify/functions/brain/self-tuner', {
        method: 'GET'
      });

      if (response.ok) {
        const result = await response.json();
        return result.config || null;
      }
    } catch (err) {
      console.warn('Could not fetch AI config:', err.message);
    }
    return null;
  }, []);

  return {
    tuningData,
    loading,
    error,
    runTuning,
    getAIConfig
  }
}
