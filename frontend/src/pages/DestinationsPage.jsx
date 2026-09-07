import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import AddToItineraryModal from '../components/AddToItineraryModal';
import { searchDestinations } from '../api/destinations';
import { CATEGORY_THEME } from '../lib/categoryTheme';

const CATEGORIES = Object.keys(CATEGORY_THEME);

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const category = searchParams.get('category') || '';
  const minBudget = searchParams.get('minBudget') || '';
  const maxBudget = searchParams.get('maxBudget') || '';
  const page = Number(searchParams.get('page') || 1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (minBudget) params.minBudget = minBudget;
      if (maxBudget) params.maxBudget = maxBudget;
      const res = await searchDestinations(params);
      setDestinations(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, minBudget, maxBudget, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function updateParams(next) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!('page' in next)) params.delete('page');
    setSearchParams(params);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateParams({ search });
  }

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Explorer les destinations</h1>
        <p className="mt-1 text-slate-500">Filtrez par catégorie, budget ou recherchez une ville.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              placeholder="Rechercher une ville, un pays, un nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            Rechercher
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Catégorie
          </span>
          <button
            onClick={() => updateParams({ category: '' })}
            className={`badge border ${!category ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            Toutes
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParams({ category: category === cat ? '' : cat })}
              className={`badge border capitalize ${
                category === cat ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {CATEGORY_THEME[cat].label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Budget</span>
          <input
            type="number"
            placeholder="Min"
            className="input w-28"
            defaultValue={minBudget}
            onBlur={(e) => updateParams({ minBudget: e.target.value })}
          />
          <span className="text-slate-300">—</span>
          <input
            type="number"
            placeholder="Max"
            className="input w-28"
            defaultValue={maxBudget}
            onBlur={(e) => updateParams({ maxBudget: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Recherche des destinations..." />
      ) : destinations.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="Aucune destination trouvée"
          description="Essayez d'élargir vos filtres ou votre recherche."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {destinations.map((d, i) => (
              <div key={d.id} className={`animate-fade-in-up stagger-${Math.min((i % 8) + 1, 8)}`}>
                <DestinationCard destination={d} onAdd={setSelected} />
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => updateParams({ page: String(page - 1) })}
                className="btn-secondary !px-3"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-slate-500">
                Page {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => updateParams({ page: String(page + 1) })}
                className="btn-secondary !px-3"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      <AddToItineraryModal destination={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
}
