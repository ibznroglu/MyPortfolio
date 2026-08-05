import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const renderAt = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );

test('renders the hero heading on the english home page', () => {
  renderAt('/');
  expect(screen.getByRole('heading', { name: /İSA BEZENİROĞLU/i })).toBeInTheDocument();
});

test('serves the turkish home page under /tr', () => {
  renderAt('/tr');
  expect(screen.getByRole('link', { name: 'Hakkımda' })).toBeInTheDocument();
});

test('renders the 404 page for an unknown route', () => {
  renderAt('/definitely-not-a-page');
  expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
});

test('renders the localized 404 page for an unknown turkish route', () => {
  renderAt('/tr/olmayan-sayfa');
  expect(screen.getByRole('heading', { name: /sayfa bulunamadı/i })).toBeInTheDocument();
});
