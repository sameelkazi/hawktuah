
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const icons = {
    success: <CheckCircle size={20} className="text-green-500 dark:text-green-400" />,
    error: <AlertCircle size={20} className="text-red-500 dark:text-red-400" />,
    warning: <AlertTriangle size={20} className="text-orange-500 dark:text-orange-400" />,
    info: <Info size={20} className="text-blue-500 dark:text-blue-400" />
  };

  const styles = {
    success: 'border-green-500/20 bg-green-50/90 dark:bg-green-900/40',
    error: 'border-red-500/20 bg-red-50/90 dark:bg-red-900/40',
    warning: 'border-orange-500/20 bg-orange-50/90 dark:bg-orange-900/40',
    info: 'border-blue-500/20 bg-blue-50/90 dark:bg-blue-900/40'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      layout
      className={`pointer-events-auto min-w-[320px] max-w-md p-4 rounded-xl backdrop-blur-md border shadow-lg flex items-center gap-3 ${styles[toast.type]}`}
    >
      <div className="shrink-0">
        {icons[toast.type]}
      </div>
      <p className="text-sm font-medium text-slate-900 dark:text-white flex-1">{toast.message}</p>
      <button 
        onClick={() => onRemove(toast.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
