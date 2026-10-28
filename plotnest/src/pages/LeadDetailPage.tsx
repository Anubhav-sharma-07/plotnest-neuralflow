import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ListSkeleton } from '../components/SkeletonLoader';
import { formatINR, isFollowUpOverdue } from '../utils/rules';
import { mockProjects } from '../data/mockData';
import {
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  ArrowLeft,
  Trophy,
  XCircle,
  Building,
  User,
  History,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Receipt,
  FileText,
  X,
  CheckCircle2,
} from 'lucide-react';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    leads,
    plots,
    siteVisits,
    language,
    role,
    addFollowUp,
    convertToSale,
    completeRegistration,
    markLeadLost,
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
  }, [id]);

  const lead = leads.find((l) => l.id === id);

  // Tabs: timeline | visits | assignment | audit
  const [activeTab, setActiveTab] = useState<'timeline' | 'visits' | 'assignment' | 'audit'>('timeline');

  // Follow-up modal
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpChannel, setFollowUpChannel] = useState<'call' | 'whatsapp' | 'in_person'>('call');
  const [followUpResult, setFollowUpResult] = useState('Interested in visiting site');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Convert to Sale Modal
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertProject, setConvertProject] = useState(lead?.interestedProjectId || mockProjects[0].id);
  const [convertPlot, setConvertPlot] = useState('');
  const [convertPrice, setConvertPrice] = useState(lead ? String(lead.budgetInLakhs * 100000) : '2500000');
  const [convertErrors, setConvertErrors] = useState<{ projectId?: string; plotId?: string; salePrice?: string }>({});

  // Mark as Lost Modal
  const [showLostModal, setShowLostModal] = useState(false);
  const [lostReason, setLostReason] = useState('out_of_budget');
  const [lostComment, setLostComment] = useState('');
  const [lostError, setLostError] = useState('');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
        <ListSkeleton count={4} />
      </div>
    );
  }

  if (simulateError) {
    return (
      <div className="py-8">
        <ErrorState
          title="Failed to Load Lead Details"
          message="Simulated error state is active. Turn off error simulation to resume normal viewing."
          onRetry={() => setSimulateError(false)}
        />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="py-12">
        <EmptyState
          title="Lead Not Found"
          description="The requested lead does not exist or may have been removed."
          actionText="Back to Leads"
          onAction={() => navigate('/leads')}
        />
      </div>
    );
  }

  // Linked visits
  const linkedVisits = siteVisits.filter(
    (v) => v.leadId === lead.id || v.visitorName.toLowerCase() === lead.name.toLowerCase()
  );

  // Filter plots for selected project in conversion modal
  const eligiblePlots = plots.filter(
    (p) => p.projectId === convertProject && (p.status === 'available' || p.status === 'reservation_pending')
  );

  const handleAddFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpNotes.trim()) {
      showToast('Notes Required', 'Please enter notes about the follow-up conversation.', 'error');
      return;
    }

    addFollowUp(lead.id, {
      channel: followUpChannel,
      result: followUpResult,
      notes: followUpNotes,
      nextDate: nextFollowUpDate,
    });

    setShowFollowUpModal(false);
    setFollowUpNotes('');
  };

  const handleConversionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConvertErrors({});

    const numericPrice = parseFloat(convertPrice);
    const res = convertToSale(lead.id, {
      projectId: convertProject,
      plotId: convertPlot,
      salePrice: numericPrice,
    });

    if (res.success) {
      setShowConvertModal(false);
    } else if (res.errors) {
      setConvertErrors(res.errors);
    }
  };

  const handleMarkLostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostComment || lostComment.trim().length < 5) {
      setLostError('Please provide a comment of at least 5 characters explaining why the lead was lost.');
      return;
    }

    const res = markLeadLost(lead.id, lostReason, lostComment);
    if (res.success) {
      setShowLostModal(false);
      setLostComment('');
      setLostError('');
    }
  };

  const isOverdue =
    isFollowUpOverdue(lead.nextFollowUpDate) &&
    lead.status !== 'converted' &&
    lead.status !== 'closed_lost' &&
    lead.status !== 'invalid_rejected';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          to="/leads"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#14532D] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'लीड्स सूची पर वापस जाएं' : 'Back to Leads'}</span>
        </Link>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {lead.status !== 'converted' && lead.status !== 'closed_lost' && lead.status !== 'invalid_rejected' && (
            <>
              <button
                onClick={() => setShowFollowUpModal(true)}
                className="touch-target px-4 py-2 rounded-xl bg-white border border-[#DCD5C8] hover:bg-gray-50 text-sm font-bold text-gray-800 flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>{language === 'hi' ? '+ फॉलो-अप जोड़ें' : '+ Add Follow-up'}</span>
              </button>

              <button
                onClick={() => setShowConvertModal(true)}
                className="touch-target px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-sm font-extrabold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span>{language === 'hi' ? 'बिक्री में बदलें' : 'Convert to Sale'}</span>
              </button>

              <button
                onClick={() => setShowLostModal(true)}
                className="touch-target px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-sm font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>{language === 'hi' ? 'खोया हुआ (Lost)' : 'Mark Lost'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mr-2">{lead.name}</h1>
              {isOverdue && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === 'hi' ? 'अतिदेय फॉलो-अप' : 'Follow-up Overdue'}</span>
                </span>
              )}
            </div>

            {/* CRITICAL DOMAIN REQUIREMENT: 4 SEPARATE STATE CHIPS SIDE-BY-SIDE */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
              <StatusBadge status={lead.status} type="lead" size="md" />
              <StatusBadge
                status={lead.bookingStatus || (lead.status === 'converted' ? 'confirmed' : 'no_booking')}
                type="booking"
                size="md"
              />
              <StatusBadge status={lead.paymentStatus || 'pending_token'} type="payment" size="md" />
              <StatusBadge status={lead.commissionStatus || 'estimated'} type="commission" size="md" />
            </div>

            <p className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-3">
              <span>
                <strong>ID:</strong> {lead.id}
              </span>
              <span>•</span>
              <span>
                <strong>City:</strong> {lead.city}
              </span>
              <span>•</span>
              <span>
                <strong>Source:</strong> {lead.source.toUpperCase()}
              </span>
            </p>
          </div>

          {/* Quick Communication Bar */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`tel:${lead.phone}`}
              className="touch-target px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-sm border border-emerald-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>{lead.phone}</span>
            </a>
            <button
              onClick={() =>
                showToast('WhatsApp Chat', `Simulating WhatsApp chat with ${lead.name}`, 'info')
              }
              className="touch-target px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* 4-Column Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-[#F0EBE1]">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
            <span className="text-xs text-gray-500 font-medium block">Project of Interest</span>
            <span className="text-sm font-bold text-gray-900 flex items-center gap-1 mt-0.5">
              <Building className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">{lead.interestedProjectName}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
            <span className="text-xs text-gray-500 font-medium block">Client Budget</span>
            <span className="text-base font-extrabold text-[#14532D] mt-0.5 block">
              ₹{lead.budgetInLakhs} Lakh
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
            <span className="text-xs text-gray-500 font-medium block">Assigned Representative</span>
            <span className="text-sm font-bold text-gray-900 flex items-center gap-1 mt-0.5">
              <User className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">{lead.assignedToName || 'Unassigned'}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
            <span className="text-xs text-gray-500 font-medium block">Next Scheduled Follow-up</span>
            <span
              className={`text-sm font-bold mt-0.5 flex items-center gap-1 ${
                isOverdue ? 'text-rose-700 font-extrabold' : 'text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{lead.nextFollowUpDate}</span>
            </span>
          </div>
        </div>

        {/* Conversion Details Banner with Booking Reference & Deed Status */}
        {lead.status === 'converted' && lead.conversionDetails && (
          <div className="p-5 rounded-3xl bg-[#F0FDF4] border-2 border-emerald-400 text-emerald-950 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#14532D] text-white flex items-center justify-center font-bold shadow-xs">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                      Confirmed Sale Booking
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 font-mono text-xs font-bold text-[#14532D]">
                      Ref: {lead.conversionDetails.bookingReference}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mt-0.5">
                    Plot {lead.conversionDetails.plotNumber} • {lead.conversionDetails.projectName}
                  </h3>
                </div>
              </div>

              <Link
                to="/plots"
                className="touch-target px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold hover:bg-[#166534] self-start sm:self-center"
              >
                View on Plot Map &rarr;
              </Link>
            </div>

            {/* Price Snapshot & Deed Registration Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-emerald-200">
                <span className="text-[11px] text-gray-500 font-semibold block uppercase">
                  Agreed Sale Price
                </span>
                <span className="text-base font-extrabold text-[#14532D] block">
                  {formatINR(lead.conversionDetails.salePrice)}
                </span>
                <span className="text-[10px] text-gray-500">
                  Version: {lead.conversionDetails.priceSnapshot?.offerVersion || 'v1'} • Locked:{' '}
                  {new Date(lead.conversionDetails.convertedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-200">
                <span className="text-[11px] text-gray-500 font-semibold block uppercase">
                  Sub-Registrar Government Deed
                </span>
                {lead.conversionDetails.saleDeedNumber ? (
                  <div>
                    <span className="text-sm font-mono font-bold text-emerald-800 block">
                      {lead.conversionDetails.saleDeedNumber}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Registration Executed (100% Paid)
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold text-amber-800 block">
                      Deed Not Registered Yet
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Generated only when 100% payment clears & Admin signs
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-200 flex flex-col justify-center">
                <span className="text-[11px] text-gray-500 font-semibold block uppercase">
                  Registration Clearance
                </span>
                {!lead.conversionDetails.saleDeedNumber ? (
                  role === 'admin' ? (
                    <button
                      onClick={() => completeRegistration(lead.id)}
                      className="touch-target mt-1 w-full px-3 py-1.5 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Execute Govt Registration</span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500 italic mt-1">
                      Awaiting 100% payment clearance & Admin sign-off.
                    </span>
                  )
                ) : (
                  <span className="text-xs font-bold text-[#14532D] mt-1">
                    Registered by {lead.conversionDetails.registeredBy || 'Admin'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Closed Lost Reason Banner if Lost */}
        {lead.status === 'closed_lost' && (
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 text-stone-800">
            <h4 className="font-bold text-sm text-stone-900">Lead Marked as Closed - Lost</h4>
            <p className="text-xs mt-1">
              <strong>Reason:</strong> {lead.lostReason?.replace('_', ' ').toUpperCase()}
            </p>
            {lead.lostComment && (
              <p className="text-xs mt-0.5 text-stone-600">
                <strong>Comment:</strong> {lead.lostComment}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#E0D9CD] flex flex-wrap items-center gap-2 sm:gap-6">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`touch-target pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'timeline'
              ? 'border-[#14532D] text-[#14532D]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Activity Timeline ({lead.timeline.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`touch-target pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'visits'
              ? 'border-[#14532D] text-[#14532D]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Site Visits & Expenses ({linkedVisits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assignment')}
          className={`touch-target pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'assignment'
              ? 'border-[#14532D] text-[#14532D]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Assignment History</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`touch-target pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'audit'
              ? 'border-[#14532D] text-[#14532D]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Log ({lead.auditLog?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Append-Only Activity Timeline */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-gray-900">
              Append-Only Interaction Log
            </h3>
            <button
              onClick={() => setShowFollowUpModal(true)}
              className="text-xs font-bold text-[#14532D] hover:underline"
            >
              + Log Interaction
            </button>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5DFD5]">
            {lead.timeline.slice().reverse().map((act) => (
              <div key={act.id} className="relative group">
                <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-white border-2 border-[#14532D] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#14532D]" />
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      {act.type} • {act.author}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(act.timestamp).toLocaleDateString()}{' '}
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">
                    {act.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Visits and Expenses */}
      {activeTab === 'visits' && (
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-gray-900">
              Site Visits & Field Expenses
            </h3>
            <Link to="/visits" className="text-xs font-bold text-[#14532D] hover:underline">
              Open Visits Center &rarr;
            </Link>
          </div>

          {linkedVisits.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8]">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">No Site Visits Scheduled</p>
              <p className="text-xs text-gray-500 mt-1">
                Schedule a site visit from the Site Visits tab or log it in follow-ups.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {linkedVisits.map((v) => (
                <div key={v.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE4D9] pb-3">
                    <div>
                      <h4 className="font-bold text-base text-gray-900">
                        {v.projectName} {v.plotOfInterest ? `(Plot ${v.plotOfInterest})` : ''}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Scheduled on {v.scheduledDate} at {v.timeSlot} • Pickup: {v.pickupLocation}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        v.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-purple-100 text-purple-900'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>

                  {v.feedbackComment && (
                    <div className="p-3 rounded-xl bg-white border border-gray-200 text-xs">
                      <strong className="text-gray-900 block mb-1">
                        Mandatory Field Feedback:
                      </strong>
                      <p className="text-gray-700 italic">"{v.feedbackComment}"</p>
                    </div>
                  )}

                  {/* Expenses sub-list */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                      Visit Expenses ({v.expenses.length}):
                    </span>
                    {v.expenses.length === 0 ? (
                      <p className="text-xs text-gray-400">No expenses logged for this visit.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {v.expenses.map((exp) => (
                          <div
                            key={exp.id}
                            className="p-3 rounded-xl bg-white border border-gray-200 text-xs space-y-1"
                          >
                            <div className="flex justify-between font-bold">
                              <span className="capitalize">{exp.category}</span>
                              <span className="text-emerald-800">₹{exp.amount}</span>
                            </div>
                            <p className="text-gray-600 truncate">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Assignment History */}
      {activeTab === 'assignment' && (
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <h3 className="font-extrabold text-lg text-gray-900">
            Ownership & Rep Assignment History
          </h3>
          <div className="divide-y divide-gray-100 text-sm">
            <div className="py-3 flex justify-between">
              <div>
                <p className="font-bold text-gray-900">Current Assignee: {lead.assignedToName || 'Unassigned'}</p>
                <p className="text-xs text-gray-500 capitalize">Role: {lead.assignedRole?.replace('_', ' ') || 'None'}</p>
              </div>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-md self-start border border-emerald-200">
                Active Owner
              </span>
            </div>
            <div className="py-3 flex justify-between">
              <div>
                <p className="font-bold text-gray-800">Original Intake</p>
                <p className="text-xs text-gray-500">
                  Source: {lead.source.replace('_', ' ')} • Intake Date:{' '}
                  {new Date(lead.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs text-gray-500">Created</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log (Audit Trail) */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-gray-900">
                Audit Trail & State Changes
              </h3>
              <p className="text-xs text-gray-500">
                Immutable record of who changed what, when, old value, and new value.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-100 rounded-xl overflow-hidden">
              <thead className="bg-[#FAF8F5] text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Changed By</th>
                  <th className="p-3">Field</th>
                  <th className="p-3">Old Value</th>
                  <th className="p-3">New Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lead.auditLog && lead.auditLog.length > 0 ? (
                  lead.auditLog.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-gray-500">
                        {new Date(log.timestamp).toLocaleDateString()}{' '}
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3 font-bold text-gray-900">{log.changedBy}</td>
                      <td className="p-3 font-mono text-emerald-800 font-bold">{log.field}</td>
                      <td className="p-3 text-gray-500">
                        <span className="px-2 py-0.5 rounded bg-gray-100 font-mono">
                          {log.oldValue || 'none'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-900 font-bold">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-mono">
                          {log.newValue}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      No audit records logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Convert to Sale Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-2xl font-black text-[#14532D] flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span>Convert Lead to Sale</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Enforces mandatory Project, Plot, and Sale Price validation rules.
                </p>
              </div>
              <button
                onClick={() => setShowConvertModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConversionSubmit} className="space-y-4">
              {/* Project Selection (REQUIRED) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Select Project *
                </label>
                <select
                  value={convertProject}
                  onChange={(e) => {
                    setConvertProject(e.target.value);
                    setConvertPlot('');
                  }}
                  className="touch-target w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-medium text-sm focus:ring-2 focus:ring-[#14532D]"
                >
                  {mockProjects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name} ({proj.availablePlots} plots available)
                    </option>
                  ))}
                </select>
                {convertErrors.projectId && (
                  <p className="text-xs font-bold text-rose-600 mt-1">{convertErrors.projectId}</p>
                )}
              </div>

              {/* Plot Selection (REQUIRED) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Select Demarcated Plot *
                </label>
                <select
                  value={convertPlot}
                  onChange={(e) => setConvertPlot(e.target.value)}
                  className="touch-target w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-medium text-sm focus:ring-2 focus:ring-[#14532D]"
                >
                  <option value="">-- Choose Plot Number --</option>
                  {eligiblePlots.map((plot) => (
                    <option key={plot.id} value={plot.id}>
                      Plot {plot.plotNumber} - {plot.sizeGuntas} Guntas ({plot.facing} facing) - ₹
                      {plot.priceInLakhs} Lakh
                    </option>
                  ))}
                </select>
                {convertErrors.plotId && (
                  <p className="text-xs font-bold text-rose-600 mt-1">{convertErrors.plotId}</p>
                )}
              </div>

              {/* Agreed Sale Price in INR (REQUIRED) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Final Sale Consideration Price (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={convertPrice}
                    onChange={(e) => setConvertPrice(e.target.value)}
                    placeholder="e.g. 2450000"
                    className="touch-target w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#14532D]"
                  />
                </div>
                {convertPrice && !isNaN(Number(convertPrice)) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Value: <strong>{formatINR(Number(convertPrice))}</strong>
                  </p>
                )}
                {convertErrors.salePrice && (
                  <p className="text-xs font-bold text-rose-600 mt-1">{convertErrors.salePrice}</p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <strong>Domain Policy Notice:</strong>
                <p>
                  Converting to sale generates a <strong>Booking Reference</strong> (e.g. PN-BK-0001)
                  and locks a price snapshot. The registered Deed Number is issued only when full
                  100% payment is cleared and recorded by an Admin.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="touch-target px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-6 py-2.5 rounded-xl bg-[#14532D] text-white text-sm font-extrabold hover:bg-[#166534] shadow-sm flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span>Confirm Sale Conversion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Lost Modal */}
      {showLostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-xl font-black text-rose-900 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Mark Lead as Lost</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Requires mandatory lost reason and descriptive comment.
                </p>
              </div>
              <button
                onClick={() => setShowLostModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMarkLostSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Reason for Loss *
                </label>
                <select
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className="touch-target w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-medium text-sm focus:ring-2 focus:ring-rose-500"
                >
                  <option value="out_of_budget">Client Out of Budget</option>
                  <option value="bought_competitor">Purchased from Competitor Farm</option>
                  <option value="location_too_far">Location Distance Unsuitable</option>
                  <option value="family_disagreement">Family Decision Not in Favor</option>
                  <option value="dropped_plan">Dropped Farmland Investment Plan</option>
                  <option value="unresponsive">Unresponsive after Multiple Attempts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Mandatory Explanation / Comment *
                </label>
                <textarea
                  rows={3}
                  value={lostComment}
                  onChange={(e) => {
                    setLostComment(e.target.value);
                    setLostError('');
                  }}
                  placeholder="Detail why the prospect decided not to proceed..."
                  className="touch-target w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500"
                />
                {lostError && <p className="text-xs font-bold text-rose-600 mt-1">{lostError}</p>}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLostModal(false)}
                  className="touch-target px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-sm font-bold shadow-sm"
                >
                  Confirm Lead Lost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Follow-up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-black text-[#14532D] flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <span>Log Interaction & Follow-up</span>
              </h3>
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFollowUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Interaction Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['call', 'whatsapp', 'in_person'] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setFollowUpChannel(ch)}
                      className={`touch-target py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                        followUpChannel === ch
                          ? 'bg-[#14532D] text-white border-[#14532D]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {ch === 'call' ? '📞 Call' : ch === 'whatsapp' ? '💬 WhatsApp' : '🤝 In-Person'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Discussion Outcome / Result
                </label>
                <input
                  type="text"
                  value={followUpResult}
                  onChange={(e) => setFollowUpResult(e.target.value)}
                  placeholder="e.g. Discussed soil report, wants weekend site visit"
                  className="touch-target w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Conversation Notes *
                </label>
                <textarea
                  rows={3}
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Summarize key points discussed..."
                  className="touch-target w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="touch-target w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="touch-target px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-sm font-bold shadow-sm"
                >
                  Save Interaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
