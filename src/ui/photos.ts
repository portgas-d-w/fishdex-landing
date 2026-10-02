// Miniatures en Blob, séparées des métadonnées. Éviction limitée aux images.
let DB_NAME = 'au-fil-de-leau.photos';
export function setPhotoProfile(profile:'normal'|'test'){DB_NAME=profile==='test'?'au-fil-de-leau.test.photos':'au-fil-de-leau.photos';}
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB_NAME, 1);
    let settled = false;
    const timer = window.setTimeout(() => { settled = true; reject(new Error('Stockage photo indisponible.')); }, 4000);
    r.onupgradeneeded = () => r.result.createObjectStore('photos', { keyPath: 'id' });
    r.onsuccess = () => { window.clearTimeout(timer); if (settled) r.result.close(); else { settled = true; resolve(r.result); } };
    r.onerror = r.onblocked = () => { window.clearTimeout(timer); settled = true; reject(r.error ?? new Error('Stockage photo bloqué.')); };
  });
}
export async function storePhoto(id: string, blob: Blob): Promise<boolean> {
  if (blob.size > 100_000) return false;
  let db: IDBDatabase | undefined;
  try {
    db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db!.transaction('photos', 'readwrite'); const store = tx.objectStore('photos');
      store.put({ id, blob, date: Date.now() });
      const r = store.getAll(); r.onsuccess = () => {
        const entries = r.result.sort((a, b) => a.date - b.date);
        for (const old of entries.slice(0, Math.max(0, entries.length - 128))) store.delete(old.id);
      };
      tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
    }); return true;
  } catch { return false; } finally { db?.close(); }
}
export async function getPhoto(id: string): Promise<Blob | undefined> {
  let db: IDBDatabase | undefined;
  try { db = await openDB(); return await new Promise((resolve, reject) => {
    const tx = db!.transaction('photos'); const r = tx.objectStore('photos').get(id);
    r.onsuccess = () => resolve(r.result?.blob); r.onerror = () => reject(r.error);
  }); } catch { return undefined; } finally { db?.close(); }
}
