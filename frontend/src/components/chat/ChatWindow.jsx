import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store';
import { UserMessage, BotMessage, TypingIndicator } from './Messages';
import { SchemeCard } from '../profile/SchemeCard';

const ChatWindow = ({ messages, isTyping }) => {
  const { i18n } = useTranslation();
  const { addMessage } = useAppStore();
  const [promptAnswered, setPromptAnswered] = useState(false);

  const handleLanguageChoice = (lang) => {
    setPromptAnswered(true);
    if (lang === 'en') {
      i18n.changeLanguage('en');
      addMessage({ sender: 'bot', text: 'Switched to English! Feel free to ask me any questions about these schemes.' });
    } else {
      addMessage({ sender: 'bot', text: 'Sure, we will continue in your local language! Feel free to ask any questions.' });
    }
  };

  const getLanguageName = (code) => {
    const map = { 
      en: 'English', hi: 'Hindi', te: 'Telugu', kn: 'Kannada', ta: 'Tamil', ml: 'Malayalam',
      bn: 'Bengali', gu: 'Gujarati', mr: 'Marathi', pa: 'Punjabi', or: 'Odia',
      as: 'Assamese', ur: 'Urdu', mni: 'Manipuri'
    };
    return map[code] || 'Local Language';
  };

  const lastMessageRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollToLastMessage = () => {
      if (lastMessageRef.current) {
        try {
          // 'start' ensures the top of the message is visible, solving the issue of long text replies hiding their start
          lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) {
          lastMessageRef.current.scrollIntoView();
        }
      }
    };
    
    // Call immediately and also after a short delay
    scrollToLastMessage();
    const timer = setTimeout(scrollToLastMessage, 150);
    
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 w-full min-h-0" data-lenis-prevent="true">
      <div className="max-w-3xl mx-auto flex flex-col">
        {messages.map((msg, index) => {
          const isLast = index === messages.length - 1;
          return (
            <div key={index} ref={isLast && !isTyping ? lastMessageRef : null}>
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
                  
                  {msg.isFirstMessage && i18n.language !== 'en' && !promptAnswered && (
                    <div className="mt-6 p-4 border-2 border-black bg-gray-50 flex flex-col gap-3 font-body">
                      <p className="font-bold text-sm">Would you like to continue in {getLanguageName(i18n.language)} or switch to English?</p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleLanguageChoice(i18n.language)}
                          className="px-4 py-2 bg-black text-white text-sm font-bold border-2 border-black hover:bg-gray-800 transition-colors"
                        >
                          Keep {getLanguageName(i18n.language)}
                        </button>
                        <button 
                          onClick={() => handleLanguageChoice('en')}
                          className="px-4 py-2 bg-white text-black text-sm font-bold border-2 border-black hover:bg-gray-100 transition-colors"
                        >
                          Switch to English
                        </button>
                      </div>
                    </div>
                  )}
                </BotMessage>
              )}
            </div>
          );
        })}
        {isTyping && (
          <div ref={lastMessageRef}>
            <TypingIndicator />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
