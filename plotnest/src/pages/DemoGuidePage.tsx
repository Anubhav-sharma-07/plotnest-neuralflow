import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  UserCheck,
  Trophy,
  FileSpreadsheet,
  MapPin,
  ListTodo,
} from 'lucide-react';

export const DemoGuidePage: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Public Landing Page & Site Visit Booking',
      role: 'Public / Visitor',
      route: '/',
      keyActions: [
        'Notice softened claim: "Clear-title verified plots (sample)" and "Free pickup available on request".',
        'Toggle language between EN / हिं in header or hero section.',
        'Fill "Book a Free Site Visit" form with name, 10-digit phone, and preferred date.',
        'Submit to view the instant confirmation card with CRM Lead ID generated.',
      ],
      tip: 'Click "View this Lead in CRM" to jump directly into the CRM pipeline.',
    },
    {
      step: 2,
      title: 'Login as Sales Representative & Today Screen',
      role: 'Sales Person (Aarav Sharma)',
      route: '/login',
      keyActions: [
        'Select "Sales Executive" role on login page with demo OTP (123456).',
        'Notice automatic redirect to the "/today" action queue.',
        'Observe personalized greeting: "Good morning, Aarav!" and Daily Target Progress Ring ("3 of 5 Done").',
        'Test min-48px Call and WhatsApp buttons with one-click touch feedback.',
      ],
      tip: 'The checkbox next to each lead updates the daily completion ring instantly.',
    },
    {
      step: 3,
      title: 'Lead Detail with 4 Separate State Chips',
      role: 'Sales Executive or Admin',
      route: '/leads/lead-101',
      keyActions: [
        'Inspect the four distinct milestone chips side-by-side: Lead Status, Booking Status, Payment Status, and Commission Status.',
        'Inspect the append-only Activity Timeline with interaction history.',
        'View the "Assignment History" and new "Audit Log" tab showing timestamp, author, old value, and new value.',
      ],
      tip: 'Status is always dual-signal (color + icon + text), never color alone.',
    },
    {
      step: 4,
      title: 'Convert to Sale without Deed Number (Domain Rule)',
      role: 'Sales Executive or Admin',
      route: '/leads/lead-101',
      keyActions: [
        'Click the "Convert to Sale" button.',
        'Observe mandatory validation requiring Project, Plot, and Sale Price.',
        'Confirm sale conversion: Notice it creates a Booking Reference (e.g. PN-BK-0001) and locks an agreed price snapshot.',
        'CRITICAL: A Sub-Registrar Deed Number is NOT generated on conversion.',
      ],
      tip: 'The conversion banner highlights that official deed registration requires 100% payment receipt.',
    },
    {
      step: 5,
      title: 'Government Deed Registration upon 100% Payment',
      role: 'Administrator (Sanjay Deshmukh)',
      route: '/leads/lead-103',
      keyActions: [
        'Switch role to "Admin" using the top bar "Demo as" dropdown.',
        'Open lead-103 (Vikramaditya Hegde) which has advance payments cleared.',
        'As Administrator, click "Execute Govt Registration".',
        'A formal Government Deed number (e.g. DOC-REG-2026-XXXX) is issued and logged in the immutable audit log.',
      ],
      tip: 'Non-admin roles cannot execute government deed registration.',
    },
    {
      step: 6,
      title: 'Interactive Plot Map, 24h Countdown & Customer Request Flow',
      role: 'Customer or Staff',
      route: '/plots',
      keyActions: [
        'Switch to "Customer" role to test buyer view: Observe customer privacy shield protecting other buyers’ data.',
        'Click an Available plot (e.g. P-05) and click "Request this Plot". Fill hold request note.',
        'Switch to "Admin" role: Open "Requests (1)" queue and click "Approve (24h Hold)".',
        'Observe live countdown timer: "Held for 23h 59m remaining".',
        'Click "Fast-forward 24h (Demo)" in the header to simulate expiry and see the plot automatically revert to Available.',
      ],
      tip: 'Attempting to reserve a pending plot triggers a conflict prevention toast.',
    },
    {
      step: 7,
      title: 'Assignment Queue Auto-Assign & Excel Import Wizard',
      role: 'Administrator or Moderator',
      route: '/assignments',
      keyActions: [
        'Open "/assignments": Review workload cards showing active vs overdue leads for all 4 sales reps.',
        'Click "Auto-assign (round-robin)": Review confirmation modal and distribute unassigned leads.',
        'Navigate to "/import" (Excel Import Wizard): Walk through the 4 steps (Upload, Map Columns, Validate Preview with duplicate detection, Done).',
      ],
      tip: 'Row #1 detects an existing phone number and flags it for automatic duplicate prevention.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5 text-[#14532D]" />
          <span>Screen Recording Walkthrough Script</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          7-Step Demo Video Recording Guide
        </h1>
        <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
          Use this sequential walkthrough to present the complete PlotNest platform prototype.
          Every feature—from domain logic deed restrictions to round-robin queues and bilingual Devanagari labels—is verified and interactive.
        </p>

        <div className="mt-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
          <span>
            🔑 <strong>Demo Mobile OTP:</strong> <code className="font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-gray-200">123456</code>
          </span>
          <span>•</span>
          <span>
            🌐 <strong>Language Toggle:</strong> EN / हिं in Header
          </span>
          <span>•</span>
          <span>
            ⚙️ <strong>Simulate Error State:</strong> Demo Settings Menu in Header
          </span>
        </div>
      </div>

      {/* 7 Steps List */}
      <div className="space-y-5">
        {steps.map((s) => (
          <div
            key={s.step}
            className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs hover:border-[#14532D]/40 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#14532D] text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                  {s.step}
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">{s.title}</h2>
                  <span className="text-xs font-bold text-emerald-800">
                    Recommended Role: {s.role}
                  </span>
                </div>
              </div>

              <Link
                to={s.route}
                className="touch-target px-4 py-2 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#14532D] font-bold text-xs border border-[#BBF7D0] flex items-center gap-1.5 self-start sm:self-center"
              >
                <span>Open {s.route}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Actions to Demonstrate:
              </span>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {s.keyActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] text-xs text-gray-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Presenter Tip:</strong> {s.tip}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
