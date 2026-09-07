import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, MapPin } from 'lucide-react';
import Modal from './Modal';
import * as itinerariesApi from '../api/itineraries';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddToItineraryModal({ destination, open, onClose }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('existing');
  const [selectedId, setSelectedId] = useState('');
  const [date, setDate] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDates, setNewDates] = useState({ startDate: '', endDate: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    setLoading(true);
    itinerariesApi
      .listItineraries({ limit: 50 })
      .then((res) => {
        setItineraries(res.data);
        if (res.data.length) {
          setSelectedId(res.data[0].id);
          setMode('existing');
        } else {
          setMode('new');
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [open, isAuthenticated]);

  if (!isAuthenticated && open) {
    return (
      <Modal open={open} onClose={onClose} title="Connexion requise">
        <p className="text-sm text-slate-600">
          Connectez-vous pour ajouter des destinations à un itinéraire personnel.
        </p>
        <button className="btn-primary mt-4 w-full" onClick={() => navigate('/login')}>
          Se connecter
        </button>
      </Modal>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date) return toast.error('Choisissez une date');
    setSubmitting(true);
    try {
      let itineraryId = selectedId;
      if (mode === 'new') {
        if (!newTitle || !newDates.startDate || !newDates.endDate) {
          throw new Error('Titre et dates requis pour un nouvel itinéraire');
        }
        const created = await itinerariesApi.createItinerary(newDates.startDate <= newDates.endDate
          ? { title: newTitle, startDate: newDates.startDate, endDate: newDates.endDate }
          : (() => { throw new Error('La date de début doit précéder la date de fin'); })());
        itineraryId = created.id;
      }
      if (!itineraryId) throw new Error('Sélectionnez un itinéraire');
      await itinerariesApi.addItem(itineraryId, { destinationId: destination.id, date });
      toast.success(`${destination.name} ajouté à l'itinéraire !`);
      onClose();
      navigate(`/itineraries/${itineraryId}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Ajouter "${destination?.name}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {itineraries.length > 0 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('existing')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${mode === 'existing' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Itinéraire existant
            </button>
            <button
              type="button"
              onClick={() => setMode('new')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${mode === 'new' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Nouvel itinéraire
            </button>
          </div>
        )}

        {mode === 'existing' && itineraries.length > 0 ? (
          <div>
            <label className="label">Choisir un itinéraire</label>
            <select className="input" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {itineraries.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="label">Titre de l'itinéraire</label>
              <input className="input" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="ex. Vacances d'été" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Début</label>
                <input type="date" className="input" value={newDates.startDate} onChange={(e) => setNewDates({ ...newDates, startDate: e.target.value })} />
              </div>
              <div>
                <label className="label">Fin</label>
                <input type="date" className="input" value={newDates.endDate} onChange={(e) => setNewDates({ ...newDates, endDate: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="label">Date de visite</label>
          <input type="date" required className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          <MapPin className="h-4 w-4 shrink-0" />
          {destination?.city}, {destination?.country}
        </div>

        <button type="submit" disabled={submitting || loading} className="btn-primary w-full">
          <PlusCircle className="h-4 w-4" />
          {submitting ? 'Ajout...' : "Ajouter à l'itinéraire"}
        </button>
      </form>
    </Modal>
  );
}
