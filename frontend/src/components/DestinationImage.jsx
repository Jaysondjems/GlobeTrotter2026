import { useState } from 'react';
import { getCategoryTheme } from '../lib/categoryTheme';

export default function DestinationImage({ category, name, className = '' }) {
  const theme = getCategoryTheme(category);
  const Icon = theme.icon;
  const [errored, setErrored] = useState(false);

  if (!theme.image || errored) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br ${theme.gradient} ${className}`}>
        <Icon className="h-10 w-10 text-white/90" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={theme.image}
      alt={name}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`object-cover ${className}`}
    />
  );
}
