import React from 'react';
import { Link } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { mockCustomerBooking, mockAgents, mockProjects } from '../data/mockData';
import { formatINR, isFollowUpOverdue } from '../utils/rules';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Users,
  Trophy,
  Calendar,
  Clock,
  TrendingUp,
  MapPin,
  Download,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Wallet,
  ShieldCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { role, leads, plots, siteVisits, language, currentUserName, showToast } = usePlotNest();

  // 1. Admin Analytics Data
  const funnelData = [
    { stage: 'New', count: leads.filter((l) => l.status === 'new').length, fill: '#10B981' },
    { stage: 'Assigned', count: leads.filter((l) => l.status === 'assigned').length, fill: '#0EA5E9' },
    { stage: 'Contacted', count: leads.filter((l) => l.status === 'contacted').length, fill: '#6366F1' },
    { stage: 'Follow-up', count: leads.filter((l) => l.status === 'follow_up').length, fill: '#F59E0B' },
    { stage: 'Visit Sched.', count: leads.filter((l) => l.status === 'visit_scheduled').length, fill: '#8B5CF6' },
    { stage: 'Visit Done', count: leads.filter((l) => l.status === 'visit_completed').length, fill: '#14B8A6' },
    { stage: 'Converted', count: leads.filter((l) => l.status === 'converted').length, fill: '#166534' },
  ];

  const plotStatusData = [
    { name: 'Available', value: plots.filter((p) => p.status === 'available').length, color: '#16A34A' },
    { name: 'Hold / Pending', value: plots.filter((p) => p.status === 'reservation_pending').length, color: '#D97706' },
    { name: 'Booked', value: plots.filter((p) => p.status === 'booked').length, color: '#2563EB' },
    { name: 'Sold', value: plots.filter((p) => p.status === 'sold').length, color: '#DC2626' },
    { name: 'Blocked', value: plots.filter((p) => p.status === 'blocked').length, color: '#6B7280' },
  ];

  const financialData = [
    { month: 'Jul 2026', bookedCr: 1.15, collectedCr: 0.95 },
    { month: 'Aug 2026', bookedCr: 1.48, collectedCr: 1.20 },
    { month: 'Sep 2026', bookedCr: 1.82, collectedCr: 1.42 },
    { month: 'Oct 2026', bookedCr: 2.25, collectedCr: 1.68 },
  ];

  // 2. Sales Person Data (Aarav Sharma)
  const salesLeads = leads.filter((l) => l.assignedToId === 'user-sales-1');
  const overdueFollowups = salesLeads.filter(
    (l) => isFollowUpOverdue(l.nextFollowUpDate) && l.status !== 'converted' && l.status !== 'closed_lost'
  );
  const myVisits = siteVisits.filter((v) => v.assignedToId === 'user-sales-1');

  // 3. Agent Commission States (Vikram Rajput / Channel Agent)
  const commissionData = {
    estimated: 480000,
    eligible: 240000,
    approved: 180000,
    paid: 820000,
    teamSize: 18,
    activeDownlines: 11,
  };

  const handleDownloadDoc = (title: string) => {
    showToast(
      language === 'hi' ? 'दस्तावेज़ डाउनलोड' : 'Document Download',
      `Downloading verified copy of: ${title}`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#14532D] to-emerald-900 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300 block">
            {role.toUpperCase()} WORKSPACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {language === 'hi' ? `स्वागत है, ${currentUserName}` : `Welcome back, ${currentUserName}`}
          </h1>
          <p className="text-sm text-emerald-100 mt-1">
            PlotNest Farm Land Sales & CRM • Bangalore & Pune Estates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/plots"
            className="touch-target px-4 py-2 rounded-xl bg-white text-[#14532D] font-bold text-xs hover:bg-emerald-50 shadow-xs"
          >
            {language === 'hi' ? 'प्लॉट इन्वेंट्री' : 'Plot Map'}
          </Link>
          <Link
            to="/visits"
            className="touch-target px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 border border-emerald-600"
          >
            {language === 'hi' ? 'साइट विज़िट्स' : 'Site Visits'}
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. CUSTOMER DASHBOARD */}
      {/* ======================================================== */}
      {role === 'customer' && (
        <div className="space-y-6">
          {/* Customer Plot Summary Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE1] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {language === 'hi' ? 'मेरी आवंटित कृषि भूमि' : 'My Allocated Farm Land Plot'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-0.5">
                  Plot {mockCustomerBooking.plotNumber} • {mockCustomerBooking.projectName}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Booking ID: {mockCustomerBooking.id} • Registered on {mockCustomerBooking.bookingDate}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                {mockCustomerBooking.registrationStatus}
              </span>
            </div>

            {/* Payment Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-700">
                  {language === 'hi' ? 'भुगतान प्रगति (60% पूर्ण)' : 'Payment Milestone Progress (60% Completed)'}
                </span>
                <span className="text-[#14532D] font-extrabold">
                  ₹{mockCustomerBooking.paidAmount / 100000} Lakh of ₹{mockCustomerBooking.totalPrice / 100000} Lakh
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-[#14532D] rounded-full transition-all duration-500"
                  style={{ width: `${(mockCustomerBooking.paidAmount / mockCustomerBooking.totalPrice) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500 flex justify-between">
                <span>Advance Token & Agreement executed</span>
                <span>Registry balance due at deed signing</span>
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                <span className="text-gray-500 block">Plot Dimensions</span>
                <span className="text-sm font-bold text-gray-900 mt-0.5 block">10 Guntas (10,890 sq ft)</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                <span className="text-gray-500 block">Managed Timber</span>
                <span className="text-sm font-bold text-emerald-800 mt-0.5 block">50 Malabar Neem + 15 Sandalwood</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                <span className="text-gray-500 block">Drip Irrigation</span>
                <span className="text-sm font-bold text-gray-900 mt-0.5 block">Automated Israeli Drip Active</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                <span className="text-gray-500 block">Weekend Stay</span>
                <span className="text-sm font-bold text-gray-900 mt-0.5 block">Clubhouse Guest Pass Active</span>
              </div>
            </div>
          </div>

          {/* Legal Documents Repository */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-700" />
              <span>{language === 'hi' ? 'कानूनी दस्तावेज एवं 7/12 प्रमाण पत्र' : 'Verified Legal Clearances & Title Records'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockCustomerBooking.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] flex items-center justify-between gap-3 hover:border-emerald-600 transition-colors"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 truncate">{doc.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{doc.type} • {doc.date}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadDoc(doc.title)}
                    className="touch-target p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0"
                    aria-label={`Download ${doc.title}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SALES PERSON WORKSPACE */}
      {/* ======================================================== */}
      {role === 'sales_person' && (
        <div className="space-y-6">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold">
                <span>{language === 'hi' ? 'मेरी सक्रिय लीड्स' : 'My Active Leads'}</span>
                <Users className="w-5 h-5 text-emerald-700" />
              </div>
              <p className="text-3xl font-black text-gray-900">{salesLeads.length}</p>
              <p className="text-xs text-emerald-800 font-semibold">Direct pipeline assignment</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold">
                <span>{language === 'hi' ? 'अतिदेय फॉलो-अप' : 'Overdue Follow-ups'}</span>
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <p className="text-3xl font-black text-rose-700">{overdueFollowups.length}</p>
              <p className="text-xs text-rose-600 font-semibold">Immediate attention needed</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold">
                <span>{language === 'hi' ? 'साइट विज़िट्स' : 'Scheduled Tours'}</span>
                <Calendar className="w-5 h-5 text-purple-700" />
              </div>
              <p className="text-3xl font-black text-purple-900">{myVisits.length}</p>
              <p className="text-xs text-purple-800 font-semibold">Complimentary AC cab tours</p>
            </div>
          </div>

          {/* Overdue Queue */}
          {overdueFollowups.length > 0 && (
            <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-300 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-rose-950 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span>Due & Overdue Follow-up Actions</span>
                </h3>
                <Link to="/leads?overdue=1" className="text-xs font-bold text-rose-800 hover:underline">
                  View in Leads &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {overdueFollowups.map((l) => (
                  <div
                    key={l.id}
                    className="p-3.5 rounded-2xl bg-white border border-rose-200 text-xs flex justify-between items-center"
                  >
                    <div>
                      <Link to={`/leads/${l.id}`} className="font-black text-sm text-gray-900 hover:underline">
                        {l.name}
                      </Link>
                      <p className="text-gray-500 mt-0.5">{l.phone} • {l.interestedProjectName}</p>
                      <p className="text-rose-700 font-bold mt-0.5">Due: {l.nextFollowUpDate}</p>
                    </div>
                    <Link
                      to={`/leads/${l.id}`}
                      className="touch-target px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold"
                    >
                      Action
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. AGENT WORKSPACE (Commissions & Team) */}
      {/* ======================================================== */}
      {role === 'agent' && (
        <div className="space-y-6">
          {/* Commission States (Estimated, Eligible, Approved, Paid) */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-700" />
              <span>Channel Partner Commission Payout Tracker</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-amber-200">
                <span className="text-xs font-bold text-gray-500 block">1. Estimated Commission</span>
                <span className="text-xl font-black text-amber-800 mt-1 block">
                  ₹{(commissionData.estimated / 100000).toFixed(2)} Lakh
                </span>
                <p className="text-[11px] text-gray-500 mt-1">Pending token clears</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-sky-200">
                <span className="text-xs font-bold text-gray-500 block">2. Eligible for Payout</span>
                <span className="text-xl font-black text-sky-800 mt-1 block">
                  ₹{(commissionData.eligible / 100000).toFixed(2)} Lakh
                </span>
                <p className="text-[11px] text-gray-500 mt-1">Agreement executed</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-indigo-200">
                <span className="text-xs font-bold text-gray-500 block">3. Approved by Finance</span>
                <span className="text-xl font-black text-indigo-800 mt-1 block">
                  ₹{(commissionData.approved / 100000).toFixed(2)} Lakh
                </span>
                <p className="text-[11px] text-gray-500 mt-1">Ready for RTGS</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300">
                <span className="text-xs font-bold text-emerald-900 block">4. Total Paid to Date</span>
                <span className="text-xl font-black text-[#14532D] mt-1 block">
                  ₹{(commissionData.paid / 100000).toFixed(2)} Lakh
                </span>
                <p className="text-[11px] text-emerald-800 mt-1">Direct bank credited</p>
              </div>
            </div>

            {/* Team Downlines */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-600">
                Channel Team Size: <strong>{commissionData.teamSize} Partners</strong> (
                {commissionData.activeDownlines} active this month)
              </span>
              <Link to="/team" className="font-bold text-[#14532D] hover:underline">
                View Hierarchy Tree &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. ADMIN & MODERATOR DASHBOARD (Full Analytics & Recharts) */}
      {/* ======================================================== */}
      {(role === 'admin' || role === 'moderator') && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">Total Inquiries</span>
              <span className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 block">
                {leads.length}
              </span>
              <p className="text-[11px] text-emerald-700 font-bold mt-1">Meta + Google Ads</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">Total Plots Sold / Booked</span>
              <span className="text-2xl sm:text-3xl font-black text-[#14532D] mt-1 block">
                {plots.filter((p) => p.status === 'sold' || p.status === 'booked').length} / 40
              </span>
              <p className="text-[11px] text-gray-500 mt-1">45% Estate Occupied</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">Gross Booked Value</span>
              <span className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 block">
                ₹6.70 Cr
              </span>
              <p className="text-[11px] text-emerald-700 font-bold mt-1">+18% this quarter</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">Collections Realized</span>
              <span className="text-2xl sm:text-3xl font-black text-[#14532D] mt-1 block">
                ₹5.25 Cr
              </span>
              <p className="text-[11px] text-gray-500 mt-1">78.3% realization</p>
            </div>
          </div>

          {/* Charts Row: Funnel Chart & Plots by Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Lead Funnel Chart */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-gray-900">
                Lead Conversion Pipeline Funnel
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <XAxis
                      dataKey="stage"
                      interval={0}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      angle={-25}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} />
                    <Tooltip
                      formatter={(val: any) => [`${val} Leads`, 'Count']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5DFD5' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plots by Status Pie Chart */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-gray-900">
                Plot Inventory Distribution (40 Plots)
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={plotStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {plotStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val} Plots`, 'Plots']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5DFD5' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Booked Value vs Collections Realized */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-gray-900">
                Booked Value vs Collections Realized (in ₹ Crores)
              </h3>
              <span className="text-xs text-gray-500 font-semibold">Q3 2026 Fiscal Trend</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <Tooltip
                    formatter={(val: any) => [`₹${val} Cr`, '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5DFD5' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="bookedCr" name="Booked Value (₹ Cr)" fill="#14532D" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="collectedCr" name="Realized Collections (₹ Cr)" fill="#34D399" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performing Sales Reps & Agents Table */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-gray-900">
                Top Performing Sales Executives & Channel Partners
              </h3>
              <Link to="/team" className="text-xs font-bold text-[#14532D] hover:underline">
                View All Team Hierarchy &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-[#FAF8F5] text-gray-900 uppercase font-bold border-b border-[#EAE4D9]">
                  <tr>
                    <th className="p-3">Partner Name</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-right">Units Sold</th>
                    <th className="p-3 text-right">Volume (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockAgents.slice(0, 5).map((agent, i) => (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{agent.name}</td>
                      <td className="p-3">{agent.designation}</td>
                      <td className="p-3 capitalize">{agent.role.replace('_', ' ')}</td>
                      <td className="p-3 text-right font-extrabold text-[#14532D]">{14 - i * 2}</td>
                      <td className="p-3 text-right font-mono font-bold">
                        ₹{(3.2 - i * 0.45).toFixed(2)} Cr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
