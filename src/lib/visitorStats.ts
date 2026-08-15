import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getDatabase, onValue, ref, runTransaction } from 'firebase/database';

/**
 * Every Firebase import in the app lives in this one module, and nothing
 * imports it statically — `useVisitorTracking` pulls it in with a dynamic
 * import once the counter scrolls into view.
 *
 * The named imports matter: `import('firebase/database')` at the call site
 * would defer the SDK but also defeat tree shaking, since the whole namespace
 * has to survive. Keeping them static inside a lazily imported module gives
 * both.
 *
 * Firebase web config is public by design; access is controlled by Realtime
 * Database security rules. The missing-config check runs here rather than at
 * module scope: a throw during module evaluation used to propagate into the
 * React tree and take the whole page down with it.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const connect = () => {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase configuration: ${missing.join(', ')}. Copy .env.example to .env.local and fill it in.`,
    );
  }

  const app = initializeApp(firebaseConfig);
  return { database: getDatabase(app), auth: getAuth(app) };
};

export interface VisitorCountHandlers {
  onCount: (total: number) => void;
  onError: (error: unknown) => void;
}

/**
 * Subscribes to the running total and claims this visitor's first visit.
 * Returns the unsubscribe function.
 */
export const trackVisit = async ({ onCount, onError }: VisitorCountHandlers) => {
  const { database, auth } = connect();

  const stop = onValue(
    ref(database, 'totalVisitors'),
    (snapshot) => onCount(snapshot.val() ?? 0),
    onError,
  );

  try {
    const { user } = await signInAnonymously(auth);

    // Transaction rather than get-then-set: two tabs opening at the same
    // moment must not both claim a first visit.
    const claim = await runTransaction(ref(database, `countedVisitors/${user.uid}`), (current) =>
      current === null ? true : undefined,
    );

    if (claim.committed) {
      await runTransaction(
        ref(database, 'totalVisitors'),
        (current: number | null) => (current ?? 0) + 1,
      );
    }
  } catch (error) {
    onError(error);
  }

  return stop;
};
