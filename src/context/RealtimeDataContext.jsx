
import React, { createContext, useContext, useEffect, useState } from 'react';

const RealtimeDataContext = createContext();

export const useRealtimeData = () => {
  const context = useContext(RealtimeDataContext);
  if (!context) {
    throw new Error('useRealtimeData must be used within a RealtimeDataProvider');
  }
  return context;
};

export const RealtimeDataProvider = ({ children }) => {
  const [buildUpdates, setBuildUpdates] = useState([]);
  const [alertUpdates, setAlertUpdates] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    connectToEventStream();
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const connectToEventStream = () => {
    try {
      // Use different URLs for development vs production
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8888' 
        : '';
      
      const source = new EventSource(`${baseUrl}/.netlify/functions/realtime-streamer`);
      
      source.onopen = () => {
        console.log('🔗 Real-time connection established');
        setConnectionStatus('connected');
      };

      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleRealtimeEvent(data);
        } catch (err) {
          console.error('Failed to parse real-time event:', err);
        }
      };

      source.onerror = (error) => {
        console.warn('Real-time connection error:', error);
        setConnectionStatus('error');
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (source.readyState === EventSource.CLOSED) {
            connectToEventStream();
          }
        }, 5000);
      };

      setEventSource(source);

      // Fallback: Generate mock data if SSE fails
      setTimeout(() => {
        if (connectionStatus !== 'connected') {
          generateMockData();
        }
      }, 3000);

    } catch (error) {
      console.error('Failed to establish EventSource connection:', error);
      setConnectionStatus('error');
      generateMockData();
    }
  };

  const handleRealtimeEvent = (eventData) => {
    // Handle array of events or single event
    const events = Array.isArray(eventData) ? eventData : [eventData];
    
    events.forEach(event => {
      switch (event.type) {
        case 'buildUpdate':
          setBuildUpdates(prev => {
            const filtered = prev.filter(build => build.id !== event.id);
            return [event, ...filtered].slice(0, 50); // Keep last 50
          });
          break;

        case 'alertUpdate':
          setAlertUpdates(prev => {
            const filtered = prev.filter(alert => alert.id !== event.id);
            return [event, ...filtered].slice(0, 100); // Keep last 100
          });
          break;

        case 'aiInsight':
          setAiInsights(prev => {
            const filtered = prev.filter(insight => insight.id !== event.id);
            return [event, ...filtered].slice(0, 20); // Keep last 20
          });
          break;

        default:
          console.log('Unknown event type:', event.type);
      }
    });
  };

  const generateMockData = () => {
    console.log('🤖 Generating mock real-time data');
    setConnectionStatus('mock');

    // Generate initial mock data
    const mockBuilds = Array.from({ length: 5 }, (_, i) => ({
      type: 'buildUpdate',
      id: `mock-build-${i}`,
      timestamp: new Date(Date.now() - i * 30000).toISOString(),
      siteId: ['toyparty-main', 'site-1', 'site-2'][i % 3],
      status: ['ready', 'building', 'failed', 'enqueued'][i % 4],
      message: `Mock build ${['ready', 'building', 'failed', 'enqueued'][i % 4]}`,
      buildDuration: Math.floor(Math.random() * 200) + 60
    }));

    const mockAlerts = Array.from({ length: 3 }, (_, i) => ({
      type: 'alertUpdate',
      id: `mock-alert-${i}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      siteId: ['toyparty-main', 'site-1'][i % 2],
      severity: ['warning', 'info', 'critical'][i % 3],
      message: `Mock alert ${i + 1}`,
      resolved: Math.random() > 0.5
    }));

    const mockInsights = Array.from({ length: 2 }, (_, i) => ({
      type: 'aiInsight',
      id: `mock-insight-${i}`,
      timestamp: new Date(Date.now() - i * 120000).toISOString(),
      siteId: 'toyparty-main',
      insightType: i % 2 === 0 ? 'anomaly' : 'prediction',
      message: `Mock AI insight ${i + 1}`,
      confidence: 85,
      recommendedAction: 'Mock recommendation'
    }));

    setBuildUpdates(mockBuilds);
    setAlertUpdates(mockAlerts);
    setAiInsights(mockInsights);

    // Simulate periodic updates
    const interval = setInterval(() => {
      const newBuild = {
        type: 'buildUpdate',
        id: `mock-build-${Date.now()}`,
        timestamp: new Date().toISOString(),
        siteId: 'toyparty-main',
        status: ['ready', 'building'][Math.floor(Math.random() * 2)],
        message: `Live mock build update`,
        buildDuration: Math.floor(Math.random() * 200) + 60
      };

      setBuildUpdates(prev => [newBuild, ...prev.slice(0, 49)]);
    }, 30000);

    return () => clearInterval(interval);
  };

  const getLatestBuildForSite = (siteId) => {
    return buildUpdates.find(build => build.siteId === siteId);
  };

  const getUnresolvedAlerts = () => {
    return alertUpdates.filter(alert => !alert.resolved);
  };

  const getLatestAIInsights = (limit = 5) => {
    return aiInsights.slice(0, limit);
  };

  const value = {
    buildUpdates,
    alertUpdates,
    aiInsights,
    connectionStatus,
    getLatestBuildForSite,
    getUnresolvedAlerts,
    getLatestAIInsights,
    reconnect: connectToEventStream
  };

  return (
    <RealtimeDataContext.Provider value={value}>
      {children}
    </RealtimeDataContext.Provider>
  );
};
