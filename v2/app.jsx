import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import STRINGS from './strings.js';
import CONTENT from '../content.js';
import { useActiveSection, useGlassPointer, useReveal } from './lib/hooks.js';

import Background from './components/background.jsx';
import Cursor from './components/cursor.jsx';
import Rail from './components/rail.jsx';
import Nav from './components/nav.jsx';
import Hero from './components/hero.jsx';
import About from './components/about.jsx';
import Work from './components/work.jsx';
import Approach from './components/approach.jsx';
import Stack from './components/stack.jsx';
import Services from './components/services.jsx';
import Testimonials from './components/testimonials.jsx';
import Contact from './components/contact.jsx';
import ProjectDrawer from './components/project-drawer.jsx';

const s = CONTENT.sections;
const SECTIONS = [
  'hero',
  s.about.isDisplay && 'about',
  s.work.isDisplay && 'work',
  s.approach.isDisplay && 'approach',
  s.stack.isDisplay && 'stack',
  s.services.isDisplay && 'services',
  s.testimonials.isDisplay && 'testimonials',
  s.contact.isDisplay && 'contact',
].filter(Boolean);

function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('hk_lang') || 'en'; } catch (_) { return 'en'; }
  });
  const [activeProject, setActiveProject] = useState(null);
  const t = STRINGS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('hk_lang', lang); } catch (_) {}
  }, [lang]);

  useReveal(lang);
  useGlassPointer();
  const active = useActiveSection(SECTIONS, lang);

  return (
    <>
      <Background />
      <Cursor />
      <Rail sections={SECTIONS} active={active} labels={t.railLabels} />
      <Nav t={t} lang={lang} setLang={setLang} active={active} />
      <main>
        <Hero t={t} />
        {s.about.isDisplay        && <About        t={t} />}
        {s.work.isDisplay         && <Work         t={t} lang={lang} openProject={setActiveProject} />}
        {s.approach.isDisplay     && <Approach     t={t} />}
        {s.stack.isDisplay        && <Stack        t={t} />}
        {s.services.isDisplay     && <Services     t={t} lang={lang} />}
        {s.testimonials.isDisplay && <Testimonials t={t} lang={lang} />}
        {s.contact.isDisplay      && <Contact      t={t} />}
      </main>
      <ProjectDrawer project={activeProject} lang={lang} t={t} onClose={() => setActiveProject(null)} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
