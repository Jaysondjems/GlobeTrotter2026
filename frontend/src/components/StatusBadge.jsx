const STATUS_STYLES = {
  DRAFT: 'bg-slate-100 text-slate-600',
  PLANNED: 'bg-blue-100 text-blue-700',
  ONGOING: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
};

const STATUS_LABELS = {
  DRAFT: 'Brouillon',
  PLANNED: 'Planifié',
  ONGOING: 'En cours',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_STYLES[status] || STATUS_STYLES.DRAFT}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
