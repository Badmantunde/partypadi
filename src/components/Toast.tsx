"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 p-4 bg-[#11120F] text-[#F5F5F0] border border-black/20 shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
          >
            {toast.type === "success" && (
              <span className="w-2.5 h-2.5 mt-1 bg-[#C5FF35] shrink-0" />
            )}
            {toast.type === "error" && (
              <span className="w-2.5 h-2.5 mt-1 bg-red-500 shrink-0" />
            )}
            {toast.type === "info" && (
              <span className="w-2.5 h-2.5 mt-1 bg-white shrink-0" />
            )}

            <div className="flex-1">
              <p className="text-xs font-mono font-medium tracking-tight uppercase">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-xs text-[#DADBD4] mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8E8F89] hover:text-white transition-colors p-0.5"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
