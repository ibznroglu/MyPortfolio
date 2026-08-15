import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

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
