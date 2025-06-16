
import React, { useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const CreateBrandView = () => {
  const [brandId, setBrandId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [color, setColor] = useState('#000000');
  const [tone, setTone] = useState('professional');
  const [creating, setCreating] = useState(false);

  const generate = async () => {
    if (!brandId.trim() || !displayName.trim()) {
      alert('Please fill in brand ID and display name');
      return;
    }

    setCreating(true);
    
    const config = {
      brandId: brandId.toLowerCase(),
      displayName,
      primaryColor: color,
      logo: `/logos/${brandId.toLowerCase()}-logo.svg`,
      gptPersona: { 
        tone, 
        signature: `🤖 ${displayName} AI` 
      },
      modules: {
        finance: true,
        support: true,
        hr: true,
        marketing: true,
        operations: true,
        supplyChain: false
      },
      playbookOverrides: {},
      personas: {
        admin: {
          name: `${displayName} Admin AI`,
          tone: 'executive, strategic, formal',
          signature: `🧠 ${displayName} Admin`
        },
        rep: {
          name: `${displayName} Rep`,
          tone: `${tone}, helpful, knowledgeable`,
          signature: `✨ ${displayName} Rep`
        },
        support: {
          name: `${displayName} Support`,
          tone: 'empathetic, helpful, warm',
          signature: `🛟 ${displayName} Support`
        }
      }
    };

    try {
      // In a real implementation, this would create the file via API
      console.log('Brand config generated:', config);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`✅ Brand ${displayName} created successfully!\n\nConfig generated for brand ID: ${brandId}`);
      
      // Reset form
      setBrandId('');
      setDisplayName('');
      setColor('#000000');
      setTone('professional');
      
    } catch (error) {
      alert(`❌ Failed to create brand: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const generateBrandId = () => {
    if (displayName) {
      setBrandId(displayName.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          New Brand Generator
        </h1>
        
        <AnimatedCard className="bg-white dark:bg-gray-800">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={generateBrandId}
                placeholder="e.g., Amazing Company"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand ID (URL slug)
              </label>
              <input
                type="text"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                placeholder="e.g., amazingcompany"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Will be used in URLs: /{brandId}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Brand Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-10 border rounded"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AI Personality Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="energetic">Energetic</option>
                <option value="caring">Caring</option>
                <option value="innovative">Innovative</option>
              </select>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Preview:</h3>
              <div className="text-sm space-y-1">
                <p><strong>URL:</strong> /{brandId}</p>
                <p><strong>Display:</strong> {displayName || 'Brand Name'}</p>
                <p style={{ color }}><strong>Color:</strong> {color}</p>
                <p><strong>AI Tone:</strong> {tone}</p>
              </div>
            </div>

            <button 
              onClick={generate}
              disabled={creating || !brandId.trim() || !displayName.trim()}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {creating ? 'Creating Brand...' : 'Create Brand Configuration'}
            </button>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default CreateBrandView;
