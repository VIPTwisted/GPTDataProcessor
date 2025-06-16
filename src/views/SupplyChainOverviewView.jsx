
// src/views/SupplyChainOverviewView.jsx
import React from 'react';
import {
  mockInventoryForecast,
  mockRouteOptimization,
  mockSupplierMetrics,
  mockStockHealth,
  mockGlobalSupplyFlow
} from '../data/mockSupplyChainData';
import AnimatedCard from '../components/widgets/AnimatedCard';

const SupplyChainOverviewView = () => {
  const getRatingColor = (rating) => {
    switch (rating) {
      case 'A+': return 'text-green-600 bg-green-100';
      case 'A': return 'text-green-500 bg-green-50';
      case 'B': return 'text-yellow-600 bg-yellow-100';
      case 'C+': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        📦 Supply Chain & Inventory Intelligence
      </h1>
      <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
        Predictive demand trends, supplier reliability, route optimization, and global supply flow monitoring.
      </p>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$302K</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-xl">🏭</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Routes Optimized</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-xl">🛣️</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Avg Health Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">79%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 dark:text-yellow-400 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Inventory Forecast */}
        <AnimatedCard title="📈 Inventory Demand Forecasting" subTitle="AI-predicted stock levels by location/SKU">
          <div className="space-y-3">
            {mockInventoryForecast.map((item, i) => {
              const isLow = item.stock + item.forecast < 50;
              const projectedStock = item.stock + item.forecast;
              return (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">{item.product}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.location} • {item.sku}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Current: {item.stock} | Forecast: {item.forecast > 0 ? '+' : ''}{item.forecast}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {isLow ? '⚠️ REORDER' : '✅ OK'}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Projected: {projectedStock}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedCard>

        {/* Stock Health Matrix */}
        <AnimatedCard title="🔄 Stock Health by Category" subTitle="Turnover rates and inventory health scores">
          <div className="space-y-4">
            {mockStockHealth.map((category, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-white">{category.category}</h4>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${getHealthColor(category.healthScore)}`}>
                    {category.healthScore}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Total Value</p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      ${category.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Turnover Rate</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{category.turnoverRate}x</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Route Optimization */}
      <AnimatedCard title="🧭 AI Route Optimization" subTitle="Smart logistics and delivery efficiency suggestions" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRouteOptimization.map((route, i) => (
            <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {route.from} ➡️ {route.to}
                </h4>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{route.eta}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Method: <span className="font-medium">{route.method}</span>
              </p>
              <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded text-sm">
                <p className="text-blue-700 dark:text-blue-300">
                  💡 <strong>AI Suggestion:</strong> {route.suggestion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Supplier Reliability Matrix */}
      <AnimatedCard title="🏷️ Supplier Reliability Scorecard" subTitle="Lead times, defect rates, and cost adherence tracking" className="mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Supplier</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Lead Time</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Defect Rate</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Cost Adherence</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Rating</th>
              </tr>
            </thead>
            <tbody>
              {mockSupplierMetrics.map((supplier, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">{supplier.name}</td>
                  <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">{supplier.leadTime}d</td>
                  <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                    {(supplier.defectRate * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                    {(supplier.costAdherence * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getRatingColor(supplier.rating)}`}>
                      {supplier.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>

      {/* Global Supply Flow */}
      <AnimatedCard title="🌎 Global Supply Flow Monitor" subTitle="International shipments and supply chain visibility">
        <div className="space-y-4">
          {mockGlobalSupplyFlow.map((flow, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400">🌐</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {flow.origin} → {flow.destination}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Volume: {flow.volume.toLocaleString()} units
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  flow.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  flow.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {flow.status}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">ETA: {flow.eta}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default SupplyChainOverviewView;
