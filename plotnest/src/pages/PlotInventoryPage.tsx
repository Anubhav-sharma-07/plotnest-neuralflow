import React, { useState, useEffect } from 'react';
import { usePlotNest } from '../context/PlotNestContext';
import { Plot, PlotStatus, BookingRequest } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ErrorState } from '../components/ErrorState';
import { PlotMapSkeleton } from '../components/SkeletonLoader';
import { canReservePlot, formatINR, formatTimeRemaining } from '../utils/rules';
import { mockProjects } from '../data/mockData';
import {
  MapPin,
  Compass,
  Layers,
  Lock,
  Clock,
  User,
  ShieldAlert,
  Calendar,
  FastForward,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  X,
  FileCheck,
} from 'lucide-react';

export const PlotInventoryPage: React.FC = () => {
  const {
    plots,
    role,
    reservePlot,
    requestPlotBooking,
    bookingRequests,
    approveBookingRequest,
    rejectBookingRequest,
    fastForward24Hours,
    language,
    showToast,
    simulateError,
    setSimulateError,
  } = usePlotNest();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(() => plots[0] || null);
  const [activeProject, setActiveProject] = useState<string>(mockProjects[0].id);

  // Customer Request Plot Modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [customerName, setCustomerName] = useState('Ramesh K. Patel');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 99110');
  const [customerNote, setCustomerNote] = useState('');

  // Staff Review Tab/Toggle
  const [showRequestsDrawer, setShowRequestsDrawer] = useState(false);
  const [rejectModalReq, setRejectModalReq] = useState<BookingRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('Already earmarked for another buyer');

  // Keep selectedPlot synced with latest plots array
  useEffect(() => {
    if (selectedPlot) {
      const updated = plots.find((p) => p.id === selectedPlot.id);
      if (updated) setSelectedPlot(updated);
    }
  }, [plots]);

  const isInternalRole = role === 'admin' || role === 'moderator' || role === 'sales_person' || role === 'agent';
  const pendingRequests = bookingRequests.filter((r) => r.status === 'pending');

  // Counts by status
  const counts = {
    available: plots.filter((p) => p.status === 'available').length,
    reservation_pending: plots.filter((p) => p.status === 'reservation_pending').length,
    booked: plots.filter((p) => p.status === 'booked').length,
    sold: plots.filter((p) => p.status === 'sold').length,
    blocked: plots.filter((p) => p.status === 'blocked').length,
  };

  const getStatusColor = (status: PlotStatus) => {
    switch (status) {
      case 'available':
        return { fill: '#DCFCE7', stroke: '#16A34A', text: '#14532D', badge: 'bg-emerald-600' };
      case 'reservation_pending':
        return { fill: '#FEF3C7', stroke: '#D97706', text: '#92400E', badge: 'bg-amber-500' };
      case 'booked':
        return { fill: '#DBEAFE', stroke: '#2563EB', text: '#1E40AF', badge: 'bg-blue-600' };
      case 'sold':
        return { fill: '#FEE2E2', stroke: '#DC2626', text: '#991B1B', badge: 'bg-rose-600' };
      case 'blocked':
        return { fill: '#F3F4F6', stroke: '#9CA3AF', text: '#4B5563', badge: 'bg-stone-500' };
      default:
        return { fill: '#F3F4F6', stroke: '#D1D5DB', text: '#374151', badge: 'bg-gray-400' };
    }
  };

  const handleReserveClick = (plot: Plot) => {
    const check = canReservePlot(plot);
    if (!check.allowed) {
      showToast(
        language === 'hi' ? 'आरक्षण टकराव' : 'Reservation Conflict',
        check.conflictReason || 'Plot cannot be reserved.',
        'error'
      );
      return;
    }

    const res = reservePlot(plot.id);
    if (res.success) {
      setSelectedPlot({ ...plot, status: 'reservation_pending' });
    }
  };

  const handleCustomerRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlot) return;
    if (!customerName.trim() || customerPhone.trim().length < 10) {
      showToast('Validation Error', 'Please enter your name and phone number.', 'error');
      return;
    }

    const res = requestPlotBooking(selectedPlot.id, customerName.trim(), customerPhone.trim(), customerNote.trim());
    if (res.success) {
      setShowRequestModal(false);
      setCustomerNote('');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
        <PlotMapSkeleton />
      </div>
    );
  }

  if (simulateError) {
    return (
      <div className="py-8">
        <ErrorState
          title="Plot Inventory Service Unavailable"
          message="Simulated error state is active. Turn off error simulation to reload interactive map."
          onRetry={() => setSimulateError(false)}
        />
      </div>
    );
  }

  const selectedRemaining = selectedPlot?.status === 'reservation_pending'
    ? formatTimeRemaining(selectedPlot.reservationExpiry)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Header & Demo Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {language === 'hi' ? 'इंटरैक्टिव प्लॉट इन्वेंट्री मैप' : 'Interactive Plot Inventory Map'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'hi'
              ? '40 फार्म प्लॉट्स का डिजिटल लेआउट: स्थिति, आकार, मिट्टी एवं मूल्य'
              : '40 demarcated agro plots with live reservation hold timers and customer request queue'}
          </p>
        </div>

        {/* Actions: Fast Forward 24h & Project Selector & Requests Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Fast-forward 24h Demo Button */}
          <button
            onClick={fastForward24Hours}
            className="touch-target px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Simulate 24 hours passing to expire pending holds"
          >
            <FastForward className="w-4 h-4 text-amber-700" />
            <span>{language === 'hi' ? '24 घंटे फास्ट-फॉरवर्ड (डेमो)' : 'Fast-forward 24h (Demo)'}</span>
          </button>

          {/* Pending Requests Badge for Staff */}
          {isInternalRole && (
            <button
              onClick={() => setShowRequestsDrawer(!showRequestsDrawer)}
              className="touch-target px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <FileCheck className="w-4 h-4 text-purple-700" />
              <span>
                Requests ({pendingRequests.length})
              </span>
            </button>
          )}

          {/* Project Selector */}
          <select
            value={activeProject}
            onChange={(e) => setActiveProject(e.target.value)}
            className="touch-target px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-[#14532D]"
          >
            {mockProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Booking Requests Review Drawer */}
      {showRequestsDrawer && isInternalRole && (
        <div className="p-5 rounded-3xl bg-purple-50/80 border-2 border-purple-300 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-700" />
                <span>Customer Plot Booking Requests Queue</span>
              </h3>
              <p className="text-xs text-purple-800">
                Incoming online hold requests from plot buyers. Approve to lock 24h reservation.
              </p>
            </div>
            <button
              onClick={() => setShowRequestsDrawer(false)}
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              Hide
            </button>
          </div>

          {bookingRequests.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No customer booking requests logged.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookingRequests.map((req) => (
                <div
                  key={req.id}
                  className={`p-3.5 rounded-2xl bg-white border text-xs space-y-2 ${
                    req.status === 'approved'
                      ? 'border-emerald-300'
                      : req.status === 'rejected'
                      ? 'border-rose-200'
                      : 'border-purple-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">
                        Plot {req.plotNumber} • {req.projectName}
                      </span>
                      <p className="text-gray-600 mt-0.5">
                        Buyer: <strong>{req.customerName}</strong> ({req.customerPhone})
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {req.status === 'pending' ? 'Pending Review' : req.status}
                    </span>
                  </div>

                  {req.note && (
                    <p className="text-gray-600 bg-gray-50 p-2 rounded-xl italic">
                      "{req.note}"
                    </p>
                  )}

                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                      <button
                        onClick={() => approveBookingRequest(req.id)}
                        className="touch-target flex-1 py-1.5 px-3 rounded-lg bg-[#14532D] text-white font-bold text-xs hover:bg-[#166534] flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Approve (24h Hold)</span>
                      </button>
                      <button
                        onClick={() => setRejectModalReq(req)}
                        className="touch-target py-1.5 px-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-300 font-bold text-xs hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500">
                      Reviewed by {req.reviewedBy || 'Staff'} {req.rejectReason ? `• Reason: ${req.rejectReason}` : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Color AND Label Legend Bar (never color alone!) */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          {language === 'hi' ? 'स्थिति संकेत एवं संख्या (रंग + लेबल):' : 'Status & Count Legend (Color + Label):'}
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>Available ({counts.available})</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Reservation Pending ({counts.reservation_pending})</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-300">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <span>Booked ({counts.booked})</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-900 border border-rose-300">
            <span className="w-3 h-3 rounded-full bg-rose-600" />
            <span>Sold ({counts.sold})</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 border border-stone-300">
            <span className="w-3 h-3 rounded-full bg-stone-500" />
            <span>Blocked ({counts.blocked})</span>
          </div>
        </div>
      </div>

      {/* Main Grid: SVG Map on Left, Side Sheet on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Interactive Farm Map */}
        <div className="lg:col-span-8 p-4 sm:p-6 rounded-3xl bg-[#F4EFE6] border border-[#DDD5C8] shadow-inner overflow-hidden">
          <div className="flex items-center justify-between mb-3 text-xs text-[#14532D] font-bold">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>NORTH &uarr; | Main 30ft Estate Access Road</span>
            </span>
            <span className="text-gray-500">Tap plot to inspect</span>
          </div>

          <div className="w-full overflow-x-auto bg-[#F9F6F0] rounded-2xl p-4 border border-[#DDD5C8] shadow-sm">
            <svg
              viewBox="0 0 880 580"
              className="w-full h-auto min-w-[720px] select-none"
              style={{ maxHeight: '600px' }}
            >
              {/* Natural Stream / River on Bottom Row */}
              <path
                d="M 10 520 Q 220 540 440 510 T 870 535 L 870 575 L 10 575 Z"
                fill="#BFDBFE"
                stroke="#60A5FA"
                strokeWidth="2"
              />
              <text x="440" y="555" fill="#1E40AF" fontSize="12" fontWeight="bold" textAnchor="middle">
                ~ Perennial Freshwater Farm Stream & Walking Trail ~
              </text>

              {/* Clubhouse & Organic Park Area in Central Right */}
              <rect
                x="440"
                y="190"
                width="190"
                height="65"
                rx="12"
                fill="#E2E8F0"
                stroke="#94A3B8"
                strokeWidth="2"
              />
              <text x="535" y="225" fill="#334155" fontSize="11" fontWeight="bold" textAnchor="middle">
                🏡 Clubhouse, Farm Café & Pool
              </text>

              {/* Main Avenue Roads */}
              <rect x="10" y="10" width="860" height="20" fill="#CBD5E1" rx="4" />
              <text x="440" y="24" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle">
                30 FT TARRED MAIN ACCESS ROAD
              </text>

              {/* Internal Cross Street */}
              <rect x="10" y="270" width="860" height="16" fill="#E2E8F0" rx="3" />
              <text x="440" y="282" fill="#64748B" fontSize="9" fontWeight="bold" textAnchor="middle">
                25 FT INTERNAL AVENUE (SOLAR STREET LAMPS)
              </text>

              {/* 40 Plots Rendered */}
              {plots.map((plot) => {
                const colWidth = 98;
                const rowHeight = 75;
                const startX = 20 + (plot.col - 1) * 105;
                const yOffset = plot.row > 2 ? 30 : 0;
                const startY = 40 + (plot.row - 1) * 85 + yOffset;

                const isSelected = selectedPlot?.id === plot.id;
                const colors = getStatusColor(plot.status);

                return (
                  <g
                    key={plot.id}
                    onClick={() => setSelectedPlot(plot)}
                    className="cursor-pointer transition-transform hover:opacity-90"
                  >
                    <rect
                      x={startX}
                      y={startY}
                      width={colWidth}
                      height={rowHeight}
                      rx="10"
                      fill={isSelected ? '#FEF08A' : colors.fill}
                      stroke={isSelected ? '#14532D' : colors.stroke}
                      strokeWidth={isSelected ? '3.5' : '2'}
                      strokeDasharray={plot.status === 'blocked' ? '4 3' : 'none'}
                    />

                    {/* Plot Number */}
                    <text
                      x={startX + colWidth / 2}
                      y={startY + 24}
                      fill={colors.text}
                      fontSize="14"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      {plot.plotNumber}
                    </text>

                    {/* Gunta Size */}
                    <text
                      x={startX + colWidth / 2}
                      y={startY + 42}
                      fill="#374151"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {plot.sizeGuntas} Guntas
                    </text>

                    {/* Price or Expiry indicator */}
                    <text
                      x={startX + colWidth / 2}
                      y={startY + 60}
                      fill={plot.status === 'reservation_pending' ? '#B45309' : '#14532D'}
                      fontSize="10"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      {plot.status === 'reservation_pending'
                        ? '⏱️ Hold 24h'
                        : `₹${plot.priceInLakhs}L`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Side Sheet with Plot Details & Action */}
        <div className="lg:col-span-4">
          {selectedPlot ? (
            <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-lg space-y-5 animate-in fade-in">
              {/* Header */}
              <div className="flex items-start justify-between border-b pb-3 border-[#F0EBE1]">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Demarcated Farm Plot
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 mt-0.5">
                    Plot {selectedPlot.plotNumber}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedPlot.projectName}</p>
                </div>
                <StatusBadge status={selectedPlot.status} type="plot" size="md" />
              </div>

              {/* LIVE HOLD COUNTDOWN (For reservation_pending plots) */}
              {selectedPlot.status === 'reservation_pending' && selectedRemaining && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">
                      Live Reservation Hold Timer
                    </span>
                    <span className="text-sm font-black text-amber-950">
                      {selectedRemaining.formatted}
                    </span>
                  </div>
                </div>
              )}

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                  <span className="text-gray-500 block">Area (Guntas)</span>
                  <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">
                    {selectedPlot.sizeGuntas} Guntas
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                  <span className="text-gray-500 block">Area (Sq. Ft.)</span>
                  <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">
                    {selectedPlot.sizeSqFt.toLocaleString()} sq.ft
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                  <span className="text-gray-500 block">Facing Direction</span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 block">
                    {selectedPlot.facing}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                  <span className="text-gray-500 block">Soil Characteristic</span>
                  <span className="text-sm font-bold text-emerald-800 mt-0.5 block truncate">
                    {selectedPlot.soilType}
                  </span>
                </div>
              </div>

              {/* Price Callout */}
              <div className="p-4 rounded-2xl bg-[#14532D]/10 border border-[#14532D]/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                    Total All-Inclusive Price:
                  </span>
                  <span className="text-2xl font-black text-[#14532D]">
                    ₹{selectedPlot.priceInLakhs} Lakh
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  (₹{Math.round((selectedPlot.priceInLakhs * 100000) / selectedPlot.sizeSqFt)}/sq.ft)
                </span>
              </div>

              {/* Privacy Rules Enforcement: Internal vs Customer/Public */}
              <div className="pt-2 border-t border-gray-100">
                {isInternalRole ? (
                  /* Internal Team sees Buyer, Agent, and Full Details */
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                      <User className="w-4 h-4 text-amber-700" />
                      <span>Internal Allocation & Buyer Record</span>
                    </div>

                    {selectedPlot.buyerName ? (
                      <div className="space-y-1 text-gray-700">
                        <p>
                          <strong>Allocated Buyer:</strong> {selectedPlot.buyerName}
                        </p>
                        <p>
                          <strong>Contact Phone:</strong> {selectedPlot.buyerPhone || 'N/A'}
                        </p>
                        <p>
                          <strong>Handling Agent:</strong> {selectedPlot.agentName || 'Aarav Sharma'}
                        </p>
                        {selectedPlot.bookingDate && (
                          <p>
                            <strong>Booking Date:</strong> {selectedPlot.bookingDate}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No buyer currently allocated to this plot.</p>
                    )}
                  </div>
                ) : (
                  /* Customer / Public Role Privacy Shield */
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-gray-800 font-bold">
                      <ShieldAlert className="w-4 h-4 text-emerald-700" />
                      <span>Privacy Shield Enabled</span>
                    </div>
                    {selectedPlot.status === 'available' ? (
                      <p className="text-emerald-800 font-semibold">
                        This plot is currently Available for reservation.
                      </p>
                    ) : (
                      <p className="text-gray-500">
                        Buyer identity and personal contact records are protected and visible to management only.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons: Customer "Request this Plot" vs Internal "Reserve" */}
              <div className="pt-2">
                {role === 'customer' ? (
                  /* Customer Flow: "Request this plot" -> "Request received, not yet confirmed" */
                  selectedPlot.status === 'available' ? (
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="touch-target w-full py-3.5 px-4 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Send className="w-4 h-4 text-emerald-300" />
                      <span>{language === 'hi' ? 'इस प्लॉट का अनुरोध करें' : 'Request this Plot'}</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="touch-target w-full py-3 px-4 rounded-2xl bg-gray-200 text-gray-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Plot is not available for request</span>
                    </button>
                  )
                ) : (
                  /* Staff Flow: "Reserve Plot (24h Token Hold)" with Conflict Prevention */
                  selectedPlot.status === 'available' ? (
                    <button
                      onClick={() => handleReserveClick(selectedPlot)}
                      className="touch-target w-full py-3.5 px-4 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Clock className="w-4 h-4 text-emerald-300" />
                      <span>
                        {language === 'hi' ? 'प्लॉट रिज़र्व करें (24 घंटे होल्ड)' : 'Reserve Plot (24h Token Hold)'}
                      </span>
                    </button>
                  ) : (
                    <button
                      disabled
                      onClick={() => handleReserveClick(selectedPlot)}
                      className="touch-target w-full py-3 px-4 rounded-2xl bg-gray-200 text-gray-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>
                        {selectedPlot.status === 'reservation_pending'
                          ? 'Under Reservation Hold'
                          : `Plot is ${selectedPlot.status.toUpperCase()}`}
                      </span>
                    </button>
                  )
                )}

                <p className="text-[11px] text-gray-500 text-center mt-2">
                  {role === 'customer'
                    ? 'Submitting a hold request sends a notification to our team to lock your reservation.'
                    : 'The Reserve action prevents a second reservation of the same plot with conflict messaging.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E5DFD5]">
              <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-800">Select Any Plot</p>
              <p className="text-xs text-gray-500 mt-1">
                Click any numbered plot on the SVG layout map to inspect dimensions and status.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer "Request this Plot" Modal */}
      {showRequestModal && selectedPlot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-xl font-black text-[#14532D] flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-700" />
                  <span>Request Plot Hold</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Requesting Plot {selectedPlot.plotNumber} ({selectedPlot.sizeGuntas} Guntas) at {selectedPlot.projectName}
                </p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomerRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#14532D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile Number (+91) *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#14532D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Optional Note or Requirements
                </label>
                <textarea
                  rows={2}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="e.g. Planning fruit orchard setup, request 48h hold..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9] text-xs text-gray-600">
                Notice: On submission, your request will be marked as{' '}
                <strong>"Request received, not yet confirmed"</strong> until approved by farm sales staff.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="touch-target px-4 py-2 rounded-xl border text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-sm font-bold hover:bg-[#166534] shadow-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Reject Booking Request Modal */}
      {rejectModalReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="font-extrabold text-base text-rose-900">
              Reject Booking Request for Plot {rejectModalReq.plotNumber}
            </h3>
            <p className="text-xs text-gray-600">
              Please choose a reason for declining {rejectModalReq.customerName}'s request.
            </p>

            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800"
            >
              <option value="Already earmarked for another buyer">Already earmarked for another buyer</option>
              <option value="Price negotiation requirement">Price negotiation requirement</option>
              <option value="Management reserve policy">Management reserve policy</option>
              <option value="Unreachable on contact number">Unreachable on contact number</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalReq(null)}
                className="px-3 py-1.5 rounded-lg border text-xs font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectBookingRequest(rejectModalReq.id, rejectReason);
                  setRejectModalReq(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-bold hover:bg-rose-800"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
