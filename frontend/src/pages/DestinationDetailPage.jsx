import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, DollarSign, TrendingUp, Sparkles, Plus } from 'lucide-react';
import DestinationImage from '../components/DestinationImage';
import FavoriteButton from '../components/FavoriteButton';
import LoadingSpinner from '../components/LoadingSpinner';
import AddToItineraryModal from '../components/AddToItineraryModal';
import { getDestination } from '../api/destinations';
import { getCategoryTheme } from '../lib/categoryTheme';

export default function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDestination(id)
      .then(setDestination)
      .catch((err) => {
        toast.error(err.message);
        navigate('/destinations');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <LoadingSpinner label="Chargement de la destination..." className="min-h-[70vh]" />;
  if (!destination) return null;

  const theme = getCategoryTheme(destination.category);
  const activities = Array.isArray(destination.activities) ? destination.activities : [];

  return (
    <div className="animate-fade-in">
      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
        <DestinationImage category={destination.category} name={destination.name} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-slate-900/40" />

        <div className="container-app absolute inset-x-0 top-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>
        </div>

        <div className="container-app absolute inset-x-0 bottom-8 flex items-end justify-between gap-4">
          <div className="animate-fade-in-up text-white">
            <span className={`badge ${theme.badge}`}>{theme.label}</span>
            <h1 className="mt-3 text-4xl font-extrabold text-shadow sm:text-5xl">{destination.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-white/90 text-shadow">
              <MapPin className="h-4 w-4" /> {destination.city}, {destination.country}
            </p>
          </div>
          <FavoriteButton destination={destination} size="lg" className="mb-2 shrink-0" />
        </div>
      </div>

      <div className="container-app grid grid-cols-1 gap-8 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2 animate-fade-in-up">
          <h2 className="text-lg font-bold text-slate-900">À propos</h2>
          <p className="mt-2 leading-relaxed text-slate-600">
            {destination.description || `Découvrez ${destination.name}, une destination ${theme.label.toLowerCase()} incontournable.`}
          </p>

          {activities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900">Activités</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {activities.map((a) => (
                  <span key={a} className="badge border border-slate-200 bg-white text-slate-600">
                    <Sparkles className="h-3 w-3 text-brand-500" /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="animate-fade-in-up stagger-2">
          <div className="card sticky top-24 space-y-5 p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <DollarSign className="h-4 w-4 text-emerald-600" /> Budget moyen
              </span>
              <span className="text-lg font-bold text-slate-900">{destination.averageBudget?.toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <TrendingUp className="h-4 w-4 text-brand-600" /> Popularité
              </span>
              <span className="text-lg font-bold text-slate-900">{destination.popularityScore}/100</span>
            </div>

            <button onClick={() => setShowAdd(true)} className="btn-primary w-full">
              <Plus className="h-4 w-4" /> Ajouter à un itinéraire
            </button>
            <Link to="/destinations" className="btn-secondary w-full">
              Voir d'autres destinations
            </Link>
          </div>
        </aside>
      </div>

      <AddToItineraryModal destination={destination} open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
