import React from 'react';
import MovieChatBubble from './MovieChatBubble';

const ChatMessage = ({ msg }) => {
  const isUser = msg.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Text Bubble */}
      <div className={`max-w-[90%] p-2 rounded-lg text-sm shadow-sm ${
        isUser ? 'bg-sky-800 text-white' : 'bg-gray-200 text-black'
      }`}>
        {msg.text}
      </div>

      {/* Movie Section (passed as titles/strings) */}
      {msg.movies && msg.movies.length > 0 && (
        <MovieChatBubble titles={msg.movies} />
      )}
    </div>
  );
};

export default ChatMessage;