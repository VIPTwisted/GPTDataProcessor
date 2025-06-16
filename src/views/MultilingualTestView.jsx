
import React, { useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useMultilingualGPT } from '../hooks/useMultilingualGPT';

const MultilingualTestView = () => {
  const { language, setLanguage, t } = useLanguage();
  const { queryGPT, translateText, loading, error } = useMultilingualGPT();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('general');
  const [translationText, setTranslationText] = useState('');
  const [translatedResult, setTranslatedResult] = useState('');

  const agents = [
    { id: 'general', name: 'General Assistant' },
    { id: 'sales', name: 'Sales Agent' },
    { id: 'support', name: 'Support Agent' },
    { id: 'trainer', name: 'Training Agent' },
    { id: 'analyzer', name: 'Data Analyzer' }
  ];

  const handleGPTQuery = async () => {
    if (!prompt.trim()) return;

    try {
      const result = await queryGPT(prompt, selectedAgent);
      setResponse(result.response);
    } catch (err) {
      console.error('GPT Query Error:', err);
    }
  };

  const handleTranslation = async () => {
    if (!translationText.trim()) return;

    try {
      const result = await translateText(translationText);
      setTranslatedResult(result.translatedText);
    } catch (err) {
      console.error('Translation Error:', err);
    }
  };

  const testPhrases = [
    'Hello, how can I help you today?',
    'Please analyze our sales performance.',
    'Generate a training module for new employees.',
    'What are the system health metrics?',
    'Create a marketing campaign strategy.'
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🌐 Multilingual GPT Testing Center</h1>
        <LanguageSelector language={language} setLanguage={setLanguage} />
      </div>

      {/* GPT Query Test */}
      <AnimatedCard className="mb-6">
        <h2 className="text-xl font-semibold mb-4">🤖 GPT Agent Testing</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Agent:</label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your Prompt:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your question or request..."
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Quick Test Phrases:</label>
          <div className="flex flex-wrap gap-2">
            {testPhrases.map((phrase, index) => (
              <button
                key={index}
                onClick={() => setPrompt(phrase)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              >
                {phrase.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGPTQuery}
          disabled={loading || !prompt.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
        >
          {loading ? 'Processing...' : `Test in ${language.toUpperCase()}`}
        </button>

        {response && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <h3 className="font-medium mb-2">GPT Response ({language}):</h3>
            <p className="text-gray-800 dark:text-gray-200">{response}</p>
          </div>
        )}
      </AnimatedCard>

      {/* Translation Test */}
      <AnimatedCard className="mb-6">
        <h2 className="text-xl font-semibold mb-4">🔄 Translation Testing</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Text to Translate:</label>
          <textarea
            value={translationText}
            onChange={(e) => setTranslationText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
          />
        </div>

        <button
          onClick={handleTranslation}
          disabled={loading || !translationText.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mb-4"
        >
          {loading ? 'Translating...' : `Translate to ${language.toUpperCase()}`}
        </button>

        {translatedResult && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <h3 className="font-medium mb-2">Translation Result:</h3>
            <p className="text-gray-800 dark:text-gray-200">{translatedResult}</p>
          </div>
        )}
      </AnimatedCard>

      {/* Language Statistics */}
      <AnimatedCard>
        <h2 className="text-xl font-semibold mb-4">📊 Language Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">🌐</div>
            <div className="text-sm text-gray-600">Current Language</div>
            <div className="font-medium">{language.toUpperCase()}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">10</div>
            <div className="text-sm text-gray-600">Supported Languages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-600">Available Agents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">∞</div>
            <div className="text-sm text-gray-600">Translation Capacity</div>
          </div>
        </div>
      </AnimatedCard>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default MultilingualTestView;
