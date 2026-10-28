import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { isFollowUpOverdue, getLeadAge } from '../utils/rules';
import {
  UserPlus,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  Building,
  Calendar,
  X,
} from 'lucide-react';

export const AssignmentQueuePage: React.FC = () => {
  const {
    leads,
    assignLead,
    autoAssignLeadsRoundRobin,
    language,
    showToast,
  } = usePlotNest();

  const [confirmRoundRobinModal, setConfirmRoundRobinModal] = useState(false);

  // Sales reps list
  const salesReps = [
    { id: 'user-sales-1', name: 'Aarav Sharma', roleTitle: 'Senior Sales Executive' },
    { id: 'user-sales-2', name: 'Pooja Verma', roleTitle: 'Field Sales Lead' },
    { id: 'user-sales-3', name: 'Kunal Deshmukh', roleTitle: 'Field Sales Rep' },
    { id: 'user-sales-4', name: 'Neha Chawla', roleTitle: 'Executive Sales Rep' },
  ];

  // Unassigned leads
  const unassignedLeads = leads.filter(
    (l) => !l.assignedToId || l.assignedToName === 'Unassigned' || l.status === 'new'
  );

  // Compute workload for each sales rep
  const repWorkloads = salesReps.map((rep) => {
    const repLeads = leads.filter((l) => l.assignedToId === rep.id);
    const activeLeads = repLeads.filter(
      (l) => l.status !== 'converted' && l.status !== 'closed_lost' && l.status !== 'invalid_rejected'
    );
    const overdueLeads = activeLeads.filter((l) => isFollowUpOverdue(l.nextFollowUpDate));
    return {
      ...rep,
      totalCount: repLeads.length,
      activeCount: activeLeads.length,
      overdueCount: overdueLeads.length,
    };
  });

  const handleManualAssign = (leadId: string, repId: string) => {
    const rep = salesReps.find((r) => r.id === repId);
    if (!rep) return;
    assignLead(leadId, rep.id, rep.name);
  };

  const executeRoundRobin = () => {
    const res = autoAssignLeadsRoundRobin();
    setConfirmRoundRobinModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Admin / Moderator Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {language === 'hi' ? 'लीड आवंटन कतार' : 'Lead Assignment Queue'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'hi'
              ? 'अनावंटित लीड्स को फील्ड सेल्स प्रतिनिधियों में वितरित करें (मैनुअल या राउंड-रॉबिन)'
              : 'Distribute unassigned buyer inquiries across active sales executives with workload balancing'}
          </p>
        </div>

        {/* Auto-assign Button */}
        <button
          onClick={() => setConfirmRoundRobinModal(true)}
          disabled={unassignedLeads.length === 0}
          className={`touch-target px-5 py-3 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all ${
            unassignedLeads.length > 0
              ? 'bg-[#14532D] hover:bg-[#166534] text-white cursor-pointer active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-emerald-300" />
          <span>Auto-assign (round-robin)</span>
        </button>
      </div>

      {/* Sales Representative Workload Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-extrabold text-gray-900">
          Sales Representative Capacity & Workload
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {repWorkloads.map((rep) => {
            const isHighLoad = rep.activeCount > 8;
            return (
              <div
                key={rep.id}
                className="p-4 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs space-y-2 hover:border-[#14532D]/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{rep.name}</h3>
                    <p className="text-[11px] text-gray-500">{rep.roleTitle}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isHighLoad
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isHighLoad ? 'High Load' : 'Available'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                  <div className="p-2 rounded-xl bg-[#FAF8F5]">
                    <span className="text-gray-500 block text-[10px] uppercase">Active Leads</span>
                    <span className="text-base font-black text-gray-900 mt-0.5 block">
                      {rep.activeCount}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F5]">
                    <span className="text-gray-500 block text-[10px] uppercase">Overdue</span>
                    <span
                      className={`text-base font-black mt-0.5 block ${
                        rep.overdueCount > 0 ? 'text-rose-600' : 'text-gray-900'
                      }`}
                    >
                      {rep.overdueCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unassigned Leads Table / Card List */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-[#F0EBE1]">
          <div>
            <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-700" />
              <span>Unassigned Inbound Inquiries ({unassignedLeads.length})</span>
            </h3>
            <p className="text-xs text-gray-500">
              Fresh web and Meta ad inquiries requiring dedicated field sales ownership.
            </p>
          </div>
        </div>

        {unassignedLeads.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-[#EAE4D9]">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800 text-sm">All Inquiries Assigned!</h4>
            <p className="text-xs text-gray-500 mt-1">
              Zero unassigned leads in queue. All incoming prospects have an active sales owner.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {unassignedLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="font-black text-base text-gray-900 hover:text-[#14532D] hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      Unassigned
                    </span>
                    <span className="text-xs text-gray-400">ID: {lead.id}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span>📞 {lead.phone}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                      <Building className="w-3.5 h-3.5" />
                      {lead.interestedProjectName}
                    </span>
                    <span>•</span>
                    <span>Budget: ₹{lead.budgetInLakhs} Lakh</span>
                    <span>•</span>
                    <span className="capitalize">Source: {lead.source.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>Age: {getLeadAge(lead.createdAt)}</span>
                  </div>
                </div>

                {/* Assignment Dropdown */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-200">
                  <label className="text-xs font-bold text-gray-700 whitespace-nowrap">
                    Assign To:
                  </label>
                  <select
                    value={lead.assignedToId || ''}
                    onChange={(e) => handleManualAssign(lead.id, e.target.value)}
                    className="touch-target px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#14532D]"
                  >
                    <option value="">-- Choose Sales Rep --</option>
                    {salesReps.map((rep) => (
                      <option key={rep.id} value={rep.id}>
                        {rep.name}
                      </option>
                    ))}
                  </select>

                  <Link
                    to={`/leads/${lead.id}`}
                    className="touch-target px-3 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700"
                  >
                    Inspect
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Round-Robin */}
      {confirmRoundRobinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#14532D] flex items-center justify-center font-bold">
                <RotateCcw className="w-6 h-6" />
              </div>
              <button
                onClick={() => setConfirmRoundRobinModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900">
                Confirm Auto-Assign (Round-Robin)?
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                This will automatically distribute{' '}
                <strong>{unassignedLeads.length} unassigned leads</strong> sequentially across the 4
                active sales executives (Aarav, Pooja, Kunal, Neha). Each assignment will be logged
                to the lead's timeline and audit history.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9] text-xs space-y-1">
              <p className="font-bold text-gray-800">Team Allocation Roster:</p>
              <ul className="list-disc pl-4 text-gray-600 space-y-0.5">
                {salesReps.map((r) => (
                  <li key={r.id}>{r.name}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmRoundRobinModal(false)}
                className="touch-target px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={executeRoundRobin}
                className="touch-target px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-extrabold shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Confirm & Distribute Leads</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
