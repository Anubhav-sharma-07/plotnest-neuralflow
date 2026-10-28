import React from 'react';
import {
  LeadStatus,
  PlotStatus,
  BookingStatus,
  PaymentStatus,
  CommissionStatus,
} from '../types';
import { usePlotNest } from '../context/PlotNestContext';
import {
  Sparkles,
  UserCheck,
  PhoneCall,
  Clock,
  Calendar,
  CheckCircle2,
  Trophy,
  XCircle,
  Ban,
  Tag,
  Lock,
  Bookmark,
  Receipt,
  Wallet,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export type StatusBadgeType = 'lead' | 'plot' | 'booking' | 'payment' | 'commission';

interface StatusBadgeProps {
  status: LeadStatus | PlotStatus | BookingStatus | PaymentStatus | CommissionStatus | string;
  type?: StatusBadgeType;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'lead',
  size = 'md',
}) => {
  const { language } = usePlotNest();

  const getLeadConfig = () => {
    switch (status as LeadStatus) {
      case 'new':
        return {
          labelEn: 'New Lead',
          labelHi: 'नई लीड',
          icon: Sparkles,
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'assigned':
        return {
          labelEn: 'Assigned',
          labelHi: 'सौंपा गया',
          icon: UserCheck,
          bg: 'bg-sky-50 text-sky-900 border-sky-300',
          dot: 'bg-sky-600',
        };
      case 'contacted':
        return {
          labelEn: 'Contacted',
          labelHi: 'संपर्क किया',
          icon: PhoneCall,
          bg: 'bg-indigo-50 text-indigo-900 border-indigo-300',
          dot: 'bg-indigo-600',
        };
      case 'follow_up':
        return {
          labelEn: 'Follow-up Due',
          labelHi: 'फॉलो-अप जारी',
          icon: Clock,
          bg: 'bg-amber-50 text-amber-950 border-amber-300',
          dot: 'bg-amber-600',
        };
      case 'visit_scheduled':
        return {
          labelEn: 'Visit Scheduled',
          labelHi: 'विज़िट निर्धारित',
          icon: Calendar,
          bg: 'bg-purple-50 text-purple-900 border-purple-300',
          dot: 'bg-purple-600',
        };
      case 'visit_completed':
        return {
          labelEn: 'Visit Completed',
          labelHi: 'विज़िट पूर्ण',
          icon: CheckCircle2,
          bg: 'bg-teal-50 text-teal-900 border-teal-300',
          dot: 'bg-teal-600',
        };
      case 'converted':
        return {
          labelEn: 'Converted to Sale',
          labelHi: 'बिक्री में परिवर्तित',
          icon: Trophy,
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold',
          dot: 'bg-emerald-700',
        };
      case 'closed_lost':
        return {
          labelEn: 'Closed - Lost',
          labelHi: 'खोया हुआ (Lost)',
          icon: XCircle,
          bg: 'bg-stone-100 text-stone-800 border-stone-300',
          dot: 'bg-stone-600',
        };
      case 'invalid_rejected':
        return {
          labelEn: 'Invalid / Rejected',
          labelHi: 'अमान्य / अस्वीकृत',
          icon: Ban,
          bg: 'bg-rose-50 text-rose-900 border-rose-300',
          dot: 'bg-rose-600',
        };
      default:
        return {
          labelEn: String(status),
          labelHi: String(status),
          icon: Tag,
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          dot: 'bg-gray-500',
        };
    }
  };

  const getPlotConfig = () => {
    switch (status as PlotStatus) {
      case 'available':
        return {
          labelEn: 'Available',
          labelHi: 'उपलब्ध',
          icon: CheckCircle2,
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'reservation_pending':
        return {
          labelEn: 'Reservation Pending',
          labelHi: 'रिज़र्वेशन लंबित',
          icon: Clock,
          bg: 'bg-amber-50 text-amber-950 border-amber-300',
          dot: 'bg-amber-600',
        };
      case 'booked':
        return {
          labelEn: 'Booked',
          labelHi: 'बुक्ड (Booked)',
          icon: Bookmark,
          bg: 'bg-blue-50 text-blue-900 border-blue-300',
          dot: 'bg-blue-600',
        };
      case 'sold':
        return {
          labelEn: 'Sold',
          labelHi: 'बिक्री पूर्ण',
          icon: Trophy,
          bg: 'bg-rose-50 text-rose-900 border-rose-300',
          dot: 'bg-rose-600',
        };
      case 'blocked':
        return {
          labelEn: 'Blocked',
          labelHi: 'अवरुद्ध',
          icon: Lock,
          bg: 'bg-stone-100 text-stone-800 border-stone-300',
          dot: 'bg-stone-600',
        };
      default:
        return {
          labelEn: String(status),
          labelHi: String(status),
          icon: Tag,
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          dot: 'bg-gray-400',
        };
    }
  };

  const getBookingConfig = () => {
    switch (status as BookingStatus) {
      case 'no_booking':
        return {
          labelEn: 'No Booking',
          labelHi: 'कोई बुकिंग नहीं',
          icon: Clock,
          bg: 'bg-gray-50 text-gray-700 border-gray-300',
          dot: 'bg-gray-400',
        };
      case 'requested':
        return {
          labelEn: 'Request Received, Not Confirmed',
          labelHi: 'अनुरोध प्राप्त, पुष्टि प्रतीक्षित',
          icon: Clock,
          bg: 'bg-amber-50 text-amber-900 border-amber-400 font-semibold',
          dot: 'bg-amber-600',
        };
      case 'confirmed':
        return {
          labelEn: 'Booking Confirmed',
          labelHi: 'बुकिंग पुष्ट',
          icon: CheckCircle2,
          bg: 'bg-blue-50 text-blue-900 border-blue-400 font-semibold',
          dot: 'bg-blue-600',
        };
      case 'cancelled':
        return {
          labelEn: 'Booking Cancelled',
          labelHi: 'बुकिंग रद्द',
          icon: XCircle,
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-600',
        };
      default:
        return {
          labelEn: String(status),
          labelHi: String(status),
          icon: Bookmark,
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          dot: 'bg-gray-400',
        };
    }
  };

  const getPaymentConfig = () => {
    switch (status as PaymentStatus) {
      case 'pending_token':
        return {
          labelEn: 'Payment: Pending Token',
          labelHi: 'भुगतान: टोकन प्रतीक्षित',
          icon: Receipt,
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'token_received':
        return {
          labelEn: 'Payment: Token Received',
          labelHi: 'भुगतान: टोकन प्राप्त',
          icon: Receipt,
          bg: 'bg-sky-50 text-sky-900 border-sky-300',
          dot: 'bg-sky-600',
        };
      case 'advance_paid':
        return {
          labelEn: 'Payment: Advance Paid (60%)',
          labelHi: 'भुगतान: 60% अग्रिम प्राप्त',
          icon: Receipt,
          bg: 'bg-indigo-50 text-indigo-900 border-indigo-300 font-semibold',
          dot: 'bg-indigo-600',
        };
      case 'fully_paid':
        return {
          labelEn: 'Payment: Fully Paid (100%)',
          labelHi: 'भुगतान: 100% पूर्ण',
          icon: CheckCircle2,
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold',
          dot: 'bg-emerald-700',
        };
      case 'refunded':
        return {
          labelEn: 'Payment: Refunded',
          labelHi: 'भुगतान: धनवापसी',
          icon: RotateCcw,
          bg: 'bg-stone-100 text-stone-800 border-stone-300',
          dot: 'bg-stone-500',
        };
      default:
        return {
          labelEn: String(status),
          labelHi: String(status),
          icon: Receipt,
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          dot: 'bg-gray-400',
        };
    }
  };

  const getCommissionConfig = () => {
    switch (status as CommissionStatus) {
      case 'estimated':
        return {
          labelEn: 'Commission: Estimated',
          labelHi: 'कमीशन: अनुमानित',
          icon: Wallet,
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'eligible':
        return {
          labelEn: 'Commission: Eligible',
          labelHi: 'कमीशन: योग्य',
          icon: Wallet,
          bg: 'bg-sky-50 text-sky-900 border-sky-300',
          dot: 'bg-sky-600',
        };
      case 'approved':
        return {
          labelEn: 'Commission: Approved',
          labelHi: 'कमीशन: स्वीकृत',
          icon: ShieldCheck,
          bg: 'bg-indigo-50 text-indigo-900 border-indigo-300 font-semibold',
          dot: 'bg-indigo-600',
        };
      case 'paid':
        return {
          labelEn: 'Commission: Paid',
          labelHi: 'कमीशन: प्रदत्त',
          icon: Trophy,
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold',
          dot: 'bg-emerald-700',
        };
      default:
        return {
          labelEn: String(status),
          labelHi: String(status),
          icon: Wallet,
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          dot: 'bg-gray-400',
        };
    }
  };

  const getConfig = () => {
    switch (type) {
      case 'plot':
        return getPlotConfig();
      case 'booking':
        return getBookingConfig();
      case 'payment':
        return getPaymentConfig();
      case 'commission':
        return getCommissionConfig();
      default:
        return getLeadConfig();
    }
  };

  const config = getConfig();
  const Icon = config.icon;
  const label = language === 'hi' ? config.labelHi : config.labelEn;

  const sizeClass =
    size === 'sm'
      ? 'text-xs px-2.5 py-0.5 gap-1.5'
      : size === 'lg'
      ? 'text-base px-3.5 py-1.5 gap-2'
      : 'text-sm px-3 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClass}`}
      role="status"
      aria-label={`${type} status: ${label}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} aria-hidden="true" />
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
};
