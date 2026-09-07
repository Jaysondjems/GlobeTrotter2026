import { Link } from 'react-router-dom';
import { MapPin, CheckCircle2 } from 'lucide-react';
import DestinationImage from './DestinationImage';
import FavoriteButton from './FavoriteButton';
import { getCategoryTheme } from '../lib/categoryTheme';

export default function RecommendationCard({ recommendation }) {
  const { destination, score, reasons } = recommendation;
  const theme = getCategoryTheme(destination.category);
  const pct = Math.min(100, Math.round((score / 65) * 100));

  return (
    <div className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow animate-fade-in-up">
      <Link to={`/destinations/${destination.id}`} className="relative block h-40 w-full overflow-hidden">
        <DestinationImage
          category={destination.category}
          name={destination.name}
          className="h-full w-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-3">
          <span className={`badge ${theme.badge}`}>{theme.label}</span>
        </div>
        <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
          <span className="text-sm font-extrabold text-brand-700">{score}</span>
        </div>
        <FavoriteButton destination={destination} className="absolute left-3 top-3" />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/destinations/${destination.id}`} className="font-bold text-slate-900 transition-colors hover:text-brand-700">
          {destination.name}
        </Link>
        <p className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {destination.city}, {destination.country}
        </p>

        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <ul className="mt-2 space-y-1.5">
          {reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-1.5 text-xs text-slate-500">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
