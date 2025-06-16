
import React, { useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';
import { GPT_TIERS, TIER_FEATURES, checkFeatureAccess, validateTierUpgrade } from '../../logic/gpt-tiers';

const GPTTierManagementView = () => {
  const [currentTier, setCurrentTier] = useState('Starter');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [gptResponse, setGptResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testGPTAccess = async (agent) => {
    setLoading(true);
    setSelectedFeature(agent);
    
    try {
      const response = await fetch('/.netlify/functions/gpt/gate-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTier: currentTier,
          agent,
          prompt: `Test access to ${agent}`,
          userId: 'demo-user'
        })
      });
      
      const data = await response.json();
      setGptResponse(data.response || data.error);
    } catch (error) {
      setGptResponse('❌ Error connecting to GPT service');
    }
    
    setLoading(false);
  };

  const tierColors = {
    Starter: 'bg-gray-100 border-gray-300',
    Gold: 'bg-yellow-100 border-yellow-400',
    Platinum: 'bg-purple-100 border-purple-400',
    Enterprise: 'bg-blue-100 border-blue-500'
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💎 GPT Subscription Tier System</h1>
      
      {/* Tier Selector */}
      <AnimatedCard className="mb-6">
        <h2 className="text-xl font-semibold mb-4">🎯 Current Tier</h2>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(GPT_TIERS).map(tier => (
            <button
              key={tier}
              onClick={() => setCurrentTier(tier)}
              className={`px-4 py-2 rounded border-2 transition-all ${
                currentTier === tier 
                  ? tierColors[tier] + ' font-bold' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </AnimatedCard>

      {/* Feature Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.entries(TIER_FEATURES).map(([feature, description]) => {
          const hasAccess = checkFeatureAccess(currentTier, feature);
          const upgrade = validateTierUpgrade(currentTier, feature);
          
          return (
            <AnimatedCard 
              key={feature}
              className={`cursor-pointer transition-all ${
                hasAccess 
                  ? 'border-green-400 bg-green-50 hover:bg-green-100' 
                  : 'border-red-300 bg-red-50 hover:bg-red-100'
              }`}
              onClick={() => testGPTAccess(feature)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{feature}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  hasAccess ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {hasAccess ? '✅ Access' : '🔒 Locked'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{description}</p>
              {!hasAccess && upgrade.upgradeTiers.length > 0 && (
                <p className="text-xs text-blue-600">
                  📈 Available in: {upgrade.upgradeTiers.join(', ')}
                </p>
              )}
            </AnimatedCard>
          );
        })}
      </div>

      {/* GPT Response Display */}
      {(gptResponse || loading) && (
        <AnimatedCard>
          <h2 className="text-xl font-semibold mb-4">🤖 GPT Response</h2>
          {loading ? (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Testing access to {selectedFeature}...
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-sm">{gptResponse}</p>
            </div>
          )}
        </AnimatedCard>
      )}

      {/* Tier Comparison Table */}
      <AnimatedCard>
        <h2 className="text-xl font-semibold mb-4">📊 Tier Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Feature</th>
                {Object.keys(GPT_TIERS).map(tier => (
                  <th key={tier} className="text-center py-2">{tier}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(TIER_FEATURES).map(feature => (
                <tr key={feature} className="border-b">
                  <td className="py-2 font-medium">{feature}</td>
                  {Object.keys(GPT_TIERS).map(tier => (
                    <td key={tier} className="text-center py-2">
                      {checkFeatureAccess(tier, feature) ? (
                        <span className="text-green-600">✅</span>
                      ) : (
                        <span className="text-red-500">❌</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default GPTTierManagementView;
