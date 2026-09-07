import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Search,
  Sparkles,
  MapPinned,
  Share2,
  ShieldCheck,
  Gauge,
  ArrowRight,
  Heart,
  Globe2,
  Users,
  Award,
  Zap,
  Lock,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Carousel from '../components/Carousel';
import Reveal from '../components/Reveal';
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
  { icon: Search, title: 'Recherche intelligente', text: 'Filtrez des dizaines de destinations par catégorie, pays et budget en quelques clics.' },
  { icon: Sparkles, title: 'Recommandations personnalisées', text: 'Un score explicable basé sur vos préférences, votre historique et la popularité.' },
  { icon: MapPinned, title: 'Itinéraires sur-mesure', text: 'Composez votre voyage jour par jour et gardez tout organisé au même endroit.' },
  { icon: Heart, title: 'Favoris', text: 'Enregistrez vos destinations coup de cœur pour les retrouver en un instant.' },
  { icon: Share2, title: 'Partage instantané', text: 'Générez un lien public pour partager votre itinéraire avec vos proches.' },
  { icon: Gauge, title: 'Rapide et résilient', text: 'Architecture microservices avec cache et circuit breakers pour rester disponible.' },
];

const WHY_US = [
  { icon: Award, title: 'Recommandations sur-mesure', text: 'Notre algorithme apprend de vos préférences et de votre historique pour ne vous proposer que des destinations pertinentes.' },
  { icon: Zap, title: 'Rapide, même sous forte charge', text: 'Cache intelligent et mise à l’échelle automatique : l’application reste fluide, même avec des milliers d’utilisateurs.' },
  { icon: Lock, title: 'Vos données protégées', text: 'Authentification sécurisée (JWT) et mots de passe chiffrés (bcrypt) : votre compte et vos itinéraires restent privés.' },
  { icon: HeartHandshake, title: 'Un accompagnement humain', text: 'Une question ? Notre équipe répond en direct sur WhatsApp, sans détour.' },
];

const STATS = [
  { icon: Globe2, value: '25+', label: 'Destinations à explorer' },
  { icon: Users, value: '8+', label: 'Voyageurs déjà inscrits' },
  { icon: Sparkles, value: '100%', label: 'Recommandations personnalisées' },
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
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-slate-900">
        <Carousel
          className="h-full w-full"
          slides={HERO_SLIDES}
          autoPlayMs={5500}
          renderSlide={(slide) => (
            <div className="relative h-full w-full">
              <img src={slide.image} alt={slide.label} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-navy-radial" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-950/85 via-brand-950/20 to-transparent" />
            </div>
          )}
        />

        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div className="container-app">
            <div className="pointer-events-auto max-w-2xl animate-fade-in-up">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur">
                <Sparkles className="h-4 w-4 text-accent-400" /> Votre prochaine aventure commence ici
              </span>
              <h1 className="text-5xl font-extrabold tracking-tight text-white text-shadow sm:text-7xl">
                Explorez le monde,
                <br />
                <span className="text-gradient bg-gradient-to-r from-accent-300 via-brand-200 to-white bg-clip-text">
                  un itinéraire à la fois
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-xl text-white/85 text-shadow">
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
                    className="w-full border-0 bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
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

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container-app grid grid-cols-1 gap-4 pb-8 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur-md animate-fade-in-up">
                <s.icon className="h-8 w-8 text-accent-300" />
                <div>
                  <p className="text-2xl font-extrabold">{s.value}</p>
                  <p className="text-sm text-white/75">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative bg-white py-24">
        <div className="container-app grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-ocean-gradient opacity-20 blur-2xl" />
              <img
                src={CATEGORY_THEME.beach.image}
                alt="À propos de GlobeTrotter"
                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-glow-lg"
              />
              <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-white p-5 shadow-glow-lg sm:block">
                <p className="text-3xl font-extrabold text-gradient">4</p>
                <p className="text-sm text-slate-500">phases d'architecture</p>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={100}>
            <span className="badge bg-brand-50 text-brand-700">À propos</span>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
              Une plateforme pensée pour les voyageurs curieux
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              GlobeTrotter est née d'une idée simple : planifier un voyage devrait être aussi
              excitant que le voyage lui-même. Plutôt que de jongler entre dix onglets pour
              chercher une destination, comparer un budget et organiser un itinéraire, nous avons
              réuni tout cela dans une seule application, intelligente et agréable à utiliser.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Derrière l'interface, une architecture distribuée moderne (microservices, cache,
              résilience) garantit une expérience rapide et fiable, quelle que soit la charge.
            </p>
            <Link to="/destinations" className="btn-secondary mt-6 inline-flex">
              Découvrir les destinations <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative bg-slate-50 py-24">
        <div className="container-app">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="badge bg-brand-50 text-brand-700">Fonctionnalités</span>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Tout ce qu'il faut pour voyager mieux</h2>
            <p className="mt-3 text-lg text-slate-500">
              Une application complète, construite sur une architecture distribuée moderne.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} variant="scale" delay={i * 80}>
                <div className="card group h-full p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-gradient text-white shadow-soft transition-transform duration-300 group-hover:scale-110">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-slate-500">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative overflow-hidden bg-brand-950 py-24">
        <div className="absolute inset-0 bg-mesh-radial" />
        <div className="absolute -left-32 top-1/4 h-80 w-80 animate-float rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 animate-float rounded-full bg-accent-500/20 blur-3xl" style={{ animationDelay: '3s' }} />

        <div className="container-app relative">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="badge bg-white/10 text-white ring-1 ring-white/20">Pourquoi nous choisir</span>
            <h2 className="mt-3 text-4xl font-extrabold text-white">Conçu pour être fiable, rapide et sûr</h2>
            <p className="mt-3 text-lg text-white/70">
              Quatre raisons pour lesquelles des voyageurs nous font confiance pour organiser leurs aventures.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {WHY_US.map((w, i) => (
              <Reveal key={w.title} variant={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}>
                <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-white/10">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-300">
                    <w.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{w.title}</h3>
                    <p className="mt-1.5 text-white/70">{w.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-hero-gradient bg-[length:200%_200%] py-24 animate-gradient-shift">
        <div className="absolute -right-24 -top-24 h-72 w-72 animate-float rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 animate-float rounded-full bg-white/10 blur-3xl" style={{ animationDelay: '2s' }} />
        <Reveal variant="scale" className="container-app relative text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-accent-300" />
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">Prêt à planifier votre prochain voyage ?</h2>
          <p className="mt-3 text-lg text-white/80">Rejoignez GlobeTrotter et obtenez vos recommandations en 2 minutes.</p>
          <Link to={isAuthenticated ? '/recommendations' : '/register'} className="btn-primary mt-7 inline-flex !bg-white !text-brand-800 hover:!bg-slate-100">
            {isAuthenticated ? 'Voir mes recommandations' : 'Commencer gratuitement'} <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
