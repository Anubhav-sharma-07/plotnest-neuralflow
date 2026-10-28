import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import {
  LayoutDashboard,
  Users,
  GitPullRequest,
  CalendarDays,
  MapPin,
  Network,
  Home,
  Globe,
  PlusCircle,
  KeyRound,
  CheckCircle2,
  ListTodo,
  UserPlus,
  FileSpreadsheet,
  Palette,
  BookOpen,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, language, currentUserName } = usePlotNest();

  const getNavLinks = () => {
    if (role === 'customer') {
      return [
        {
          to: '/dashboard',
          labelEn: 'My Farm & Bookings',
          labelHi: 'मेरा फार्म एवं बुकिंग',
          icon: Home,
        },
        {
          to: '/plots',
          labelEn: 'Plot Inventory Map',
          labelHi: 'प्लॉट नक्शा (इन्वेंट्री)',
          icon: MapPin,
        },
        {
          to: '/visits',
          labelEn: 'Site Visits',
          labelHi: 'साइट विज़िट्स',
          icon: CalendarDays,
        },
        {
          to: '/',
          labelEn: 'Public Website',
          labelHi: 'पब्लिक वेबसाइट',
          icon: Globe,
        },
        {
          to: '/design',
          labelEn: 'Design Tokens',
          labelHi: 'डिज़ाइन सिस्टम',
          icon: Palette,
        },
        {
          to: '/demo-guide',
          labelEn: 'Demo Guide',
          labelHi: 'डेमो गाइड',
          icon: BookOpen,
        },
        {
          to: '/login',
          labelEn: 'Switch Role / OTP',
          labelHi: 'भूमिका बदलें / ओटीपी',
          icon: KeyRound,
        },
      ];
    }

    // Internal Roles (Admin, Moderator, Sales Person, Agent)
    const isSalesOrAgent = role === 'sales_person' || role === 'agent';
    const isAdminOrMod = role === 'admin' || role === 'moderator';

    const baseLinks = [
      {
        to: '/dashboard',
        labelEn: 'Dashboard',
        labelHi: 'डैशबोर्ड',
        icon: LayoutDashboard,
      },
    ];

    // Sales person & Agent default workflow is /today
    if (isSalesOrAgent) {
      baseLinks.push({
        to: '/today',
        labelEn: 'Today (Priority Calls)',
        labelHi: 'आज के कार्य (प्राथमिकता)',
        icon: ListTodo,
      });
    }

    baseLinks.push({
      to: '/leads',
      labelEn: isSalesOrAgent ? 'My Leads' : 'All Leads (CRM)',
      labelHi: isSalesOrAgent ? 'मेरी लीड्स' : 'सभी लीड्स (CRM)',
      icon: Users,
    });

    // Admin & Moderator queue
    if (isAdminOrMod) {
      baseLinks.push({
        to: '/assignments',
        labelEn: 'Assignment Queue',
        labelHi: 'लीड आवंटन कतार',
        icon: UserPlus,
      });
    }

    baseLinks.push(
      {
        to: '/pipeline',
        labelEn: 'Pipeline Flow',
        labelHi: 'पाइपलाइन फ्लो',
        icon: GitPullRequest,
      },
      {
        to: '/visits',
        labelEn: 'Site Visits & Exp.',
        labelHi: 'साइट विज़िट्स व खर्च',
        icon: CalendarDays,
      },
      {
        to: '/plots',
        labelEn: 'Plot Inventory Map',
        labelHi: 'प्लॉट नक्शा (लाइव)',
        icon: MapPin,
      },
      {
        to: '/team',
        labelEn: 'Team Hierarchy',
        labelHi: 'टीम पदानुक्रम',
        icon: Network,
      }
    );

    if (isAdminOrMod) {
      baseLinks.push({
        to: '/import',
        labelEn: 'Excel Import Wizard',
        labelHi: 'एक्सेल आयात विज़ार्ड',
        icon: FileSpreadsheet,
      });
    }

    baseLinks.push(
      {
        to: '/design',
        labelEn: 'Design System',
        labelHi: 'डिज़ाइन सिस्टम',
        icon: Palette,
      },
      {
        to: '/demo-guide',
        labelEn: 'Demo Walkthrough',
        labelHi: 'डेमो गाइड (7 चरण)',
        icon: BookOpen,
      },
      {
        to: '/',
        labelEn: 'Public Landing Page',
        labelHi: 'वेबसाइट (पब्लिक)',
        icon: Globe,
      },
      {
        to: '/login',
        labelEn: 'Role Login & OTP',
        labelHi: 'लॉगिन / ओटीपी',
        icon: KeyRound,
      }
    );

    return baseLinks;
  };

  const links = getNavLinks();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#EAE4D9] p-4 shrink-0 min-h-[calc(100vh-4.5rem)]">
      {/* Current Logged User Summary */}
      <div className="mb-4 p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#EBE4D8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14532D] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {role.slice(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs uppercase font-bold text-[#14532D] tracking-wider">
              {role.replace('_', ' ')}
            </p>
            <p className="text-sm font-bold text-[#1F2937] truncate">{currentUserName}</p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1 flex-1 overflow-y-auto pr-1" aria-label="Main Navigation">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/' || link.to === '/dashboard'}
              className={({ isActive }) =>
                `touch-target w-full px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                  isActive
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'text-[#4B5563] hover:bg-[#F7F4EE] hover:text-[#111827]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{language === 'hi' ? link.labelHi : link.labelEn}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Action Button */}
      {role !== 'customer' && (
        <div className="pt-3 border-t border-[#F0EAE0]">
          <NavLink
            to="/leads?action=new"
            className="touch-target w-full px-3 py-2.5 rounded-xl text-sm font-bold bg-[#F0FDF4] text-[#14532D] hover:bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'hi' ? '+ नई लीड जोड़ें' : '+ Add New Lead'}</span>
          </NavLink>
        </div>
      )}
    </aside>
  );
};
