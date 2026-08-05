import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Work from './components/Work';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import { NAV_ITEMS, TR_PREFIX } from './lib/navigation';

const PAGES = {
  home: Home,
  about: About,
  skills: Skills,
  projects: Work,
  contact: Contact,
};

const pageRoutes = NAV_ITEMS.map(({ key, slug }) => {
  const Page = PAGES[key];
  return slug ? (
    <Route key={key} path={slug} element={<Page />} />
  ) : (
    <Route key={key} index element={<Page />} />
  );
});

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout language="en" />}>
        {pageRoutes}
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path={TR_PREFIX} element={<Layout language="tr" />}>
        {pageRoutes}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
