import React, { useState } from 'react';
import { Bot, Send, X, MessageSquare, Sparkles } from 'lucide-react';
import { aiApi } from '../services/api';

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '¡Hola! I am your LinguaLearn AI Learning Assistant. Ask me anything about grammar rules (like Ser vs. Estar), vocabulary definitions, or study strategies!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await aiApi.chat(userText);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an issue processing that query. Please try again!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-xl shadow-brand-500/30 transition transform hover:scale-105"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Tutor</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 h-[460px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="p-4 bg-brand-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-white/20">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">LinguaLearn AI Tutor</h4>
                <span className="text-[10px] text-brand-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                  Online &amp; Adaptive
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-brand-100 dark:bg-brand-950 flex items-center justify-center shrink-0 mt-0.5 text-brand-600 dark:text-brand-400">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-500 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 text-xs items-center text-slate-400">
                <Bot className="w-4 h-4 animate-spin text-brand-500" />
                <span>AI Tutor thinking...</span>
              </div>
            )}
          </div>

          {/* Input field */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask about grammar, words, conjugations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistantWidget;
