import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { EmptyState } from '../components/EmptyState';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trophy,
  MapPin,
  CheckCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const NotificationPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    language,
    showToast,
  } = usePlotNest();

  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((item) => {
    if (filterType === 'unread') return !item.read;
    if (filterType !== 'all') return item.type === filterType;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'lead_assigned':
        return <CheckCircle2 className="w-5 h-5 text-sky-600" />;
      case 'followup_overdue':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'feedback_due':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'lead_converted':
        return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 'plot_reserved':
        return <MapPin className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-[#14532D]" />
            <span>{language === 'hi' ? 'सूचना केंद्र' : 'Notification Center'}</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'hi'
              ? 'लीड असाइनमेंट, अतिदेय फॉलो-अप और विज़िट अलर्ट'
              : 'Real-time operational alerts for leads, overdue reminders, and conversions'}
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="touch-target px-4 py-2 rounded-xl bg-white border border-[#DDD5C8] hover:bg-gray-50 text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-[#14532D]" />
          <span>{language === 'hi' ? 'सभी को पढ़ा हुआ चिह्नित करें' : 'Mark All as Read'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E5DFD5]">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'lead_assigned', label: 'Lead Assigned' },
          { id: 'followup_overdue', label: 'Overdue Alerts' },
          { id: 'feedback_due', label: 'Visit Feedback' },
          { id: 'lead_converted', label: 'Conversions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`touch-target px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterType === tab.id
                ? 'bg-[#14532D] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <EmptyState
          title={language === 'hi' ? 'कोई सूचना नहीं' : 'No Notifications'}
          description="You are completely up to date with your farm sales activities."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                !item.read
                  ? 'bg-white border-emerald-300 shadow-md ring-1 ring-emerald-400/40'
                  : 'bg-white/80 border-[#E5DFD5] hover:bg-white shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="mt-1 p-2 rounded-xl bg-gray-50 shrink-0">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-gray-900">
                      {language === 'hi' ? item.hindiTitle : item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[11px] text-gray-400 mt-2 block font-medium">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Action Jump Button */}
              {item.relatedLeadId && (
                <Link
                  to={`/leads/${item.relatedLeadId}`}
                  className="touch-target px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold shrink-0 flex items-center gap-1 border border-emerald-200"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
