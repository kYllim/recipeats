"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    timerRef.current.delete(id);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      const timer = setTimeout(() => removeToast(id), 3500);
      timerRef.current.set(id, timer);
    },
    [removeToast]
  );

  useEffect(() => {
    const timers = timerRef.current;
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={[
              "pointer-events-auto flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg text-sm font-medium",
              "animate-toast-in",
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : toast.type === "error"
                  ? "bg-rose-500 text-white"
                  : "bg-zinc-800 text-white",
            ].join(" ")}
          >
            {toast.type === "success" && <span aria-hidden>✓</span>}
            {toast.type === "error" && <span aria-hidden>✕</span>}
            {toast.type === "info" && <span aria-hidden>ℹ</span>}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}