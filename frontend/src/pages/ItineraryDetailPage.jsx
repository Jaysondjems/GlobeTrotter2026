import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Calendar,
  Plus,
  Share2,
  Trash2,
  MapPin,
  StickyNote,
  MapPinned,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import DestinationImage from '../components/DestinationImage';
import AddItemModal from '../components/AddItemModal';
import ShareModal from '../components/ShareModal';
import * as itinerariesApi from '../api/itineraries';

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_OPTIONS = ['DRAFT', 'PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED'];

export default function ItineraryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await itinerariesApi.getItinerary(id);
      setItinerary(data);
    } catch (err) {
      toast.error(err.message);
      navigate('/itineraries');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDeleteItinerary() {
    if (!confirm('Supprimer définitivement cet itinéraire ?')) return;
    try {
      await itinerariesApi.deleteItinerary(id);
      toast.success('Itinéraire supprimé');
      navigate('/itineraries');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteItem(itemId) {
    if (!confirm('Retirer cette étape ?')) return;
    try {
      await itinerariesApi.deleteItem(id, itemId);
      toast.success('Étape retirée');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleStatusChange(status) {
    try {
      const updated = await itinerariesApi.updateItinerary(id, { status });
      setItinerary((prev) => ({ ...prev, status: updated.status }));
      toast.success('Statut mis à jour');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleShare() {
    try {
      const { shareToken } = await itinerariesApi.shareItinerary(id);
      setShareUrl(`${window.location.origin}/shared/${shareToken}`);
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <LoadingSpinner label="Chargement de l'itinéraire..." className="min-h-[60vh]" />;
  if (!itinerary) return null;

  const items = [...(itinerary.items || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/itineraries" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Mes itinéraires
      </Link>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{itinerary.title}</h1>
            {itinerary.description && <p className="mt-1 text-slate-500">{itinerary.description}</p>}
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              {formatDate(itinerary.startDate)} → {formatDate(itinerary.endDate)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="btn-secondary">
              <Share2 className="h-4 w-4" /> Partager
            </button>
            <button onClick={handleDeleteItinerary} className="btn-danger">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Statut</span>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={itinerary.status === s ? 'ring-2 ring-brand-500 rounded-full' : ''}
            >
              <StatusBadge status={s} />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Étapes du voyage</h2>
        <button onClick={() => setShowAddItem(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Ajouter une étape
        </button>
      </div>

      {items.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={MapPinned}
            title="Aucune étape pour le moment"
            description="Ajoutez des destinations pour construire votre itinéraire jour par jour."
          />
        </div>
      ) : (
        <ol className="mt-6 space-y-4 border-l-2 border-brand-100 pl-6">
          {items.map((item) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-white bg-brand-500 shadow" />
              <div className="card flex gap-4 p-4 animate-fade-in">
                {item.destination && (
                  <DestinationImage
                    category={item.destination.category}
                    name={item.destination.name}
                    className="h-20 w-20 shrink-0 rounded-xl"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-brand-600">{formatDate(item.date)}</p>
                      <h3 className="font-bold text-slate-900">{item.destination?.name || 'Destination'}</h3>
                      {item.destination && (
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3 w-3" /> {item.destination.city}, {item.destination.country}
                        </p>
                      )}
                    </div>
                    <button onClick={() => handleDeleteItem(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
      )}

      <AddItemModal itineraryId={id} open={showAddItem} onClose={() => setShowAddItem(false)} onAdded={fetchData} />
      <ShareModal open={Boolean(shareUrl)} onClose={() => setShareUrl(null)} shareUrl={shareUrl} />
    </div>
  );
}
