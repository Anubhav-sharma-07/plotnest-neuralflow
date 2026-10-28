import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { isFollowUpOverdue, getLeadAge, formatINR } from '../utils/rules';
import {
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Sparkles,
  User,
  Building,
  Target,
  SunMedium,
} from 'lucide-react';

export const TodayPage: React.FC = () => {
  const {
    leads,
    siteVisits,
    currentUserId,
    currentUserName,
    language,
    showToast,
  } = usePlotNest();

  // Completed call tracker for today (persisted in local component state for demo)
  const [completedLeadIds, setCompletedLeadIds] = useState<string[]>(['lead-101', 'lead-103', 'lead-106']);

  // Priority leads for today for the logged-in sales rep / agent:
  // 1. Overdue leads assigned to this rep
  // 2. Leads with visits scheduled for today/tomorrow
  // 3. New assigned inquiries
  const userLeads = leads.filter((l) => l.assignedToId === currentUserId || !l.assignedToId || currentUserId === 'user-admin');

  const priorityLeads = userLeads
    .filter((l) => l.status !== 'converted' && l.status !== 'closed_lost' && l.status !== 'invalid_rejected')
    .sort((a, b) => {
      const aOverdue = isFollowUpOverdue(a.nextFollowUpDate);
      const bOverdue = isFollowUpOverdue(b.nextFollowUpDate);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      if (a.status === 'new' && b.status !== 'new') return -1;
      return 0;
    })
    .slice(0, 5);

  // Today's site visits
  const todayVisits = siteVisits.filter(
    (v) => v.assignedToId === currentUserId || currentUserId === 'user-admin'
  ).slice(0, 3);

  const toggleDone = (id: string) => {
    if (completedLeadIds.includes(id)) {
      setCompletedLeadIds(completedLeadIds.filter((item) => item !== id));
    } else {
      setCompletedLeadIds([...completedLeadIds, id]);
      showToast('Action Logged', 'Marked follow-up call as completed for today!', 'success');
    }
  };

  const handleCall = (name: string, phone: string, id: string) => {
    showToast('Initiating Call', `Calling ${name} at ${phone}...`, 'info');
    if (!completedLeadIds.includes(id)) {
      setCompletedLeadIds([...completedLeadIds, id]);
    }
  };

  const handleWhatsApp = (name: string, phone: string, id: string) => {
    showToast('Opening WhatsApp', `Opening brochure message to ${name}...`, 'info');
    if (!completedLeadIds.includes(id)) {
      setCompletedLeadIds([...completedLeadIds, id]);
    }
  };

  const totalGoal = 5;
  const completedCount = completedLeadIds.filter((id) => priorityLeads.some((l) => l.id === id)).length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalGoal) * 100));

  return (
    <div className="space-y-6">
      {/* Personalized Greeting Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#14532D] via-[#166534] to-emerald-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <SunMedium className="w-4 h-4 text-amber-300" />
            <span>{language === 'hi' ? 'दैनिक कार्यसूची' : 'Daily Action Dispatch'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {language === 'hi' ? `नमस्ते, ${currentUserName.split(' ')[0]}! ☀️` : `Good morning, ${currentUserName.split(' ')[0]}! ☀️`}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl">
            {language === 'hi'
              ? 'यहाँ आज के 5 सबसे महत्वपूर्ण संभावित खरीदार हैं। प्रत्येक कॉल दर्ज करें और विज़िट शेड्यूल करें।'
              : 'Here are your top 5 priority buyers to call today. Close follow-ups to maintain your high conversion velocity.'}
          </p>
        </div>

        {/* Progress Ring Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#FACC15"
                strokeWidth="6"
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute font-black text-sm text-yellow-300">{progressPercent}%</span>
          </div>
          <div className="text-left">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-200 block">
              Daily Target
            </span>
            <span className="text-xl font-extrabold text-white">
              {completedCount} of {totalGoal} Done
            </span>
            <span className="text-[11px] text-emerald-300 block">
              {totalGoal - completedCount > 0 ? `${totalGoal - completedCount} calls left today` : 'Goal achieved! 🎉'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Top 5 Priority Call Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
                <Flame className="w-6 h-6 text-amber-600" />
                <span>Call these people today</span>
              </h2>
              <p className="text-xs text-gray-500">
                Sorted by follow-up urgency, new inquiries, and active site visit interest.
              </p>
            </div>
            <Link to="/leads" className="text-xs font-bold text-[#14532D] hover:underline">
              View All Leads ({leads.length}) &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {priorityLeads.map((lead, idx) => {
              const overdue = isFollowUpOverdue(lead.nextFollowUpDate);
              const isDone = completedLeadIds.includes(lead.id);

              let reasonLabel = 'Scheduled Follow-up';
              let reasonColor = 'bg-blue-50 text-blue-900 border-blue-200';

              if (overdue) {
                reasonLabel = '⚠️ Overdue Follow-up';
                reasonColor = 'bg-rose-50 text-rose-900 border-rose-300 font-bold';
              } else if (lead.status === 'new') {
                reasonLabel = '✨ Fresh Inbound Lead';
                reasonColor = 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold';
              } else if (lead.status === 'visit_scheduled') {
                reasonLabel = '🚗 Site Visit Scheduled';
                reasonColor = 'bg-purple-50 text-purple-900 border-purple-300 font-bold';
              }

              return (
                <div
                  key={lead.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isDone
                      ? 'bg-gray-50/80 border-gray-200 opacity-75'
                      : 'bg-white border-[#E5DFD5] shadow-sm hover:shadow-md hover:border-[#14532D]/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-start gap-3">
                      {/* Checkbox toggle */}
                      <button
                        onClick={() => toggleDone(lead.id)}
                        className={`touch-target w-6 h-6 rounded-lg border mt-1 flex items-center justify-center shrink-0 transition-colors ${
                          isDone
                            ? 'bg-[#14532D] border-[#14532D] text-white'
                            : 'border-gray-300 hover:border-gray-400 bg-white'
                        }`}
                        aria-label={`Mark call with ${lead.name} as done`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`/leads/${lead.id}`}
                            className={`font-black text-lg hover:underline ${
                              isDone ? 'line-through text-gray-500' : 'text-gray-900 hover:text-[#14532D]'
                            }`}
                          >
                            {idx + 1}. {lead.name}
                          </Link>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs border ${reasonColor}`}>
                            {reasonLabel}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                          <span>📍 {lead.city}</span>
                          <span>•</span>
                          <span className="font-bold text-[#14532D]">
                            Budget: ₹{lead.budgetInLakhs} Lakh
                          </span>
                          <span>•</span>
                          <span>Age: {getLeadAge(lead.createdAt)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-gray-500 self-start sm:self-center">
                      Project: <strong className="text-gray-900">{lead.interestedProjectName}</strong>
                    </div>
                  </div>

                  {/* Big Touch Target Buttons (Min 48px) */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleCall(lead.name, lead.phone, lead.id)}
                      className="touch-target flex-1 sm:flex-initial min-h-[48px] px-5 py-3 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-95"
                    >
                      <Phone className="w-5 h-5 text-emerald-300" />
                      <span>Call {lead.phone}</span>
                    </button>

                    <button
                      onClick={() => handleWhatsApp(lead.name, lead.phone, lead.id)}
                      className="touch-target flex-1 sm:flex-initial min-h-[48px] px-5 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-95"
                    >
                      <MessageSquare className="w-5 h-5 text-emerald-200" />
                      <span>WhatsApp Brochure</span>
                    </button>

                    <Link
                      to={`/leads/${lead.id}`}
                      className="touch-target min-h-[48px] px-4 py-3 rounded-2xl bg-white border border-[#DCD5C8] hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Lead</span>
                      <ArrowRight className="w-4 h-4 text-emerald-700" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Scheduled Visits Today & Quick Tips */}
        <div className="lg:col-span-4 space-y-5">
          {/* Today's Scheduled Visits */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#F0EBE1]">
              <div className="flex items-center gap-2 text-gray-900 font-black text-base">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>Today's Site Visits</span>
              </div>
              <Link to="/visits" className="text-xs font-bold text-[#14532D] hover:underline">
                Visits Hub &rarr;
              </Link>
            </div>

            {todayVisits.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-2">No visits scheduled for today.</p>
            ) : (
              <div className="space-y-3">
                {todayVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] text-xs space-y-2"
                  >
                    <div className="flex justify-between items-start font-bold">
                      <span className="text-gray-900">{visit.visitorName}</span>
                      <span className="text-[#14532D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {visit.timeSlot}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Project: <strong>{visit.projectName}</strong>
                    </p>
                    <p className="text-gray-500">
                      Pickup: {visit.pickupLocation} (Free pickup on request)
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <a
                        href={`tel:${visit.visitorPhone}`}
                        className="touch-target px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 font-bold hover:bg-emerald-200 flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Call Visitor</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sales Best Practices Callout */}
          <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Conversion Playbook Tip</span>
            </div>
            <p className="leading-relaxed">
              Always mention the <strong>sweet groundwater lab report (pH 6.8)</strong> and the
              perennial water check-dam before quoting plot prices. Weekend site visits convert 3x
              better than weekday calls!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
