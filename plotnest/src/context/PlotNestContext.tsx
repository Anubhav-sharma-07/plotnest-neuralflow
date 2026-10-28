import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Language,
  Lead,
  Plot,
  SiteVisit,
  NotificationItem,
  VisitExpense,
  LeadStatus,
  BookingRequest,
  ActivityTimelineItem,
  AuditLogItem,
} from '../types';
import {
  mockLeads,
  mockPlots,
  mockSiteVisits,
  mockNotifications,
  mockBookingRequests,
} from '../data/mockData';
import { en, translate } from '../i18n';
import {
  canReservePlot,
  validateSaleConversion,
  validateMarkAsLost,
  createConversionDetails,
  canRegisterDeed,
  generateDeedNumber,
} from '../utils/rules';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface PlotNestContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof en) => string;
  leads: Lead[];
  plots: Plot[];
  siteVisits: SiteVisit[];
  notifications: NotificationItem[];
  bookingRequests: BookingRequest[];
  toasts: ToastMessage[];
  currentUserId: string;
  currentUserName: string;
  simulateError: boolean;
  setSimulateError: (val: boolean) => void;

  // Actions
  addLead: (leadData: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    source?: Lead['source'];
    budgetInLakhs?: number;
    interestedProjectId: string;
    interestedProjectName: string;
    preferredDate?: string;
    allowDuplicateOverride?: boolean;
  }) => Lead;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus, note?: string) => void;
  addFollowUp: (
    leadId: string,
    data: {
      channel: 'call' | 'whatsapp' | 'in_person';
      result: string;
      notes: string;
      nextDate: string;
    }
  ) => void;
  convertToSale: (
    leadId: string,
    data: { projectId: string; plotId: string; salePrice: number }
  ) => { success: boolean; errors?: Record<string, string> };
  completeRegistration: (leadId: string) => { success: boolean; error?: string };
  markLeadLost: (
    leadId: string,
    reason: string,
    comment: string
  ) => { success: boolean; error?: string };
  reservePlot: (plotId: string, customerName?: string) => { success: boolean; error?: string };
  requestPlotBooking: (
    plotId: string,
    customerName: string,
    customerPhone: string,
    note?: string
  ) => { success: boolean; error?: string };
  approveBookingRequest: (requestId: string) => { success: boolean; error?: string };
  rejectBookingRequest: (requestId: string, reason: string) => { success: boolean; error?: string };
  fastForward24Hours: () => void;
  assignLead: (leadId: string, assignedToId: string, assignedToName: string) => void;
  autoAssignLeadsRoundRobin: () => { assignedCount: number };
  checkDuplicatePhone: (phone: string, currentLeadId?: string) => Lead | undefined;
  importLeads: (leadsData: Array<Partial<Lead>>) => {
    imported: number;
    duplicatesSkipped: number;
    errors: number;
  };
  bookSiteVisit: (data: {
    leadId?: string;
    visitorName: string;
    visitorPhone: string;
    projectId: string;
    projectName: string;
    scheduledDate: string;
    timeSlot: string;
    pickupLocation: string;
    assignedToId?: string;
    assignedToName?: string;
  }) => SiteVisit;
  completeSiteVisit: (visitId: string, feedbackComment: string) => { success: boolean; error?: string };
  addVisitExpense: (
    visitId: string,
    expense: {
      amount: number;
      category: VisitExpense['category'];
      date: string;
      description: string;
      receiptFileName?: string;
      receiptProofUrl?: string;
    }
  ) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const PlotNestContext = createContext<PlotNestContextType | undefined>(undefined);

export const PlotNestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('plotnest_role') as Role) || 'admin';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('plotnest_lang') as Language) || 'en';
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('plotnest_leads');
    return saved ? JSON.parse(saved) : mockLeads;
  });

  const [plots, setPlots] = useState<Plot[]>(() => {
    const saved = localStorage.getItem('plotnest_plots');
    return saved ? JSON.parse(saved) : mockPlots;
  });

  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(() => {
    const saved = localStorage.getItem('plotnest_visits');
    return saved ? JSON.parse(saved) : mockSiteVisits;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('plotnest_notifs');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem('plotnest_booking_requests');
    return saved ? JSON.parse(saved) : mockBookingRequests;
  });

  const [simulateError, setSimulateError] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('plotnest_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('plotnest_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('plotnest_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('plotnest_plots', JSON.stringify(plots));
  }, [plots]);

  useEffect(() => {
    localStorage.setItem('plotnest_visits', JSON.stringify(siteVisits));
  }, [siteVisits]);

  useEffect(() => {
    localStorage.setItem('plotnest_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('plotnest_booking_requests', JSON.stringify(bookingRequests));
  }, [bookingRequests]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    showToast(
      language === 'hi' ? 'भूमिका बदली गई' : 'Switched Role',
      `${language === 'hi' ? 'अब आप देख रहे हैं:' : 'Now viewing as:'} ${translate(language, `role_${newRole}` as keyof typeof en) || newRole}`,
      'info'
    );
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    showToast(
      newLang === 'hi' ? 'भाषा बदली गई' : 'Language Changed',
      newLang === 'hi' ? 'हिंदी भाषा चुनी गई है' : 'English selected',
      'info'
    );
  };

  const currentUserId =
    role === 'sales_person'
      ? 'user-sales-1'
      : role === 'agent'
      ? 'user-agent-1'
      : role === 'customer'
      ? 'user-customer-1'
      : 'user-admin';

  const currentUserName =
    role === 'sales_person'
      ? 'Aarav Sharma (Sales Exec)'
      : role === 'agent'
      ? 'Vikram Rajput (Channel Partner)'
      : role === 'customer'
      ? 'Ramesh K. Patel'
      : role === 'moderator'
      ? 'Priya Nair (Moderator)'
      : 'Sanjay Deshmukh (Admin)';

  const t = (key: keyof typeof en): string => {
    return translate(language, key);
  };

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const checkDuplicatePhone = (phone: string, currentLeadId?: string): Lead | undefined => {
    if (!phone) return undefined;
    const cleanDigits = phone.replace(/\D/g, '').slice(-10);
    if (cleanDigits.length < 10) return undefined;
    return leads.find(
      (l) => l.id !== currentLeadId && l.phone.replace(/\D/g, '').endsWith(cleanDigits)
    );
  };

  const addLead = (leadData: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    source?: Lead['source'];
    budgetInLakhs?: number;
    interestedProjectId: string;
    interestedProjectName: string;
    preferredDate?: string;
    allowDuplicateOverride?: boolean;
  }): Lead => {
    const newId = `lead-${Date.now().toString().slice(-4)}`;
    const timelineItems: ActivityTimelineItem[] = [
      {
        id: `act-${Date.now()}-1`,
        leadId: newId,
        timestamp: new Date().toISOString(),
        type: 'note',
        author: 'System',
        details: `Inquiry submitted for ${leadData.interestedProjectName}${
          leadData.preferredDate ? ` (Preferred Site Visit Date: ${leadData.preferredDate})` : ''
        }`,
      },
    ];

    if (leadData.allowDuplicateOverride) {
      timelineItems.push({
        id: `act-${Date.now()}-dup`,
        leadId: newId,
        timestamp: new Date().toISOString(),
        type: 'duplicate_override',
        author: currentUserName,
        details: 'Duplicate Phone Warning overridden: Created anyway as new inquiry.',
      });
    }

    const initialAudit: AuditLogItem[] = [
      {
        id: `audit-${newId}-1`,
        leadId: newId,
        timestamp: new Date().toISOString(),
        changedBy: currentUserName,
        field: 'status',
        oldValue: 'none',
        newValue: 'new',
      },
    ];

    const newLead: Lead = {
      id: newId,
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email || '',
      city: leadData.city || 'Bengaluru',
      source: leadData.source || 'website',
      status: 'new',
      bookingStatus: 'no_booking',
      paymentStatus: 'pending_token',
      commissionStatus: 'estimated',
      budgetInLakhs: leadData.budgetInLakhs || 30,
      interestedProjectId: leadData.interestedProjectId,
      interestedProjectName: leadData.interestedProjectName,
      assignedToId: 'user-sales-1',
      assignedToName: 'Aarav Sharma',
      assignedRole: 'sales_person',
      createdAt: new Date().toISOString(),
      nextFollowUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextFollowUpChannel: 'call',
      timeline: timelineItems,
      auditLog: initialAudit,
    };

    setLeads((prev) => [newLead, ...prev]);

    // Add notification
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'lead_assigned',
      title: 'New Site Visit / Lead Inquiry',
      hindiTitle: 'नई लीड एवं साइट विज़िट अनुरोध',
      message: `${newLead.name} (${newLead.phone}) inquired for ${newLead.interestedProjectName}.`,
      timestamp: 'Just now',
      read: false,
      relatedLeadId: newId,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    showToast(
      language === 'hi' ? 'लीड दर्ज हुई' : 'Lead Created Successfully',
      `${newLead.name} has been registered in PlotNest CRM.`
    );

    return newLead;
  };

  const updateLeadStatus = (leadId: string, newStatus: LeadStatus, note?: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const now = new Date().toISOString();
        const newTimeline: ActivityTimelineItem[] = [
          ...lead.timeline,
          {
            id: `act-${Date.now()}`,
            leadId,
            timestamp: now,
            type: 'status_change',
            author: currentUserName,
            details: `Status changed from "${lead.status}" to "${newStatus}".${note ? ` Note: ${note}` : ''}`,
          },
        ];
        const newAudit: AuditLogItem[] = [
          ...lead.auditLog,
          {
            id: `audit-${Date.now()}`,
            leadId,
            timestamp: now,
            changedBy: currentUserName,
            field: 'status',
            oldValue: lead.status,
            newValue: newStatus,
          },
        ];
        return {
          ...lead,
          status: newStatus,
          timeline: newTimeline,
          auditLog: newAudit,
        };
      })
    );

    showToast(
      language === 'hi' ? 'स्थिति अपडेट की गई' : 'Status Updated',
      `Lead updated to ${translate(language, `status_${newStatus}` as keyof typeof en) || newStatus}`
    );
  };

  const assignLead = (leadId: string, assignedToId: string, assignedToName: string) => {
    const now = new Date().toISOString();
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const oldAssignee = lead.assignedToName || 'Unassigned';
        const newStatus: LeadStatus = lead.status === 'new' ? 'assigned' : lead.status;
        return {
          ...lead,
          assignedToId,
          assignedToName,
          status: newStatus,
          timeline: [
            ...lead.timeline,
            {
              id: `act-${Date.now()}`,
              leadId,
              timestamp: now,
              type: 'assignment',
              author: currentUserName,
              details: `Lead assigned to ${assignedToName} (reassigned from ${oldAssignee}).`,
            },
          ],
          auditLog: [
            ...lead.auditLog,
            {
              id: `audit-${Date.now()}`,
              leadId,
              timestamp: now,
              changedBy: currentUserName,
              field: 'assignedTo',
              oldValue: oldAssignee,
              newValue: assignedToName,
            },
          ],
        };
      })
    );

    showToast(
      language === 'hi' ? 'लीड सौंपी गई' : 'Lead Assigned',
      `Assigned to ${assignedToName}.`
    );
  };

  const autoAssignLeadsRoundRobin = () => {
    const salesReps = [
      { id: 'user-sales-1', name: 'Aarav Sharma' },
      { id: 'user-sales-2', name: 'Pooja Verma' },
      { id: 'user-sales-3', name: 'Kunal Deshmukh' },
      { id: 'user-sales-4', name: 'Neha Chawla' },
    ];

    let count = 0;
    const now = new Date().toISOString();

    setLeads((prev) => {
      let repIndex = 0;
      return prev.map((lead) => {
        if (!lead.assignedToId || lead.assignedToName === 'Unassigned') {
          const targetRep = salesReps[repIndex % salesReps.length];
          repIndex++;
          count++;
          return {
            ...lead,
            assignedToId: targetRep.id,
            assignedToName: targetRep.name,
            status: 'assigned',
            timeline: [
              ...lead.timeline,
              {
                id: `act-${Date.now()}-${count}`,
                leadId: lead.id,
                timestamp: now,
                type: 'assignment',
                author: `${currentUserName} (Auto Round-Robin)`,
                details: `Auto-assigned to ${targetRep.name} via round-robin distribution.`,
              },
            ],
            auditLog: [
              ...lead.auditLog,
              {
                id: `audit-${Date.now()}-${count}`,
                leadId: lead.id,
                timestamp: now,
                changedBy: currentUserName,
                field: 'assignedTo',
                oldValue: 'Unassigned',
                newValue: targetRep.name,
              },
            ],
          };
        }
        return lead;
      });
    });

    showToast(
      language === 'hi' ? 'ऑटो-असाइन संपन्न' : 'Round-Robin Assignment Complete',
      `Distributed unassigned leads evenly across sales representatives.`
    );

    return { assignedCount: count };
  };

  const addFollowUp = (
    leadId: string,
    data: {
      channel: 'call' | 'whatsapp' | 'in_person';
      result: string;
      notes: string;
      nextDate: string;
    }
  ) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const channelIcon = data.channel === 'call' ? '📞' : data.channel === 'whatsapp' ? '💬' : '🤝';
        const now = new Date().toISOString();
        const newTimeline: ActivityTimelineItem[] = [
          ...lead.timeline,
          {
            id: `act-${Date.now()}`,
            leadId,
            timestamp: now,
            type: data.channel,
            author: currentUserName,
            details: `${channelIcon} Follow-up via ${data.channel.toUpperCase()}: Outcome - "${data.result}". ${data.notes}`,
          },
        ];
        return {
          ...lead,
          status: lead.status === 'new' || lead.status === 'assigned' ? 'contacted' : 'follow_up',
          nextFollowUpDate: data.nextDate,
          nextFollowUpChannel: data.channel,
          timeline: newTimeline,
        };
      })
    );

    showToast(
      language === 'hi' ? 'फॉलो-अप दर्ज हुआ' : 'Follow-up Logged',
      `Next interaction set for ${data.nextDate}.`
    );
  };

  const convertToSale = (
    leadId: string,
    data: { projectId: string; plotId: string; salePrice: number }
  ) => {
    // 1. Enforce validation rule: Project, Plot, and Sale Price are REQUIRED
    const validation = validateSaleConversion(data);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0] || 'Please provide all required fields.';
      showToast(language === 'hi' ? 'मान्यता त्रुटि' : 'Validation Error', firstError, 'error');
      return { success: false, errors: validation.errors as Record<string, string> };
    }

    const targetPlot = plots.find((p) => p.id === data.plotId);
    if (!targetPlot) {
      showToast('Error', 'Selected Plot was not found.', 'error');
      return { success: false, errors: { plotId: 'Plot does not exist.' } };
    }

    if (targetPlot.status === 'sold') {
      showToast('Plot Unavailable', `Plot ${targetPlot.plotNumber} is already Sold.`, 'error');
      return { success: false, errors: { plotId: 'Plot is already sold.' } };
    }

    // 2. CRITICAL DOMAIN RULE: Conversion must NOT generate a registered deed number!
    // Creates a Booking Reference (e.g. PN-BK-0004) and stores a price snapshot.
    const conversionDetails = createConversionDetails({
      projectId: data.projectId,
      projectName: targetPlot.projectName,
      plotId: data.plotId,
      plotNumber: targetPlot.plotNumber,
      salePrice: data.salePrice,
      bookingCounter: leads.filter((l) => l.bookingStatus === 'confirmed').length + 1,
    });

    let customerName = 'Customer';
    const now = new Date().toISOString();

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        customerName = lead.name;
        return {
          ...lead,
          status: 'converted',
          bookingStatus: 'confirmed',
          paymentStatus: 'token_received',
          commissionStatus: 'eligible',
          conversionDetails,
          timeline: [
            ...lead.timeline,
            {
              id: `act-${Date.now()}`,
              leadId,
              timestamp: now,
              type: 'conversion',
              author: currentUserName,
              details: `CONVERTED TO SALE! Booking Reference #${conversionDetails.bookingReference} issued for Plot ${targetPlot.plotNumber}. Price snapshot locked at ₹${(data.salePrice / 100000).toFixed(2)} Lakh (v1 offer). Formal Government Deed registration pending 100% payment.`,
            },
          ],
          auditLog: [
            ...lead.auditLog,
            {
              id: `audit-${Date.now()}-b`,
              leadId,
              timestamp: now,
              changedBy: currentUserName,
              field: 'bookingStatus',
              oldValue: lead.bookingStatus,
              newValue: 'confirmed',
            },
            {
              id: `audit-${Date.now()}-c`,
              leadId,
              timestamp: now,
              changedBy: currentUserName,
              field: 'status',
              oldValue: lead.status,
              newValue: 'converted',
            },
          ],
        };
      })
    );

    // Update plot to booked
    setPlots((prev) =>
      prev.map((plot) => {
        if (plot.id !== data.plotId) return plot;
        return {
          ...plot,
          status: 'booked',
          buyerName: customerName,
          agentName: currentUserName,
          bookingDate: new Date().toISOString().split('T')[0],
        };
      })
    );

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'lead_converted',
        title: 'Lead Converted to Sale!',
        hindiTitle: 'बधाई! नई बिक्री दर्ज हुई',
        message: `${customerName} booked Plot ${targetPlot.plotNumber}. Ref: ${conversionDetails.bookingReference}`,
        timestamp: 'Just now',
        read: false,
        relatedLeadId: leadId,
      },
      ...prev,
    ]);

    showToast(
      language === 'hi' ? 'बिक्री दर्ज हुई!' : 'Sale Booking Confirmed! 🎉',
      `Booking Reference: ${conversionDetails.bookingReference}. Price locked at ₹${(data.salePrice / 100000).toFixed(2)} Lakhs.`
    );

    return { success: true };
  };

  const completeRegistration = (leadId: string): { success: boolean; error?: string } => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return { success: false, error: 'Lead not found.' };

    const check = canRegisterDeed(100, role);
    if (!check.allowed) {
      showToast('Registration Blocked', check.reason || 'Cannot register deed.', 'error');
      return { success: false, error: check.reason };
    }

    const deedNumber = generateDeedNumber();
    const now = new Date().toISOString();

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          paymentStatus: 'fully_paid',
          commissionStatus: 'paid',
          conversionDetails: lead.conversionDetails
            ? {
                ...lead.conversionDetails,
                saleDeedNumber: deedNumber,
                registrationCompletedAt: now,
                registeredBy: currentUserName,
              }
            : undefined,
          timeline: [
            ...lead.timeline,
            {
              id: `act-${Date.now()}`,
              leadId,
              timestamp: now,
              type: 'registration',
              author: currentUserName,
              details: `GOVERNMENT SALE DEED REGISTERED! Deed Certificate #${deedNumber} registered at Sub-Registrar office. 100% payments cleared and commission released.`,
            },
          ],
          auditLog: [
            ...lead.auditLog,
            {
              id: `audit-${Date.now()}-reg`,
              leadId,
              timestamp: now,
              changedBy: currentUserName,
              field: 'saleDeedNumber',
              oldValue: 'Unregistered',
              newValue: deedNumber,
            },
            {
              id: `audit-${Date.now()}-pay`,
              leadId,
              timestamp: now,
              changedBy: currentUserName,
              field: 'paymentStatus',
              oldValue: lead.paymentStatus,
              newValue: 'fully_paid',
            },
          ],
        };
      })
    );

    // Update plot to sold
    if (targetLead.conversionDetails?.plotId) {
      setPlots((prev) =>
        prev.map((plot) =>
          plot.id === targetLead.conversionDetails?.plotId
            ? { ...plot, status: 'sold' }
            : plot
        )
      );
    }

    showToast(
      language === 'hi' ? 'रजिस्ट्री पूर्ण हुई!' : 'Deed Registration Complete!',
      `Official Deed Registered: ${deedNumber}. All rights transferred.`
    );

    return { success: true };
  };

  const markLeadLost = (leadId: string, reason: string, comment: string) => {
    const validation = validateMarkAsLost(reason, comment);
    if (!validation.valid) {
      showToast(
        language === 'hi' ? 'त्रुटि' : 'Missing Information',
        validation.error || 'Reason and comment are required.',
        'error'
      );
      return { success: false, error: validation.error };
    }

    const now = new Date().toISOString();
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          status: 'closed_lost',
          lostReason: reason,
          lostComment: comment,
          timeline: [
            ...lead.timeline,
            {
              id: `act-${Date.now()}`,
              leadId,
              timestamp: now,
              type: 'status_change',
              author: currentUserName,
              details: `Marked as Closed - Lost. Reason: ${reason}. Notes: ${comment}`,
            },
          ],
          auditLog: [
            ...lead.auditLog,
            {
              id: `audit-${Date.now()}`,
              leadId,
              timestamp: now,
              changedBy: currentUserName,
              field: 'status',
              oldValue: lead.status,
              newValue: 'closed_lost',
            },
          ],
        };
      })
    );

    showToast(
      language === 'hi' ? 'लीड बंद की गई' : 'Lead Marked as Lost',
      `Reason: ${reason}. Activity recorded.`,
      'info'
    );
    return { success: true };
  };

  const reservePlot = (plotId: string, customerName?: string) => {
    const target = plots.find((p) => p.id === plotId);
    if (!target) return { success: false, error: 'Plot not found.' };

    const check = canReservePlot(target);
    if (!check.allowed) {
      showToast(
        language === 'hi' ? 'आरक्षण विफल' : 'Reservation Conflict',
        check.conflictReason || 'This plot cannot be reserved.',
        'error'
      );
      return { success: false, error: check.conflictReason };
    }

    const name = customerName || (role === 'customer' ? 'Ramesh K. Patel' : 'Customer Hold');
    const expiry = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

    setPlots((prev) =>
      prev.map((plot) => {
        if (plot.id !== plotId) return plot;
        return {
          ...plot,
          status: 'reservation_pending',
          reservedAt: new Date().toISOString(),
          reservationExpiry: expiry,
          buyerName: name,
          agentName: currentUserName,
        };
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'plot_reserved',
        title: 'Plot Placed on Hold',
        hindiTitle: 'प्लॉट रिज़र्वेशन लंबित',
        message: `Plot ${target.plotNumber} at ${target.projectName} reserved for ${name}. 24 hours hold timer active.`,
        timestamp: 'Just now',
        read: false,
        relatedPlotId: plotId,
      },
      ...prev,
    ]);

    showToast(
      language === 'hi' ? 'प्लॉट रिज़र्व हुआ' : 'Plot Reservation Placed',
      `Plot ${target.plotNumber} is now Reservation Pending (Held for 24 hours).`
    );

    return { success: true };
  };

  const requestPlotBooking = (
    plotId: string,
    customerName: string,
    customerPhone: string,
    note?: string
  ): { success: boolean; error?: string } => {
    const target = plots.find((p) => p.id === plotId);
    if (!target) return { success: false, error: 'Plot not found.' };
    if (target.status !== 'available') {
      return {
        success: false,
        error: `Plot ${target.plotNumber} is not currently available for booking request.`,
      };
    }

    const newRequest: BookingRequest = {
      id: `req-${Date.now()}`,
      plotId,
      plotNumber: target.plotNumber,
      projectId: target.projectId,
      projectName: target.projectName,
      customerName,
      customerPhone,
      note,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setBookingRequests((prev) => [newRequest, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'booking_requested',
        title: 'New Customer Booking Request',
        hindiTitle: 'ग्राहक से नया बुकिंग अनुरोध',
        message: `${customerName} requested hold on Plot ${target.plotNumber} (${target.projectName}).`,
        timestamp: 'Just now',
        read: false,
        relatedPlotId: plotId,
      },
      ...prev,
    ]);

    showToast(
      language === 'hi' ? 'अनुरोध प्राप्त हुआ' : 'Booking Request Received',
      `Request received, not yet confirmed. Our staff will review and hold the plot shortly.`
    );

    return { success: true };
  };

  const approveBookingRequest = (requestId: string): { success: boolean; error?: string } => {
    const req = bookingRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, error: 'Request not found.' };

    const targetPlot = plots.find((p) => p.id === req.plotId);
    if (!targetPlot) return { success: false, error: 'Target plot not found.' };

    const expiry = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

    setBookingRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved',
              reviewedBy: currentUserName,
              reviewedAt: new Date().toISOString(),
            }
          : r
      )
    );

    setPlots((prev) =>
      prev.map((p) =>
        p.id === req.plotId
          ? {
              ...p,
              status: 'reservation_pending',
              reservedAt: new Date().toISOString(),
              reservationExpiry: expiry,
              buyerName: req.customerName,
              buyerPhone: req.customerPhone,
              agentName: currentUserName,
              bookingRequestId: requestId,
            }
          : p
      )
    );

    showToast(
      language === 'hi' ? 'अनुरोध स्वीकृत' : 'Booking Request Approved',
      `Plot ${req.plotNumber} is now Reservation Pending (Held for 24 hours).`
    );

    return { success: true };
  };

  const rejectBookingRequest = (requestId: string, reason: string): { success: boolean; error?: string } => {
    setBookingRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              reviewedBy: currentUserName,
              reviewedAt: new Date().toISOString(),
              rejectReason: reason,
            }
          : r
      )
    );

    showToast(
      language === 'hi' ? 'अनुरोध अस्वीकृत' : 'Booking Request Rejected',
      `Request marked rejected. Reason: ${reason}`,
      'info'
    );

    return { success: true };
  };

  const fastForward24Hours = () => {
    let expiredCount = 0;
    setPlots((prev) =>
      prev.map((plot) => {
        if (plot.status === 'reservation_pending') {
          expiredCount++;
          return {
            ...plot,
            status: 'available',
            reservedAt: undefined,
            reservationExpiry: undefined,
            buyerName: undefined,
            buyerPhone: undefined,
          };
        }
        return plot;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'reservation_expired',
        title: 'Reservation Hold Expired (Demo)',
        hindiTitle: 'आरक्षण अवधि समाप्त (डेमो)',
        message: `${expiredCount} reservation-pending plots exceeded 24-hour token window and automatically reverted to Available.`,
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    showToast(
      'Fast-forward 24h Executed',
      `${expiredCount} pending plots hold expired and reverted to Available.`,
      'info'
    );
  };

  const importLeads = (leadsData: Array<Partial<Lead>>) => {
    let imported = 0;
    let duplicatesSkipped = 0;
    let errors = 0;

    const newLeadsToAdd: Lead[] = [];

    leadsData.forEach((row, idx) => {
      if (!row.name || !row.phone) {
        errors++;
        return;
      }

      // Check duplicate
      const cleanPhone = row.phone.replace(/\D/g, '').slice(-10);
      const isDuplicate = leads.some((l) => l.phone.replace(/\D/g, '').endsWith(cleanPhone));

      if (isDuplicate) {
        duplicatesSkipped++;
        return;
      }

      const id = `lead-imp-${Date.now()}-${idx}`;
      newLeadsToAdd.push({
        id,
        name: row.name,
        phone: row.phone,
        email: row.email || '',
        city: row.city || 'Bengaluru',
        source: row.source || 'meta_ads',
        status: 'new',
        bookingStatus: 'no_booking',
        paymentStatus: 'pending_token',
        commissionStatus: 'estimated',
        budgetInLakhs: row.budgetInLakhs || 30,
        interestedProjectId: row.interestedProjectId || 'proj-1',
        interestedProjectName: row.interestedProjectName || 'Green Acres Valley',
        assignedToId: 'user-sales-1',
        assignedToName: 'Aarav Sharma',
        assignedRole: 'sales_person',
        createdAt: new Date().toISOString(),
        nextFollowUpDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
        nextFollowUpChannel: 'call',
        timeline: [
          {
            id: `act-${Date.now()}-${idx}`,
            leadId: id,
            timestamp: new Date().toISOString(),
            type: 'note',
            author: `${currentUserName} (Excel Import)`,
            details: `Imported via Bulk Excel Upload. Source: ${row.source || 'meta_ads'}.`,
          },
        ],
        auditLog: [
          {
            id: `audit-${id}-1`,
            leadId: id,
            timestamp: new Date().toISOString(),
            changedBy: currentUserName,
            field: 'status',
            oldValue: 'none',
            newValue: 'new',
          },
        ],
      });
      imported++;
    });

    if (newLeadsToAdd.length > 0) {
      setLeads((prev) => [...newLeadsToAdd, ...prev]);
    }

    showToast(
      language === 'hi' ? 'आयात संपन्न' : 'Excel Import Processed',
      `${imported} new leads added. ${duplicatesSkipped} duplicates skipped.`
    );

    return { imported, duplicatesSkipped, errors };
  };

  const bookSiteVisit = (data: {
    leadId?: string;
    visitorName: string;
    visitorPhone: string;
    projectId: string;
    projectName: string;
    scheduledDate: string;
    timeSlot: string;
    pickupLocation: string;
    assignedToId?: string;
    assignedToName?: string;
  }): SiteVisit => {
    const newVisit: SiteVisit = {
      id: `visit-${Date.now()}`,
      leadId: data.leadId || `lead-${Date.now().toString().slice(-4)}`,
      visitorName: data.visitorName,
      visitorPhone: data.visitorPhone,
      projectId: data.projectId,
      projectName: data.projectName,
      scheduledDate: data.scheduledDate,
      timeSlot: data.timeSlot,
      pickupLocation: data.pickupLocation,
      assignedToId: data.assignedToId || 'user-sales-1',
      assignedToName: data.assignedToName || 'Aarav Sharma',
      assignedRole: 'sales_person',
      status: 'scheduled',
      expenses: [],
    };

    setSiteVisits((prev) => [newVisit, ...prev]);

    if (data.leadId) {
      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id !== data.leadId) return lead;
          return {
            ...lead,
            status: 'visit_scheduled',
            timeline: [
              ...lead.timeline,
              {
                id: `act-${Date.now()}`,
                leadId: lead.id,
                timestamp: new Date().toISOString(),
                type: 'visit',
                author: currentUserName,
                details: `Site visit scheduled for ${data.scheduledDate} at ${data.timeSlot}. Pickup: ${data.pickupLocation}`,
              },
            ],
          };
        })
      );
    }

    showToast(
      language === 'hi' ? 'साइट विज़िट बुक हुई' : 'Site Visit Booked!',
      `Scheduled for ${data.visitorName} on ${data.scheduledDate} at ${data.timeSlot}.`
    );

    return newVisit;
  };

  const completeSiteVisit = (visitId: string, feedbackComment: string) => {
    if (!feedbackComment || feedbackComment.trim().length < 5) {
      showToast(
        language === 'hi' ? 'फीडबैक आवश्यक' : 'Feedback Required',
        'Mandatory feedback comment (at least 5 characters) must be entered to complete the visit.',
        'error'
      );
      return { success: false, error: 'Feedback comment is mandatory.' };
    }

    let targetLeadId: string | undefined;

    setSiteVisits((prev) =>
      prev.map((visit) => {
        if (visit.id !== visitId) return visit;
        targetLeadId = visit.leadId;
        return {
          ...visit,
          status: 'completed',
          completedAt: new Date().toISOString(),
          feedbackComment,
        };
      })
    );

    if (targetLeadId) {
      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id !== targetLeadId) return lead;
          return {
            ...lead,
            status: 'visit_completed',
            timeline: [
              ...lead.timeline,
              {
                id: `act-${Date.now()}`,
                leadId: lead.id,
                timestamp: new Date().toISOString(),
                type: 'visit',
                author: currentUserName,
                details: `Site Visit Marked Completed. Feedback: ${feedbackComment}`,
              },
            ],
          };
        })
      );
    }

    showToast(
      language === 'hi' ? 'विज़िट पूर्ण चिह्नित' : 'Site Visit Completed',
      'Mandatory feedback recorded and lead status updated.'
    );

    return { success: true };
  };

  const addVisitExpense = (
    visitId: string,
    expense: {
      amount: number;
      category: VisitExpense['category'];
      date: string;
      description: string;
      receiptFileName?: string;
      receiptProofUrl?: string;
    }
  ) => {
    const newExpense: VisitExpense = {
      id: `exp-${Date.now()}`,
      visitId,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description,
      receiptFileName: expense.receiptFileName || 'receipt_proof.jpg',
      receiptProofUrl: expense.receiptProofUrl,
    };

    setSiteVisits((prev) =>
      prev.map((visit) => {
        if (visit.id !== visitId) return visit;
        return {
          ...visit,
          expenses: [...visit.expenses, newExpense],
        };
      })
    );

    showToast(
      language === 'hi' ? 'खर्च जोड़ा गया' : 'Expense Recorded',
      `₹${expense.amount} for ${expense.category} submitted with receipt preview.`
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast(
      language === 'hi' ? 'सभी सूचनाएं पढ़ी गईं' : 'Notifications Cleared',
      'All notifications marked as read',
      'info'
    );
  };

  return (
    <PlotNestContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        leads,
        plots,
        siteVisits,
        notifications,
        bookingRequests,
        toasts,
        currentUserId,
        currentUserName,
        simulateError,
        setSimulateError,
        addLead,
        updateLeadStatus,
        addFollowUp,
        convertToSale,
        completeRegistration,
        markLeadLost,
        reservePlot,
        requestPlotBooking,
        approveBookingRequest,
        rejectBookingRequest,
        fastForward24Hours,
        assignLead,
        autoAssignLeadsRoundRobin,
        checkDuplicatePhone,
        importLeads,
        bookSiteVisit,
        completeSiteVisit,
        addVisitExpense,
        showToast,
        removeToast,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </PlotNestContext.Provider>
  );
};

export const usePlotNest = () => {
  const context = useContext(PlotNestContext);
  if (!context) {
    throw new Error('usePlotNest must be used within a PlotNestProvider');
  }
  return context;
};
