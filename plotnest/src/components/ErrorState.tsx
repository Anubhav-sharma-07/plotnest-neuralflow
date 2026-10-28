import React from 'react';
import { AlertCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { usePlotNest } from '../context/PlotNestContext';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: 'general' | 'upload';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  type = 'general',
}) => {
  const { language, t } = usePlotNest();

  const defaultTitle =
    type === 'upload'
      ? language === 'hi'
        ? 'दस्तावेज़ अपलोड विफल'
        : 'Upload Failed'
      : language === 'hi'
      ? 'कुछ गड़बड़ हुई'
      : 'Something went wrong';

  const defaultMessage =
    type === 'upload'
      ? language === 'hi'
        ? 'सर्वर से संपर्क नहीं हो सका या फ़ाइल प्रारूप अमान्य है। कृपया पुनः प्रयास करें।'
        : 'Network timeout while uploading document receipt. Please try again.'
      : language === 'hi'
      ? 'डेटा लोड करने में अस्थायी समस्या आई। कृपया पुनः प्रयास करें।'
      : 'We encountered an error loading this section. Please try again.';

  return (
    <div
      role="alert"
      className="p-8 sm:p-10 my-4 text-center rounded-3xl bg-rose-50/80 border-2 border-rose-200 shadow-xs max-w-lg mx-auto"
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center mb-4 shadow-inner">
        {type === 'upload' ? (
          <AlertTriangle className="w-8 h-8 text-rose-600" />
        ) : (
          <AlertCircle className="w-8 h-8 text-rose-600" />
        )}
      </div>

      <h3 className="text-xl font-black text-rose-950">
        {title || defaultTitle}
      </h3>
      <p className="text-sm text-rose-800 mt-2 leading-relaxed">
        {message || defaultMessage}
      </p>

      {onRetry && (
        <div className="mt-6">
          <button
            onClick={onRetry}
            className="touch-target px-6 py-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 mx-auto cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{type === 'upload' ? (language === 'hi' ? 'पुनः अपलोड करें' : 'Retry Upload') : (language === 'hi' ? 'फिर कोशिश करें' : 'Try Again')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
