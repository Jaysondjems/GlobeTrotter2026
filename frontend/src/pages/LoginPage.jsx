import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Compass, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="card w-full max-w-md p-8 animate-fade-in">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-hero-gradient text-white shadow-soft">
            <Compass className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Content de vous revoir</h1>
          <p className="mt-1 text-sm text-slate-500">Connectez-vous pour accéder à vos itinéraires.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                className="input pl-10"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                className="input pl-10"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <LogIn className="h-4 w-4" />
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Inscrivez-vous
          </Link>
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-400">
          Démo : n'importe quel email de démonstration (ex. alice.martin@example.com) / mot de passe{' '}
          <code className="rounded bg-slate-200 px-1 py-0.5">Password123!</code>
        </div>
      </div>
    </div>
  );
}
