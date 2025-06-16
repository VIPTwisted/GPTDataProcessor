
// src/views/EcommerceOverviewView.jsx
import React from 'react';
import {
  mockCartFunnel,
  mockChurnRisk,
  mockProductPerformance,
  mockMLMGrowth
} from '../data/mockEcommerceData';
import AnimatedCard from '../components/widgets/AnimatedCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const EcommerceOverviewView = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">E-Commerce & MLM Intelligence</h1>
      <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
        Funnel analytics, churn forecasts, product velocity, and MLM network trends.
      </p>

      {/* Cart Funnel */}
      <AnimatedCard title="Cart Abandonment Funnel" subTitle="Session-to-Conversion Flow" className="mb-8">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockCartFunnel}>
            <XAxis dataKey="stage" stroke="#6B7280" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </AnimatedCard>

      {/* Churn Risk */}
      <AnimatedCard title="Churn Prevention Radar" subTitle="High Risk Customer Forecasts" className="mb-8">
        <ul className="space-y-4 text-sm">
          {mockChurnRisk.map((c) => (
            <li key={c.customerId} className="flex justify-between">
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{c.name}</p>
                <p className="text-xs text-gray-500">Last Order: {c.lastOrder}</p>
              </div>
              <p className={`text-right font-bold ${c.risk > 0.8 ? 'text-red-500' : c.risk > 0.6 ? 'text-orange-500' : 'text-yellow-500'}`}>
                Risk: {(c.risk * 100).toFixed(0)}%
              </p>
            </li>
          ))}
        </ul>
      </AnimatedCard>

      {/* Product Performance */}
      <AnimatedCard title="Top Product Metrics" subTitle="Sales, Returns & Ratings" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockProductPerformance.map((p) => (
            <div key={p.sku} className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700 shadow">
              <h4 className="font-bold text-gray-800 dark:text-white">{p.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sales: {p.sales.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Returns: {p.returns}</p>
              <p className="text-sm font-semibold text-green-500 dark:text-green-400">Rating: {p.rating}★</p>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* MLM Network Growth */}
      <AnimatedCard title="MLM Network Growth" subTitle="Monthly Lead vs Churn Trend">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockMLMGrowth}>
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="newLeads" fill="#10B981" name="New Leads" />
            <Bar dataKey="churned" fill="#EF4444" name="Churned" />
          </BarChart>
        </ResponsiveContainer>
      </AnimatedCard>
    </div>
  );
};

export default EcommerceOverviewView;
