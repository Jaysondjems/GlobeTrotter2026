import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Sparkles, MapPinned, Share2, ShieldCheck, Gauge, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DestinationImage from '../components/DestinationImage';

const FEATURED_CATEGORIES = ['beach', 'culture', 'nature', 'adventure', 'city', 'luxury'];

const FEATURES = [
  {
    icon: Search,
    title: 'Recherche intelligente',
    text: 'Filtrez des dizaines de destinations par catégorie, pays et budget en quelques clics.',
  },
  {
    icon: Sparkles,
    title: 'Recommandations personnalisées',
    text: 'Un score explicable basé sur vos préférences, votre historique et la popularité.',
  },
  {
    icon: MapPinned,
    title: 'Itinéraires sur-mesure',
    text: 'Composez votre voyage jour par jour et gardez tout organisé au même endroit.',
  },
  {
    icon: Share2,
    title: 'Partage instantané',
    text: 'Générez un lien public pour partager votre itinéraire avec vos proches.',
  },
  {
    icon: Gauge,
    title: 'Rapide et résilient',
    text: 'Architecture microservices avec cache et circuit breakers pour rester disponible.',
  },
  {
    icon: ShieldCheck,
    title: 'Sécurisé',
    text: 'Authentification JWT et mots de passe chiffrés (bcrypt) de bout en bout.',
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/destinations?search=${encodeURIComponent(query)}` : '/destinations');
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
            <Sparkles className="h-4 w-4" /> Votre prochaine aventure commence ici
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Explorez le monde,
            <br />
            un itinéraire à la fois
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
            GlobeTrotter vous aide à découvrir des destinations, obtenir des recommandations
            personnalisées et organiser vos voyages du début à la fin.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl gap-2 rounded-2xl bg-white p-2 shadow-2xl">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une ville, un pays..."
                className="w-full border-0 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>
            <button type="submit" className="btn-primary">
              Rechercher
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {!isAuthenticated && (
              <Link to="/register" className="btn bg-white text-brand-700 hover:bg-slate-100">
                Créer un compte gratuit <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link to="/destinations" className="btn bg-white/10 text-white ring-1 ring-inset ring-white/40 hover:bg-white/20">
              Explorer les destinations
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex max-w-5xl gap-3 overflow-x-auto px-4 pb-12 sm:px-6 lg:px-8">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/destinations?category=${cat}`}
              className="group h-24 w-40 shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/20 transition-transform hover:-translate-y-1"
            >
              <DestinationImage category={cat} name={cat} className="h-full w-full" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Tout ce qu'il faut pour voyager mieux</h2>
          <p className="mt-3 text-slate-500">
            Une application complète, construite sur une architecture distribuée moderne.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 transition-transform hover:-translate-y-1">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                <f.icon className="h-5 w-5 text-brand-600" />
              </div>
              <h3 className="font-bold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Prêt à planifier votre prochain voyage ?</h2>
          <p className="mt-3 text-slate-300">Rejoignez GlobeTrotter et obtenez vos recommandations en 2 minutes.</p>
          <Link to={isAuthenticated ? '/recommendations' : '/register'} className="btn-primary mt-6 inline-flex">
            {isAuthenticated ? 'Voir mes recommandations' : 'Commencer gratuitement'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
