import React, { useEffect } from "react";

export default function Modal({ open, title, children, onClose }) {
  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[999] flex items-center justify-center 
        px-3 py-6 sm:px-6 
        bg-black/20 backdrop-blur-[2px]
      "
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal Box */}
      <div
        className="
          relative w-full 
          max-w-md sm:max-w-lg lg:max-w-2xl 
          bg-white rounded-xl shadow-xl
          max-h-[90vh] flex flex-col 
          transition-transform animate-in fade-in zoom-in-50 duration-150
        "
      >
        {/* Header */}
        <div
          className="
            px-4 sm:px-6 py-4 
            flex items-center justify-between 
            border-b border-slate-100
          "
        >
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 break-words">
            {title}
          </h3>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="
              w-9 h-9 flex items-center justify-center 
              rounded-full text-slate-600 
              hover:text-slate-800 hover:bg-slate-100 
              transition
            "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
