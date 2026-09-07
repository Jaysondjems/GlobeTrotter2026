import { useState } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';
import Modal from './Modal';
import * as itinerariesApi from '../api/itineraries';

export default function CreateItineraryModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.startDate > form.endDate) {
      toast.error('La date de début doit précéder la date de fin');
      return;
    }
    setSubmitting(true);
    try {
      const created = await itinerariesApi.createItinerary(form);
      toast.success('Itinéraire créé !');
      setForm({ title: '', description: '', startDate: '', endDate: '' });
      onCreated?.(created);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nouvel itinéraire">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Titre</label>
          <input required className="input" placeholder="ex. Road trip en Italie" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="label">Description (optionnel)</label>
          <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Début</label>
            <input type="date" required className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label className="label">Fin</label>
            <input type="date" required className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          <PlusCircle className="h-4 w-4" />
          {submitting ? 'Création...' : "Créer l'itinéraire"}
        </button>
      </form>
    </Modal>
  );
}
