import React, { useState } from 'react';
import { usePlotNest } from '../context/PlotNestContext';
import { SiteVisit, VisitExpense } from '../types';
import { mockAgents, mockProjects } from '../data/mockData';
import { EmptyState } from '../components/EmptyState';
import {
  Calendar,
  List,
  CheckCircle2,
  Clock,
  Car,
  Receipt,
  Plus,
  User,
  MapPin,
  Phone,
  FileText,
  Upload,
  AlertCircle,
  X,
  Building,
} from 'lucide-react';

export const SiteVisitsPage: React.FC = () => {
  const {
    siteVisits,
    completeSiteVisit,
    addVisitExpense,
    bookSiteVisit,
    language,
    t,
    showToast,
  } = usePlotNest();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedVisit, setSelectedVisit] = useState<SiteVisit | null>(null);

  // Mark complete modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  // Add expense modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('1500');
  const [expenseCategory, setExpenseCategory] = useState<VisitExpense['category']>('fuel');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [mockReceiptName, setMockReceiptName] = useState('fuel_pump_receipt_1500.jpg');

  // Book Visit modal
  const [showBookModal, setShowBookModal] = useState(false);
  const [newVisitorName, setNewVisitorName] = useState('');
  const [newVisitorPhone, setNewVisitorPhone] = useState('');
  const [newProjectId, setNewProjectId] = useState(mockProjects[0].id);
  const [newDate, setNewDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [newTimeSlot, setNewTimeSlot] = useState('10:30 AM');
  const [newPickup, setNewPickup] = useState('Bengaluru Silk Board');
  const [newAssignedTo, setNewAssignedTo] = useState(mockAgents[0].id);

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit) return;

    if (!feedbackComment.trim() || feedbackComment.trim().length < 5) {
      setFeedbackError('Mandatory feedback comment of at least 5 characters is required.');
      return;
    }

    const res = completeSiteVisit(selectedVisit.id, feedbackComment.trim());
    if (res.success) {
      setShowCompleteModal(false);
      setFeedbackComment('');
      setFeedbackError('');
      setSelectedVisit(null);
    }
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit) return;
    const amountNum = parseFloat(expenseAmount);
    if (!amountNum || amountNum <= 0) {
      showToast('Validation Error', 'Expense amount must be greater than 0', 'error');
      return;
    }

    addVisitExpense(selectedVisit.id, {
      amount: amountNum,
      category: expenseCategory,
      date: expenseDate,
      description: expenseDesc || `${expenseCategory} reimbursement for site trip`,
      receiptFileName: mockReceiptName,
      receiptProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    });

    setShowExpenseModal(false);
    setExpenseDesc('');
    setSelectedVisit(null);
  };

  const handleBookVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitorName.trim() || newVisitorPhone.trim().length < 10) {
      showToast('Error', 'Please provide visitor name and valid 10-digit phone', 'error');
      return;
    }

    const proj = mockProjects.find((p) => p.id === newProjectId) || mockProjects[0];
    const rep = mockAgents.find((a) => a.id === newAssignedTo) || mockAgents[0];

    bookSiteVisit({
      visitorName: newVisitorName.trim(),
      visitorPhone: newVisitorPhone.trim().startsWith('+91') ? newVisitorPhone.trim() : `+91 ${newVisitorPhone.trim()}`,
      projectId: proj.id,
      projectName: proj.name,
      scheduledDate: newDate,
      timeSlot: newTimeSlot,
      pickupLocation: newPickup,
      assignedToId: rep.id,
      assignedToName: rep.name,
    });

    setShowBookModal(false);
    setNewVisitorName('');
    setNewVisitorPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {language === 'hi' ? 'साइट विज़िट्स एवं फील्ड खर्च' : 'Site Visits & Field Expenses'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'hi'
              ? 'ग्राहक विज़िट्स शेड्यूल करें, फीडबैक दर्ज करें एवं पेट्रोल व खानपान खर्च जोड़ें'
              : 'Schedule client tours, record mandatory field feedback, and log expenses with receipts'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* List vs Calendar Toggle */}
          <div className="inline-flex rounded-2xl bg-white border border-[#E5DFD5] p-1 shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`touch-target px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-[#14532D] text-white shadow-xs' : 'text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`touch-target px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'calendar' ? 'bg-[#14532D] text-white shadow-xs' : 'text-gray-600'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={() => setShowBookModal(true)}
            className="touch-target px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>{language === 'hi' ? '+ विज़िट बुक करें' : '+ Schedule Visit'}</span>
          </button>
        </div>
      </div>

      {/* Calendar View Placeholder / Timeline representation */}
      {viewMode === 'calendar' ? (
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className="font-extrabold text-lg text-gray-900">
              Site Visit Inspection Calendar (October / November 2026)
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {siteVisits.length} visits total
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['2026-10-20', '2026-10-21', '2026-10-29', '2026-10-31'].map((dateKey) => {
              const dateVisits = siteVisits.filter((v) => v.scheduledDate === dateKey);
              return (
                <div key={dateKey} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-2">
                  <div className="flex items-center justify-between font-bold text-sm text-[#14532D] border-b pb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{dateKey}</span>
                    </span>
                    <span className="text-xs text-gray-500">{dateVisits.length} tours</span>
                  </div>

                  {dateVisits.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No scheduled tours</p>
                  ) : (
                    dateVisits.map((v) => (
                      <div
                        key={v.id}
                        className="p-3 rounded-xl bg-white border border-gray-200 text-xs space-y-1 shadow-xs"
                      >
                        <div className="flex justify-between font-bold">
                          <span>{v.visitorName}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              v.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>
                        <p className="text-gray-600">{v.projectName} • {v.timeSlot}</p>
                        <p className="text-gray-400">Rep: {v.assignedToName}</p>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {siteVisits.map((visit) => {
            const isCompleted = visit.status === 'completed';
            const totalExpense = visit.expenses.reduce((sum, e) => sum + e.amount, 0);

            return (
              <div
                key={visit.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs hover:border-[#14532D]/30 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE1] pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-xl text-gray-900">{visit.visitorName}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-purple-100 text-purple-900 border border-purple-300'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'Scheduled'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-3">
                      <span>📞 {visit.visitorPhone}</span>
                      <span>•</span>
                      <span>ID: {visit.id}</span>
                      <span>•</span>
                      <span>Lead: {visit.leadId}</span>
                    </p>
                  </div>

                  {/* Actions for this visit */}
                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <button
                        onClick={() => {
                          setSelectedVisit(visit);
                          setShowCompleteModal(true);
                        }}
                        className="touch-target px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === 'hi' ? 'पूर्ण चिह्नित करें' : 'Mark Complete'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedVisit(visit);
                        setShowExpenseModal(true);
                      }}
                      className="touch-target px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE8] border border-[#DDD5C8] text-xs font-bold text-gray-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Receipt className="w-4 h-4 text-[#14532D]" />
                      <span>{language === 'hi' ? '+ खर्च जोड़ें' : '+ Add Expense'}</span>
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                    <span className="text-gray-500 block">Project / Plot</span>
                    <span className="font-bold text-gray-900 block mt-0.5">
                      {visit.projectName} {visit.plotOfInterest ? `(Plot ${visit.plotOfInterest})` : ''}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                    <span className="text-gray-500 block">Date & Time</span>
                    <span className="font-bold text-gray-900 block mt-0.5">
                      {visit.scheduledDate} at {visit.timeSlot}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                    <span className="text-gray-500 block">Pickup Hub</span>
                    <span className="font-bold text-gray-900 block mt-0.5 truncate">
                      {visit.pickupLocation}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                    <span className="text-gray-500 block">Assigned Executive</span>
                    <span className="font-bold text-emerald-900 block mt-0.5 truncate">
                      {visit.assignedToName} ({visit.assignedRole})
                    </span>
                  </div>
                </div>

                {/* Mandatory Feedback Display */}
                {visit.feedbackComment ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs">
                    <span className="font-bold text-emerald-950 uppercase tracking-wider block mb-1">
                      Recorded Field Feedback (Mandatory):
                    </span>
                    <p className="text-emerald-900 italic font-medium">"{visit.feedbackComment}"</p>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      Mandatory field feedback comment must be submitted when completing this tour.
                    </span>
                  </div>
                )}

                {/* Expenses Breakdown */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Logged Expenses ({visit.expenses.length}):
                    </span>
                    <span className="text-xs font-extrabold text-[#14532D]">
                      Total: ₹{totalExpense}
                    </span>
                  </div>

                  {visit.expenses.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No expenses submitted yet for this site trip.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {visit.expenses.map((exp) => (
                        <div
                          key={exp.id}
                          className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] text-xs space-y-1.5"
                        >
                          <div className="flex justify-between font-bold">
                            <span className="capitalize text-gray-800">{exp.category}</span>
                            <span className="text-[#14532D]">₹{exp.amount}</span>
                          </div>
                          <p className="text-gray-600 text-[11px] leading-snug">{exp.description}</p>
                          <div className="pt-1 flex items-center justify-between text-[10px] text-gray-400">
                            <span>{exp.date}</span>
                            {exp.receiptFileName && (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                <Receipt className="w-3 h-3" />
                                <span>{exp.receiptFileName}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mark Complete Modal */}
      {showCompleteModal && selectedVisit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-xl font-bold text-[#14532D]">
                  Complete Site Visit
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tour for {selectedVisit.visitorName} ({selectedVisit.projectName})
                </p>
              </div>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Mandatory Feedback Comment * (Required, min 5 chars)
                </label>
                <textarea
                  rows={4}
                  value={feedbackComment}
                  onChange={(e) => {
                    setFeedbackComment(e.target.value);
                    setFeedbackError('');
                  }}
                  placeholder="Record client reactions, soil/water inspection feedback, plot preferences, and loan readiness..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
                  required
                />
                {feedbackError && (
                  <p className="text-xs text-rose-600 font-bold mt-1">{feedbackError}</p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                ✓ Completing this visit updates the CRM lead status to <strong>Visit Completed</strong> and unlocks the sale conversion pathway.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="touch-target px-4 py-2 rounded-xl border text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-sm font-bold hover:bg-[#166534]"
                >
                  Submit Feedback & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal with Receipt Upload Preview */}
      {showExpenseModal && selectedVisit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-xl font-bold text-[#14532D]">
                  Submit Trip Expense
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  For tour: {selectedVisit.visitorName}
                </p>
              </div>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    min={50}
                    step={50}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  >
                    <option value="fuel">Fuel / Diesel</option>
                    <option value="refreshments">Lunch / Refreshments</option>
                    <option value="driver">Cab / Driver Allowance</option>
                    <option value="materials">Site Materials / Water</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Expense Date *
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description / Purpose
                </label>
                <input
                  type="text"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  placeholder="e.g. Innova diesel fillup at Hosur BPCL"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              {/* Receipt Upload Preview Mock */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Receipt / Proof Upload Preview
                </label>
                <div className="p-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-6 h-6 text-emerald-700" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">{mockReceiptName}</p>
                      <p className="text-[10px] text-gray-400">Image attached (148 KB)</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="touch-target px-4 py-2 rounded-xl border text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-sm font-bold hover:bg-[#166534]"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Visit Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-bold text-[#14532D]">
                Schedule Client Site Visit
              </h3>
              <button
                onClick={() => setShowBookModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookVisitSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Visitor Full Name *
                </label>
                <input
                  type="text"
                  value={newVisitorName}
                  onChange={(e) => setNewVisitorName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
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
                    value={newVisitorPhone}
                    onChange={(e) => setNewVisitorPhone(e.target.value)}
                    placeholder="98201 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Project *
                  </label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                  >
                    {mockProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                  >
                    <option value="09:30 AM">09:30 AM Morning</option>
                    <option value="11:00 AM">11:00 AM Tour</option>
                    <option value="02:30 PM">02:30 PM Afternoon</option>
                    <option value="04:30 PM">04:30 PM Sunset Tour</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={newPickup}
                    onChange={(e) => setNewPickup(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Assign Field Executive
                  </label>
                  <select
                    value={newAssignedTo}
                    onChange={(e) => setNewAssignedTo(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm"
                  >
                    {mockAgents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.designation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="touch-target px-4 py-2 rounded-xl border text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-sm font-bold hover:bg-[#166534]"
                >
                  Schedule Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
