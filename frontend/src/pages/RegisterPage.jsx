import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Compass, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PREFERENCES = ['beach', 'culture', 'nature', 'adventure', 'city', 'luxury'];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    budgetPreference: '',
    travelPreferences: [],
  });
  const [loading, setLoading] = useState(false);

  function togglePreference(pref) {
    setForm((f) => ({
      ...f,
      travelPreferences: f.travelPreferences.includes(pref)
        ? f.travelPreferences.filter((p) => p !== pref)
        : [...f.travelPreferences, pref],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        ...form,
        budgetPreference: form.budgetPreference ? Number(form.budgetPreference) : undefined,
      });
      toast.success('Compte créé avec succès !');
      navigate('/recommendations', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="card w-full max-w-lg p-8 animate-fade-in">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-hero-gradient text-white shadow-soft">
            <Compass className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Créer votre compte</h1>
          <p className="mt-1 text-sm text-slate-500">Quelques infos pour personnaliser vos recommandations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Prénom</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  className="input pl-10"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label">Nom</label>
              <input
                required
                className="input"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                className="input pl-10"
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
                minLength={6}
                className="input pl-10"
                placeholder="6 caractères minimum"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">Budget préféré (optionnel)</label>
            <input
              type="number"
              min="0"
              className="input"
              placeholder="ex. 2000"
              value={form.budgetPreference}
              onChange={(e) => setForm({ ...form, budgetPreference: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Préférences de voyage</label>
            <div className="flex flex-wrap gap-2">
              {PREFERENCES.map((pref) => (
                <button
                  type="button"
                  key={pref}
                  onClick={() => togglePreference(pref)}
                  className={`badge border transition-colors ${
                    form.travelPreferences.includes(pref)
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <UserPlus className="h-4 w-4" />
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Déjà inscrit ?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
