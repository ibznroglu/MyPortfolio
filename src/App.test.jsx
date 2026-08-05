import { render, screen } from '@testing-library/react';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';

const renderApp = () =>
  render(
    <LanguageProvider>
      <App />
    </LanguageProvider>,
  );

test('ana sayfada isim basligi render ediliyor', () => {
  renderApp();
  expect(screen.getByRole('heading', { name: /İSA BEZENİROĞLU/i })).toBeInTheDocument();
});
