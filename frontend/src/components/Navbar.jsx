import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, Sparkles, MapPinned, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
  }`;

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const links = [
    { to: '/destinations', label: 'Destinations', icon: Compass },
    { to: '/recommendations', label: 'Recommandations', icon: Sparkles },
    { to: '/itineraries', label: 'Mes itinéraires', icon: MapPinned },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hero-gradient text-white shadow-soft">
            <Compass className="h-5 w-5" />
          </span>
          GlobeTrotter
        </Link>

        <div className="hidden md:flex md:items-center md:gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-slate-100 py-1.5 pl-1.5 pr-3 text-sm font-medium text-slate-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
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
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navLinkClass} onClick={() => setOpen(false)}>
                <span className="flex items-center gap-2">
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </span>
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3">
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
