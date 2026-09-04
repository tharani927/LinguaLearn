import React, { useState } from 'react';
import { aiApi } from '../../services/api';
import { Bot, Send, Sparkles, User, Lightbulb } from 'lucide-react';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `¡Hola! I am your LinguaLearn AI Language Learning Assistant.
I can explain grammar nuances (like Ser vs. Estar, preterite vs. imperfect), provide pronunciation guidance, conjugate verbs, and advise you on mastering items in your Mistake Vault. What would you like to discuss?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Explain Ser vs. Estar with examples',
    'How do I say "Good morning" and "Thank you" politely?',
    'What is the difference between Pretérito and Imperfecto?',
    'Give me 3 tips to conquer my Mistake Vault',
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setLoading(true);

    try {
      const res = await aiApi.chat(query);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Encountered an issue processing that query. Please try again!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Intelligent Language Tutor
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            AI Learning Assistant
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Pedagogical AI Active</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500 transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Workspace */}
      <div className="h-[520px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs sm:text-sm ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-[80%] leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-brand-500 text-white rounded-br-none'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700/60'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 text-xs items-center text-slate-400">
              <Bot className="w-4 h-4 animate-spin text-brand-500" />
              <span>Analyzing linguistic question...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2 bg-slate-50/50 dark:bg-slate-900/50"
        >
          <input
            type="text"
            placeholder="Ask anything regarding language rules, grammar, phrases..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPage;
