import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { StatusBadge } from '../components/StatusBadge';
import { filterLeadsByRole, formatINR } from '../utils/rules';
import { LeadStatus } from '../types';
import {
  Kanban,
  ListOrdered,
  Sparkles,
  UserCheck,
  PhoneCall,
  Clock,
  Calendar,
  CheckCircle2,
  Trophy,
  XCircle,
  Ban,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Building,
} from 'lucide-react';

export const LeadStatusFlowPage: React.FC = () => {
  const { leads, role, currentUserId, updateLeadStatus, language } = usePlotNest();
  const [viewMode, setViewMode] = useState<'kanban' | 'stepper'>('kanban');

  const visibleLeads = filterLeadsByRole(leads, role, currentUserId);

  // Standard progressive pipeline stages
  const pipelineStages: { id: LeadStatus; labelEn: string; labelHi: string; icon: any; color: string }[] = [
    { id: 'new', labelEn: '1. New Lead', labelHi: '१. नई लीड', icon: Sparkles, color: 'border-emerald-500' },
    { id: 'assigned', labelEn: '2. Assigned', labelHi: '२. सौंपा गया', icon: UserCheck, color: 'border-sky-500' },
    { id: 'contacted', labelEn: '3. Contacted', labelHi: '३. संपर्क किया', icon: PhoneCall, color: 'border-indigo-500' },
    { id: 'follow_up', labelEn: '4. Follow-up Due', labelHi: '४. फॉलो-अप जारी', icon: Clock, color: 'border-amber-500' },
    { id: 'visit_scheduled', labelEn: '5. Visit Scheduled', labelHi: '५. विज़िट तय', icon: Calendar, color: 'border-purple-500' },
    { id: 'visit_completed', labelEn: '6. Visit Completed', labelHi: '६. विज़िट पूर्ण', icon: CheckCircle2, color: 'border-teal-500' },
    { id: 'converted', labelEn: '7. Converted Sale', labelHi: '७. बिक्री पूर्ण', icon: Trophy, color: 'border-emerald-600' },
  ];

  // Terminal & Excluded buckets
  const terminalStages: { id: LeadStatus; labelEn: string; labelHi: string; icon: any; color: string }[] = [
    { id: 'closed_lost', labelEn: 'Closed - Lost', labelHi: 'सौदा निरस्त (Lost)', icon: XCircle, color: 'border-stone-400' },
    { id: 'invalid_rejected', labelEn: 'Invalid / Rejected', labelHi: 'अमान्य / फर्जी (Spam)', icon: Ban, color: 'border-rose-400' },
  ];

  const handleAdvance = (leadId: string, currentStatus: LeadStatus) => {
    const stageOrder: LeadStatus[] = [
      'new',
      'assigned',
      'contacted',
      'follow_up',
      'visit_scheduled',
      'visit_completed',
      'converted',
    ];
    const currentIndex = stageOrder.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
      const nextStatus = stageOrder[currentIndex + 1];
      updateLeadStatus(leadId, nextStatus, 'Advanced via Pipeline flow.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {language === 'hi' ? 'लीड स्टेटस पाइपलाइन फ्लो' : 'Lead Status Pipeline Flow'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'hi'
              ? 'न्यू लीड से लेकर सेल कन्वर्जन तक का संपूर्ण यात्रा चक्र'
              : 'Sequential journey from Meta/Web intake to Registry with separate Invalid stage'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex rounded-2xl bg-white border border-[#E5DFD5] p-1 shadow-xs">
          <button
            onClick={() => setViewMode('kanban')}
            className={`touch-target px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-[#14532D] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>{language === 'hi' ? 'कान्बान बोर्ड' : 'Kanban Board'}</span>
          </button>
          <button
            onClick={() => setViewMode('stepper')}
            className={`touch-target px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'stepper'
                ? 'bg-[#14532D] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>{language === 'hi' ? 'स्टेपर व्यू' : 'Stepper Journey'}</span>
          </button>
        </div>
      </div>

      {/* Distinction Note */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Architecture Rule:</strong> <em>Invalid / Rejected</em> leads (spam, wrong numbers) are kept in a separate quarantine bucket completely decoupled from genuine <em>Closed - Lost</em> negotiations.
        </span>
      </div>

      {/* Stepper View */}
      {viewMode === 'stepper' && (
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-8">
          <div className="space-y-6">
            {pipelineStages.map((stage, idx) => {
              const leadsInStage = visibleLeads.filter((l) => l.status === stage.id);
              const Icon = stage.icon;
              return (
                <div key={stage.id} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#14532D] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                          <Icon className="w-4 h-4 text-emerald-700" />
                          <span>{language === 'hi' ? stage.labelHi : stage.labelEn}</span>
                        </h3>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {leadsInStage.length} {language === 'hi' ? 'लीड्स' : 'leads'}
                        </span>
                      </div>

                      {/* Leads list in this stage */}
                      {leadsInStage.length === 0 ? (
                        <p className="text-xs text-gray-400 mt-2 italic">No leads currently in this stage.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                          {leadsInStage.map((lead) => (
                            <div
                              key={lead.id}
                              className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] hover:border-[#14532D] transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <Link
                                  to={`/leads/${lead.id}`}
                                  className="font-bold text-sm text-gray-900 hover:text-[#14532D] hover:underline"
                                >
                                  {lead.name}
                                </Link>
                                <span className="text-[11px] font-mono text-gray-500">{lead.id}</span>
                              </div>
                              <p className="text-xs text-emerald-800 font-medium mt-1">
                                {lead.interestedProjectName} • ₹{lead.budgetInLakhs}L
                              </p>
                              <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                                <span className="text-gray-500">{lead.assignedToName}</span>
                                {idx < pipelineStages.length - 1 && (
                                  <button
                                    onClick={() => handleAdvance(lead.id, lead.status)}
                                    className="font-bold text-[#14532D] hover:underline flex items-center gap-0.5"
                                  >
                                    <span>Advance</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terminal / Excluded Buckets */}
          <div className="pt-6 border-t border-[#EAE4D9]">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-500 mb-4">
              Terminal Outcomes & Disqualifications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terminalStages.map((stage) => {
                const stageLeads = visibleLeads.filter((l) => l.status === stage.id);
                const Icon = stage.icon;
                return (
                  <div
                    key={stage.id}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span>{language === 'hi' ? stage.labelHi : stage.labelEn}</span>
                      </span>
                      <span className="text-xs font-bold bg-white px-2 py-0.5 rounded border">
                        {stageLeads.length} leads
                      </span>
                    </div>
                    {stageLeads.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">None in this category.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {stageLeads.map((l) => (
                          <div
                            key={l.id}
                            className="p-2.5 rounded-xl bg-white border border-gray-200 text-xs flex justify-between items-center"
                          >
                            <Link to={`/leads/${l.id}`} className="font-bold text-gray-900 hover:underline">
                              {l.name}
                            </Link>
                            <span className="text-gray-500">{l.lostReason || 'Disqualified'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[1400px]">
            {/* 7 Progressive Columns */}
            {pipelineStages.map((stage, idx) => {
              const leadsInColumn = visibleLeads.filter((l) => l.status === stage.id);
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className="w-72 shrink-0 bg-white rounded-3xl border border-[#E5DFD5] p-3.5 flex flex-col shadow-xs"
                >
                  <div className={`border-t-4 ${stage.color} pt-2 mb-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-emerald-800" />
                      <h3 className="font-extrabold text-sm text-gray-900 truncate">
                        {language === 'hi' ? stage.labelHi : stage.labelEn}
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {leadsInColumn.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                    {leadsInColumn.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400 border border-dashed rounded-2xl">
                        No leads
                      </div>
                    ) : (
                      leadsInColumn.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] hover:border-[#14532D] shadow-xs space-y-2 group transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <Link
                              to={`/leads/${lead.id}`}
                              className="font-bold text-sm text-gray-900 group-hover:text-[#14532D] group-hover:underline line-clamp-1"
                            >
                              {lead.name}
                            </Link>
                            <span className="text-[10px] font-mono text-gray-400">{lead.id}</span>
                          </div>

                          <div className="text-xs text-gray-600 space-y-0.5">
                            <p className="text-emerald-900 font-semibold truncate">
                              {lead.interestedProjectName}
                            </p>
                            <p>Budget: <strong>₹{lead.budgetInLakhs} Lakh</strong></p>
                            <p className="text-gray-400">Next: {lead.nextFollowUpDate}</p>
                          </div>

                          <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                            <span className="text-gray-500 truncate max-w-[100px]">
                              {lead.assignedToName}
                            </span>
                            {idx < pipelineStages.length - 1 && (
                              <button
                                onClick={() => handleAdvance(lead.id, lead.status)}
                                className="font-extrabold text-[#14532D] hover:underline flex items-center gap-0.5 cursor-pointer"
                                aria-label={`Advance ${lead.name} to next stage`}
                              >
                                <span>Move</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}

            {/* Separate Column for Closed-Lost */}
            <div className="w-72 shrink-0 bg-stone-50 rounded-3xl border border-stone-300 p-3.5 flex flex-col shadow-xs">
              <div className="border-t-4 border-stone-500 pt-2 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-stone-700" />
                  <h3 className="font-extrabold text-sm text-stone-900">Closed - Lost</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                  {visibleLeads.filter((l) => l.status === 'closed_lost').length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {visibleLeads
                  .filter((l) => l.status === 'closed_lost')
                  .map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-2xl bg-white border border-stone-300 text-xs space-y-1"
                    >
                      <Link to={`/leads/${lead.id}`} className="font-bold text-stone-900 block hover:underline">
                        {lead.name}
                      </Link>
                      <p className="text-rose-700 font-semibold">{lead.lostReason?.replace('_', ' ')}</p>
                      <p className="text-gray-500 italic line-clamp-2">"{lead.lostComment}"</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Separate Column for Invalid / Rejected */}
            <div className="w-72 shrink-0 bg-rose-50/60 rounded-3xl border border-rose-300 p-3.5 flex flex-col shadow-xs">
              <div className="border-t-4 border-rose-600 pt-2 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Ban className="w-4 h-4 text-rose-700" />
                  <h3 className="font-extrabold text-sm text-rose-950">Invalid / Rejected</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                  {visibleLeads.filter((l) => l.status === 'invalid_rejected').length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {visibleLeads
                  .filter((l) => l.status === 'invalid_rejected')
                  .map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-2xl bg-white border border-rose-200 text-xs space-y-1"
                    >
                      <Link to={`/leads/${lead.id}`} className="font-bold text-gray-900 block hover:underline">
                        {lead.name}
                      </Link>
                      <p className="text-gray-500 font-mono">{lead.phone}</p>
                      <span className="inline-block px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                        Spam / Fake Digit Filter
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
