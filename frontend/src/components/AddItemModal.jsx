import { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, MapPin } from 'lucide-react';
import Modal from './Modal';
import { searchDestinations } from '../api/destinations';
import * as itinerariesApi from '../api/itineraries';

export default function AddItemModal({ itineraryId, open, onClose, onAdded }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState(null);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const res = await searchDestinations({ search: query, limit: 6 });
      setResults(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSearching(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!picked) return toast.error('Choisissez une destination');
    if (!date) return toast.error('Choisissez une date');
    setSubmitting(true);
    try {
      const item = await itinerariesApi.addItem(itineraryId, { destinationId: picked.id, date, notes: notes || undefined });
      toast.success('Étape ajoutée !');
      onAdded?.({ ...item, destination: picked });
      reset();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setQuery('');
    setResults([]);
    setPicked(null);
    setDate('');
    setNotes('');
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Ajouter une étape"
    >
      {!picked ? (
        <div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                className="input pl-10"
                placeholder="Rechercher une destination..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-secondary" disabled={searching}>
              {searching ? '...' : 'Chercher'}
            </button>
          </form>

          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
            {results.map((d) => (
              <button
                key={d.id}
                onClick={() => setPicked(d)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left hover:border-brand-300 hover:bg-brand-50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" /> {d.city}, {d.country}
                  </p>
                </div>
                <Plus className="h-4 w-4 text-brand-500" />
              </button>
            ))}
            {results.length === 0 && !searching && (
              <p className="py-6 text-center text-xs text-slate-400">Recherchez une destination à ajouter.</p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-brand-50 p-3">
            <div>
              <p className="text-sm font-semibold text-brand-900">{picked.name}</p>
              <p className="text-xs text-brand-600">{picked.city}, {picked.country}</p>
            </div>
            <button type="button" onClick={() => setPicked(null)} className="text-xs font-medium text-brand-600 hover:underline">
              Changer
            </button>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" required className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Notes (optionnel)</label>
            <textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Ajout...' : "Ajouter à l'itinéraire"}
          </button>
        </form>
      )}
    </Modal>
  );
}
