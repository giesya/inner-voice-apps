import { openDB } from 'idb';

const DATABASE_NAME = 'innervoice-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'stories';


const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, {
        keyPath: 'id',
      });
    }
  },
});

export async function saveStory(story) {
  if (!story?.id) {
    throw new Error('`id` is required to save.');
  }
  return (await dbPromise).put(OBJECT_STORE_NAME, story);
}

export async function saveStoriesBulk(stories) {
  const db = await dbPromise;
  const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
  const store = tx.objectStore(OBJECT_STORE_NAME);
  for (const story of stories) {
    if (story?.id) {
      await store.put(story);
    }
  }
  await tx.done;
}

export async function getAllStories() {
  console.log('getAllStories dipanggil');
  return (await dbPromise).getAll(OBJECT_STORE_NAME);
}


export async function deleteStory(id) {
  return (await dbPromise).delete(OBJECT_STORE_NAME, id);
}

export async function isStorySaved(id) {
  const result = await (await dbPromise).get(OBJECT_STORE_NAME, id);
  return !!result;
}