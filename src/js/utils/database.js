class Database {
  constructor() {
    this.dbName = 'StoryApp';
    this.dbVersion = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create stories store
        if (!db.objectStoreNames.contains('stories')) {
          const storiesStore = db.createObjectStore('stories', { keyPath: 'id' });
          storiesStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Create pending stories store for offline submission
        if (!db.objectStoreNames.contains('pendingStories')) {
          const pendingStore = db.createObjectStore('pendingStories', { keyPath: 'id', autoIncrement: true });
          pendingStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  async saveStory(story) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['stories'], 'readwrite');
      const store = transaction.objectStore('stories');
      const request = store.put(story);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async savePendingStory(story) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingStories'], 'readwrite');
      const store = transaction.objectStore('pendingStories');
      const request = store.add(story);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllStories() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['stories'], 'readonly');
      const store = transaction.objectStore('stories');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingStories() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingStories'], 'readonly');
      const store = transaction.objectStore('pendingStories');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteStory(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['stories'], 'readwrite');
      const store = transaction.objectStore('stories');
      const request = store.delete(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deletePendingStory(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['pendingStories'], 'readwrite');
      const store = transaction.objectStore('pendingStories');
      const request = store.delete(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export default Database; 