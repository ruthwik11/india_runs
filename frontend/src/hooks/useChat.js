import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { chatAPI } from '../services/api';
import { getUserId } from '../services/storage';
import { useLanguage } from './useLanguage';

/**
 * Full chat hook managing messages, loading state, profile, and API calls.
 */
export function useChat() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [userId] = useState(() => getUserId());
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      role: 'bot',
      content: { summary: t('chat.welcome') },
      timestamp: Date.now(),
    },
  ]);

  const sendMessage = useCallback(
    async (messageText, userProfile) => {
      const currentProfile = userProfile || profile;

      // Add user message
      const userMsg = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: { text: messageText },
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const response = await chatAPI.sendMessage({
          user_id: userId,
          language,
          profile: currentProfile,
          message: messageText,
        });

        const botMsg = {
          id: `bot-${Date.now()}`,
          role: 'bot',
          content: {
            summary: response.summary || response.message || '',
            schemes: response.schemes || [],
          },
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (error) {
        const errorMsg = {
          id: `error-${Date.now()}`,
          role: 'bot',
          content: {
            summary: t('chat.error', 'Sorry, something went wrong. Please try again.'),
          },
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    },
    [userId, language, profile, t]
  );

  return { messages, sendMessage, loading, profile, setProfile };
}
