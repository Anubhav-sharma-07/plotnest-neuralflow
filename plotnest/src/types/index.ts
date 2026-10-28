export type Role = 'admin' | 'moderator' | 'sales_person' | 'agent' | 'customer';

export type Language = 'en' | 'hi';

export type LeadStatus =
  | 'new'
  | 'assigned'
  | 'contacted'
  | 'follow_up'
  | 'visit_scheduled'
  | 'visit_completed'
  | 'converted'
  | 'closed_lost'
  | 'invalid_rejected';

export type PlotStatus =
  | 'available'
  | 'reservation_pending'
  | 'booked'
  | 'sold'
  | 'blocked';

export type BookingStatus =
  | 'no_booking'
  | 'requested'
  | 'confirmed'
  | 'cancelled';

export type PaymentStatus =
  | 'pending_token'
  | 'token_received'
  | 'advance_paid'
  | 'fully_paid'
  | 'refunded';

export type CommissionStatus =
  | 'estimated'
  | 'eligible'
  | 'approved'
  | 'paid';

export type LeadSource =
  | 'meta_ads'
  | 'google'
  | 'referral'
  | 'walk_in'
  | 'website';

export interface ActivityTimelineItem {
  id: string;
  leadId: string;
  timestamp: string;
  type: 'call' | 'whatsapp' | 'visit' | 'note' | 'status_change' | 'assignment' | 'conversion' | 'in_person' | 'duplicate_override' | 'registration';
  author: string;
  details: string;
  extra?: Record<string, any>;
}

export interface AuditLogItem {
  id: string;
  leadId: string;
  timestamp: string;
  changedBy: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface VisitExpense {
  id: string;
  visitId: string;
  amount: number;
  category: 'fuel' | 'refreshments' | 'driver' | 'materials' | 'other';
  date: string;
  description: string;
  receiptProofUrl?: string;
  receiptFileName?: string;
}

export interface SiteVisit {
  id: string;
  leadId: string;
  visitorName: string;
  visitorPhone: string;
  projectId: string;
  projectName: string;
  plotOfInterest?: string;
  scheduledDate: string;
  timeSlot: string;
  pickupLocation: string;
  assignedToId: string;
  assignedToName: string;
  assignedRole: 'sales_person' | 'agent';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  feedbackComment?: string;
  completedAt?: string;
  expenses: VisitExpense[];
}

export interface BookingRequest {
  id: string;
  plotId: string;
  plotNumber: string;
  projectId: string;
  projectName: string;
  customerName: string;
  customerPhone: string;
  note?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectReason?: string;
}

export interface PriceSnapshot {
  price: number;
  date: string;
  offerVersion: string; // e.g. "v1"
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  source: LeadSource;
  status: LeadStatus;
  // Four separate state chips
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  commissionStatus: CommissionStatus;
  budgetInLakhs: number;
  interestedProjectId: string;
  interestedProjectName: string;
  interestedPlotNumber?: string;
  assignedToId: string;
  assignedToName: string;
  assignedRole: 'sales_person' | 'agent';
  createdAt: string; // ISO date string
  nextFollowUpDate: string; // YYYY-MM-DD
  nextFollowUpChannel: 'call' | 'whatsapp' | 'in_person';
  timeline: ActivityTimelineItem[];
  auditLog: AuditLogItem[];
  lostReason?: string;
  lostComment?: string;
  conversionDetails?: {
    projectId: string;
    projectName: string;
    plotId: string;
    plotNumber: string;
    salePrice: number;
    convertedAt: string;
    bookingReference: string; // e.g. PN-BK-0001 (NOT a deed)
    priceSnapshot: PriceSnapshot;
    saleDeedNumber?: string; // Only populated when payment is 100% and registration marked complete!
    registrationCompletedAt?: string;
    registeredBy?: string;
  };
}

export interface Plot {
  id: string;
  plotNumber: string;
  projectId: string;
  projectName: string;
  sizeSqFt: number;
  sizeGuntas: number; // 1 gunta = 1089 sq ft
  priceInLakhs: number;
  facing: 'North' | 'East' | 'South' | 'West' | 'North-East';
  soilType: 'Red Loamy' | 'Black Cotton' | 'Alluvial Soil' | 'Rich Organic Loam';
  status: PlotStatus;
  reservedAt?: string;
  reservationExpiry?: string; // ISO timestamp (24h from hold)
  reservedByCustomerId?: string;
  reservedByCustomerName?: string;
  buyerName?: string;
  buyerPhone?: string;
  agentName?: string;
  bookingDate?: string;
  bookingRequestId?: string;
  col: number; // 1 to 8
  row: number; // 1 to 5
}

export interface Project {
  id: string;
  name: string;
  hindiName: string;
  location: string;
  hindiLocation: string;
  tagline: string;
  totalPlots: number;
  availablePlots: number;
  priceRange: string;
  heroImage: string;
  amenities: { title: string; hindiTitle: string; icon: string; description: string }[];
  soilAndWater: string;
  approvals: string[];
}

export interface AgentHierarchyNode {
  id: string;
  name: string;
  designation: string;
  hindiDesignation: string;
  level: number; // 1 to 15
  phone: string;
  email: string;
  leadsCount: number;
  unitsSold: number;
  totalEarningsINR: number;
  bankName: string;
  accountMasked: string;
  panMasked: string;
  ifscMasked: string;
  avatarSeed: string;
  parentId?: string;
  children?: AgentHierarchyNode[];
}

export interface NotificationItem {
  id: string;
  type: 'lead_assigned' | 'followup_overdue' | 'feedback_due' | 'lead_converted' | 'plot_reserved' | 'reservation_expired' | 'booking_requested';
  title: string;
  hindiTitle: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetPath?: string;
  relatedLeadId?: string;
  relatedPlotId?: string;
}

export interface CustomerBooking {
  id: string;
  bookingReference: string;
  plotNumber: string;
  projectName: string;
  projectId: string;
  plotId: string;
  sizeSqFt: number;
  totalPrice: number;
  paidAmount: number; // e.g. 60% or 100%
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  registrationStatus: 'Token Received' | 'Agreement Executed' | 'Registry Completed' | 'Possession Handed';
  bookingDate: string;
  saleDeedNumber?: string;
  documents: { title: string; type: string; date: string; downloadUrl: string }[];
}
