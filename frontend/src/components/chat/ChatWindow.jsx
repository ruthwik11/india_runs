import React, { useEffect, useRef } from 'react';
import { UserMessage, BotMessage, TypingIndicator } from './Messages';
import { SchemeCard } from '../profile/SchemeCard';

const ChatWindow = ({ messages, isTyping }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
      <div className="max-w-3xl mx-auto flex flex-col">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.sender === 'user' ? (
              <UserMessage message={msg.text} />
            ) : (
              <BotMessage message={msg.text}>
                {msg.schemes && msg.schemes.length > 0 && (
                  <div className="mt-8 space-y-4">
                    {msg.schemes.map(scheme => (
                      <SchemeCard key={scheme.scheme_id} scheme={scheme} />
                    ))}
                  </div>
                )}
              </BotMessage>
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
