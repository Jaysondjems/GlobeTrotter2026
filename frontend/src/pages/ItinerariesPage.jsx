import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPinned, Plus, Calendar, ListChecks } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import CreateItineraryModal from '../components/CreateItineraryModal';
import * as itinerariesApi from '../api/itineraries';

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await itinerariesApi.listItineraries({ limit: 50 });
      setItineraries(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-slate-900">
            <MapPinned className="h-7 w-7 text-brand-600" />
            Mes itinéraires
          </h1>
          <p className="mt-1 text-slate-500">Créez, organisez et partagez vos voyages.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Nouvel itinéraire
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Chargement de vos itinéraires..." />
      ) : itineraries.length === 0 ? (
        <EmptyState
          icon={MapPinned}
          title="Aucun itinéraire pour le moment"
          description="Créez votre premier itinéraire ou ajoutez une destination depuis la page de recherche."
          action={
            <button onClick={() => setShowCreate(true)} className="btn-primary mt-2">
              <Plus className="h-4 w-4" /> Créer un itinéraire
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((it) => (
            <Link
              key={it.id}
              to={`/itineraries/${it.id}`}
              className="card group flex flex-col gap-3 p-5 transition-transform hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 group-hover:text-brand-700">{it.title}</h3>
                <StatusBadge status={it.status} />
              </div>
              {it.description && <p className="line-clamp-2 text-sm text-slate-500">{it.description}</p>}
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(it.startDate)} → {formatDate(it.endDate)}
                </span>
                <span className="flex items-center gap-1">
                  <ListChecks className="h-3.5 w-3.5" />
                  {it.items?.length || 0} étape{(it.items?.length || 0) > 1 ? 's' : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateItineraryModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={fetchData} />
    </div>
  );
}
