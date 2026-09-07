import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Sparkles, RefreshCw } from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getRecommendations } from '../api/recommendations';
import { useAuth } from '../context/AuthContext';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecommendations(user.id, 9);
      setRecommendations(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-slate-900">
            <Sparkles className="h-7 w-7 text-brand-600" />
            Recommandé pour vous
          </h1>
          <p className="mt-1 text-slate-500">
            Basé sur vos préférences, votre historique de voyages et la popularité des destinations.
          </p>
        </div>
        <button onClick={fetchData} className="btn-secondary" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Calcul de vos recommandations..." />
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Pas encore de recommandations"
          description="Ajoutez des préférences de voyage ou créez un itinéraire pour affiner vos suggestions."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.destination.id} recommendation={rec} />
          ))}
        </div>
      )}
    </div>
  );
}
