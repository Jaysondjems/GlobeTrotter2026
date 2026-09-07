import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Compass, Mail, Lock, User, UserPlus, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_THEME } from '../lib/categoryTheme';

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
    <div className="grid min-h-[92vh] grid-cols-1 lg:grid-cols-2">
      {/* Image side */}
      <div className="relative hidden overflow-hidden bg-brand-950 lg:block">
        <img src={CATEGORY_THEME.luxury.image} alt="Destination de rêve" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-navy-radial" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/50 to-brand-950/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-14 text-white">
          <Heart className="h-10 w-10 text-accent-300 animate-fade-in-up" />
          <h2 className="mt-5 text-4xl font-extrabold text-shadow animate-fade-in-up">
            Rejoignez des voyageurs qui explorent autrement.
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/85 text-shadow animate-fade-in-up">
            Dites-nous ce que vous aimez, on s'occupe du reste : recommandations, budgets, itinéraires.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-white px-6 py-16 sm:px-12">
        <div className="w-full max-w-lg animate-fade-in-up">
          <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-extrabold text-slate-900">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-gradient text-white shadow-soft">
              <Compass className="h-6 w-6" />
            </span>
            GlobeTrotter
          </Link>

          <h1 className="text-3xl font-extrabold text-slate-900">Créer votre compte</h1>
          <p className="mt-2 text-slate-500">Quelques infos pour personnaliser vos recommandations.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Prénom</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    className="input py-3.5 pl-12 text-base"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Nom</label>
                <input
                  required
                  className="input py-3.5 text-base"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  className="input py-3.5 pl-12 text-base"
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
                  minLength={6}
                  className="input py-3.5 pl-12 text-base"
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
                className="input py-3.5 text-base"
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
                    className={`badge border px-3 py-1.5 text-sm transition-all ${
                      form.travelPreferences.includes(pref)
                        ? 'border-transparent bg-ocean-gradient text-white shadow-soft'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
                    }`}
                  >
                    {CATEGORY_THEME[pref]?.label || pref}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base">
              <UserPlus className="h-5 w-5" />
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-7 text-center text-slate-500">
            Déjà inscrit ?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
