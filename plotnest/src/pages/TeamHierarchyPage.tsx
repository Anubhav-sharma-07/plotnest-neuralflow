import React, { useState } from 'react';
import { usePlotNest } from '../context/PlotNestContext';
import { AgentHierarchyNode } from '../types';
import { mockTeamHierarchy } from '../data/mockData';
import { formatINR } from '../utils/rules';
import {
  Network,
  Search,
  ChevronDown,
  ChevronRight,
  User,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Trophy,
  Phone,
  Mail,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const TeamHierarchyPage: React.FC = () => {
  const { language } = usePlotNest();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentHierarchyNode>(mockTeamHierarchy);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to render tree nodes recursively
  const renderTreeNode = (node: AgentHierarchyNode, depth: number = 0) => {
    const isSelected = selectedAgent.id === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodes[node.id];

    // Filter matching
    const matchesSearch =
      searchTerm.trim() === '' ||
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.designation.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      <div key={node.id} className="space-y-1">
        <div
          style={{ paddingLeft: `${Math.min(depth * 18, 120)}px` }}
          className="flex items-center gap-1.5"
        >
          {hasChildren ? (
            <button
              onClick={() => toggleCollapse(node.id)}
              className="touch-target p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer"
              aria-label={isCollapsed ? 'Expand node' : 'Collapse node'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-emerald-800" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-800" />
              )}
            </button>
          ) : (
            <div className="w-6 h-6 shrink-0" />
          )}

          <div
            onClick={() => setSelectedAgent(node)}
            className={`touch-target flex-1 p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
              isSelected
                ? 'bg-[#14532D] text-white border-[#14532D] shadow-sm'
                : matchesSearch && searchTerm
                ? 'bg-amber-50 text-gray-900 border-amber-300'
                : 'bg-white text-gray-800 border-[#E5DFD5] hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#14532D]/10 text-[#14532D]'
                }`}
              >
                L{node.level}
              </span>
              <div className="min-w-0">
                <span className="font-extrabold text-xs sm:text-sm block truncate">
                  {node.name}
                </span>
                <span
                  className={`text-[11px] block truncate ${
                    isSelected ? 'text-emerald-200' : 'text-gray-500'
                  }`}
                >
                  {language === 'hi' ? node.hindiDesignation : node.designation}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`text-xs font-mono font-bold ${
                  isSelected ? 'text-yellow-300' : 'text-[#14532D]'
                }`}
              >
                {node.unitsSold} units
              </span>
            </div>
          </div>
        </div>

        {/* Children Render */}
        {hasChildren && !isCollapsed && (
          <div className="space-y-1">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {language === 'hi' ? 'टीम पदानुक्रम एवं एजेंट प्रोफाइल' : '15-Level Team Hierarchy & Agent Profiles'}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {language === 'hi'
            ? 'प्रशिक्षु सेल्स एग्जीक्यूटिव (स्तर 1) से बोर्ड सेल्स डायरेक्टर (स्तर 15) तक का संगठन चार्ट'
            : 'Corporate sales leadership chain from Trainee Executive to Board Sales Director'}
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by executive name or level designation..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
          />
        </div>
      </div>

      {/* 2-Column: Expandable Tree on Left, Profile Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Expandable Tree */}
        <div className="lg:col-span-7 p-4 sm:p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs space-y-3 max-h-[750px] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Expandable Organization Structure
            </span>
            <span className="text-xs text-emerald-800 font-bold">15 Levels Active</span>
          </div>
          {renderTreeNode(mockTeamHierarchy)}
        </div>

        {/* Selected Agent Profile Card with Masked Payout Details */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="p-6 rounded-3xl bg-white border-2 border-[#14532D] shadow-xl space-y-5 animate-in fade-in">
            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-[#14532D] text-white flex items-center justify-center font-black text-xl shadow-md">
                L{selectedAgent.level}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Level {selectedAgent.level} Executive
                </span>
                <h3 className="text-2xl font-black text-gray-900 truncate mt-0.5">
                  {selectedAgent.name}
                </h3>
                <p className="text-xs text-gray-600 font-semibold truncate">
                  {language === 'hi' ? selectedAgent.hindiDesignation : selectedAgent.designation}
                </p>
              </div>
            </div>

            {/* Performance Metric Counters */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                <span className="text-[11px] text-gray-500 font-bold block">Assigned Leads</span>
                <span className="text-lg font-black text-gray-900 mt-0.5 block">
                  {selectedAgent.leadsCount}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                <span className="text-[11px] text-gray-500 font-bold block">Units Sold</span>
                <span className="text-lg font-black text-[#14532D] mt-0.5 block">
                  {selectedAgent.unitsSold}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9]">
                <span className="text-[11px] text-gray-500 font-bold block">Total Volume</span>
                <span className="text-sm font-black text-emerald-900 mt-1 block">
                  {formatINR(selectedAgent.totalEarningsINR)}
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{selectedAgent.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{selectedAgent.email}</span>
              </div>
            </div>

            {/* Masked Payout & Compliance Details */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>Masked Banking & Payout Credentials</span>
                </span>
                <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-900">
                  Verified KYC
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-700 font-medium">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Account:</span>
                  <span className="font-mono font-bold text-gray-900">{selectedAgent.accountMasked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank IFSC:</span>
                  <span className="font-mono font-bold text-gray-900">{selectedAgent.ifscMasked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Name:</span>
                  <span className="font-bold text-gray-900">{selectedAgent.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Income Tax PAN:</span>
                  <span className="font-mono font-bold text-gray-900">{selectedAgent.panMasked}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center">
              Security Notice: Bank accounts and PAN numbers are masked per RBI/DPDP guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
