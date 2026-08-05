import { render, screen } from '@testing-library/react';
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
  expect(await screen.findByRole('link', { name: 'Hakkımda' })).toBeInTheDocument();
});

test('renders the 404 page for an unknown route', async () => {
  renderAt('/definitely-not-a-page');
  expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
});

test('renders the localized 404 page for an unknown turkish route', async () => {
  renderAt('/tr/olmayan-sayfa');
  expect(await screen.findByRole('heading', { name: /sayfa bulunamadı/i })).toBeInTheDocument();
});
