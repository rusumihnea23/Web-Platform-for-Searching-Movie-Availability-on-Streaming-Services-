import React, { useState, useEffect, useRef } from 'react';
import { askChatBot, deleteChat, getChatHistory } from '../../Actions/ChatActions'; 
import { SparklesIcon,ArrowRightCircleIcon } from '@heroicons/react/16/solid';
import ChatMessage from './ChatMessage';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // 1. Fetch History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getChatHistory();
      if (history && Array.isArray(history)) {
        // Filter out system messages and map to your local format
        const formattedHistory = history
          .filter(msg => msg.role !== 'system')
          .map(msg => ({
            text: msg.content,
            sender: msg.role === 'user' ? 'user' : 'ai',
            movies: [] // Backend history doesn't seem to store parsed movie lists separately
          }));
        setMessages(formattedHistory);
      }
    };
    fetchHistory();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user', movies: [] };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await askChatBot(input);
    
    if (response) {
      // Logic for parsing your Java service response
      const aiData = response.answer || response; 

      setMessages((prev) => [...prev, { 
        text: aiData.message || aiData.content || "I'm sorry, I couldn't process that.", 
        movies: aiData.movies || [], 
        sender: 'ai' 
      }]);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Clear chat history?")) {
      const result = await deleteChat();
      if (result) setMessages([]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans ">
      {isOpen && (
        <div className="w-80 h-[28rem] bg-sky-700 border border-gray-300 rounded-lg shadow-2xl flex flex-col mb-4 overflow-hidden">
          {/* Header */}
          <div className="bg-sky-800 p-3 text-white flex justify-between items-center shadow-md">
            <span className="font-bold flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 " /> Cinema AI
            </span>
            <button onClick={handleDelete} className="text-[10px] bg-red-700 hover:bg-red-800 px-2 py-1 rounded uppercase font-bold transition-colors">
              Clear
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-4 bg-gray-50 scrollbar-thin">
            {messages.length === 0 && !isLoading && (
               <p className="text-center text-gray-400 text-xs mt-10">No messages yet. Ask for a movie!</p>
            )}
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} msg={msg} />
            ))}
            {isLoading && (
              <div className="text-[11px] text-gray-400 animate-pulse flex items-center gap-1">
                <SparklesIcon className="w-3 h-3" /> Assistant is thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Suggest a romantic movie..."
              className="flex-1 bg-gray-100 border border-transparent rounded-full px-4 py-2 text-sm outline-none focus:border-sky-800 focus:bg-white text-black transition-all"
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading} 
              className="bg-sky-800 text-white p-2 rounded-full hover:bg-sky-700 disabled:bg-gray-300 transition-colors shadow-sm"
            >
              <ArrowRightCircleIcon className='w-4 h-4'/>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-14 h-14 bg-sky-800 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
      >
        {isOpen ? '✕' : <SparklesIcon className="w-7 h-7 text-white hover:text-amber-300" />}
      </button>
    </div>
  );
};

export default AIChat;