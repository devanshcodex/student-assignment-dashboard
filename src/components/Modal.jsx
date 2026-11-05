import { useEffect, useRef } from 'react'

// Native <dialog>: gives focus trapping, Esc to close and aria-modal for free.
export default function Modal({ title, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => { ref.current.showModal() }, [])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/60 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="max-h-[85vh] overflow-y-auto p-5">
        <h2 id="modal-title" className="mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </dialog>
  )
}
