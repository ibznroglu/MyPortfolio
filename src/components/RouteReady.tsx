import { useEffect } from 'react';

/**
 * Renders nothing. Placed inside the route Suspense boundary, it mounts only
 * once the lazy chunk has resolved — while the fallback is showing, the whole
 * subtree is suspended and this never runs.
 *
 * That gives the shell around Suspense a reliable answer to "has the page
 * itself rendered yet", which neither the load event nor readyState can
 * provide: both fire on the document, and a lazily imported route is not part
 * of the document's load.
 */
const RouteReady = ({ onReady }: { onReady: () => void }) => {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return null;
};

export default RouteReady;
