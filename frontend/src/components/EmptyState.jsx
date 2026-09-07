export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 py-16 px-6 text-center animate-fade-in">
      {Icon && (
        <div className="rounded-full bg-brand-50 p-4">
          <Icon className="h-7 w-7 text-brand-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  );
}
