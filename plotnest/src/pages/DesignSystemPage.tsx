import React, { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ListSkeleton } from '../components/SkeletonLoader';
import {
  Palette,
  Type,
  MousePointerClick,
  CheckCircle2,
  Sparkles,
  Shield,
  Layers,
  Sliders,
  Phone,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  const [testInput, setTestInput] = useState('');
  const [showSkeletonDemo, setShowSkeletonDemo] = useState(false);

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          <Palette className="w-3.5 h-3.5 text-[#14532D]" />
          <span>PlotNest Design System Specification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Brand Architecture & Visual Language
        </h1>
        <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
          Crafted for high trust, mixed-literacy usability, and rural-meets-modern aesthetics.
          Anchored by deep forestry green (<code className="text-[#14532D] font-mono font-bold">#14532D</code>),
          warm sand neutral surfaces (<code className="text-stone-700 font-mono font-bold">#FAF8F5</code>),
          large 48px touch targets, dual-signal status indicators, and full WCAG AA contrast compliance.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <span>1. Color Tokens & Semantic Contrast</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-[#14532D] text-white shadow-xs space-y-3">
            <span className="text-xs font-bold text-emerald-300 uppercase block">Primary Green</span>
            <div>
              <p className="font-mono text-sm font-extrabold">#14532D</p>
              <p className="text-[11px] text-emerald-200">Deep Forest / Brand Core</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#166534] text-white shadow-xs space-y-3">
            <span className="text-xs font-bold text-emerald-300 uppercase block">Emerald Dark</span>
            <div>
              <p className="font-mono text-sm font-extrabold">#166534</p>
              <p className="text-[11px] text-emerald-200">Interactive Hover</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] text-gray-900 shadow-xs space-y-3">
            <span className="text-xs font-bold text-stone-600 uppercase block">Warm Sand Base</span>
            <div>
              <p className="font-mono text-sm font-extrabold text-stone-900">#FAF8F5</p>
              <p className="text-[11px] text-stone-500">App Canvas Neutral</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#E5DFD5] text-stone-900 shadow-xs space-y-3">
            <span className="text-xs font-bold text-stone-700 uppercase block">Sand Border</span>
            <div>
              <p className="font-mono text-sm font-extrabold">#E5DFD5</p>
              <p className="text-[11px] text-stone-600">Card Boundaries</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#CA8A04] text-white shadow-xs space-y-3">
            <span className="text-xs font-bold text-yellow-100 uppercase block">Agri Gold Accent</span>
            <div>
              <p className="font-mono text-sm font-extrabold">#CA8A04</p>
              <p className="text-[11px] text-yellow-100">Timber & Highlights</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-900 shadow-xs space-y-3">
            <span className="text-xs font-bold text-gray-500 uppercase block">Card White</span>
            <div>
              <p className="font-mono text-sm font-extrabold">#FFFFFF</p>
              <p className="text-[11px] text-gray-500">Elevated Containers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Typography Scale (Min 16px body) */}
      <section className="p-6 rounded-3xl bg-white border border-[#E5DFD5] space-y-4 shadow-xs">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Type className="w-5 h-5 text-emerald-700" />
          <span>2. Mixed-Literacy Typography Scale</span>
        </h2>
        <p className="text-xs text-gray-500">
          Enforces minimum 16px font sizes on primary body copy so agricultural investors, senior patrons, and field staff can read effortlessly.
        </p>

        <div className="space-y-4 pt-2 divide-y divide-gray-100">
          <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <span className="text-xs text-gray-400 font-mono w-28">Heading 1 (36px+)</span>
            <span className="text-3xl sm:text-4xl font-black text-[#14532D]">
              Green Acres Valley Farmlands
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <span className="text-xs text-gray-400 font-mono w-28">Heading 2 (24px)</span>
            <span className="text-2xl font-black text-gray-900">
              Interactive Plot Map & Soil Tests
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <span className="text-xs text-gray-400 font-mono w-28">Body Regular (16px)</span>
            <p className="text-base text-gray-700 max-w-xl leading-relaxed">
              Red loamy fertile soil with automated drip irrigation lines, registered RTC mutation, and sweet potable drinking water.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <span className="text-xs text-gray-400 font-mono w-28">Devanagari (Hindi)</span>
            <p className="text-base font-bold text-gray-800 font-devanagari">
              स्पष्ट 7/12 उतारा, 24/7 पानी व ड्रिप सिंचाई, और वीकेंड फार्महाउस कुटीर।
            </p>
          </div>
        </div>
      </section>

      {/* 3. Five Distinct Status Chip Categories */}
      <section className="p-6 rounded-3xl bg-white border border-[#E5DFD5] space-y-5 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-gray-900">
            3. The 5 Status Chip Categories (Dual-Signal: Color + Icon + Label)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Status is NEVER conveyed by color alone. Every badge pairs accessible contrast with dedicated icons and text labels.
          </p>
        </div>

        {/* Category A: Lead Status */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Category A: Lead Status (CRM Progression)
          </span>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="new" type="lead" size="md" />
            <StatusBadge status="assigned" type="lead" size="md" />
            <StatusBadge status="contacted" type="lead" size="md" />
            <StatusBadge status="follow_up" type="lead" size="md" />
            <StatusBadge status="visit_scheduled" type="lead" size="md" />
            <StatusBadge status="visit_completed" type="lead" size="md" />
            <StatusBadge status="converted" type="lead" size="md" />
            <StatusBadge status="closed_lost" type="lead" size="md" />
            <StatusBadge status="invalid_rejected" type="lead" size="md" />
          </div>
        </div>

        {/* Category B: Plot Status */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Category B: Plot Map Status
          </span>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="available" type="plot" size="md" />
            <StatusBadge status="reservation_pending" type="plot" size="md" />
            <StatusBadge status="booked" type="plot" size="md" />
            <StatusBadge status="sold" type="plot" size="md" />
            <StatusBadge status="blocked" type="plot" size="md" />
          </div>
        </div>

        {/* Category C: Booking Status (Domain Rule) */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Category C: Booking Status (Separate Milestone Chip)
          </span>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="no_booking" type="booking" size="md" />
            <StatusBadge status="requested" type="booking" size="md" />
            <StatusBadge status="confirmed" type="booking" size="md" />
            <StatusBadge status="cancelled" type="booking" size="md" />
          </div>
        </div>

        {/* Category D: Payment Status */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Category D: Payment Milestone Status
          </span>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="pending_token" type="payment" size="md" />
            <StatusBadge status="token_received" type="payment" size="md" />
            <StatusBadge status="advance_paid" type="payment" size="md" />
            <StatusBadge status="fully_paid" type="payment" size="md" />
            <StatusBadge status="refunded" type="payment" size="md" />
          </div>
        </div>

        {/* Category E: Commission Status */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Category E: Agent & Channel Commission Status
          </span>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="estimated" type="commission" size="md" />
            <StatusBadge status="eligible" type="commission" size="md" />
            <StatusBadge status="approved" type="commission" size="md" />
            <StatusBadge status="paid" type="commission" size="md" />
          </div>
        </div>
      </section>

      {/* 4. Touch Targets & Buttons (Min 48px) */}
      <section className="p-6 rounded-3xl bg-white border border-[#E5DFD5] space-y-4 shadow-xs">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <MousePointerClick className="w-5 h-5 text-emerald-700" />
          <span>4. Minimum 48px Touch Target Buttons</span>
        </h2>
        <p className="text-xs text-gray-500">
          Optimized for single-handed mobile field operation with high-contrast text and 200ms spring feedback.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Primary */}
          <button className="touch-target px-6 py-3 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-extrabold text-sm shadow-md transition-all active:scale-95">
            Primary Action (48px)
          </button>

          {/* Secondary */}
          <button className="touch-target px-5 py-3 rounded-2xl bg-white hover:bg-gray-50 border border-[#DCD5C8] text-gray-800 font-bold text-sm shadow-xs transition-all active:scale-95">
            Secondary Button
          </button>

          {/* WhatsApp Direct */}
          <button className="touch-target px-5 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95">
            <MessageSquare className="w-5 h-5 text-emerald-200" />
            <span>WhatsApp Quick Link</span>
          </button>

          {/* Call Direct */}
          <button className="touch-target px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-extrabold text-sm flex items-center gap-2 transition-all active:scale-95">
            <Phone className="w-5 h-5 text-emerald-700" />
            <span>Call Customer</span>
          </button>

          {/* Destructive */}
          <button className="touch-target px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-bold text-sm transition-all active:scale-95">
            Mark as Lost
          </button>
        </div>
      </section>

      {/* 5. Input Fields & Focus Rings */}
      <section className="p-6 rounded-3xl bg-white border border-[#E5DFD5] space-y-4 shadow-xs">
        <h2 className="text-xl font-black text-gray-900">5. Form Inputs & Accessibility Focus Rings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Buyer Full Name
            </label>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="e.g. Anand Mahindra"
              className="touch-target w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Select Farmland Project
            </label>
            <select className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#14532D]">
              <option>Green Acres Valley (Hosur)</option>
              <option>Vedic Farms & Orchards (Pune)</option>
              <option>Sahyadri Agro Haven (Karjat)</option>
            </select>
          </div>
        </div>
      </section>

      {/* 6. Empty, Loading, and Error States */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              6. Empty, Loading & Error State Components
            </h2>
            <p className="text-xs text-gray-500">
              Tested across network interruptions and zero-data cold starts.
            </p>
          </div>
          <button
            onClick={() => setShowSkeletonDemo(!showSkeletonDemo)}
            className="text-xs font-bold text-[#14532D] underline"
          >
            {showSkeletonDemo ? 'Show Static Cards' : 'Test Skeleton Loading'}
          </button>
        </div>

        {showSkeletonDemo ? (
          <div className="p-6 bg-white rounded-3xl border border-[#E5DFD5]">
            <ListSkeleton count={3} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-[#E5DFD5] p-2">
              <EmptyState
                title="No Inquiries Assigned"
                description="Your daily follow-up queue is completely clear. Grab fresh leads from the Assignment Queue."
                actionText="+ View Assignment Queue"
                onAction={() => {}}
              />
            </div>

            <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 flex items-center justify-center">
              <ErrorState
                title="Unable to Sync Soil Mutation Data"
                message="Government land registry server timed out. Tap retry to attempt reconnection."
                onRetry={() => {}}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
