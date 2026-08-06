import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, toast.duration || 5000);
    }
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastColors = {
  success: 'bg-success/20 border-success/30 text-success',
  error: 'bg-danger/20 border-danger/30 text-danger',
  warning: 'bg-warning/20 border-warning/30 text-warning',
  info: 'bg-accent/20 border-accent/30 text-accent',
};

export const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type];
          const colorClass = toastColors[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`glass ${colorClass} border rounded-lg p-4 min-w-80 max-w-sm`}
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export const useToast = () => {
  const { addToast, removeToast, clearToasts } = useToastStore();

  return {
    toast: (message: string, type: ToastType = 'info', duration?: number) => {
      addToast({ message, type, duration });
    },
    success: (message: string, duration?: number) => {
      addToast({ message, type: 'success', duration });
    },
    error: (message: string, duration?: number) => {
      addToast({ message, type: 'error', duration });
    },
    warning: (message: string, duration?: number) => {
      addToast({ message, type: 'warning', duration });
    },
    info: (message: string, duration?: number) => {
      addToast({ message, type: 'info', duration });
    },
    dismiss: (id: string) => {
      removeToast(id);
    },
    clear: () => {
      clearToasts();
    },
  };
};
