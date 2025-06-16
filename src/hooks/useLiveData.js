
import { useState, useEffect, useCallback } from 'react';

// Live data hook for real-time API integration
export const useLiveData = (dataType, params = {}, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { 
    autoRefresh = true, 
    refreshInterval = 30000, // 30 seconds
    dataEngineUrl = 'http://0.0.0.0:4000',
    netlifyFunctionUrl = '/.netlify/functions/data/intel-router'
  } = options;

  const fetchData = useCallback(async (useCache = false) => {
    if (!dataType) return;

    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (useCache) {
        // Try to get cached data first
        response = await fetch(`${dataEngineUrl}/api/cache/${dataType}`);
        if (!response.ok) {
          throw new Error('No cached data available');
        }
      } else {
        // Fetch fresh data
        const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '0.0.0.0'
          ? `${dataEngineUrl}/api/fetch`
          : netlifyFunctionUrl;

        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: dataType, params })
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success !== false) {
        setData(result.data || result);
        setLastUpdated(new Date().toISOString());
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error(`❌ useLiveData error for ${dataType}:`, err);
      setError(err.message);
      
      // Try to get cached data as fallback
      if (!useCache) {
        try {
          await fetchData(true);
        } catch (cacheError) {
          console.error(`❌ Cache fallback failed for ${dataType}:`, cacheError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [dataType, params, dataEngineUrl, netlifyFunctionUrl]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || !dataType) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData, dataType]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    isStale: lastUpdated && (Date.now() - new Date(lastUpdated).getTime()) > refreshInterval
  }
}
// Hook for executing AI playbooks
export const usePlaybookExecution = (options = {}) => {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const { 
    dataEngineUrl = 'http://0.0.0.0:4000',
    netlifyFunctionUrl = '/.netlify/functions/ai/execute-playbook'
  } = options;

  const executePlaybook = useCallback(async (playbookId, steps, executedBy, context = {}) => {
    setExecuting(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '0.0.0.0'
        ? `${dataEngineUrl}/api/execute-playbook`
        : netlifyFunctionUrl;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbookId, steps, executedBy, context })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const executionResult = await response.json();
      
      if (executionResult.success) {
        setResult(executionResult);
        console.log(`✅ Playbook ${playbookId} executed successfully`);
      } else {
        throw new Error(executionResult.error || 'Playbook execution failed');
      }

      return executionResult;
    } catch (err) {
      console.error(`❌ Playbook execution error:`, err);
      setError(err.message);
      throw err;
    } finally {
      setExecuting(false);
    }
  }, [dataEngineUrl, netlifyFunctionUrl]);

  return {
    executePlaybook,
    executing,
    result,
    error
  }
}
// Hook for real-time data streaming
export const useDataStream = (options = {}) => {
  const [connected, setConnected] = useState(false);
  const [streamData, setStreamData] = useState(null);
  const [error, setError] = useState(null);

  const { 
    dataEngineUrl = 'http://0.0.0.0:4000'
  } = options;

  useEffect(() => {
    if (!window.EventSource) {
      setError('EventSource not supported');
      return;
    }

    const eventSource = new EventSource(`${dataEngineUrl}/api/stream`);

    eventSource.onopen = () => {
      setConnected(true);
      setError(null);
      console.log('🔌 Connected to live data stream');
    }
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStreamData(data);
      } catch (err) {
        console.error('❌ Error parsing stream data:', err);
      }
    }
    eventSource.onerror = (err) => {
      setConnected(false);
      setError('Stream connection error');
      console.error('❌ Stream error:', err);
    }
    return () => {
      eventSource.close();
      setConnected(false);
    }
  }, [dataEngineUrl]);

  return {
    connected,
    streamData,
    error
  }
}
export default useLiveData;
