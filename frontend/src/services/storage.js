import { openDB } from 'idb';

const DB_NAME = 'sarkari_saathi_db';
const DB_VERSION = 1;
const STORE_NAME = 'chat_history';

// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const storage = {
  // --- IndexedDB for heavy lifting (Chat/Schemes) ---
  
  async saveChatHistory(sessionId, messages) {
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      await store.put({ 
        id: sessionId, 
        messages, 
        updatedAt: Date.now() 
      });
      await tx.done;
    } catch (e) {
      console.error('Failed to save chat history to IDB', e);
    }
  },

  async getChatHistory(sessionId) {
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const data = await store.get(sessionId);
      return data ? data.messages : null;
    } catch (e) {
      console.error('Failed to get chat history from IDB', e);
      return null;
    }
  },

  async clearOldChatHistory(daysToKeep = 7) {
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      let cursor = await store.openCursor();
      const threshold = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
      
      while (cursor) {
        if (cursor.value.updatedAt < threshold) {
          await cursor.delete();
        }
        cursor = await cursor.continue();
      }
      await tx.done;
    } catch (e) {
      console.error('Failed to cleanup old IDB data', e);
    }
  },

  // --- LocalStorage for preferences & drafts ---

  saveDraftProfile(profile) {
    localStorage.setItem('SARKARI_SAATHI_DRAFT_PROFILE', JSON.stringify({
      data: profile,
      timestamp: Date.now()
    }));
  },

  getDraftProfile() {
    const raw = localStorage.getItem('SARKARI_SAATHI_DRAFT_PROFILE');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      // Expire after 24 hours
      const isExpired = (Date.now() - parsed.timestamp) > 24 * 60 * 60 * 1000;
      if (isExpired) {
        this.clearDraftProfile();
        return null;
      }
      return parsed.data;
    } catch (e) {
      return null;
    }
  },

  clearDraftProfile() {
    localStorage.removeItem('SARKARI_SAATHI_DRAFT_PROFILE');
  },

  saveUserSession(uuid) {
    localStorage.setItem('SARKARI_SAATHI_SESSION', uuid);
  },

  getUserSession() {
    return localStorage.getItem('SARKARI_SAATHI_SESSION');
  }
};
