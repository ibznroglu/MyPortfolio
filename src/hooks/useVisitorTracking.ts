import { useEffect, useState } from 'react';

export type VisitorStatsStatus = 'idle' | 'ready' | 'unavailable';

export interface VisitorStats {
  totalVisitors: number;
  status: VisitorStatsStatus;
}

/**
 * Total visits, counted once per anonymous identity.
 *
 * Nothing loads until `enabled` turns true. The caller flips it when the
 * counter scrolls into view, which keeps the Firebase SDK — around 71 kB gzip —
 * off the critical path of every route.
 */
export const useVisitorTracking = (enabled: boolean): VisitorStats => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [status, setStatus] = useState<VisitorStatsStatus>('idle');

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;
    let stop: (() => void) | undefined;

    // One failing read must not hide a number that already arrived.
    const markUnavailable = (error: unknown) => {
      console.error('Visitor tracking unavailable:', error);
      setStatus((current) => (current === 'ready' ? current : 'unavailable'));
    };

    import('../lib/visitorStats')
      .then(({ trackVisit }) =>
        trackVisit({
          onCount: (total) => {
            if (cancelled) return;
            setTotalVisitors(total);
            setStatus('ready');
          },
          onError: markUnavailable,
        }),
      )
      .then((unsubscribe) => {
        if (cancelled) unsubscribe();
        else stop = unsubscribe;
      })
      .catch(markUnavailable);

    return () => {
      cancelled = true;
      stop?.();
    };
  }, [enabled]);

  return { totalVisitors, status };
};
