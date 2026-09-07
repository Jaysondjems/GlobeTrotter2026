import { useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Check, Share2 } from 'lucide-react';
import Modal from './Modal';

export default function ShareModal({ open, onClose, shareUrl }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Impossible de copier automatiquement');
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Partager cet itinéraire">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
          <Share2 className="h-6 w-6 text-brand-600" />
        </span>
        <p className="text-sm text-slate-500">
          Toute personne ayant ce lien peut consulter votre itinéraire, sans avoir besoin de compte.
        </p>
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
          <input readOnly value={shareUrl} className="flex-1 truncate bg-transparent px-2 text-sm text-slate-600 outline-none" />
          <button onClick={handleCopy} className="btn-primary !py-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copié' : 'Copier'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
