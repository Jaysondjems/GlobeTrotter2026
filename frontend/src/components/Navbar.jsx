import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, Sparkles, MapPinned, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const navLinkClass = ({ isActive }) =>
  `group relative px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'
  }`;

function Underline({ isActive }) {
  return (
    <span
      className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-ocean-gradient transition-transform duration-300 ${
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}
    />
  );
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useFavorites();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const links = [
    { to: '/destinations', label: 'Destinations', icon: Compass },
    { to: '/recommendations', label: 'Recommandations', icon: Sparkles },
    { to: '/itineraries', label: 'Mes itinéraires', icon: MapPinned },
    { to: '/favorites', label: 'Favoris', icon: Heart, badge: count },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? 'border-slate-100 bg-white/85 shadow-sm backdrop-blur-lg' : 'border-transparent bg-white/60 backdrop-blur-md'
      }`}
    >
      <nav className="container-app flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold text-slate-900">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-gradient text-white shadow-soft transition-transform hover:rotate-6 hover:scale-105">
            <Compass className="h-6 w-6" />
          </span>
          GlobeTrotter
        </Link>

        <div className="hidden md:flex md:items-center md:gap-2">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span className="relative inline-flex items-center">
                    {l.label}
                    {Boolean(l.badge) && (
                      <span className="ml-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                        {l.badge}
                      </span>
                    )}
                  </span>
                  <Underline isActive={isActive} />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-brand-50 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-brand-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-gradient text-xs font-bold text-white">
                  {user?.firstName?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                </span>
                {user?.firstName}
              </div>
              <button onClick={handleLogout} className="btn-ghost" title="Déconnexion">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost">
                Connexion
              </Link>
              <Link to="/register" className="btn-primary">
                Inscription
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden animate-fade-in-down">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-base font-semibold transition-colors ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <span className="flex items-center gap-2.5">
                  <l.icon className="h-5 w-5" />
                  {l.label}
                  {Boolean(l.badge) && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
                      {l.badge}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 border-t border-slate-100 pt-4">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn-secondary w-full">
                  <LogOut className="h-4 w-4" /> Déconnexion ({user?.firstName})
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary w-full" onClick={() => setOpen(false)}>
                    Connexion
                  </Link>
                  <Link to="/register" className="btn-primary w-full" onClick={() => setOpen(false)}>
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
