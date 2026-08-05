/** Placeholder shown while a lazily loaded page chunk is downloading. */
const RouteFallback = () => (
  <div className="section-shell flex items-center justify-center" role="status" aria-live="polite">
    <span className="sr-only">Loading</span>
    <span
      className="h-8 w-8 animate-spin rounded-full border-2 border-pink-600/30 border-t-pink-600"
      aria-hidden="true"
    />
  </div>
);

export default RouteFallback;
