import React from 'react';
import { usePlotNest } from '../context/PlotNestContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePlotNest();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 bg-white transition-all transform animate-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'border-emerald-300 bg-[#F0FDF4]'
                : isError
                ? 'border-rose-300 bg-[#FFF1F2]'
                : 'border-amber-300 bg-[#FFFBEB]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4
                className={`font-bold text-sm ${
                  isSuccess ? 'text-emerald-950' : isError ? 'text-rose-950' : 'text-amber-950'
                }`}
              >
                {toast.title}
              </h4>
              <p
                className={`text-xs mt-0.5 leading-relaxed ${
                  isSuccess ? 'text-emerald-800' : isError ? 'text-rose-800' : 'text-amber-800'
                }`}
              >
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="touch-target p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/5"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
