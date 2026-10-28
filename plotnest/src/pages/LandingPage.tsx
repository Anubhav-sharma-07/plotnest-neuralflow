import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { mockProjects } from '../data/mockData';
import {
  Trees,
  Droplets,
  ShieldCheck,
  Home,
  Compass,
  FileCheck,
  Calendar,
  CheckCircle2,
  Phone,
  ArrowRight,
  MapPin,
  Sparkles,
  ChevronDown,
  HelpCircle,
  Clock,
  Car,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { addLead, bookSiteVisit, language } = usePlotNest();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectId: mockProjects[0].id,
    preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    pickupCity: 'Bengaluru',
  });

  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});
  const [submittedVisit, setSubmittedVisit] = useState<{
    leadId: string;
    visitorName: string;
    visitorPhone: string;
    projectName: string;
    date: string;
  } | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string } = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errors.name = language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name (min 3 letters).';
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      errors.phone = language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const selectedProj = mockProjects.find((p) => p.id === formData.projectId) || mockProjects[0];

    // 1. Create Lead in CRM
    const newLead = addLead({
      name: formData.name.trim(),
      phone: `+91 ${cleanPhone.slice(-10)}`,
      city: formData.pickupCity,
      source: 'meta_ads',
      interestedProjectId: selectedProj.id,
      interestedProjectName: selectedProj.name,
      preferredDate: formData.preferredDate,
      budgetInLakhs: 30,
    });

    // 2. Schedule Site Visit in System
    bookSiteVisit({
      leadId: newLead.id,
      visitorName: formData.name.trim(),
      visitorPhone: `+91 ${cleanPhone.slice(-10)}`,
      projectId: selectedProj.id,
      projectName: selectedProj.name,
      scheduledDate: formData.preferredDate,
      timeSlot: '11:00 AM',
      pickupLocation: `${formData.pickupCity} Central Meeting Point`,
    });

    setSubmittedVisit({
      leadId: newLead.id,
      visitorName: formData.name.trim(),
      visitorPhone: `+91 ${cleanPhone.slice(-10)}`,
      projectName: selectedProj.name,
      date: formData.preferredDate,
    });
  };

  const faqs = [
    {
      qEn: 'Who maintains the farm, trees, and water drip systems?',
      qHi: 'फार्म, पेड़ और ड्रिप सिंचाई का रख-रखाव कौन करता है?',
      aEn: 'Our on-site professional agricultural team handles all pruning, natural pest control, drip management, and harvest for the first 3 years, included in the maintenance plan.',
      aHi: 'हमारी विशेषज्ञ कृषि टीम पहले 3 वर्षों तक सभी पेड़ों की छंटाई, प्राकृतिक कीट नियंत्रण, ड्रिप प्रबंधन और उपज की देखभाल करती है।',
    },
    {
      qEn: 'Can anyone in India purchase these farm lands?',
      qHi: 'क्या भारत में कोई भी यह कृषि भूमि खरीद सकता है?',
      aEn: 'Yes! All lands have certified clear titles with RTC / 7/12 mutations, compliant with State Land Revenue rules. Our legal counsel assists with deed registration end-to-end.',
      aHi: 'हाँ! सभी भूमि स्पष्ट 7/12 व आरटीसी म्यूटेशन के साथ उपलब्ध हैं। हमारी कानूनी टीम रजिस्ट्री और नामान्तरण में पूरी सहायता करती है।',
    },
    {
      qEn: 'Is pickup available for site inspection?',
      qHi: 'क्या साइट विज़िट के लिए पिकअप उपलब्ध है?',
      aEn: 'Yes, free pickup is available on request from designated city transit hubs, accompanied by a dedicated agricultural executive.',
      aHi: 'हाँ, हम सप्ताहांत में शहर के प्रमुख स्थानों से अनुरोध पर निःशुल्क पिकअप की सुविधा प्रदान करते हैं।',
    },
    {
      qEn: 'Can I construct a weekend cottage or farmhouse?',
      qHi: 'क्या मैं वीकेंड कॉटेज या फार्महाउस बना सकता हूँ?',
      aEn: 'Yes, up to 10-15% of the plot area can be utilized for an eco-friendly farm villa, gazebo, or cottage as per state agricultural guidelines.',
      aHi: 'हाँ, राज्य के नियमों के अनुसार 10-15% क्षेत्र पर प्राकृतिक फार्म विला, गज़ेबो या कॉटेज बनाया जा सकता है।',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-gradient-to-b from-[#14532D]/10 via-[#FAF8F5] to-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14532D]/10 border border-[#14532D]/20 text-[#14532D] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#14532D]" />
                <span>
                  {language === 'hi' ? 'स्पष्ट 7/12 टाइटल सत्यापित प्लॉट्स (सैंपल)' : 'Clear-title verified plots (sample)'}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#14532D] tracking-tight leading-tight">
                {language === 'hi' ? (
                  <>
                    अपने परिवार के लिए <br />
                    <span className="text-emerald-700 underline decoration-[#CA8A04]/60">
                      सुरक्षित कृषि फार्म
                    </span>{' '}
                    का स्वामित्व पाएं
                  </>
                ) : (
                  <>
                    Own a High-Yield <br />
                    <span className="text-emerald-700 underline decoration-[#CA8A04]/60">
                      Managed Farm Plot
                    </span>{' '}
                    Close to the City
                  </>
                )}
              </h1>

              <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                {language === 'hi'
                  ? 'सदाबहार पानी, चंदन व केसर आम के बागान, सोलर फेंसिंग और वीकेंड कॉटेज क्लबहाउस की सुविधा। आज ही निःशुल्क साइट विज़िट बुक करें।'
                  : 'Gated 40-acre managed farmland estates with 24/7 water borewells, solar perimeter fencing, mature fruit & timber orchards, and weekend clubhouse amenities.'}
              </p>

              {/* Price Callout & Trust Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="p-3 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                  <span className="text-xs text-gray-500 font-medium block">
                    {language === 'hi' ? 'प्रारंभिक कीमत' : 'Plots Starting'}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-[#14532D]">
                    ₹18.5 Lakh*
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                  <span className="text-xs text-gray-500 font-medium block">
                    {language === 'hi' ? 'प्लॉट साइज़' : 'Plot Sizes'}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-[#14532D]">
                    8 - 20 Gunta
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
                  <span className="text-xs text-gray-500 font-medium block">
                    {language === 'hi' ? 'संतुष्ट खरीदार' : 'Happy Owners'}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-[#14532D]">
                    120+ Families
                  </span>
                </div>
              </div>

              {/* Quick links to CRM / Portal */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a
                  href="#book-visit"
                  className="touch-target px-7 py-3.5 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-extrabold text-base shadow-lg shadow-emerald-950/20 flex items-center gap-2.5 transition-all"
                >
                  <Calendar className="w-5 h-5 text-emerald-300" />
                  <span>{language === 'hi' ? 'मुफ्त साइट विज़िट बुक करें' : 'Book a Free Site Visit'}</span>
                </a>

                <Link
                  to="/plots"
                  className="touch-target px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-[#DCD5C8] text-[#14532D] font-bold text-base shadow-xs flex items-center gap-2 transition-all"
                >
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  <span>{language === 'hi' ? 'प्लॉट नक्शा देखें' : 'View Plot Map'}</span>
                </Link>
              </div>
            </div>

            {/* Right: Lead Capture "Book a Free Site Visit" Form */}
            <div id="book-visit" className="lg:col-span-5 scroll-mt-24">
              <div className="bg-white rounded-3xl border-2 border-[#14532D]/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#14532D]/5 rounded-bl-full pointer-events-none" />

                {submittedVisit ? (
                  /* Success Confirmation Screen */
                  <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-inner">
                      <CheckCircle2 className="w-10 h-10 text-[#14532D]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                        {language === 'hi' ? 'विज़िट की पुष्टि' : 'Site Visit Registered'}
                      </span>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">
                        {language === 'hi' ? 'धन्यवाद, आपकी विज़िट दर्ज हुई!' : 'Site Visit Booked Successfully!'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {language === 'hi'
                          ? `नमस्ते ${submittedVisit.visitorName}, हमारी टीम आपसे ${submittedVisit.visitorPhone} पर संपर्क करेगी।`
                          : `Thank you, ${submittedVisit.visitorName}. Our dedicated field executive will contact you shortly on ${submittedVisit.visitorPhone}.`}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] text-left text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{language === 'hi' ? 'प्रोजेक्ट:' : 'Project:'}</span>
                        <span className="font-bold text-gray-900">{submittedVisit.projectName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{language === 'hi' ? 'तारीख:' : 'Preferred Date:'}</span>
                        <span className="font-bold text-gray-900">{submittedVisit.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{language === 'hi' ? 'समय:' : 'Time Slot:'}</span>
                        <span className="font-bold text-[#14532D]">
                          11:00 AM ({language === 'hi' ? 'अनुरोध पर पिकअप उपलब्ध' : 'Free pickup available on request'})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{language === 'hi' ? 'CRM लीड ID:' : 'CRM Lead ID:'}</span>
                        <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-gray-200">
                          {submittedVisit.leadId}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Link
                        to="/leads"
                        className="touch-target w-full px-5 py-3 rounded-xl bg-[#14532D] text-white font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <span>{language === 'hi' ? 'CRM में लीड देखें' : 'View this Lead in CRM'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setSubmittedVisit(null)}
                        className="text-xs font-bold text-gray-500 hover:text-gray-800 underline"
                      >
                        {language === 'hi' ? 'अन्य व्यक्ति के लिए बुक करें' : 'Book for another person'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-b border-[#F0EBE1] pb-3">
                      <h2 className="text-xl sm:text-2xl font-black text-[#14532D]">
                        {language === 'hi' ? 'मुफ्त साइट विज़िट बुक करें' : 'Book a Free Site Visit'}
                      </h2>
                      <p className="text-xs text-gray-600 mt-1">
                        {language === 'hi'
                          ? 'अनुरोध पर निःशुल्क पिकअप व कृषि विशेषज्ञ परामर्श शामिल'
                          : 'Free pickup available on request & agroforestry expert tour'}
                      </p>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        {language === 'hi' ? 'आपका पूरा नाम *' : 'Your Full Name *'}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Patel"
                        className={`w-full px-4 py-3 rounded-xl border text-base ${
                          formErrors.name ? 'border-rose-500 bg-rose-50/30' : 'border-[#D9D2C5] bg-[#FAF8F5]'
                        } focus:outline-hidden focus:ring-2 focus:ring-[#14532D]`}
                        required
                      />
                      {formErrors.name && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        {language === 'hi' ? 'मोबाइल नंबर (व्हाट्सएप) *' : 'Mobile Number (WhatsApp) *'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3.5 text-sm font-bold text-gray-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="98201 12345"
                          className={`w-full pl-14 pr-4 py-3 rounded-xl border text-base ${
                            formErrors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-[#D9D2C5] bg-[#FAF8F5]'
                          } focus:outline-hidden focus:ring-2 focus:ring-[#14532D]`}
                          required
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Project Selection */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        {language === 'hi' ? 'प्रोजेक्ट चुनें *' : 'Select Project *'}
                      </label>
                      <select
                        value={formData.projectId}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#D9D2C5] bg-[#FAF8F5] text-base focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
                      >
                        {mockProjects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {language === 'hi' ? p.hindiName : p.name} ({p.priceRange})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        {language === 'hi' ? 'पसंदीदा तारीख *' : 'Preferred Visit Date *'}
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#D9D2C5] bg-[#FAF8F5] text-base focus:outline-hidden focus:ring-2 focus:ring-[#14532D]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="touch-target w-full py-4 px-6 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-extrabold text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Car className="w-5 h-5 text-emerald-300" />
                      <span>{language === 'hi' ? 'विज़िट बुक करें (फ्री कैब)' : 'Confirm Free Site Visit'}</span>
                    </button>

                    <p className="text-[11px] text-center text-gray-500">
                      {language === 'hi'
                        ? '🔒 आपकी जानकारी 100% सुरक्षित है। कोई अनचाही कॉल नहीं।'
                        : '🔒 Your information is confidential. Direct developer inquiry.'}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Highlights Section */}
      <section className="py-16 bg-white border-y border-[#EAE4D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#14532D] block">
              {language === 'hi' ? 'विशेष फार्म प्रोजेक्ट्स' : 'Handpicked Managed Farm Projects'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              {language === 'hi' ? 'प्रकृति की गोद में सुरक्षित निवेश' : 'Premium Agro Estates Ready for Registration'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl border border-[#E5DFD5] bg-[#FAF8F5] overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative h-52 overflow-hidden bg-emerald-950">
                  <img
                    src={project.heroImage}
                    alt={project.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-[#14532D] shadow-sm">
                    {project.priceRange}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#14532D]/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white">
                    {project.availablePlots} {language === 'hi' ? 'प्लॉट उपलब्ध' : 'Plots Available'}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {language === 'hi' ? project.hindiName : project.name}
                    </h3>
                    <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? project.hindiLocation : project.location}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                      {project.tagline}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#EBE4D8] space-y-2">
                      <div className="text-xs text-gray-700">
                        <strong className="text-gray-900">{language === 'hi' ? 'मिट्टी व जल:' : 'Soil & Water:'}</strong> {project.soilAndWater}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.approvals.map((app, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#DDD5C7] text-[11px] font-medium text-gray-700"
                          >
                            <FileCheck className="w-3 h-3 text-emerald-700" />
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#EAE4D9] flex items-center justify-between gap-3">
                    <Link
                      to="/plots"
                      className="touch-target flex-1 py-2.5 px-3 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-bold text-center shadow-xs"
                    >
                      {language === 'hi' ? 'प्लॉट नक्शा' : 'View Plot Layout'}
                    </Link>
                    <a
                      href="#book-visit"
                      onClick={() => setFormData({ ...formData, projectId: project.id })}
                      className="touch-target py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 border border-[#D9D2C5] text-xs font-bold text-gray-800 text-center"
                    >
                      {language === 'hi' ? 'विज़िट बुक करें' : 'Book Visit'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-[#14532D]">
              {language === 'hi' ? 'परियोजना की मुख्य सुविधाएं' : 'World-Class Infrastructure & Amenities'}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {language === 'hi'
                ? 'हर फार्म प्लॉट पर पूर्ण कनेक्टिविटी, जैविक देखभाल एवं सुरक्षा'
                : 'Turnkey agricultural ecosystem maintained by seasoned agro-specialists'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects[0].amenities.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-xs flex items-start gap-4 hover:border-emerald-600 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#14532D]/10 text-[#14532D] flex items-center justify-center shrink-0">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-900">
                    {language === 'hi' ? item.hindiTitle : item.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 bg-white border-t border-[#EAE4D9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">
              {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#E5DFD5] bg-[#FAF8F5] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="touch-target w-full px-5 py-4 text-left font-bold text-base text-gray-900 flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{language === 'hi' ? faq.qHi : faq.qEn}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        isOpen ? 'rotate-180 text-[#14532D]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-gray-700 leading-relaxed border-t border-[#EFEBE1]">
                      {language === 'hi' ? faq.aHi : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample Content Prototype Disclaimer Footer */}
      <footer className="py-8 bg-[#FAF8F5] border-t border-[#EAE4D9] text-center px-4">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-bold">
            <span>⚠️ {language === 'hi' ? 'सैंपल कंटेंट प्रोटोटाइप' : 'Sample Content Showcase'}</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            {language === 'hi'
              ? 'PlotNest एक क्लिक करने योग्य इंटरैक्टिव डिज़ाइन प्रोटोटाइप है। प्रदर्शित प्रोजेक्ट, म्यूटेशन, आंकड़े और ग्राहक विवरण केवल प्रदर्शन और मूल्यांकन के लिए काल्पनिक हैं।'
              : 'PlotNest is an interactive React design showcase prototype. Project titles, pricing, mutation certificates, and client details are fictional sample data for UX demonstration purposes only.'}
          </p>
          <div className="pt-2 text-[11px] text-gray-400">
            © 2026 PlotNest Platform • Clear-title verified plots (sample)
          </div>
        </div>
      </footer>
    </div>
  );
};
