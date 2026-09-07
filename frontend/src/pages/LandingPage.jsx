import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Sparkles, MapPinned, Share2, ShieldCheck, Gauge, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Carousel from '../components/Carousel';
import { CATEGORY_THEME } from '../lib/categoryTheme';

const HERO_SLIDES = [
  { id: 'beach', tagline: 'Des plages qui vous appellent', ...CATEGORY_THEME.beach },
  { id: 'culture', tagline: "L'histoire à ciel ouvert", ...CATEGORY_THEME.culture },
  { id: 'nature', tagline: 'Perdez-vous dans la nature', ...CATEGORY_THEME.nature },
  { id: 'adventure', tagline: "L'aventure vous attend", ...CATEGORY_THEME.adventure },
  { id: 'city', tagline: 'Des villes qui ne dorment jamais', ...CATEGORY_THEME.city },
  { id: 'luxury', tagline: "L'exception, sans compromis", ...CATEGORY_THEME.luxury },
];

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
    icon: Heart,
    title: 'Favoris',
    text: 'Enregistrez vos destinations coup de cœur pour les retrouver en un instant.',
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
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-slate-900">
        <Carousel
          className="h-full w-full"
          slides={HERO_SLIDES}
          autoPlayMs={5500}
          renderSlide={(slide) => (
            <div className="relative h-full w-full">
              <img src={slide.image} alt={slide.label} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-navy-radial" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-950/80 via-transparent to-transparent" />
            </div>
          )}
        />

        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div className="container-app">
            <div className="pointer-events-auto max-w-2xl animate-fade-in-up">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur">
                <Sparkles className="h-4 w-4 text-accent-400" /> Votre prochaine aventure commence ici
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-white text-shadow sm:text-6xl">
                Explorez le monde,
                <br />
                un itinéraire à la fois
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/85 text-shadow">
                GlobeTrotter vous aide à découvrir des destinations, obtenir des recommandations
                personnalisées et organiser vos voyages du début à la fin.
              </p>

              <form onSubmit={handleSearch} className="mt-8 flex max-w-xl gap-2 rounded-2xl bg-white/95 p-2 shadow-2xl backdrop-blur">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une ville, un pays..."
                    className="w-full border-0 bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Rechercher
                </button>
              </form>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {!isAuthenticated && (
                  <Link to="/register" className="btn bg-white text-brand-800 hover:bg-slate-100">
                    Créer un compte gratuit <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <Link to="/destinations" className="btn bg-white/10 text-white ring-1 ring-inset ring-white/40 hover:bg-white/20">
                  Explorer les destinations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-slate-900">Tout ce qu'il faut pour voyager mieux</h2>
            <p className="mt-3 text-slate-500">
              Une application complète, construite sur une architecture distribuée moderne.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                  <f.icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-hero-gradient py-20">
        <div className="absolute -right-24 -top-24 h-72 w-72 animate-float rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 animate-float rounded-full bg-white/10 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="container-app relative text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Prêt à planifier votre prochain voyage ?</h2>
          <p className="mt-3 text-white/80">Rejoignez GlobeTrotter et obtenez vos recommandations en 2 minutes.</p>
          <Link to={isAuthenticated ? '/recommendations' : '/register'} className="btn-primary mt-6 inline-flex bg-white !text-brand-800 hover:bg-slate-100">
            {isAuthenticated ? 'Voir mes recommandations' : 'Commencer gratuitement'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
