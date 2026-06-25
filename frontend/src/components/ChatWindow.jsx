import React, { useEffect, useRef } from 'react';
import BotMessage from './BotMessage';
import UserMessage from './UserMessage';
import LoadingSpinner from './LoadingSpinner';
import SchemeList from './SchemeList';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWindow = ({ messages, loading }) => {
  const endOfMessagesRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Smooth scroll to bottom
    if (endOfMessagesRef.current) {
      setTimeout(() => {
        endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [messages, loading]);

  return (
    <div className="h-full overflow-y-auto px-4 py-6 md:px-8 bg-muted-bg/30 relative custom-scrollbar">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            if (msg.role === 'user') {
              return <UserMessage key={index} text={msg.content} />;
            } else {
              return (
                <BotMessage key={index}>
                  {typeof msg.content === 'string' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {msg.content.summary && <p className="font-medium text-lg">{msg.content.summary}</p>}
                      {msg.content.schemes && (
                        <div className="mt-2">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-4 font-bold text-success flex items-center gap-3 bg-success/10 py-2 px-4 rounded-xl border border-success/20 w-fit"
                          >
                            <span className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center text-sm shadow-md">
                              {msg.content.schemes.length}
                            </span>
                            {t('chat.schemesFound')}
                          </motion.div>
                          <SchemeList schemes={msg.content.schemes} />
                        </div>
                      )}
                    </div>
                  )}
                </BotMessage>
              );
            }
          })}
          
          {loading && (
            <motion.div key="loader" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
              <BotMessage>
                <LoadingSpinner type="dots" text={t('chat.loading')} />
              </BotMessage>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endOfMessagesRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatWindow;
