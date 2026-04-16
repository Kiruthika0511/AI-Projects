import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, job }) {
  if (!isOpen || !job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg-modal-overlay)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      id="delete-confirm-overlay"
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl animate-scale-in p-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-modal)',
        }}
        id="delete-confirm-modal"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h3
            className="text-lg font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Delete this job?
          </h3>
          <p
            className="text-sm mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            <strong>{job.role}</strong> at <strong>{job.company}</strong>
          </p>
          <p
            className="text-xs mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              id="cancel-delete"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(job.id);
                onClose();
              }}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center gap-2"
              id="confirm-delete"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
