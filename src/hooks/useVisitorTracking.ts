import { useEffect, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import {
  onDisconnect,
  onValue,
  orderByChild,
  query,
  ref,
  runTransaction,
  serverTimestamp,
  set,
  startAt,
} from 'firebase/database';
import { auth, database } from '../config/firebase';

// A visitor is "active" if the server saw them within this window. The
// heartbeat has to be comfortably shorter so a live tab never falls out of it.
const ACTIVE_WINDOW_MS = 60_000;
const HEARTBEAT_MS = 20_000;

export type VisitorStatsStatus = 'loading' | 'ready' | 'unavailable';

export interface VisitorStats {
  totalVisitors: number;
  activeUsers: number;
  status: VisitorStatsStatus;
}

export const useVisitorTracking = (): VisitorStats => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [status, setStatus] = useState<VisitorStatsStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let unsubscribeActive: (() => void) | undefined;
    const teardown: Array<() => void> = [];

    // The database clock is authoritative; the visitor's system clock is not.
    let serverOffsetMs = 0;

    // One failing read must not hide numbers that already arrived.
    const markUnavailable = () =>
      setStatus((current) => (current === 'ready' ? current : 'unavailable'));

    const countFirstVisitOnce = async (uid: string) => {
      const claimRef = ref(database, `countedVisitors/${uid}`);

      // Transaction rather than get-then-set: two tabs opening at the same
      // moment must not both claim a first visit.
      const claim = await runTransaction(claimRef, (current) =>
        current === null ? true : undefined,
      );

      if (!claim.committed) return;

      await runTransaction(
        ref(database, 'totalVisitors'),
        (current: number | null) => (current ?? 0) + 1,
      );
    };

    const trackPresence = (uid: string) => {
      const presenceRef = ref(database, `activeUsers/${uid}`);
      const connectedRef = ref(database, '.info/connected');

      const write = () => set(presenceRef, { lastSeen: serverTimestamp() });

      const stopConnected = onValue(connectedRef, (snapshot) => {
        if (snapshot.val() !== true) return;

        // Registered before the first write, so a hard close still cleans up.
        onDisconnect(presenceRef)
          .remove()
          .then(write)
          .catch(() => {});
      });

      teardown.push(stopConnected, () => set(presenceRef, null).catch(() => {}));

      heartbeat = setInterval(write, HEARTBEAT_MS);
    };

    // The window slides, so the subscription is rebuilt on every heartbeat.
    const watchActiveUsers = () => {
      const subscribe = () => {
        unsubscribeActive?.();

        const since = Date.now() + serverOffsetMs - ACTIVE_WINDOW_MS;
        const activeQuery = query(
          ref(database, 'activeUsers'),
          orderByChild('lastSeen'),
          startAt(since),
        );

        unsubscribeActive = onValue(
          activeQuery,
          (snapshot) => {
            setActiveUsers(snapshot.size);
            setStatus('ready');
          },
          (error) => {
            console.error('Could not read active users:', error);
            markUnavailable();
          },
        );
      };

      subscribe();
      const resubscribe = setInterval(subscribe, HEARTBEAT_MS);
      teardown.push(
        () => clearInterval(resubscribe),
        () => unsubscribeActive?.(),
      );
    };

    const start = async () => {
      const stopOffset = onValue(
        ref(database, '.info/serverTimeOffset'),
        (snapshot) => {
          serverOffsetMs = snapshot.val() ?? 0;
        },
        () => {
          // Falling back to the local clock is acceptable here.
        },
      );
      teardown.push(stopOffset);

      const stopTotal = onValue(
        ref(database, 'totalVisitors'),
        (snapshot) => {
          setTotalVisitors(snapshot.val() ?? 0);
          setStatus('ready');
        },
        (error) => {
          console.error('Could not read visitor totals:', error);
          markUnavailable();
        },
      );
      teardown.push(stopTotal);

      const { user } = await signInAnonymously(auth);
      if (cancelled) return;

      trackPresence(user.uid);
      watchActiveUsers();
      await countFirstVisitOnce(user.uid);
    };

    start().catch((error) => {
      console.error('Visitor tracking unavailable:', error);
      markUnavailable();
    });

    return () => {
      cancelled = true;
      if (heartbeat) clearInterval(heartbeat);
      teardown.forEach((fn) => fn());
    };
  }, []);

  return { totalVisitors, activeUsers, status };
};
