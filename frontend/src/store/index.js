import { create } from 'zustand';
import { storage } from '../services/storage';

// Ensure a session UUID exists
let sessionUUID = storage.getUserSession();
if (!sessionUUID && typeof crypto !== 'undefined' && crypto.randomUUID) {
  sessionUUID = crypto.randomUUID();
  storage.saveUserSession(sessionUUID);
}

export const useAppStore = create((set, get) => ({
  sessionId: sessionUUID,
  
  // Profile State
  profile: storage.getDraftProfile() || {
    age: '',
    monthly_income: '',
    state: '',
    occupation: '',
    family_size: 1,
    has_land: false,
    land_size_acres: 0,
  },
  
  updateProfile: (updates) => {
    set((state) => {
      const newProfile = { ...state.profile, ...updates };
      storage.saveDraftProfile(newProfile);
      return { profile: newProfile };
    });
  },

  clearProfile: () => {
    storage.clearDraftProfile();
    set({
      profile: {
        age: '',
        monthly_income: '',
        state: '',
        occupation: '',
        family_size: 1,
        has_land: false,
        land_size_acres: 0,
      }
    });
  },

  // Chat State
  messages: [],
  isTyping: false,

  setMessages: (messages) => {
    set({ messages });
    storage.saveChatHistory(get().sessionId, messages);
  },

  addMessage: (message) => {
    set((state) => {
      const newMessages = [...state.messages, message];
      storage.saveChatHistory(state.sessionId, newMessages);
      return { messages: newMessages };
    });
  },

  setTyping: (isTyping) => set({ isTyping }),

  loadChatHistory: async () => {
    const history = await storage.getChatHistory(get().sessionId);
    if (history) {
      set({ messages: history });
    }
  }
}));
