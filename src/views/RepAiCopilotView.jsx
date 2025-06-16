
import React, { useState } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const RepAiCopilotView = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    {
      q: 'How do I handle price objections?',
      a: 'Great question! Here are 3 proven strategies: 1) Reframe value over price - "This isn\'t just a product, it\'s an experience that pays for itself" 2) Use the feel-felt-found method 3) Offer payment plans or bundle deals. Would you like specific scripts for any of these?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Give me a party opening script',
    'How to upsell to VIP packages?',
    'Best follow-up messages',
    'Handling difficult customers',
    'Social media post ideas'
  ];

  const ask = async () => {
    if (!input.trim()) return;

    const userQuestion = input;
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        'party': 'Here\'s a killer party opening: "Hey gorgeous! Welcome to the most fun you\'ll have shopping tonight! I\'m [Name], your pleasure expert, and I\'m here to help you discover exactly what makes you feel amazing. Who\'s ready to explore something new?" 🔥',
        'upsell': 'For VIP upsells, try: "I can see you have amazing taste! Since you\'re investing in yourself tonight, I want to make sure you get the FULL experience. Our VIP collection has everything you need for the complete journey - would you like me to show you the upgrade options?"',
        'follow': 'Perfect follow-up sequence: Day 1: "How are you enjoying your new goodies? 😉" Day 3: "Quick check-in - any questions about your purchase?" Day 7: "Ready for round 2? I have some new arrivals that would be PERFECT for you!"',
        'difficult': 'For difficult customers: Stay calm, acknowledge their concerns, and redirect to benefits. "I totally understand your concern. Many of my best customers felt the same way initially. What if I could show you exactly how this addresses that worry?"',
        'social': 'Social post ideas: 1) "Just helped another babe discover her confidence tonight! 💪" 2) "Who else needs some midweek motivation? 🔥" 3) "PSA: Your pleasure matters. Invest in yourself! ✨"'
      };

      const responseKey = Object.keys(responses).find(key => userQuestion.toLowerCase().includes(key));
      const aiResponse = responseKey ? responses[responseKey] : 
        `I'd be happy to help with that! For "${userQuestion}", I recommend focusing on building confidence and creating value. Here are some specific tips: 1) Always lead with benefits, not features 2) Use storytelling to create emotional connection 3) Ask open-ended questions to understand needs. Would you like me to elaborate on any of these strategies?`;

      setHistory(prev => [...prev, { q: userQuestion, a: aiResponse }]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🧠 My AI Co-Pilot</h1>
      
      <AnimatedCard className="mb-4">
        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          {history.map((h, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                  <p className="text-sm">{h.q}</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg max-w-md">
                  <p className="text-sm">{h.a}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && ask()}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask for script ideas, objections, product tips..."
            />
            <button 
              onClick={ask} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isTyping}
            >
              {isTyping ? '...' : 'Ask'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default RepAiCopilotView;
