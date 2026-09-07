import { Waves, Landmark, Mountain, Compass, Building2, Gem, MapPin } from 'lucide-react';

// One curated, reliable photo per category (Unsplash) + a matching gradient/icon fallback
// shown automatically if the image fails to load (offline demo, network issue, etc.).
export const CATEGORY_THEME = {
  beach: {
    label: 'Plage',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    gradient: 'from-cyan-400 to-blue-600',
    icon: Waves,
    badge: 'bg-cyan-100 text-cyan-700',
  },
  culture: {
    label: 'Culture',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80',
    gradient: 'from-amber-400 to-orange-600',
    icon: Landmark,
    badge: 'bg-amber-100 text-amber-700',
  },
  nature: {
    label: 'Nature',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    gradient: 'from-emerald-400 to-green-700',
    icon: Mountain,
    badge: 'bg-emerald-100 text-emerald-700',
  },
  adventure: {
    label: 'Aventure',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
    gradient: 'from-orange-400 to-red-600',
    icon: Compass,
    badge: 'bg-orange-100 text-orange-700',
  },
  city: {
    label: 'Ville',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80',
    gradient: 'from-slate-500 to-slate-800',
    icon: Building2,
    badge: 'bg-slate-200 text-slate-700',
  },
  luxury: {
    label: 'Luxe',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
    gradient: 'from-violet-400 to-fuchsia-700',
    icon: Gem,
    badge: 'bg-fuchsia-100 text-fuchsia-700',
  },
};

export const DEFAULT_THEME = {
  label: 'Destination',
  image: null,
  gradient: 'from-brand-400 to-brand-700',
  icon: MapPin,
  badge: 'bg-brand-100 text-brand-700',
};

export function getCategoryTheme(category) {
  return CATEGORY_THEME[category] || DEFAULT_THEME;
}
