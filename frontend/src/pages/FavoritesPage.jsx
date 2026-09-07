import { Heart } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import EmptyState from '../components/EmptyState';
import AddToItineraryModal from '../components/AddToItineraryModal';
import { useFavorites } from '../context/FavoritesContext';
import { useState } from 'react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [selected, setSelected] = useState(null);

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold text-slate-900">
          <Heart className="h-7 w-7 fill-rose-500 text-rose-500" />
          Mes favoris
        </h1>
        <p className="mt-1 text-slate-500">Les destinations que vous avez aimées, enregistrées sur cet appareil.</p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Aucun favori pour le moment"
          description="Cliquez sur le cœur d'une destination pour l'ajouter ici."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((d, i) => (
            <div key={d.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}>
              <DestinationCard destination={d} onAdd={setSelected} />
            </div>
          ))}
        </div>
      )}

      <AddToItineraryModal destination={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
}
