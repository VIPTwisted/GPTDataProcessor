
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InstallerWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    brandId: 'toyparty',
    language: 'en',
    gptTier: 'basic',
    enableWebhooks: true,
    enableMultilingual: true
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      // Send configuration to setup endpoint
      const response = await fetch('/.netlify/functions/setup/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (response.ok) {
        localStorage.setItem('gemini-setup-complete', 'true');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Setup failed:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Brand</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['toyparty', 'boldbeauty', 'vibevault'].map(brand => (
                <div
                  key={brand}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    config.brandId === brand
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setConfig({...config, brandId: brand})}
                >
                  <h3 className="text-lg font-semibold capitalize">{brand}</h3>
                  <p className="text-gray-600">
                    {brand === 'toyparty' && 'Family Entertainment'}
                    {brand === 'boldbeauty' && 'Beauty & Wellness'}
                    {brand === 'vibevault' && 'Music & Events'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Language Settings</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-lg font-medium">Default Language</span>
                <select
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
                  value={config.language}
                  onChange={(e) => setConfig({...config, language: e.target.value})}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.enableMultilingual}
                  onChange={(e) => setConfig({...config, enableMultilingual: e.target.checked})}
                  className="rounded"
                />
                <span className="ml-2">Enable multilingual support</span>
              </label>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">GPT Configuration</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-lg font-medium">GPT Tier</span>
                <select
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
                  value={config.gptTier}
                  onChange={(e) => setConfig({...config, gptTier: e.target.value})}
                >
                  <option value="basic">Basic (10 requests/day)</option>
                  <option value="premium">Premium (100 requests/day)</option>
                  <option value="enterprise">Enterprise (Unlimited)</option>
                </select>
              </label>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Integration Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.enableWebhooks}
                  onChange={(e) => setConfig({...config, enableWebhooks: e.target.checked})}
                  className="rounded"
                />
                <span className="ml-2">Enable webhook integrations</span>
              </label>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Setup Summary</h3>
                <ul className="space-y-1 text-sm">
                  <li>Brand: {config.brandId}</li>
                  <li>Language: {config.language}</li>
                  <li>GPT Tier: {config.gptTier}</li>
                  <li>Webhooks: {config.enableWebhooks ? 'Enabled' : 'Disabled'}</li>
                  <li>Multilingual: {config.enableMultilingual ? 'Enabled' : 'Disabled'}</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🛠️ Gemini OS Setup Wizard
            </h1>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-600 mt-2">Step {step} of 4</p>
          </div>

          {renderStep()}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {step === 4 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallerWizard;
