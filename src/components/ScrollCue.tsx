import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../hooks/useLanguage';

/**
 * A hint that the page continues, shown only when it is true and only until
 * it has been acted on.
 *
 * A cue that is always there is decoration: it says "scroll" to someone
 * already scrolling, and says it on pages with nothing below the fold. So it
 * appears only if the document is actually taller than the viewport and the
 * visitor has not moved yet, and it leaves on the first scroll and does not
 * come back.
 *
 * A word rather than a lone glyph. An 18px chevron under two filled buttons
 * reads as leftover punctuation; the label removes the guesswork, and the
 * letter-spacing is what makes it look deliberate rather than loud.
 *
 * Not a button. Everyone can already scroll — what they need is a reason to,
 * not a third control competing with the two real calls to action directly
 * above it. Decorative to assistive tech for the same reason.
 */
const ScrollCue = () => {
  const { t } = useLanguage();
  const cueRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Measured on the frame after mount: layout has not settled during it, and
    // a cue that flashes on an unscrollable page is worse than none.
    const frame = requestAnimationFrame(() => {
      const node = cueRef.current;
      if (!node || window.scrollY !== 0) return;

      const room = document.documentElement.scrollHeight - window.innerHeight;
      if (room <= 120) return;

      // The cue has to clear the fold itself. On a tall hero and a short
      // phone it lands below it, and a scroll hint nobody can see without
      // scrolling is worse than none at all.
      if (node.getBoundingClientRect().bottom > window.innerHeight) return;

      setVisible(true);
    });

    const hide = () => setVisible(false);
    window.addEventListener('scroll', hide, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', hide);
    };
  }, []);

  return (
    <span
      ref={cueRef}
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-body transition-opacity duration-500 ${
        visible ? 'animate-scroll-cue opacity-100' : 'opacity-0'
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.25em]">{t.home.scrollCue}</span>
      <FaChevronDown size={22} className="text-accent-soft" />
    </span>
  );
};

export default ScrollCue;
