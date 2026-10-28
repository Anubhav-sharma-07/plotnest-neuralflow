import { Lead, Plot, PlotStatus, Role, PriceSnapshot } from '../types';

/**
 * Format currency in Indian numbering system (Lakhs / Crores / Thousands)
 */
export function formatINR(amount: number, unit: 'rupees' | 'lakhs' = 'rupees'): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  if (unit === 'lakhs') {
    if (amount >= 100) {
      const cr = amount / 100;
      return `₹${cr.toFixed(2)} Cr`;
    }
    return `₹${amount.toFixed(2)} Lakh`;
  }

  // Format exact rupees
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2)} Lakh`;
  }

  // Standard Indian formatting for smaller numbers
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Validation rule for converting lead to sale:
 * Project, Plot and Sale Price are all REQUIRED. Block conversion until all three are filled.
 */
export interface ConversionInput {
  projectId?: string;
  plotId?: string;
  salePrice?: number | string;
}

export interface ConversionValidationResult {
  valid: boolean;
  errors: {
    projectId?: string;
    plotId?: string;
    salePrice?: string;
  };
}

export function validateSaleConversion(input: ConversionInput): ConversionValidationResult {
  const errors: { projectId?: string; plotId?: string; salePrice?: string } = {};

  if (!input.projectId || input.projectId.trim() === '') {
    errors.projectId = 'Please select a Project for the sale.';
  }

  if (!input.plotId || input.plotId.trim() === '') {
    errors.plotId = 'Please select a Plot number.';
  }

  const numericPrice = typeof input.salePrice === 'string' ? parseFloat(input.salePrice) : input.salePrice;
  if (numericPrice === undefined || numericPrice === null || isNaN(numericPrice) || numericPrice <= 0) {
    errors.salePrice = 'Sale Price is required and must be greater than ₹0.';
  }

  const valid = Object.keys(errors).length === 0;
  return { valid, errors };
}

/**
 * Create conversion details:
 * CRITICAL DOMAIN RULE: Conversion must NOT generate a registered deed number.
 * It creates a Booking Reference (e.g. PN-BK-0001) and stores a price snapshot.
 */
export function createConversionDetails(input: {
  projectId: string;
  projectName: string;
  plotId: string;
  plotNumber: string;
  salePrice: number;
  bookingCounter?: number;
}) {
  const counterStr = String(input.bookingCounter || 1).padStart(4, '0');
  const bookingReference = `PN-BK-${counterStr}`;
  const now = new Date().toISOString();

  return {
    projectId: input.projectId,
    projectName: input.projectName,
    plotId: input.plotId,
    plotNumber: input.plotNumber,
    salePrice: input.salePrice,
    convertedAt: now,
    bookingReference,
    priceSnapshot: {
      price: input.salePrice,
      date: now,
      offerVersion: 'v1',
    },
    saleDeedNumber: undefined, // Deed number is NOT generated on conversion!
  };
}

/**
 * Deed registration rule:
 * Show/generate the deed number ONLY when payment reaches 100% and marked complete by admin.
 */
export function canRegisterDeed(paymentProgressPercent: number, role: Role): { allowed: boolean; reason?: string } {
  if (paymentProgressPercent < 100) {
    return {
      allowed: false,
      reason: `Deed cannot be registered until payments reach 100% (currently ${paymentProgressPercent}%).`,
    };
  }
  if (role !== 'admin') {
    return {
      allowed: false,
      reason: 'Only an Administrator can execute and record final Government Deed Registration.',
    };
  }
  return { allowed: true };
}

export function generateDeedNumber(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `DOC-REG-2026-${rand}`;
}

/**
 * Validation rule for marking a lead as Lost:
 * Requires a reason and a comment.
 */
export function validateMarkAsLost(reason?: string, comment?: string): { valid: boolean; error?: string } {
  if (!reason || reason.trim() === '') {
    return { valid: false, error: 'Please choose a reason for losing this lead.' };
  }
  if (!comment || comment.trim().length < 5) {
    return { valid: false, error: 'Please provide a comment explaining why the lead was lost (at least 5 characters).' };
  }
  return { valid: true };
}

/**
 * Validation rule for reserving a plot:
 * Can only reserve if plot status is 'available'.
 * Prevents a second reservation of the same plot with a conflict message.
 */
export function canReservePlot(plot: Pick<Plot, 'plotNumber' | 'status' | 'projectName'>): {
  allowed: boolean;
  conflictReason?: string;
} {
  switch (plot.status) {
    case 'available':
      return { allowed: true };
    case 'reservation_pending':
      return {
        allowed: false,
        conflictReason: `Plot ${plot.plotNumber} is already under Reservation Pending. A second reservation cannot be placed.`,
      };
    case 'booked':
      return {
        allowed: false,
        conflictReason: `Plot ${plot.plotNumber} is already Booked with advance token received.`,
      };
    case 'sold':
      return {
        allowed: false,
        conflictReason: `Plot ${plot.plotNumber} has been Sold and deed registered.`,
      };
    case 'blocked':
      return {
        allowed: false,
        conflictReason: `Plot ${plot.plotNumber} is currently Blocked for management allocation.`,
      };
    default:
      return { allowed: false, conflictReason: 'Plot is not available for reservation.' };
  }
}

/**
 * Filter leads based on logged-in role:
 * Admin/Moderator sees all leads.
 * Sales Person/Agent sees only assigned leads.
 * Customer sees 0 leads.
 */
export function filterLeadsByRole(leads: Lead[], role: Role, currentUserId: string): Lead[] {
  if (role === 'admin' || role === 'moderator') {
    return leads;
  }
  if (role === 'sales_person' || role === 'agent') {
    return leads.filter((lead) => lead.assignedToId === currentUserId);
  }
  return [];
}

/**
 * Check if follow-up date is overdue
 */
export function isFollowUpOverdue(dateString: string): boolean {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  return target < today;
}

/**
 * Calculate lead age in readable format
 */
export function getLeadAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

/**
 * Format remaining reservation time (e.g. "Held for 23h 40m")
 */
export function formatTimeRemaining(expiryIso?: string): { formatted: string; isExpired: boolean; hours: number; minutes: number } {
  if (!expiryIso) {
    return { formatted: '24h 00m remaining', isExpired: false, hours: 24, minutes: 0 };
  }
  const diff = new Date(expiryIso).getTime() - Date.now();
  if (diff <= 0) {
    return { formatted: 'Hold Expired', isExpired: true, hours: 0, minutes: 0 };
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { formatted: `Held for ${hours}h ${minutes}m remaining`, isExpired: false, hours, minutes };
}
