import Modal from './Modal'

export default function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" className="btn" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="button" className="btn-primary" onClick={onConfirm} disabled={busy}>
          {busy ? 'Saving...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
