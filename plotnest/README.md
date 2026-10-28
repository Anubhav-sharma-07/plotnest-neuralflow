# PlotNest — Farm Land Sales, CRM & Customer Platform

PlotNest is a production-grade, clickable and responsive React prototype and CRM platform engineered specifically for agricultural real estate (managed farm lands, agroforestry estates, and weekend farm villas in India).

---

## 🌾 Tech Stack
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4, custom Plus Jakarta Sans & Noto Sans Devanagari typography, deep green (`#14532D`) theme, warm sand neutrals (`#FAF8F5`, `#E5DFD5`)
- **Navigation**: React Router (DOM)
- **Charts**: Recharts (Lead Funnel, Plot Inventory Distribution, Booked Value vs Collections Realized)
- **Icons**: Lucide React
- **Tests**: Node.js built-in test runner (`node:test`, `node:assert/strict`) executed with `tsx`

---

## 👥 Roles & Demo Credentials

Switch roles anytime via the **"Demo as"** dropdown in the top header or the **Role Login & OTP** screen (`/login`):

1. **Admin (`admin`)**:
   - Full CRM oversight across all leads and sales representatives
   - Executive dashboard with funnel analytics, financial realization, and plot distributions
   - Unrestricted plot map inspection (buyer identity, agent, and pricing)
   - Exclusively authorized to execute formal **Sub-Registrar Government Deed Registration** upon 100% payment clearance.
2. **Moderator (`moderator`)**:
   - Operational lead management, assignment reviews, and spam quarantine
   - Lead Assignment Queue (`/assignments`) with manual and round-robin auto-assignment
   - Review incoming customer plot booking requests (Approve 24h Hold or Reject).
3. **Sales Person (`sales_person`)**:
   - Default login destination: **Today Screen (`/today`)** with top 5 priority calls and daily progress ring
   - Sees only directly assigned leads ("My Leads")
   - Overdue follow-up queue with quick-action calls and WhatsApp templates
   - Site visit logs, tour completion with mandatory feedback, expense submission.
4. **Agent (`agent`)**:
   - Channel partner commission lifecycle: **Estimated → Eligible → Approved → Paid**
   - Active downline network and 15-level team hierarchy visibility (`/team`).
5. **Customer (`customer`)**:
   - Customer farm portal with payment milestone progress bar
   - Verified legal repository: 7/12 & RTC Bhoomi mutation certificate, Registered Sale Deed, Demarcation Map, Agri Lab Soil Test
   - **Privacy Shield**: Customer and public roles cannot view other buyers' contact details on the plot map
   - Interactive plot booking request flow ("Request this Plot").

**Demo Mobile OTP**: `123456` (1-click Auto-Fill enabled on `/login`).

---

## 🏛️ Domain Logic Architecture

1. **Deed Registration Rule**:
   - Converting a lead to a sale does **NOT** generate a government sale deed.
   - On "Convert to Sale", the system generates a **Booking Reference** (e.g. `PN-BK-0001`) and locks a **Price Snapshot** (`price`, `date`, `offerVersion: "v1"`).
   - The official Sub-Registrar Deed Certificate number is issued **only** when the buyer's payments reach 100% and an Administrator executes "Registration complete".
2. **Four Distinct State Chips**:
   - Displayed side-by-side on lead detail and plot cards:
     - **Lead Status**: New → Assigned → Contacted → Follow-up → Visit Scheduled → Visit Completed → Converted / Closed-Lost
     - **Booking Status**: No Booking → Request Received, Not Confirmed → Booking Confirmed → Booking Cancelled
     - **Payment Status**: Pending Token → Token Received → Advance Paid (60%) → Fully Paid (100%) → Refunded
     - **Commission Status**: Comm: Estimated → Comm: Eligible → Comm: Approved → Comm: Paid
3. **Reservation Hold Expiry**:
   - Live 24-hour countdown displayed on pending plots ("Held for 23h 40m remaining").
   - Expired holds automatically revert to Available status with notification alerts.
   - Header demo action allows fast-forwarding 24 hours to simulate hold expiration.
4. **Duplicate Phone Detection**:
   - Real-time phone comparison against existing CRM leads with alert banners and logged override options.

---

## 📱 14 Interactive Screens & Routes

1. **Public Landing Page (`/`)**:
   - Meta-ads style hero with softened claims: *Clear-title verified plots (sample)* and *Free pickup available on request*
   - Plot price ranges (*₹18.5 Lakh to ₹65 Lakh* across 3 projects)
   - Infrastructure & amenities grid (perennial borewells, automated Israeli drip, solar fencing, organic timber, clubhouse)
   - Interactive FAQ accordion
   - **Book a Free Site Visit Form**: Submitting creates a live lead in the CRM, schedules a tour, and displays a success confirmation.
   - Small "Sample content" footer note.

2. **Role Login & OTP (`/login`)**:
   - Role selection with sample personas
   - Mobile OTP simulator (`123456`)
   - Role-aware redirect (Sales/Agent to `/today`, Admin/Customer to `/dashboard`)
   - Bilingual EN / हिं toggle.

3. **Today Action Screen (`/today`)**:
   - Personalized greeting ("Good morning, Aarav! ☀️")
   - "Call these people today" top 5 priority leads
   - Big 48px touch-target Call and WhatsApp buttons
   - Today's site visits schedule
   - Circular daily progress ring ("3 of 5 Done").

4. **Lead List (`/leads`)**:
   - Search by client name, phone number, or Lead ID
   - Filters by Status, Project, Source (Meta Ads, Google, Referral, Walk-in, Website)
   - **Overdue Only** toggle switch with high-contrast alert indicators
   - StatusBadge showing status by both **color AND label**
   - Quick **Call** and **WhatsApp** actions
   - New Lead Modal with real-time duplicate phone number detection.

5. **Lead Detail (`/leads/:id`)**:
   - Four separate status chips side-by-side
   - Append-only Activity Timeline
   - Add Follow-up modal (channel, result, notes, next date)
   - Convert to Sale modal with mandatory Project, Plot, and Sale Price validation
   - Price snapshot and booking reference display
   - Government deed registration action for Admin upon 100% payment
   - **Audit Log Tab** detailing who changed what, when, old value, and new value.

6. **Assignment Queue (`/assignments`)**:
   - Unassigned inquiries list with source and age
   - Sales representative capacity & active workload cards
   - Individual dropdown assign
   - **Auto-assign (round-robin)** button with confirmation modal and audit logging.

7. **Pipeline Flow (`/pipeline`)**:
   - Kanban Board View and Stepper Journey View toggle
   - Sequential progression across all 8 pipeline milestones
   - Separate quarantine column for *Invalid / Rejected* spam inquiries.

8. **Site Visits & Expenses (`/visits`)**:
   - Calendar and List view toggle
   - Book new site visit modal
   - Mark Complete action with **mandatory** field feedback comment
   - Visit expense reimbursement submission with receipt preview.

9. **Interactive Plot Inventory Map (`/plots`)**:
   - SVG architectural estate layout of 40 demarcated plots
   - Dual-signal Legend (Color + Label)
   - Live 24-hour reservation hold countdown timer
   - Fast-forward 24h demo button
   - Customer "Request this Plot" workflow
   - Staff booking requests review drawer (Approve/Reject).

10. **Role-Adaptive Dashboards (`/dashboard`)**:
    - *Admin*: Funnel bar chart, plot inventory pie chart, Booked vs Realized collections, top agent leaderboard
    - *Sales Person*: Overdue follow-up queue, tour counter, conversion tracker
    - *Agent*: Commission lifecycle tracker (Estimated, Eligible, Approved, Paid) and downline count
    - *Customer*: My Farm summary, 60% payment progress bar, verified legal repository.

11. **Team Hierarchy (`/team`)**:
    - Searchable, expandable 15-level organization tree
    - Interactive profile card on click: leads count, units sold, total earnings (₹), and masked banking credentials.

12. **Excel / CSV Import Wizard (`/import`)**:
    - 4-step wizard: Upload, Map columns, Validate preview, Done
    - Row-error table highlighting duplicate phone numbers and invalid records
    - Sample CSV template download.

13. **Design System Specification (`/design`)**:
    - Complete token reference: Deep green `#14532D`, warm sand neutrals (`#FAF8F5`, `#E5DFD5`)
    - Mixed-literacy type scale (16px+ body, Devanagari font support)
    - 5 status chip categories showcase
    - 48px touch targets, input focus rings, and empty/loading/error cards.

14. **Demo Guide (`/demo-guide`)**:
    - 7-step screen recording script with suggested presenter tips.

---

## 🎨 Design & Accessibility Principles

- **Bilingual Interface**: Quick **EN / हिं** toggle in the header and landing page translating navigation, buttons, statuses, and validation messages.
- **Accessible Touch Targets**: All interactive buttons, chips, and input fields enforce a minimum **48px tap target** (`.touch-target`).
- **Dual-Signal Status**: Status is never communicated by color alone; every indicator couples high-contrast color with an explicit textual label and Lucide icon.
- **Mixed-Literacy Usability**: Body text at 16px+, clean Devanagari typography, and simple agricultural terminology.
- **Local Persistence**: State changes (new leads, reservations, follow-ups, converted sales, expenses) persist across sessions using `PlotNestContext` and `localStorage`.

---

## ❌ Not Included

- Real banking payment gateway checkout APIs (simulated via token milestone statuses).
- Live telephony carrier SIP calling / actual SMS WhatsApp API gateway (simulated via in-app toast triggers).
- Physical land revenue department mutation visits.
