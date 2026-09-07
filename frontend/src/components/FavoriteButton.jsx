import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoriteButton({ destination, className = '', size = 'md' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(destination.id);
  const sizeClasses = size === 'lg' ? 'h-11 w-11' : 'h-8 w-8';
  const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(destination);
    toast.success(active ? 'Retiré des favoris' : 'Ajouté aux favoris', { icon: active ? '💔' : '❤️' });
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={`flex ${sizeClasses} items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-transform hover:scale-110 active:scale-95 ${className}`}
    >
      <Heart className={`${iconSize} transition-colors ${active ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
    </button>
  );
}
