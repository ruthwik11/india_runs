import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/shared/Button';
import ProfileForm from '../components/profile/ProfileForm';
import ChatWindow from '../components/chat/ChatWindow';
import { useAppStore } from '../store';

const Chat = ({ onBack }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { messages, isTyping, addMessage, setTyping, updateProfile } = useAppStore();
  const [inputValue, setInputValue] = useState('');

  const handleProfileSubmit = (data) => {
    updateProfile(data);
    setFormSubmitted(true);
    addMessage({
      sender: 'bot',
      text: "Based on your profile, I found these schemes for you:",
      schemes: [
        {
          scheme_id: "pm-awas-001",
          name_en: "PM Awas Yojana",
          benefit_amount: "₹1,20,000",
          eligibility_match_score: 0.95,
          required_documents: ["Aadhaar", "Bank Account"],
          steps_to_apply: [
            { step: 1, action_en: "Visit the PM Awas portal" }
          ],
          apply_link: "https://pmawy.gov.in"
        }
      ]
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 relative z-10">
      <AnimatePresence mode="wait">
        {!formSubmitted ? (
          <motion.div
            key="profile-form"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: 'spring', stiffness: 70, damping: 20 }}
            className="bg-white border-thin border-black p-6 md:p-8"
          >
            <div className="mb-12">
               <Button variant="ghost" onClick={onBack} className="p-0 underline uppercase tracking-widest text-sm mb-4">
                 ← Back to Home
               </Button>
               <h2 className="font-display text-4xl mb-4">Your Profile</h2>
               <p className="font-body text-lg text-muted-foreground">Please fill out these details so we can match you with the right schemes.</p>
            </div>
            
            {/* ProfileForm */}
            <div className="py-12 mb-8">
              <ProfileForm onSubmit={handleProfileSubmit} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat-interface"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 70, damping: 20 }}
            className="bg-white border-thin border-black flex flex-col h-[75vh] max-h-[850px] overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-black text-white p-4 md:px-6 flex items-center justify-between z-20">
              <Button variant="ghost" onClick={() => setFormSubmitted(false)} className="text-white hover:text-white/80 p-0 underline decoration-white">
                ← Profile
              </Button>
              <h2 className="font-mono tracking-widest uppercase text-sm">SarkariSaathi Assistant</h2>
              <div className="w-16"></div> {/* Spacer */}
            </div>
            
            {/* Chat Body */}
            <div className="flex-1 overflow-hidden relative bg-white pattern-noise flex flex-col">
              <ChatWindow messages={messages} isTyping={isTyping} />
              
              <div className="p-4 border-t-thin border-black bg-white">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!inputValue.trim()) return;
                    addMessage({ sender: 'user', text: inputValue });
                    setInputValue('');
                    setTyping(true);
                    setTimeout(() => {
                      setTyping(false);
                      addMessage({ sender: 'bot', text: 'Thank you for your question. I am analyzing the scheme details to provide a comprehensive answer.' });
                    }, 1500);
                  }}
                  className="flex gap-4 max-w-3xl mx-auto"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-4 border-thin border-black focus:border-thick focus:outline-none bg-white font-body text-lg"
                  />
                  <Button type="submit">SEND</Button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
