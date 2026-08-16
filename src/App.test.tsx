import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { observedNodes } from './setupTests';
import Footer from './components/Footer';
import LanguageProvider from './context/LanguageProvider';

// Pages are lazily loaded, so every assertion has to await the chunk.
const renderAt = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );

test('renders the hero heading on the english home page', async () => {
  renderAt('/');
  expect(await screen.findByRole('heading', { name: /İSA BEZENİROĞLU/i })).toBeInTheDocument();
});

test('serves the turkish home page under /tr', async () => {
  renderAt('/tr');
  // Scoped to the desktop nav: the mobile panel stays mounted so it can animate,
  // so an unscoped query would match the same link twice.
  const mainNav = await screen.findByRole('navigation', { name: 'Main' });
  expect(within(mainNav).getByRole('link', { name: 'Hakkımda' })).toBeInTheDocument();
});

test('offers a way off the home page without opening the menu', async () => {
  renderAt('/');
  const main = await screen.findByRole('main');
  expect(within(main).getByRole('link', { name: 'View Projects' })).toHaveAttribute(
    'href',
    '/projects',
  );
  expect(within(main).getAllByRole('link', { name: 'Download CV' })[0]).toHaveAttribute(
    'href',
    '/isa_bezeniroglu_resume.pdf',
  );
});

test('names the two section links distinctly', async () => {
  renderAt('/');
  const main = await screen.findByRole('main');
  expect(within(main).getByRole('link', { name: /All skills/ })).toHaveAttribute('href', '/skills');
  expect(within(main).getByRole('link', { name: /All projects/ })).toHaveAttribute(
    'href',
    '/projects',
  );
});

test('previews every section on the home page', async () => {
  renderAt('/');
  const main = await screen.findByRole('main');
  for (const heading of ['Technical Skills', 'Projects', 'About Me', 'Get In Touch']) {
    expect(within(main).getByRole('heading', { level: 2, name: heading })).toBeInTheDocument();
  }
});

test('links the turkish home page previews to turkish routes', async () => {
  renderAt('/tr');
  const main = await screen.findByRole('main');
  expect(within(main).getByRole('link', { name: 'Projeleri İncele' })).toHaveAttribute(
    'href',
    '/tr/projects',
  );
});

test('names the cv in the footer instead of hiding it behind an icon', async () => {
  renderAt('/');
  const footer = await screen.findByRole('contentinfo');
  expect(within(footer).getByRole('link', { name: 'CV' })).toHaveAttribute(
    'href',
    '/isa_bezeniroglu_resume.pdf',
  );
  // The header nav is fixed and never leaves the screen, so repeating it here
  // would show the same five links twice at the same moment.
  expect(within(footer).queryByRole('navigation')).not.toBeInTheDocument();
});

test('labels the menu toggle and keeps the panel to navigation', async () => {
  renderAt('/tr');
  const toggle = await screen.findByRole('button', { name: 'Menü' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');

  const panel = screen.getByRole('navigation', { name: 'Mobile' });
  const links = within(panel).getAllByRole('link');
  expect(links).toHaveLength(5);
  expect(links.map((link) => link.textContent)).toEqual([
    'Ana Sayfa',
    'Hakkımda',
    'Yetenekler',
    'Projeler',
    'İletişim',
  ]);
});

test('gives every page a single h1', async () => {
  for (const route of ['/', '/about', '/skills', '/projects', '/contact']) {
    const { unmount } = renderAt(route);
    // Waiting on the lazy chunk before counting, or the shell resolves first.
    await screen.findByRole('main');
    const h1s = await screen.findAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    unmount();
  }
});

test('groups the skills page instead of listing everything flat', async () => {
  renderAt('/skills');
  const main = await screen.findByRole('main');
  for (const group of ['Core', 'Frameworks & UI', 'Platform & Tooling']) {
    expect(within(main).getByRole('heading', { level: 2, name: group })).toBeInTheDocument();
  }
  expect(within(main).queryByText('HTML')).not.toBeInTheDocument();
  expect(within(main).queryByText('JIRA')).not.toBeInTheDocument();
});

test('watches the visitor counter only once the route has rendered', () => {
  // Footer in isolation: in the full app the lazy chunks are already in the
  // module cache by this point, so Suspense never actually suspends and the
  // ordering this guards cannot be reproduced through <App />.
  const renderFooter = (routeReady: boolean) =>
    render(
      <MemoryRouter>
        <LanguageProvider language="en">
          <Footer routeReady={routeReady} />
        </LanguageProvider>
      </MemoryRouter>,
    );

  observedNodes.length = 0;
  const pending = renderFooter(false);
  // RouteFallback fills the same section-shell every page uses, so with a
  // chunk still in flight this footer sits at the fold and an observer
  // started here would fire immediately.
  expect(observedNodes).toHaveLength(0);
  pending.unmount();

  renderFooter(true);
  expect(observedNodes).toHaveLength(1);
});

test('keeps the scroll cue decorative and silent when there is no room', async () => {
  renderAt('/');
  const main = await screen.findByRole('main');

  const cue = within(main).getByText('Scroll').closest('span[aria-hidden="true"]');
  expect(cue).not.toBeNull();

  // jsdom reports no scroll room, which is what a page with nothing below the
  // fold looks like: the cue stays mounted for layout but never animates in.
  expect(cue).not.toHaveClass('animate-scroll-cue');
  expect(cue).toHaveClass('opacity-0');
});

test('renders the 404 page for an unknown route', async () => {
  renderAt('/definitely-not-a-page');
  expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
});

test('renders the localized 404 page for an unknown turkish route', async () => {
  renderAt('/tr/olmayan-sayfa');
  expect(await screen.findByRole('heading', { name: /sayfa bulunamadı/i })).toBeInTheDocument();
});
test('renders the portfolio case study', async () => {
  renderAt('/projects/portfolio');
  expect(
    await screen.findByRole('heading', { level: 1, name: /started in 2023/i }),
  ).toBeInTheDocument();
});
test('renders a case study that has no public link', async () => {
  renderAt('/projects/gaming-pro-market');
  expect(
    await screen.findByRole('heading', { level: 1, name: /team of seven/i }),
  ).toBeInTheDocument();
});
test('renders the vargeloglu case study', async () => {
  renderAt('/projects/vargeloglu-insaat');
  expect(
    await screen.findByRole('heading', { level: 1, name: /back online/i }),
  ).toBeInTheDocument();
});

test('serves the turkish case study under /tr', async () => {
  renderAt('/tr/projects/vargeloglu-insaat');
  expect(
    await screen.findByRole('heading', { level: 1, name: /yeniden ayağa kaldırmak/i }),
  ).toBeInTheDocument();
});

test('falls back to 404 for an unknown case study slug', async () => {
  renderAt('/projects/not-a-case-study');
  expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
});

describe('theme', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  test('toggling switches the theme and remembers the choice', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(await screen.findByRole('button', { name: /light theme/i }));

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem('theme')).toBe('light');

    await user.click(screen.getByRole('button', { name: /dark theme/i }));

    expect(document.documentElement).not.toHaveAttribute('data-theme');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('adopts the theme the init script already applied', async () => {
    // theme-init.js runs before React in the browser; the hook has to read what
    // it decided rather than work it out again.
    document.documentElement.setAttribute('data-theme', 'light');
    renderAt('/');

    expect(await screen.findByRole('button', { name: /dark theme/i })).toBeInTheDocument();
  });
});
