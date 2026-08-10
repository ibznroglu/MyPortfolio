import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { NAV_ITEMS, TR_PREFIX } from './lib/navigation';

// Each page ships as its own chunk, so the first paint only downloads the
// route the visitor actually asked for.
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Work = lazy(() => import('./components/Work'));
const Contact = lazy(() => import('./components/Contact'));
const NotFound = lazy(() => import('./components/NotFound'));
const CaseStudy = lazy(() => import('./components/CaseStudy'));

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
        <Route path="projects/:caseSlug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path={TR_PREFIX} element={<Layout language="tr" />}>
        {pageRoutes}
        <Route path="projects/:caseSlug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
