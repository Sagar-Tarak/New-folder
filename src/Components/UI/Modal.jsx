import React, { useEffect } from "react";

export default function Modal({ open, title, children, onClose }) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    globalThis.addEventListener("keydown", handleEsc);
    return () => globalThis.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center px-4 py-6 sm:px-6 bg-transparent"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop (softer) */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal (clean, smooth) */}
      <div className="relative w-full max-w-xl sm:max-w-2xl bg-white rounded-xl shadow-md transition-transform transform-gpu duration-150 ease-out overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header — title and close control aligned */}
        <div className="px-6 py-4 bg-transparent flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close modal"
              title="Close"
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-100 transition-colors duration-150"
            >
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>

        {/* Body: center children and keep them constrained */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col">
          <div className="w-full mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
