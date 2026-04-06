import { createContext, useState } from "react";

 const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-800 text-slate-100 px-4 py-2 rounded-md shadow-lg border border-slate-700 transition-all duration-300 animate-fade-in">
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
};
export default ToastContext