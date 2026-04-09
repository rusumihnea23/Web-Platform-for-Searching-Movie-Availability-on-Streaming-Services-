import { useState } from "react";

export default function ReviewContent({ content, limit = 300 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  const isLongText = content.length > limit;
  const displayedText = isExpanded 
    ? content 
    : content.slice(0, limit) + (isLongText ? "..." : "");

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <p 
        className="text-slate-300 leading-relaxed italic pl-3 border-l-2 border-slate-800 break-words whitespace-pre-wrap"
        style={{ overflowWrap: 'anywhere' }} // Extra insurance for long strings
      >
        {displayedText}
      </p>
      
      {isLongText && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 ml-3 text-xs font-bold text-pink-500 hover:text-pink-400 transition-colors uppercase tracking-widest"
        >
          {isExpanded ? "Show Less ↑" : "Read More ↓"}
        </button>
      )}
    </div>
  );
}