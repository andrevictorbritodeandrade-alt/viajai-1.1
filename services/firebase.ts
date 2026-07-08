
import { initializeApp, FirebaseApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, Firestore, getDocFromServer } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getSessionUser } from "./session";
import firebaseConfig from "../firebase-applet-config.json";

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let isFirebaseInitialized = false;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  auth = getAuth(app);
  isFirebaseInitialized = true;
  console.log("[Firebase] Initialized successfully.");
} catch (error) {
  console.error("[Firebase] Initialization failed:", error);
}

// Dynamic ID. Fallback to 'temp_guest' if not logged in.
const getUserDocId = () => getSessionUser() || "temp_guest";

export type SyncStatus = 'saving' | 'saved' | 'offline' | 'online' | 'error' | 'syncing';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    // Extract only necessary primitive data from auth
    authUserId: auth?.currentUser?.uid,
    authEmail: auth?.currentUser?.email
  };
  
  console.error('Firestore Error: ', errInfo);
  throw new Error(JSON.stringify(errInfo));
}

export const notifySyncStatus = (status: SyncStatus) => {
  const event = new CustomEvent('sync-status', { detail: status });
  window.dispatchEvent(event);
};

export const syncDataToCloud = async (collectionName: string, data: any, customDocId?: string) => {
  if (!navigator.onLine || !isFirebaseInitialized || !db) return;
  const docId = customDocId || getUserDocId();
  if (!docId) return;

  const path = `${collectionName}/${docId}`;
  try {
    notifySyncStatus('saving');
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    notifySyncStatus('saved');
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, path);
    notifySyncStatus('error');
  }
};

export const subscribeToCloudData = (collectionName: string, callback: (data: any) => void, customDocId?: string) => {
  if (!isFirebaseInitialized || !db) {
    setTimeout(() => callback(null), 10);
    return () => {};
  }
  
  const docId = customDocId || getUserDocId();
  const path = `${collectionName}/${docId}`;
  const docRef = doc(db, collectionName, docId);
  
  // Para o perfil compartilhado, se não houver dados, tentamos buscar dados antigos por compatibilidade
  const isShared = docId === 'shared_andre_marcelly';
  const legacyIds = ['André Brito', 'Marcelly Bispo', 'andré brito', 'marcelly bispo'];

  return onSnapshot(docRef, async (docSnap) => {
    if (docSnap.exists()) {
      notifySyncStatus('syncing');
      callback(docSnap.data());
      setTimeout(() => notifySyncStatus('saved'), 1000);
    } else if (isShared) {
      // Se não existe no compartilhado, tenta carregar do André ou Marcelly
      let foundLegacy = false;
      for (const legacyId of legacyIds) {
        try {
          const legacySnap = await getDoc(doc(db!, collectionName, legacyId));
          if (legacySnap.exists()) {
            notifySyncStatus('syncing');
            callback(legacySnap.data());
            foundLegacy = true;
            // Opcionalmente: salvar essa cópia no ID compartilhado para migração silenciosa
            setDoc(doc(db!, collectionName, docId), legacySnap.data(), { merge: true });
            setTimeout(() => notifySyncStatus('saved'), 1000);
            break;
          }
        } catch (e) {
          console.warn(`Erro ao buscar dados legados em ${collectionName}/${legacyId}`, e);
        }
      }
      if (!foundLegacy) callback(null);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
    callback(null);
  });
};

export const loadDataFromCloud = async (collectionName: string): Promise<any> => {
  if (!isFirebaseInitialized || !db || !navigator.onLine) return null;
  const userId = getUserDocId();
  const path = `${collectionName}/${userId}`;
  const isShared = userId === 'shared_andre_marcelly';
  const legacyIds = ['André Brito', 'Marcelly Bispo', 'andré brito', 'marcelly bispo'];

  try {
    const docSnap = await getDoc(doc(db, collectionName, userId));
    if (docSnap.exists()) return docSnap.data();

    // Migração/Fallback para André/Marcelly
    if (isShared) {
      for (const legacyId of legacyIds) {
        const legacySnap = await getDoc(doc(db, collectionName, legacyId));
        if (legacySnap.exists()) {
          // Salva no novo ID para não ter que fazer isso de novo
          setDoc(doc(db, collectionName, userId), legacySnap.data(), { merge: true });
          return legacySnap.data();
        }
      }
    }

    return null;
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, path);
    return null;
  }
};

async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();

export { db, auth };
