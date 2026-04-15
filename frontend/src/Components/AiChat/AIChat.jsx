import React, { useState, useEffect, useRef } from 'react';
import { askChatBot,deleteChat } from '../../Actions/ChatActions'; 
import { SparklesIcon } from '@heroicons/react/16/solid';
const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { text: input, sender: 'user' };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);

  const response = await askChatBot(input);
  
  if (response) {

    setMessages((prev) => [...prev, { text: response.answer, sender: 'ai' }]);
  }
  setIsLoading(false);
};

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to clear this chat?")) {
      const result = await deleteChat();
      if (result) {
        setMessages([]);
        alert("Chat history deleted.");
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col mb-4 overflow-hidden">
          {/* Header */}
          <div className="bg-sky-800 p-3 text-white flex justify-between items-center">
            <span className="font-bold">AI Assistant</span>
            <button onClick={handleDelete} className="text-xs bg-red-800 hover:bg-red-900 px-2 py-1 rounded cursor-pointer">
              Clear
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] p-2 rounded-lg text-sm ${
                msg.sender === 'user' ? 'ml-auto bg-sky-800 text-white' : 'mr-auto bg-gray-200 text-black'
              }`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="text-xs text-gray-500 italic">AI is thinking...</div>}
          </div>

          {/* Input Area */}
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask something..."
              className="flex-1 bg-sky-700 border rounded px-2 py-1 text-sm outline-none focus:bg-sky-800"
            />
            <button onClick={handleSend} disabled={isLoading} className=" cursor-pointer bg-sky-800 text-white px-3 py-1 rounded text-sm disabled:bg-gray-400">
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 cursor-pointer bg-sky-800 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:bg-blue-700 transition-all"
      >
      {isOpen ? '✕' : <SparklesIcon className="w-7 h-7" />}
      </button>
    </div>
  );
};

export default AIChat;