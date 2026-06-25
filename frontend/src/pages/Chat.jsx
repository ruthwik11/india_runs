import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Button } from '../components/shared/Button';
import ProfileForm from '../components/profile/ProfileForm';
import ChatWindow from '../components/chat/ChatWindow';
import { useAppStore } from '../store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Chat = ({ onBack }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { i18n } = useTranslation();
  const { messages, isTyping, addMessage, setTyping, updateProfile, profile } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(prev => prev ? prev + " " + transcript : transcript);
          setIsListening(false);
        };
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Speech recognition not supported in this browser.");
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const langMap = { 
        en: 'en-IN', hi: 'hi-IN', te: 'te-IN', kn: 'kn-IN', ta: 'ta-IN', ml: 'ml-IN',
        bn: 'bn-IN', gu: 'gu-IN', mr: 'mr-IN', pa: 'pa-IN', ur: 'ur-IN' 
      };
      recognitionRef.current.lang = langMap[i18n.language] || 'hi-IN';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendToBackend = async (messageText = null) => {
    setTyping(true);
    try {
      const payload = {
        user_id: "user-123", // In a real app, use auth token or UUID
        language: i18n.language,
        profile: profile,
        message: messageText
      };
      
      const response = await axios.post(`${API_URL}/chat`, payload);
      
      if (response.data.status === 'success') {
        const { schemes, summary_local, summary_en } = response.data.data;
        const botResponse = summary_local || summary_en;
        
        addMessage({
          sender: 'bot',
          text: botResponse,
          schemes: messageText ? null : schemes, // Only show scheme cards on initial load, not for every Q&A follow-up
          isFirstMessage: messageText === null
        });
      } else {
        addMessage({ sender: 'bot', text: 'Sorry, there was an error processing your request.' });
      }
    } catch (error) {
      console.error("API Error:", error);
      // Simulate multilingual hack if backend is down
      const fallbackText = i18n.language === 'hi' 
        ? "क्षमा करें, सर्वर से कनेक्ट करने में समस्या हुई। कृपया बाद में प्रयास करें।" 
        : "Sorry, could not connect to the server. Please make sure the backend is running.";
      addMessage({ sender: 'bot', text: fallbackText });
    } finally {
      setTyping(false);
    }
  };

  const handleProfileSubmit = (data) => {
    updateProfile(data);
    setFormSubmitted(true);
    sendToBackend(); // Initial check without message
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue;
    addMessage({ sender: 'user', text: userMessage });
    setInputValue('');
    
    sendToBackend(userMessage);
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
            <div className="flex-1 overflow-hidden relative bg-white pattern-noise flex flex-col min-h-0">
              <ChatWindow messages={messages} isTyping={isTyping} />
              
              <div className="p-4 border-t-thin border-black bg-white">
                <form 
                  onSubmit={handleSendMessage}
                  className="flex gap-4 max-w-3xl mx-auto"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-4 border-thin border-black focus:border-thick focus:outline-none bg-white font-body text-lg"
                  />
                  <button 
                    type="button"
                    onClick={toggleListening}
                    className={`px-4 border-thin border-black transition-colors ${isListening ? 'bg-black text-white animate-pulse' : 'bg-white hover:bg-gray-100 text-black'}`}
                    title="Speak"
                  >
                    🎤
                  </button>
                  <Button type="submit" disabled={isTyping}>SEND</Button>
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
