
import React from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const mockTeamData = [
  { name: 'Brielle K.', sales: '$3,120', training: '4/6', campaigns: 3, xp: 1205, status: 'active' },
  { name: 'Nico V.', sales: '$4,720', training: '6/6', campaigns: 5, xp: 1450, status: 'active' },
  { name: 'Tamika R.', sales: '$2,310', training: '3/6', campaigns: 1, xp: 890, status: 'needs_coaching' },
  { name: 'Jules K.', sales: '$5,120', training: '5/6', campaigns: 7, xp: 1680, status: 'promotion_ready' },
  { name: 'Taylor M.', sales: '$1,890', training: '2/6', campaigns: 2, xp: 650, status: 'training_behind' }
];

const TeamAnalyticsView = () => (
  <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">👥 Team Performance Dashboard</h1>
    
    {/* Summary Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <AnimatedCard>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{mockTeamData.length}</p>
          <p className="text-sm text-gray-500">Total Reps</p>
        </div>
      </AnimatedCard>
      <AnimatedCard>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            ${mockTeamData.reduce((sum, rep) => sum + parseFloat(rep.sales.replace('$', '').replace(',', '')), 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total Sales</p>
        </div>
      </AnimatedCard>
      <AnimatedCard>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {mockTeamData.reduce((sum, rep) => sum + rep.campaigns, 0)}
          </p>
          <p className="text-sm text-gray-500">Active Campaigns</p>
        </div>
      </AnimatedCard>
      <AnimatedCard>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            {Math.round(mockTeamData.reduce((sum, rep) => sum + rep.xp, 0) / mockTeamData.length)}
          </p>
          <p className="text-sm text-gray-500">Avg XP</p>
        </div>
      </AnimatedCard>
    </div>

    {/* Detailed Table */}
    <AnimatedCard>
      <h2 className="text-lg font-semibold mb-4">Rep Performance Details</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Sales</th>
              <th className="pb-2">Training</th>
              <th className="pb-2">Campaigns</th>
              <th className="pb-2">XP</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockTeamData.map((rep, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 font-medium">{rep.name}</td>
                <td className="py-2">{rep.sales}</td>
                <td className="py-2">{rep.training}</td>
                <td className="py-2">{rep.campaigns}</td>
                <td className="py-2">{rep.xp}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rep.status === 'active' ? 'bg-green-100 text-green-800' :
                    rep.status === 'promotion_ready' ? 'bg-blue-100 text-blue-800' :
                    rep.status === 'needs_coaching' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {rep.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimatedCard>
  </div>
);

export default TeamAnalyticsView;
