import { useEffect, useRef } from 'react';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: 'auto' | 'light' | 'dark';
      callback: (token: string) => void;
      'error-callback': () => void;
      'expired-callback': () => void;
      'refresh-expired'?: 'auto' | 'manual' | 'never';
    },
  ) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | undefined;

/** Loads the Turnstile script once, no matter how many widgets ask for it. */
const loadScript = (): Promise<void> => {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Let a later attempt retry instead of caching the failure forever.
      scriptPromise = undefined;
      reject(new Error('Turnstile script failed to load'));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};

interface Props {
  siteKey: string;
  /** Bumping this re-renders the widget; tokens are single use. */
  resetKey: number;
  onVerify: (token: string) => void;
  onError: () => void;
  onExpire: () => void;
}

const TurnstileWidget = ({ siteKey, resetKey, onVerify, onError, onExpire }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Kept in refs so a changing callback identity never re-renders the widget.
  const onVerifyRef = useRef(onVerify);
  const onErrorRef = useRef(onError);
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    let widgetId: string | undefined;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;

        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          'refresh-expired': 'auto',
          callback: (token) => onVerifyRef.current(token),
          // Expiry is a normal part of the lifecycle, not a failure.
          'expired-callback': () => onExpireRef.current(),
          'error-callback': () => onErrorRef.current(),
        });
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current();
      });

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, resetKey]);

  return <div ref={containerRef} className="flex justify-center" />;
};

export default TurnstileWidget;
