import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  validateSaleConversion,
  validateMarkAsLost,
  canReservePlot,
  filterLeadsByRole,
  isFollowUpOverdue,
  createConversionDetails,
  canRegisterDeed,
} from './rules';
import { Lead } from '../types';

test('formatINR formats currency properly in Indian numbering', () => {
  assert.equal(formatINR(2500000), '₹25.00 Lakh');
  assert.equal(formatINR(15000000), '₹1.50 Cr');
  assert.equal(formatINR(45, 'lakhs'), '₹45.00 Lakh');
  assert.equal(formatINR(120, 'lakhs'), '₹1.20 Cr');
});

test('validateSaleConversion enforces project, plot, and salePrice requirements', () => {
  // Empty input fails all 3
  const failEmpty = validateSaleConversion({});
  assert.equal(failEmpty.valid, false);
  assert.ok(failEmpty.errors.projectId);
  assert.ok(failEmpty.errors.plotId);
  assert.ok(failEmpty.errors.salePrice);

  // Missing plot fails
  const missingPlot = validateSaleConversion({
    projectId: 'proj-1',
    plotId: '',
    salePrice: 2500000,
  });
  assert.equal(missingPlot.valid, false);
  assert.ok(missingPlot.errors.plotId);
  assert.equal(missingPlot.errors.projectId, undefined);

  // Zero or negative sale price fails
  const zeroPrice = validateSaleConversion({
    projectId: 'proj-1',
    plotId: 'plot-4',
    salePrice: 0,
  });
  assert.equal(zeroPrice.valid, false);
  assert.ok(zeroPrice.errors.salePrice);

  // Valid when all three are provided and price > 0
  const passAll = validateSaleConversion({
    projectId: 'proj-1',
    plotId: 'plot-4',
    salePrice: 3200000,
  });
  assert.equal(passAll.valid, true);
  assert.equal(Object.keys(passAll.errors).length, 0);
});

test('converting a lead creates booking reference and price snapshot but NEVER generates a deed', () => {
  const conversion = createConversionDetails({
    projectId: 'proj-1',
    projectName: 'Green Acres Valley',
    plotId: 'plot-27',
    plotNumber: 'P-27',
    salePrice: 2800000,
    bookingCounter: 1,
  });

  // Verify Booking Reference
  assert.equal(conversion.bookingReference, 'PN-BK-0001');

  // Verify Price Snapshot
  assert.ok(conversion.priceSnapshot);
  assert.equal(conversion.priceSnapshot.price, 2800000);
  assert.equal(conversion.priceSnapshot.offerVersion, 'v1');
  assert.ok(conversion.priceSnapshot.date);

  // CRITICAL RULE: Deed number must NOT be created upon conversion!
  assert.equal(conversion.saleDeedNumber, undefined);
});

test('canRegisterDeed only allows deed registration when payment reaches 100% and performed by Admin', () => {
  // Payment at 60% fails
  const incompletePayment = canRegisterDeed(60, 'admin');
  assert.equal(incompletePayment.allowed, false);
  assert.match(incompletePayment.reason || '', /reach 100%/);

  // Payment at 100% but non-admin fails
  const nonAdmin = canRegisterDeed(100, 'sales_person');
  assert.equal(nonAdmin.allowed, false);
  assert.match(nonAdmin.reason || '', /Only an Administrator/);

  // Payment at 100% by admin succeeds
  const adminComplete = canRegisterDeed(100, 'admin');
  assert.equal(adminComplete.allowed, true);
});

test('validateMarkAsLost enforces reason and comment length', () => {
  assert.equal(validateMarkAsLost('', 'Too high budget').valid, false);
  assert.equal(validateMarkAsLost('out_of_budget', '').valid, false);
  assert.equal(validateMarkAsLost('out_of_budget', 'no').valid, false);
  assert.equal(validateMarkAsLost('out_of_budget', 'Buyer chose another project nearby').valid, true);
});

test('canReservePlot enforces plot conflict prevention', () => {
  // Available plot allows reservation
  const available = canReservePlot({ plotNumber: 'P-12', status: 'available', projectName: 'Green Acres' });
  assert.equal(available.allowed, true);

  // Reservation pending prevents second reservation
  const pending = canReservePlot({ plotNumber: 'P-12', status: 'reservation_pending', projectName: 'Green Acres' });
  assert.equal(pending.allowed, false);
  assert.match(pending.conflictReason || '', /already under Reservation Pending/);

  // Booked prevents reservation
  const booked = canReservePlot({ plotNumber: 'P-14', status: 'booked', projectName: 'Green Acres' });
  assert.equal(booked.allowed, false);
  assert.match(booked.conflictReason || '', /already Booked/);

  // Sold prevents reservation
  const sold = canReservePlot({ plotNumber: 'P-15', status: 'sold', projectName: 'Green Acres' });
  assert.equal(sold.allowed, false);
  assert.match(sold.conflictReason || '', /has been Sold/);
});

test('filterLeadsByRole enforces access control', () => {
  const dummyLeads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Ramesh Patel',
      phone: '+91 98201 12345',
      city: 'Mumbai',
      source: 'meta_ads',
      status: 'new',
      bookingStatus: 'no_booking',
      paymentStatus: 'pending_token',
      commissionStatus: 'estimated',
      budgetInLakhs: 40,
      interestedProjectId: 'p1',
      interestedProjectName: 'Green Acres',
      assignedToId: 'agent-1',
      assignedToName: 'Aarav Sharma',
      assignedRole: 'sales_person',
      createdAt: '2026-10-20T10:00:00Z',
      nextFollowUpDate: '2026-10-28',
      nextFollowUpChannel: 'call',
      timeline: [],
      auditLog: [],
    },
    {
      id: 'lead-2',
      name: 'Suresh Raina',
      phone: '+91 98201 98765',
      city: 'Pune',
      source: 'google',
      status: 'contacted',
      bookingStatus: 'no_booking',
      paymentStatus: 'pending_token',
      commissionStatus: 'estimated',
      budgetInLakhs: 50,
      interestedProjectId: 'p2',
      interestedProjectName: 'Vedic Farms',
      assignedToId: 'agent-2',
      assignedToName: 'Pooja Verma',
      assignedRole: 'sales_person',
      createdAt: '2026-10-22T10:00:00Z',
      nextFollowUpDate: '2026-10-29',
      nextFollowUpChannel: 'whatsapp',
      timeline: [],
      auditLog: [],
    },
  ];

  // Admin sees all
  assert.equal(filterLeadsByRole(dummyLeads, 'admin', 'admin-1').length, 2);
  // Moderator sees all
  assert.equal(filterLeadsByRole(dummyLeads, 'moderator', 'mod-1').length, 2);
  // Sales Person agent-1 sees only their lead
  const agent1Leads = filterLeadsByRole(dummyLeads, 'sales_person', 'agent-1');
  assert.equal(agent1Leads.length, 1);
  assert.equal(agent1Leads[0].id, 'lead-1');
  // Customer sees 0 leads
  assert.equal(filterLeadsByRole(dummyLeads, 'customer', 'cust-1').length, 0);
});

test('isFollowUpOverdue detects past dates', () => {
  assert.equal(isFollowUpOverdue('2020-01-01'), true);
  assert.equal(isFollowUpOverdue('2099-01-01'), false);
});
