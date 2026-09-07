import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-app flex flex-col items-center justify-between gap-3 py-8 text-sm text-slate-500 sm:flex-row">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <Compass className="h-4 w-4 text-brand-600" />
          GlobeTrotter
        </div>
        <p>Projet academique - architecture microservices (Phases 1 a 4).</p>
      </div>
    </footer>
  );
}
