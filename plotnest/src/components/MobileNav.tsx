import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import {
  LayoutDashboard,
  Users,
  MapPin,
  CalendarDays,
  Home,
  Globe,
  GitPullRequest,
  ListTodo,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role, language } = usePlotNest();

  const getLinks = () => {
    if (role === 'customer') {
      return [
        {
          to: '/dashboard',
          labelEn: 'My Farm',
          labelHi: 'मेरा फार्म',
          icon: Home,
        },
        {
          to: '/plots',
          labelEn: 'Plots',
          labelHi: 'प्लॉट्स',
          icon: MapPin,
        },
        {
          to: '/visits',
          labelEn: 'Visits',
          labelHi: 'विज़िट्स',
          icon: CalendarDays,
        },
        {
          to: '/',
          labelEn: 'Website',
          labelHi: 'वेबसाइट',
          icon: Globe,
        },
      ];
    }

    const isSalesOrAgent = role === 'sales_person' || role === 'agent';

    return [
      {
        to: isSalesOrAgent ? '/today' : '/dashboard',
        labelEn: isSalesOrAgent ? 'Today' : 'Dashboard',
        labelHi: isSalesOrAgent ? 'आज' : 'डैशबोर्ड',
        icon: isSalesOrAgent ? ListTodo : LayoutDashboard,
      },
      {
        to: '/leads',
        labelEn: 'Leads',
        labelHi: 'लीड्स',
        icon: Users,
      },
      {
        to: '/pipeline',
        labelEn: 'Pipeline',
        labelHi: 'फ्लो',
        icon: GitPullRequest,
      },
      {
        to: '/plots',
        labelEn: 'Plot Map',
        labelHi: 'नक्शा',
        icon: MapPin,
      },
      {
        to: '/visits',
        labelEn: 'Visits',
        labelHi: 'विज़िट्स',
        icon: CalendarDays,
      },
    ];
  };

  const links = getLinks();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5DFD5] shadow-lg px-2 pb-safe"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/' || link.to === '/dashboard'}
              className={({ isActive }) =>
                `touch-target flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all focus:outline-hidden focus:ring-2 focus:ring-[#14532D] ${
                  isActive
                    ? 'text-[#14532D] font-extrabold scale-105'
                    : 'text-[#6B7280] font-medium hover:text-[#111827]'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span className="text-[11px] mt-0.5 leading-none block text-center truncate max-w-[64px]">
                {language === 'hi' ? link.labelHi : link.labelEn}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
