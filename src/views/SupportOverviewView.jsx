
// src/views/SupportOverviewView.jsx
import React from 'react';
import {
  mockTicketForecast,
  mockSentimentStream,
  mockAgentPerformance,
  mockEscalationAlerts,
  mockChurnRiskCustomers
} from '../data/mockSupportData';
import AnimatedCard from '../components/widgets/AnimatedCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const SupportOverviewView = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">💬 Support Intelligence Center</h1>
      <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
        Predictive workload, emotional sentiment insights, and agent augmentation.
      </p>

      {/* Forecasted Ticket Load */}
      <AnimatedCard title="📊 Predictive Ticket Volume" subTitle="AI-forecasted staffing requirements" className="mb-8">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockTicketForecast}>
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expected" fill="#6366F1" name="Expected Tickets" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            🤖 AI Alert: Friday spike predicted due to campaign launch. Consider +2 agents.
          </p>
        </div>
      </AnimatedCard>

      {/* Sentiment Mapping */}
      <AnimatedCard title="😊 Omnichannel Sentiment Feed" subTitle="Live customer emotional context" className="mb-8">
        <div className="space-y-3">
          {mockSentimentStream.map((msg) => (
            <div key={msg.id} className="flex justify-between items-start p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800 dark:text-white">{msg.channel}</span>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {msg.channel}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{msg.message}"</p>
              </div>
              <span className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${
                msg.sentiment === 'Positive' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
              }`}>
                {msg.sentiment}
              </span>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Agent Performance & Smart Escalation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnimatedCard title="🧠 Agent Performance Coaching" subTitle="Live KPIs with training flags">
          <div className="space-y-4">
            {mockAgentPerformance.map((agent, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    agent.rating >= 4.5 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                    agent.rating >= 4.0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                  }`}>
                    {agent.rating >= 4.5 ? 'Excellent' : agent.rating >= 4.0 ? 'Good' : 'Needs Coaching'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Tickets</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{agent.tickets}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Avg Time</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{agent.avgTime}m</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Rating</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{agent.rating} ★</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        <AnimatedCard title="🛠️ Smart Escalation Alerts" subTitle="AI-flagged priority interventions">
          <div className="space-y-3">
            {mockEscalationAlerts.map((alert, i) => (
              <div key={i} className="p-3 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{alert.ticketId}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert.priority === 'Critical' ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Customer: {alert.customer}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{alert.issue}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            🚨 Review All Escalations
          </button>
        </AnimatedCard>
      </div>

      {/* Churn Detection */}
      <AnimatedCard title="⚠️ Churn Risk Detection" subTitle="Proactive customer retention alerts" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockChurnRiskCustomers.map((customer) => (
            <div key={customer.id} className="p-4 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{customer.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ID: {customer.id}</p>
                </div>
                <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">
                  {Math.round(customer.riskScore * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Last contact: {customer.lastContact}</p>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-1.5 px-3 rounded transition-colors">
                🎯 Initiate Retention Campaign
              </button>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Future Integration Modules */}
      <AnimatedCard title="🔮 Future AI Extensions" subTitle="Planned integrations for advanced support">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <div className="text-2xl mb-2">🤖</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">GPT Response Assistant</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">AI-suggested responses for complex tickets</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <div className="text-2xl mb-2">📞</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Voice Analytics</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Call sentiment & coaching from voice logs</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <div className="text-2xl mb-2">💬</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Chatbot Integration</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Live chatbot conversation insights</p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default SupportOverviewView;
