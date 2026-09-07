import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Compass, Mail, Lock, LogIn, Sparkles, ShieldCheck, Globe2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_THEME } from '../lib/categoryTheme';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Connexion réussie, bienvenue !');
      navigate(location.state?.from?.pathname || '/recommendations', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[92vh] grid-cols-1 lg:grid-cols-2">
      {/* Image side */}
      <div className="relative hidden overflow-hidden bg-brand-950 lg:block">
        <img src={CATEGORY_THEME.beach.image} alt="Plage paradisiaque" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-navy-radial" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/50 to-brand-950/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-14 text-white">
          <Sparkles className="h-10 w-10 text-accent-300 animate-fade-in-up" />
          <h2 className="mt-5 text-4xl font-extrabold text-shadow animate-fade-in-up">
            Chaque voyage commence par une connexion.
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/85 text-shadow animate-fade-in-up">
            Retrouvez vos itinéraires, vos favoris et des recommandations pensées pour vous.
          </p>
          <div className="mt-8 flex gap-6 animate-fade-in-up">
            <div className="flex items-center gap-2 text-white/80">
              <Globe2 className="h-5 w-5 text-accent-300" /> 25+ destinations
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <ShieldCheck className="h-5 w-5 text-accent-300" /> Connexion sécurisée
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-white px-6 py-16 sm:px-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-extrabold text-slate-900">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-gradient text-white shadow-soft">
              <Compass className="h-6 w-6" />
            </span>
            GlobeTrotter
          </Link>

          <h1 className="text-3xl font-extrabold text-slate-900">Content de vous revoir</h1>
          <p className="mt-2 text-slate-500">Connectez-vous pour accéder à vos itinéraires.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  className="input py-3.5 pl-12 text-base"
                  placeholder="vous@exemple.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  className="input py-3.5 pl-12 text-base"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base">
              <LogIn className="h-5 w-5" />
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-7 text-center text-slate-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Inscrivez-vous
            </Link>
          </p>

          <div className="mt-7 rounded-2xl bg-brand-50 p-4 text-center text-sm text-brand-800">
            Démo : n'importe quel email de démonstration (ex. alice.martin@example.com) / mot de passe{' '}
            <code className="rounded bg-white px-1.5 py-0.5">Password123!</code>
          </div>
        </div>
      </div>
    </div>
  );
}
