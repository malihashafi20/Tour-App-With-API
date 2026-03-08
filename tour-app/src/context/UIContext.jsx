// src/context/UIContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const timerRef = useRef(null);

  const showToast = (msg, type = 'info', timeout = 2500) => {
    setQueue((q) => [...q, { id: Date.now(), msg, type, timeout }]);
  };

  useEffect(() => {
    if (!queue.length) return;
    const current = queue[0];
    timerRef.current = setTimeout(() => {
      setQueue((q) => q.slice(1));
    }, current.timeout);
    return () => clearTimeout(timerRef.current);
  }, [queue]);

  const toast = queue[0] || null;

  return (
    <UIContext.Provider value={{ toast, showToast }}>
      {children}
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow bg-white border border-slate-200"
        >
          <span className={`font-semibold ${toast.type === 'error' ? 'text-rose-600' : 'text-sky-700'}`}>
            {toast.msg}
          </span>
        </div>
      )}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
