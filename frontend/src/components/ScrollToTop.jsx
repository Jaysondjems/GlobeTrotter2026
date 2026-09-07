import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Standard SPA UX nicety: without this, navigating to a new page keeps the previous scroll position.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);

  return null;
}
