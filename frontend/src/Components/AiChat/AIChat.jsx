import { useState, useEffect, useRef } from 'react';
import { askChatBot, deleteChat, getChatHistory } from '../../Actions/ChatActions';
import { SparklesIcon as Spark, ArrowRightCircleIcon as Arrow } from '@heroicons/react/24/solid';
import ChatMessage from './ChatMessage';

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    getChatHistory().then(h => Array.isArray(h) && setMsgs(
      h.filter(m => m.role !== 'system').map(m => ({ 
        text: m.content, 
        sender: m.role === 'user' ? 'user' : 'ai', 
        movies: m.movies || [] // Fix: Preserves movies from backend on reload
      }))
    ));
  }, []);

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs]);

  const send = async () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, { text: input, sender: 'user', movies: [] }]);
    setInput(''); setLoading(true);
    
    const res = await askChatBot(input);
    const ai = res?.answer || res || {};
    setMsgs(p => [...p, { text: ai.message || ai.content || "Error", movies: ai.movies || [], sender: 'ai' }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {open && (
        <div className="w-80 h-112 bg-sky-700 rounded-lg shadow-2xl flex flex-col mb-4 overflow-hidden">
          <div className="bg-sky-800 p-3 text-white flex justify-between items-center shadow-md">
            <span className="font-bold flex items-center gap-2"><Spark className="w-4 h-4" /> Cinema AI</span>
            <button onClick={() => window.confirm("Clear?") && deleteChat().then(r => r && setMsgs([]))} className="text-[10px] bg-red-700 px-2 py-1 rounded font-bold uppercase hover:bg-red-800">Clear</button>
          </div>

          <div ref={ref} className="flex-1 p-3 overflow-y-auto space-y-4 bg-gray-50 scrollbar-thin">
            {!msgs.length && !loading && <p className="text-center text-gray-400 text-xs mt-10">Ask for a movie!</p>}
            {msgs.map((m, i) => <ChatMessage key={i} msg={m} />)}
            {loading && <div className="text-[11px] text-gray-400 animate-pulse flex items-center gap-1"><Spark className="w-3 h-3" /> Thinking...</div>}
          </div>

          <div className="p-3 bg-white flex gap-2 items-center">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Suggest a movie..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none text-black" />
            <button onClick={send} disabled={loading} className="bg-sky-800 text-white p-2 rounded-full disabled:bg-gray-300"><Arrow className="w-4 h-4"/></button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(!open)} className="w-14 h-14 bg-sky-800 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110">
        {open ? '✕' : <Spark className="w-7 h-7 hover:text-amber-300" />}
      </button>
    </div>
  );
};

export default AIChat;