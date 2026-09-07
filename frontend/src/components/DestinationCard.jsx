import { MapPin, TrendingUp, DollarSign, Plus } from 'lucide-react';
import DestinationImage from './DestinationImage';
import { getCategoryTheme } from '../lib/categoryTheme';

export default function DestinationCard({ destination, onAdd, actionLabel = 'Ajouter à un itinéraire' }) {
  const theme = getCategoryTheme(destination.category);

  return (
    <div className="card group flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-44 w-full overflow-hidden">
        <DestinationImage
          category={destination.category}
          name={destination.name}
          className="h-full w-full transition-transform duration-500 group-hover:scale-110"
        />
        <span className={`badge absolute left-3 top-3 ${theme.badge} backdrop-blur`}>{theme.label}</span>
        {destination.popularityScore >= 85 && (
          <span className="badge absolute right-3 top-3 bg-white/90 text-slate-700">
            <TrendingUp className="h-3 w-3" /> Populaire
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold text-slate-900">{destination.name}</h3>
        <p className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {destination.city}, {destination.country}
        </p>
        {destination.description && (
          <p className="line-clamp-2 text-sm text-slate-500">{destination.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            {destination.averageBudget?.toLocaleString('fr-FR')}
          </span>
          {onAdd && (
            <button onClick={() => onAdd(destination)} className="btn-secondary !py-1.5 !px-3 text-xs">
              <Plus className="h-3.5 w-3.5" />
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
