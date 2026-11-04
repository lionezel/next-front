const DB_NAME = "DistripakoFrontFilesDB";
const STORE_NAME = "files";

const blobUrlCache = new Map<string, string>();

const openFilesDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB no disponible"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveFormFileToIndexedDB = async (key: string, fileOrBlob: Blob | File): Promise<string> => {
  try {
    const objectUrl = URL.createObjectURL(fileOrBlob);
    blobUrlCache.set(key, objectUrl);

    const db = await openFilesDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(fileOrBlob, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
    return `indexed_db:${key}`;
  } catch (err) {
    console.warn("Error guardando archivo en IndexedDB:", err);
    return "";
  }
};

export const getFormFileFromIndexedDB = async (key: string): Promise<string | undefined> => {
  if (blobUrlCache.has(key)) {
    return blobUrlCache.get(key);
  }
  try {
    const db = await openFilesDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        const res = req.result;
        if (res instanceof Blob || res instanceof File) {
          const url = URL.createObjectURL(res);
          blobUrlCache.set(key, url);
          resolve(url);
        } else {
          resolve(undefined);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Error leyendo de IndexedDB:", err);
    return undefined;
  }
};
