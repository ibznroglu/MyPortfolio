/** Placeholder shown while a lazily loaded page chunk is downloading. */
const RouteFallback = () => (
  <div className="section-shell flex items-center justify-center" role="status" aria-live="polite">
    <span className="sr-only">Loading</span>
    <span
      className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent"
      aria-hidden="true"
    />
  </div>
);

export default RouteFallback;
