import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { Role } from '../types';
import {
  Trees,
  Bell,
  Globe,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Sliders,
  AlertTriangle,
  Clock,
  Palette,
  BookOpen,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    t,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    simulateError,
    setSimulateError,
    fastForward24Hours,
  } = usePlotNest();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showDemoSettings, setShowDemoSettings] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
      if (demoRef.current && !demoRef.current.contains(event.target as Node)) {
        setShowDemoSettings(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const rolesList: { id: Role; labelEn: string; labelHi: string; descEn: string }[] = [
    {
      id: 'admin',
      labelEn: 'Admin',
      labelHi: 'एडमिन (प्रशासक)',
      descEn: 'Full system access & all leads',
    },
    {
      id: 'moderator',
      labelEn: 'Moderator',
      labelHi: 'मॉडरेटर',
      descEn: 'Lead assignment & review',
    },
    {
      id: 'sales_person',
      labelEn: 'Sales Person',
      labelHi: 'सेल्स पर्सन',
      descEn: 'Assigned leads & follow-ups',
    },
    {
      id: 'agent',
      labelEn: 'Channel Agent',
      labelHi: 'एजेंट (पार्टनर)',
      descEn: 'Partner leads & commissions',
    },
    {
      id: 'customer',
      labelEn: 'Customer',
      labelHi: 'ग्राहक (खरीदार)',
      descEn: 'Own bookings & plot documents',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E1D5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="touch-target flex items-center gap-2.5 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
              aria-label="PlotNest Home"
            >
              <div className="w-10 h-10 rounded-xl bg-[#14532D] text-white flex items-center justify-center shadow-sm">
                <Trees className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-[#14532D] tracking-tight block leading-none">
                  PlotNest
                </span>
                <span className="text-xs text-[#6B7280] font-medium hidden sm:block">
                  {language === 'hi' ? 'फार्म लैंड सेल्स व ग्राहक मंच' : 'Farm Land Sales & CRM'}
                </span>
              </div>
            </Link>

            {/* Quick Public Site pill */}
            {location.pathname !== '/' && (
              <Link
                to="/"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#14532D] bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'पब्लिक वेबसाइट' : 'Public Landing'}</span>
              </Link>
            )}
          </div>

          {/* Right Controls: Language Toggle, Role Switcher, Demo Settings, Notification Bell */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle: EN / हिं */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="touch-target px-3 py-2 rounded-xl text-sm font-semibold border border-[#E5E0D8] bg-[#FAF8F5] hover:bg-[#F3EFE8] text-[#1F2937] flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#14532D] transition-all"
              aria-label="Toggle language between English and Hindi"
              title="Switch language EN / हिं"
            >
              <Globe className="w-4 h-4 text-[#14532D]" />
              <span className="font-bold">{language === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {/* Demo Settings Dropdown (Error simulation & Fast-forward 24h) */}
            <div className="relative" ref={demoRef}>
              <button
                onClick={() => setShowDemoSettings(!showDemoSettings)}
                className={`touch-target p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-all ${
                  simulateError
                    ? 'border-amber-400 bg-amber-50 text-amber-900 animate-pulse'
                    : 'border-[#E5E0D8] bg-[#FAF8F5] hover:bg-[#F3EFE8] text-[#374151]'
                }`}
                aria-label="Demo controls"
                title="Demo settings & simulation"
              >
                <Sliders className="w-4 h-4 text-[#14532D]" />
                <span className="hidden md:inline font-bold">
                  {simulateError ? '⚠️ Error ON' : 'Demo Settings'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {showDemoSettings && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="pb-2 mb-2 border-b border-[#F0EBE1]">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Demo Showcase Tools
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Simulate edge conditions for review recording
                    </p>
                  </div>

                  <div className="space-y-2">
                    {/* Simulate Error Toggle */}
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Simulate Error State</span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Shows error panels with Retry action
                        </p>
                      </div>
                      <button
                        onClick={() => setSimulateError(!simulateError)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          simulateError
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {simulateError ? 'Active' : 'Off'}
                      </button>
                    </div>

                    {/* Fast Forward 24h Demo Action */}
                    <button
                      onClick={() => {
                        fastForward24Hours();
                        setShowDemoSettings(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-emerald-50 border border-[#EBE4D8] text-xs font-bold text-gray-800 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#14532D]" />
                        <div>
                          <div>Fast-forward 24h (Hold Expiry)</div>
                          <div className="text-[10px] font-normal text-gray-500">
                            Reverts pending plots to Available
                          </div>
                        </div>
                      </div>
                      <span className="text-emerald-700 font-extrabold">&rarr;</span>
                    </button>

                    {/* Design System & Demo Guide Links */}
                    <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
                      <Link
                        to="/design"
                        onClick={() => setShowDemoSettings(false)}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-emerald-50 text-[11px] font-bold text-[#14532D] flex items-center justify-center gap-1.5"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Design System</span>
                      </Link>
                      <Link
                        to="/demo-guide"
                        onClick={() => setShowDemoSettings(false)}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-emerald-50 text-[11px] font-bold text-[#14532D] flex items-center justify-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Demo Guide</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Role Switcher Dropdown */}
            <div className="relative" ref={roleRef}>
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="touch-target px-3 py-2 rounded-xl text-sm font-semibold bg-[#14532D] text-white hover:bg-[#166534] flex items-center gap-2 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-400 transition-all"
                aria-expanded={showRoleMenu}
                aria-haspopup="true"
                aria-label="Switch Demo User Role"
              >
                <UserCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                <div className="text-left hidden sm:block leading-tight">
                  <span className="text-[10px] uppercase tracking-wider block text-emerald-200">
                    {language === 'hi' ? 'भूमिका' : 'Demo as'}
                  </span>
                  <span className="text-xs font-bold capitalize">
                    {rolesList.find((r) => r.id === role)?.[language === 'hi' ? 'labelHi' : 'labelEn']}
                  </span>
                </div>
                <span className="sm:hidden text-xs font-bold uppercase">{role.replace('_', ' ')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E5E0D8] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-[#F0EBE1]">
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                      {language === 'hi' ? 'डेमो भूमिका चुनें:' : 'Select Demo Role:'}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {language === 'hi'
                        ? 'विभिन्न अनुमतियों और दृश्य का परीक्षण करें'
                        : 'Simulates view & data permissions'}
                    </p>
                  </div>
                  <div className="p-1 space-y-1">
                    {rolesList.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRole(r.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-start gap-3 transition-colors ${
                          role === r.id
                            ? 'bg-[#F0FDF4] text-[#14532D] font-bold border border-[#BBF7D0]'
                            : 'hover:bg-[#FAF8F5] text-[#374151]'
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            role === r.id ? 'border-[#14532D] bg-[#14532D]' : 'border-gray-300'
                          }`}
                        >
                          {role === r.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">
                            {language === 'hi' ? r.labelHi : r.labelEn}
                          </div>
                          <div className="text-xs text-[#6B7280]">{r.descEn}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell with Badge */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="touch-target p-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] hover:bg-[#F3EFE8] text-[#374151] relative focus:outline-hidden focus:ring-2 focus:ring-[#14532D] transition-colors"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
                aria-expanded={showNotifications}
              >
                <Bell className="w-5 h-5 text-[#14532D]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white text-[11px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 bg-[#FAF8F5] border-b border-[#EAE4D9] flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#14532D] text-base">
                        {language === 'hi' ? 'सूचनाएं' : 'Notifications'}
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        {unreadCount > 0
                          ? `${unreadCount} ${language === 'hi' ? 'अपठित सूचनाएं' : 'unread alerts'}`
                          : language === 'hi'
                          ? 'सभी सूचनाएं पढ़ी गईं'
                          : 'All caught up!'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs font-semibold text-[#14532D] hover:underline"
                      >
                        {language === 'hi' ? 'सब पढ़ें' : 'Mark all read'}
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-500">
                        {language === 'hi' ? 'कोई नई सूचना नहीं है' : 'No notifications yet'}
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => markNotificationRead(item.id)}
                          className={`p-3.5 text-left cursor-pointer transition-colors hover:bg-[#FAF8F5] ${
                            !item.read ? 'bg-[#F0FDF4]/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#14532D]">
                              {language === 'hi' ? item.hindiTitle : item.title}
                            </span>
                            <span className="text-[11px] text-gray-400 shrink-0">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                            {item.message}
                          </p>
                          {!item.read && (
                            <span className="inline-block mt-1 w-2 h-2 rounded-full bg-emerald-600" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-[#14532D] hover:underline"
                    >
                      {language === 'hi' ? 'सभी सूचनाएं देखें' : 'View All Notifications'} &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
