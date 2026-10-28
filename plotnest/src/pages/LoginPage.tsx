import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { Role } from '../types';
import {
  ShieldCheck,
  Smartphone,
  KeyRound,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { role, setRole, language, setLanguage, showToast } = usePlotNest();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<Role>(role);
  const [phoneNumber, setPhoneNumber] = useState('98201 44551');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const DEMO_OTP = '123456';

  const roleDetails: {
    id: Role;
    nameEn: string;
    nameHi: string;
    sampleUser: string;
    description: string;
  }[] = [
    {
      id: 'admin',
      nameEn: 'Administrator',
      nameHi: 'एडमिन (प्रशासक)',
      sampleUser: 'Sanjay Deshmukh (Admin)',
      description: 'Access all CRM leads, plot inventory, team hierarchy and financial reports.',
    },
    {
      id: 'moderator',
      nameEn: 'Moderator / Operations',
      nameHi: 'मॉडरेटर / संचालन',
      sampleUser: 'Priya Nair (Lead Ops)',
      description: 'Review fresh inquiries, assign sales reps, approve expenses and plot holds.',
    },
    {
      id: 'sales_person',
      nameEn: 'Sales Executive',
      nameHi: 'सेल्स पर्सन',
      sampleUser: 'Aarav Sharma (Senior Rep)',
      description: 'Work on assigned leads, schedule site visits, log follow-ups and convert sales.',
    },
    {
      id: 'agent',
      nameEn: 'Channel Partner / Agent',
      nameHi: 'एजेंट (चैनल पार्टनर)',
      sampleUser: 'Vikram Rajput (Partner)',
      description: 'View partner leads, track commission payouts (Estimated, Eligible, Approved, Paid).',
    },
    {
      id: 'customer',
      nameEn: 'Customer / Plot Buyer',
      nameHi: 'ग्राहक (खरीदार)',
      sampleUser: 'Ramesh K. Patel (Plot P-02)',
      description: 'View own farm plot, 60% payment progress bar, download 7/12 & registration documents.',
    },
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      showToast('Invalid Phone', 'Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpError('');
      showToast('OTP Sent', `Demo OTP sent to +91 ${clean.slice(-10)} (Use: 123456)`, 'info');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== DEMO_OTP) {
      setOtpError(
        language === 'hi'
          ? 'गलत ओटीपी। कृपया डेमो ओटीपी: 123456 का उपयोग करें।'
          : 'Invalid OTP code. Please use demo OTP: 123456.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRole(selectedRole);
      showToast(
        language === 'hi' ? 'लॉगिन सफल' : 'Login Successful',
        `Logged in as ${roleDetails.find((r) => r.id === selectedRole)?.nameEn}`
      );
      const isSalesOrAgent = selectedRole === 'sales_person' || selectedRole === 'agent';
      navigate(isSalesOrAgent ? '/today' : '/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8 bg-white rounded-3xl border border-[#E5DFD5] p-6 sm:p-10 shadow-xl relative">
        <div className="flex justify-end">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5"
          >
            <span>🌐</span>
            <span>{language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}</span>
          </button>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#14532D] text-white mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-7 h-7 text-emerald-300" />
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-black text-gray-900">
            {language === 'hi' ? 'प्लॉटनेस्ट पोर्टल लॉगिन' : 'PlotNest Platform Login'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {language === 'hi'
              ? 'भूमिका चुनें और मोबाइल ओटीपी से लॉगिन करें'
              : 'Select role and verify with simulated mobile OTP'}
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
            {language === 'hi' ? '1. लॉगिन हेतु भूमिका चुनें *' : '1. Select Your Role *'}
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {roleDetails.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`touch-target w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'border-[#14532D] bg-[#F0FDF4] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#14532D] bg-[#14532D]' : 'border-gray-400'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-gray-900">
                        {language === 'hi' ? r.nameHi : r.nameEn}
                      </span>
                      <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        {r.sampleUser}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{r.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* OTP Authentication Form */}
        <div className="pt-2 border-t border-gray-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            {language === 'hi' ? '2. मोबाइल ओटीपी प्रमाणीकरण' : '2. Mobile OTP Verification'}
          </label>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Phone Number'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-base font-bold text-gray-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98201 44551"
                    className="w-full pl-16 pr-4 py-3 rounded-xl border border-gray-300 bg-[#FAF8F5] text-base focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="touch-target w-full py-3.5 px-4 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-300" />
                <span>
                  {isLoading
                    ? language === 'hi'
                      ? 'ओटीपी भेजा जा रहा है...'
                      : 'Sending OTP...'
                    : language === 'hi'
                    ? 'ओटीपी प्राप्त करें'
                    : 'Send 6-Digit OTP'}
                </span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>
                  {language === 'hi' ? 'डेमो ओटीपी कोड:' : 'Demo OTP Code:'}{' '}
                  <strong className="text-sm font-mono tracking-widest text-[#14532D]">
                    {DEMO_OTP}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(DEMO_OTP)}
                  className="px-2 py-1 bg-amber-200/80 hover:bg-amber-300 rounded font-bold text-[11px]"
                >
                  {language === 'hi' ? 'ऑटो-भरें' : 'Auto-Fill'}
                </button>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  {language === 'hi' ? '6-अंकों का ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[#FAF8F5] text-center text-xl font-mono tracking-widest font-bold focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
                  autoFocus
                  required
                />
                {otpError && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 text-center">{otpError}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="touch-target px-4 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  {language === 'hi' ? 'नंबर बदलें' : 'Change No.'}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="touch-target flex-1 py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>
                    {isLoading
                      ? language === 'hi'
                        ? 'सत्यापन हो रहा है...'
                        : 'Verifying...'
                      : language === 'hi'
                      ? 'लॉगिन पूर्ण करें'
                      : 'Verify & Login'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
