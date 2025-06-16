
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useRealtimeData } from '../context/RealtimeDataContext';
import MetricsChart from './MetricsChart';
import AnimatedCard from './AnimatedCard';

const DashboardOverview = ({ user, realTimeData, onShowToast }) => {
  const [metrics, setMetrics] = useState({
    totalSites: 0,
    deployments: 0,
    alerts: 0,
    performance: 0
  });
  const [sites, setSites] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  
  const { get, post, loading } = useApi();
  const { 
    buildUpdates, 
    alertUpdates, 
    aiInsights, 
    connectionStatus,
    getUnresolvedAlerts,
    getLatestAIInsights 
  } = useRealtimeData();

  useEffect(() => {
    loadOverviewData();
  }, []);

  useEffect(() => {
    if (realTimeData) {
      updateRealTimeMetrics(realTimeData);
    }
  }, [realTimeData]);

  // Update metrics based on real-time data
  useEffect(() => {
    const unresolvedAlerts = getUnresolvedAlerts();
    const recentBuilds = buildUpdates.filter(build => 
      new Date(build.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    setMetrics(prev => ({
      ...prev,
      alerts: unresolvedAlerts.length,
      deployments: recentBuilds.filter(build => build.status === 'ready').length,
      performance: Math.max(70, 100 - (unresolvedAlerts.length * 5))
    }));

    // Update recent activity with real-time events
    const latestActivity = [
      ...buildUpdates.slice(0, 3).map(build => ({
        icon: build.status === 'ready' ? '✅' : build.status === 'failed' ? '❌' : '🔄',
        message: `${build.siteId}: ${build.message}`,
        timestamp: new Date(build.timestamp).toLocaleString()
      })),
      ...alertUpdates.slice(0, 2).map(alert => ({
        icon: alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️',
        message: `${alert.siteId}: ${alert.message}`,
        timestamp: new Date(alert.timestamp).toLocaleString()
      }))
    ].slice(0, 5);

    setRecentActivity(latestActivity);
  }, [buildUpdates, alertUpdates]);

  const loadOverviewData = async () => {
    try {
      const [metricsRes, sitesRes, activityRes] = await Promise.all([
        get('/api/metrics/overview'),
        get('/api/sites'),
        get('/api/activity/recent')
      ]);

      setMetrics(metricsRes.data || metrics);
      setSites(sitesRes.data || []);
      setRecentActivity(activityRes.data || []);
    } catch (err) {
      onShowToast('Failed to load overview data: ' + err.message, 'error');
    }
  }
  const updateRealTimeMetrics = (data) => {
    if (data.metrics) {
      setMetrics(prev => ({...prev, ...data.metrics}));
    }
    
    if (data.activity) {
      setRecentActivity(prev => [data.activity, ...prev.slice(0, 9)]);
    }
  }
  const handleBulkDeploy = async () => {
    try {
      const response = await post('/api/sites/bulk-deploy');
      if (response.success) {
        onShowToast(`Bulk deployment initiated for ${response.count} sites`, 'success');
      }
    } catch (err) {
      onShowToast('Bulk deployment failed: ' + err.message, 'error');
    }
  }
  const handleAutoOptimize = async () => {
    try {
      const response = await post('/api/ai/optimize');
      if (response.success) {
        onShowToast(`AI optimization completed: ${response.optimizations} improvements`, 'success');
      }
    } catch (err) {
      onShowToast('Auto-optimization failed: ' + err.message, 'error');
    }
  }
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to Master Deployment Orchestrator</h1>
        <p className="text-lg opacity-90">
          Enterprise-grade autonomous deployment management with AI-powered insights
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedCard>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sites</p>
              <p className="text-3xl font-bold text-blue-600">{metrics.totalSites}</p>
            </div>
            <div className="text-4xl">🌐</div>
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Deployments Today</p>
              <p className="text-3xl font-bold text-green-600">{metrics.deployments}</p>
            </div>
            <div className="text-4xl">🚀</div>
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Alerts</p>
              <p className="text-3xl font-bold text-yellow-600">{metrics.alerts}</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Performance</p>
              <p className="text-3xl font-bold text-purple-600">{metrics.performance}%</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </AnimatedCard>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">🤖 Autonomous Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleBulkDeploy}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            🚀 Bulk Deploy All
          </button>
          
          <button
            onClick={handleAutoOptimize}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            🧠 AI Optimize
          </button>
          
          <button
            onClick={() => onShowToast('Health check initiated', 'info')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            💊 Health Check
          </button>
          
          <button
            onClick={() => onShowToast('Backup creation started', 'info')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            💾 Create Backups
          </button>
        </div>
      </div>

      {/* AI Insights Section */}
      <AnimatedCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">🤖 AI Proactive Insights</h3>
            <div className={`px-2 py-1 rounded-full text-xs ${
              connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
              connectionStatus === 'mock' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {connectionStatus === 'connected' ? 'Live' : 
               connectionStatus === 'mock' ? 'Demo' : 'Offline'}
            </div>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {getLatestAIInsights(3).length > 0 ? (
              getLatestAIInsights(3).map((insight, index) => (
                <div key={insight.id} className={`p-3 rounded-lg border-l-4 ${
                  insight.insightType === 'anomaly' 
                    ? 'bg-red-50 border-red-400' 
                    : 'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {insight.insightType === 'anomaly' ? '🚨' : '🔮'} {insight.message}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Site: {insight.siteId} • Confidence: {insight.confidence}%
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        💡 {insight.recommendedAction}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(insight.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No AI insights available</p>
            )}
          </div>
        </div>
      </AnimatedCard>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <AnimatedCard>
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4">📈 Performance Trends</h3>
            <MetricsChart data={realTimeData?.chartData} />
          </div>
        </AnimatedCard>

        {/* Recent Activity */}
        <AnimatedCard>
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4">🔔 Recent Activity</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{activity.icon || '📋'}</div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-600">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Sites Overview */}
      <AnimatedCard>
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">🌐 Sites Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.length > 0 ? (
              sites.slice(0, 6).map((site, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{site.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      site.status === 'healthy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {site.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{site.url}</p>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Deploy
                    </button>
                    <button className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Logs
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No sites configured yet
              </div>
            )}
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}
export default DashboardOverview;
