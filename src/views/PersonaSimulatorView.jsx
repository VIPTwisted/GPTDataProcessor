
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePersonaPrompt } from '../hooks/usePersonaPrompt';
import { useBrandConfig } from '../hooks/useBrandConfig';
import AnimatedCard from '../components/widgets/AnimatedCard';

const PersonaSimulatorView = () => {
  const { brandId } = useParams();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [role, setRole] = useState('rep');
  const [loading, setLoading] = useState(false);
  
  const { config: brand } = useBrandConfig(brandId || 'toyparty');
  const { prompt, persona } = usePersonaPrompt(brandId || 'toyparty');

  const simulate = async () => {
    setLoading(true);
    try {
      // Simulate GPT response based on persona
      const mockResponse = generateMockResponse(input, persona, brand);
      setOutput(mockResponse);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateMockResponse = (userInput, persona, brand) => {
    if (!persona || !brand) return 'Brand configuration not loaded.';
    
    const responses = {
      admin: [
        `Strategic analysis for ${userInput}: Based on our current KPIs, I recommend implementing a data-driven approach.`,
        `Executive summary: The situation regarding ${userInput} requires immediate C-level attention and resource allocation.`
      ],
      rep: [
        `Hey there! About ${userInput} - I've got some exciting insights that'll blow your mind! 😉`,
        `Oh, you're asking about ${userInput}? Let me tell you why that's absolutely perfect for your needs!`
      ],
      support: [
        `I understand you need help with ${userInput}. Let me walk you through this step by step with care.`,
        `Thank you for reaching out about ${userInput}. I'm here to make sure you get exactly what you need.`
      ]
    };

    const roleResponses = responses[role] || responses.rep;
    const baseResponse = roleResponses[Math.floor(Math.random() * roleResponses.length)];
    
    return `${baseResponse}\n\n${persona.signature}`;
  };

  if (!brand) {
    return (
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <p>Loading brand configuration...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          Persona Simulator - {brand.displayName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test AI personalities and responses for different roles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard className="bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Configuration
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.keys(brand.personas || {}).map(roleKey => (
                  <option key={roleKey} value={roleKey}>
                    {brand.personas[roleKey].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Persona
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-medium text-gray-900 dark:text-white">
                  {persona?.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tone: {persona?.tone}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Signature: {persona?.signature}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Test Input
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-3 py-2 border rounded h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Ask the AI something..."
              />
            </div>

            <button 
              onClick={simulate}
              disabled={loading || !input.trim()}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Test Persona'}
            </button>
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            AI Response
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded min-h-[200px]">
              {output ? (
                <div className="whitespace-pre-wrap text-gray-900 dark:text-white">
                  {output}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Response will appear here after testing...
                </p>
              )}
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                System Prompt Preview:
              </h3>
              <pre className="text-xs text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                {prompt.slice(0, 200)}...
              </pre>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default PersonaSimulatorView;
