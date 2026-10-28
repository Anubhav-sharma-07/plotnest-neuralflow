import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ListSkeleton } from '../components/SkeletonLoader';
import { filterLeadsByRole, isFollowUpOverdue, getLeadAge } from '../utils/rules';
import { mockProjects } from '../data/mockData';
import { LeadStatus, LeadSource } from '../types';
import {
  Search,
  Filter,
  Phone,
  MessageSquare,
  Plus,
  Clock,
  AlertTriangle,
  User,
  ArrowRight,
  X,
  Calendar,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const LeadListPage: React.FC = () => {
  const {
    leads,
    role,
    currentUserId,
    language,
    addLead,
    checkDuplicatePhone,
    showToast,
    simulateError,
    setSimulateError,
  } = usePlotNest();

  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [onlyOverdue, setOnlyOverdue] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(
    searchParams.get('action') === 'new'
  );

  // New Lead Form state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCity, setNewLeadCity] = useState('Bengaluru');
  const [newLeadProject, setNewLeadProject] = useState(mockProjects[0].id);
  const [newLeadBudget, setNewLeadBudget] = useState(30);
  const [newLeadSource, setNewLeadSource] = useState<LeadSource>('meta_ads');

  // Check duplicate phone live
  const duplicateLead = useMemo(() => {
    return checkDuplicatePhone(newLeadPhone);
  }, [newLeadPhone, checkDuplicatePhone]);

  // Filter leads by role first
  const roleFilteredLeads = useMemo(() => {
    return filterLeadsByRole(leads, role, currentUserId);
  }, [leads, role, currentUserId]);

  // Apply search and filter criteria
  const filteredLeads = useMemo(() => {
    return roleFilteredLeads.filter((lead) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(term);
        const matchesPhone = lead.phone.includes(term);
        const matchesId = lead.id.toLowerCase().includes(term);
        if (!matchesName && !matchesPhone && !matchesId) return false;
      }

      if (statusFilter !== 'all' && lead.status !== statusFilter) {
        return false;
      }

      if (sourceFilter !== 'all' && lead.source !== sourceFilter) {
        return false;
      }

      if (projectFilter !== 'all' && lead.interestedProjectId !== projectFilter) {
        return false;
      }

      if (onlyOverdue) {
        if (lead.status === 'converted' || lead.status === 'closed_lost' || lead.status === 'invalid_rejected') {
          return false;
        }
        if (!isFollowUpOverdue(lead.nextFollowUpDate)) {
          return false;
        }
      }

      return true;
    });
  }, [roleFilteredLeads, searchTerm, statusFilter, sourceFilter, projectFilter, onlyOverdue]);

  const handleCreateLead = (e?: React.FormEvent, allowDuplicateOverride: boolean = false) => {
    if (e) e.preventDefault();
    if (!newLeadName.trim() || newLeadPhone.trim().length < 10) {
      showToast('Validation Error', 'Please provide a valid name and 10-digit phone number.', 'error');
      return;
    }

    const selectedProj = mockProjects.find((p) => p.id === newLeadProject) || mockProjects[0];
    addLead({
      name: newLeadName.trim(),
      phone: newLeadPhone.trim().startsWith('+91') ? newLeadPhone.trim() : `+91 ${newLeadPhone.trim()}`,
      city: newLeadCity,
      source: newLeadSource,
      budgetInLakhs: Number(newLeadBudget),
      interestedProjectId: selectedProj.id,
      interestedProjectName: selectedProj.name,
      allowDuplicateOverride,
    });

    setShowAddModal(false);
    setNewLeadName('');
    setNewLeadPhone('');
    setSearchParams({});
  };

  const handleSimulateCall = (leadName: string, phone: string) => {
    showToast(
      language === 'hi' ? 'कॉल आरंभ' : 'Initiating Call',
      `Connecting to ${leadName} at ${phone}...`,
      'info'
    );
  };

  const handleSimulateWhatsApp = (leadName: string, phone: string) => {
    showToast(
      language === 'hi' ? 'व्हाट्सएप चैट' : 'Opening WhatsApp',
      `Opening WhatsApp chat with ${leadName} (${phone}) with farmland brochure template.`,
      'info'
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <ListSkeleton count={5} />
      </div>
    );
  }

  if (simulateError) {
    return (
      <div className="py-8">
        <ErrorState
          title="CRM Leads Database Offline"
          message="Simulated error state is active. Turn off error simulation to restore leads."
          onRetry={() => setSimulateError(false)}
        />
      </div>
    );
  }

  const isSalesOrAgent = role === 'sales_person' || role === 'agent';
  const pageTitle = isSalesOrAgent
    ? language === 'hi'
      ? 'मेरी लीड्स'
      : 'My Assigned Leads'
    : language === 'hi'
    ? 'सभी लीड्स (CRM)'
    : 'All Leads (CRM)';

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span>{pageTitle}</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#14532D] text-white">
              {filteredLeads.length} {language === 'hi' ? 'लीड्स' : 'leads'}
            </span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isSalesOrAgent
              ? language === 'hi'
                ? 'आपके नाम पर सौंपी गई सभी लीड्स एवं फॉलो-अप'
                : 'Leads directly assigned to you for contact and conversion'
              : language === 'hi'
              ? 'प्रशासक दृश्य: संपूर्ण डेटाबेस एवं लीड असाइनमेंट'
              : 'Admin / Moderator view: full pipeline oversight across sales team'}
          </p>
        </div>

        {role !== 'customer' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="touch-target px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-5 h-5 text-emerald-300" />
            <span>{language === 'hi' ? '+ नई लीड जोड़ें' : '+ Add New Lead'}</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'नाम, फोन या लीड आईडी से खोजें...'
                  : 'Search by name, phone or lead ID...'
              }
              className="touch-target w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="touch-target w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Lead</option>
              <option value="assigned">Assigned</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow-up Due</option>
              <option value="visit_scheduled">Visit Scheduled</option>
              <option value="visit_completed">Visit Completed</option>
              <option value="converted">Converted to Sale</option>
              <option value="closed_lost">Closed - Lost</option>
              <option value="invalid_rejected">Invalid / Rejected</option>
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="touch-target w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white"
            >
              <option value="all">All Projects</option>
              {mockProjects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="touch-target w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white"
            >
              <option value="all">All Sources</option>
              <option value="meta_ads">Meta Ads</option>
              <option value="google">Google Search</option>
              <option value="referral">Referral</option>
              <option value="walk_in">Walk-in Direct</option>
              <option value="website">Public Website</option>
            </select>
          </div>
        </div>

        {/* Overdue Checkbox Toggle */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
            <input
              type="checkbox"
              checked={onlyOverdue}
              onChange={(e) => setOnlyOverdue(e.target.checked)}
              className="w-4 h-4 rounded text-[#14532D] focus:ring-[#14532D]"
            />
            <span className={onlyOverdue ? 'text-rose-700 font-extrabold' : ''}>
              ⚠️ {language === 'hi' ? 'केवल अतिदेय फॉलो-अप दिखाएं' : 'Show Overdue Follow-ups Only'}
            </span>
          </label>

          {(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' || projectFilter !== 'all' || onlyOverdue) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSourceFilter('all');
                setProjectFilter('all');
                setOnlyOverdue(false);
              }}
              className="text-xs text-rose-600 hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Leads List Rendering */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          title={language === 'hi' ? 'कोई लीड नहीं मिली' : 'No Leads Found'}
          description={
            language === 'hi'
              ? 'वर्तमान फ़िल्टर के साथ कोई लीड मेल नहीं खाती। फ़िल्टर रीसेट करें या नई लीड जोड़ें।'
              : 'No leads match your current filter parameters. Try clearing filters or create a new lead.'
          }
          actionText={language === 'hi' ? '+ पहली लीड जोड़ें' : '+ Add Your First Lead'}
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => {
            const overdue =
              isFollowUpOverdue(lead.nextFollowUpDate) &&
              lead.status !== 'converted' &&
              lead.status !== 'closed_lost' &&
              lead.status !== 'invalid_rejected';

            const age = getLeadAge(lead.createdAt);

            return (
              <div
                key={lead.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs hover:border-[#14532D]/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Lead Summary */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="font-black text-lg text-gray-900 hover:text-[#14532D] hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <StatusBadge status={lead.status} type="lead" size="sm" />
                    <StatusBadge
                      status={lead.bookingStatus || (lead.status === 'converted' ? 'confirmed' : 'no_booking')}
                      type="booking"
                      size="sm"
                    />
                    {overdue && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>{language === 'hi' ? 'अतिदेय!' : 'Overdue'}</span>
                      </span>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600">
                    <span className="font-semibold text-gray-800">
                      📞 {lead.phone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-800 font-medium">
                      <Building className="w-3.5 h-3.5" />
                      {lead.interestedProjectName}
                    </span>
                    <span>•</span>
                    <span>
                      {language === 'hi' ? 'बजट:' : 'Budget:'}{' '}
                      <strong className="text-gray-900">₹{lead.budgetInLakhs} Lakh</strong>
                    </span>
                    <span>•</span>
                    <span className="capitalize">
                      {language === 'hi' ? 'स्रोत:' : 'Source:'} {lead.source.replace('_', ' ')}
                    </span>
                    <span>•</span>
                    <span className="text-gray-400">
                      {language === 'hi' ? 'उम्र:' : 'Age:'} {age}
                    </span>
                  </div>

                  {/* Assignment & Next Follow-up */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <span className="text-gray-500">
                      {language === 'hi' ? 'प्रभारी:' : 'Assigned to:'}{' '}
                      <strong className="text-gray-800">{lead.assignedToName || 'Unassigned'}</strong>
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className={`flex items-center gap-1 font-bold ${overdue ? 'text-rose-700' : 'text-gray-700'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {language === 'hi' ? 'अगला फॉलो-अप:' : 'Next Follow-up:'} {lead.nextFollowUpDate} ({lead.nextFollowUpChannel})
                      </span>
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons (Call, WhatsApp, Details) */}
                <div className="flex items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100 shrink-0">
                  <button
                    onClick={() => handleSimulateCall(lead.name, lead.phone)}
                    className="touch-target px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 flex items-center gap-1.5 cursor-pointer min-h-[48px]"
                    aria-label={`Quick Call to ${lead.name}`}
                  >
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'hi' ? 'कॉल' : 'Call'}</span>
                  </button>

                  <button
                    onClick={() => handleSimulateWhatsApp(lead.name, lead.phone)}
                    className="touch-target px-3.5 py-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-900 text-xs font-bold border border-green-300 flex items-center gap-1.5 cursor-pointer min-h-[48px]"
                    aria-label={`Quick WhatsApp to ${lead.name}`}
                  >
                    <MessageSquare className="w-4 h-4 text-green-700" />
                    <span>WhatsApp</span>
                  </button>

                  <Link
                    to={`/leads/${lead.id}`}
                    className="touch-target px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs min-h-[48px]"
                    aria-label={`View details for ${lead.name}`}
                  >
                    <span>{language === 'hi' ? 'विवरण' : 'Details'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Lead Modal with Duplicate Phone Check */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-xl font-bold text-[#14532D]">
                  {language === 'hi' ? 'नई लीड दर्ज करें' : 'Add New CRM Lead'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {language === 'hi' ? 'ग्राहक का विवरण भरें' : 'Enter buyer requirements and contact details'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchParams({});
                }}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DUPLICATE PHONE WARNING BANNER */}
            {duplicateLead && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 space-y-2.5 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-950">
                      Duplicate Number Warning
                    </h4>
                    <p className="text-xs font-bold mt-0.5">
                      This number is already in the system!
                    </p>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Existing Lead: <strong>{duplicateLead.name}</strong> ({duplicateLead.phone}) •{' '}
                      {duplicateLead.interestedProjectName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200">
                  <Link
                    to={`/leads/${duplicateLead.id}`}
                    onClick={() => setShowAddModal(false)}
                    className="touch-target px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-100"
                  >
                    View Existing Lead ({duplicateLead.id}) &rarr;
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleCreateLead(undefined, true)}
                    className="touch-target px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-xs"
                  >
                    Create Anyway (Logged in Audit)
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={(e) => handleCreateLead(e, false)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Suresh Bansal"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone (+91) *
                  </label>
                  <input
                    type="tel"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="98201 12345"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newLeadCity}
                    onChange={(e) => setNewLeadCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Project of Interest
                  </label>
                  <select
                    value={newLeadProject}
                    onChange={(e) => setNewLeadProject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                  >
                    {mockProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Budget (₹ Lakhs)
                  </label>
                  <input
                    type="number"
                    value={newLeadBudget}
                    onChange={(e) => setNewLeadBudget(Number(e.target.value))}
                    min={15}
                    max={200}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Lead Source
                </label>
                <select
                  value={newLeadSource}
                  onChange={(e) => setNewLeadSource(e.target.value as LeadSource)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                >
                  <option value="meta_ads">Meta Ads</option>
                  <option value="google">Google Search</option>
                  <option value="referral">Referral</option>
                  <option value="walk_in">Walk-in Direct</option>
                  <option value="website">Public Website</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="touch-target px-4 py-2 rounded-xl border text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2 rounded-xl bg-[#14532D] text-white text-sm font-bold hover:bg-[#166534]"
                >
                  Save Lead to CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
