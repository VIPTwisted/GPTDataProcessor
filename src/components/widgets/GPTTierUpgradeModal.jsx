
import React from 'react';

const GPTTierUpgradeModal = ({ isOpen, onClose, currentTier, requiredFeature, upgradeTiers }) => {
  if (!isOpen) return null;

  const tierPricing = {
    Starter: '$0/month',
    Gold: '$29/month',
    Platinum: '$79/month',
    Enterprise: '$199/month'
  };

  const handleUpgrade = (targetTier) => {
    // Simulate upgrade process
    alert(`🚀 Upgrading to ${targetTier}! Redirecting to payment...`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">💎 Upgrade Required</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Your current <strong>{currentTier}</strong> tier doesn't include access to:
          </p>
          <p className="bg-blue-50 p-3 rounded text-blue-800 font-medium">
            🔒 {requiredFeature}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Available Upgrades:</h3>
          {upgradeTiers.map(tier => (
            <div key={tier} className="border rounded p-3 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{tier}</h4>
                  <p className="text-sm text-gray-600">{tierPricing[tier]}</p>
                </div>
                <button
                  onClick={() => handleUpgrade(tier)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Upgrade
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default GPTTierUpgradeModal;
