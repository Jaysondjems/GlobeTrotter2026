import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <Compass className="h-12 w-12 text-brand-400" />
      <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
      <p className="text-slate-500">Cette page n'existe pas.</p>
      <Link to="/" className="btn-primary mt-2">
        Retour à l'accueil
      </Link>
    </div>
  );
}
