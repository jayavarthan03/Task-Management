import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem = ({ toast, onClose }) => {
  const { id, message, type } = toast;

  const styles = {
    success: {
      bg: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
    },
    error: {
      bg: 'bg-rose-950/80 border-rose-500/30 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
    },
    warning: {
      bg: 'bg-amber-950/80 border-amber-500/30 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
    },
    info: {
      bg: 'bg-blue-950/80 border-blue-500/30 text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl pointer-events-auto ${currentStyle.bg}`}
    >
      <div className="flex items-center gap-3">
        {currentStyle.icon}
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-dark-400 hover:text-dark-100 transition-colors p-1 rounded-lg hover:bg-dark-800/40"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
