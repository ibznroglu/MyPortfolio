import { socialLinks } from '../data/socialLinks';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';

// Mirrors the desktop social rail in navbar.jsx, which is hidden below lg.
const Footer = () => (
  <footer className="lg:hidden h-16 border-t border-hairline/5 bg-surface">
    <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <p className="text-xs text-muted">© {new Date().getFullYear()} İsa Bezeniroğlu</p>

      <ul className="flex items-center list-none p-0">
        {socialLinks.map(({ id, label, href, Icon, external }) => (
          <li key={id}>
            <a
              href={href}
              aria-label={label}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={`block rounded-lg p-3 text-body hover:text-accent-soft transition-colors ${FOCUS_RING}`}
            >
              <Icon size={20} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);

export default Footer;
