import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, MapPin, StickyNote, Compass, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import DestinationImage from '../components/DestinationImage';
import StatusBadge from '../components/StatusBadge';
import { getSharedItinerary } from '../api/itineraries';

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function SharedItineraryPage() {
  const { token } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSharedItinerary(token)
      .then(setItinerary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <LoadingSpinner label="Chargement de l'itinéraire partagé..." className="min-h-[80vh]" />;

  if (error) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
        <h1 className="text-xl font-bold text-slate-900">Itinéraire introuvable</h1>
        <p className="text-slate-500">{error}</p>
        <Link to="/" className="btn-primary mt-2">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const items = [...(itinerary.items || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-[80vh] bg-slate-50">
      <div className="bg-hero-gradient py-10">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
            <Compass className="h-4 w-4" /> GlobeTrotter
          </Link>
          <h1 className="text-3xl font-extrabold text-white">{itinerary.title}</h1>
          {itinerary.description && <p className="mt-2 text-white/80">{itinerary.description}</p>}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <span className="badge bg-white/15 text-white backdrop-blur">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(itinerary.startDate)} → {formatDate(itinerary.endDate)}
            </span>
            <StatusBadge status={itinerary.status} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-lg font-bold text-slate-900">Étapes du voyage</h2>
        <ol className="space-y-4 border-l-2 border-brand-100 pl-6">
          {items.map((item) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-white bg-brand-500 shadow" />
              <div className="card flex gap-4 p-4">
                {item.destination && (
                  <DestinationImage category={item.destination.category} name={item.destination.name} className="h-20 w-20 shrink-0 rounded-xl" />
                )}
                <div>
                  <p className="text-xs font-semibold text-brand-600">{formatDate(item.date)}</p>
                  <h3 className="font-bold text-slate-900">{item.destination?.name}</h3>
                  {item.destination && (
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" /> {item.destination.city}, {item.destination.country}
                    </p>
                  )}
                  {item.notes && (
                    <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500">
                      <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {item.notes}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl bg-white p-6 text-center shadow-card">
          <p className="text-sm text-slate-500">Envie de créer votre propre itinéraire ?</p>
          <Link to="/register" className="btn-primary mt-3 inline-flex">
            Rejoindre GlobeTrotter
          </Link>
        </div>
      </div>
    </div>
  );
}
