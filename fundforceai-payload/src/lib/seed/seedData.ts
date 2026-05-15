/**
 * Clean seed data for Funding Force AI / Merbi.
 *
 * 13 realistic clients matching original mock data.
 * Each client gets a user login (role: client) linked via relatedClient.
 * 2 admin users (super_admin + admin) for operations.
 *
 * Safe to run multiple times — skips existing records.
 */

// ---------------------------------------------------------------------------
// Admin / operator users
// ---------------------------------------------------------------------------

export const seedUsers = [
  {
    email: 'admin@merbi.com',
    password: 'MerbiAdmin2026',
    fullName: 'Eli Banks',
    role: 'super_admin' as const,
  },
  {
    email: 'ops@merbi.com',
    password: 'MerbiOps2026',
    fullName: 'Jordan Cole',
    role: 'admin' as const,
  },
]

// ---------------------------------------------------------------------------
// Client type
// ---------------------------------------------------------------------------

export type SeedClient = {
  externalId: string
  name: string
  signedAt: string
  category: string
  status: string
  pointOfContact: string
  email: string
  phone: string
  ein: string
  address: string
  totalAllocation: number
  vendors: {
    vendorId: string
    name: string
    purpose: string
    amount: number
    method: string
    status: string
  }[]
  history: {
    eventId: string
    action: string
    time: string
  }[]
  userEmail: string
  userPassword: string
  userFullName: string
}

// ---------------------------------------------------------------------------
// All 13 clients
// ---------------------------------------------------------------------------

export const seedClients: SeedClient[] = [
  // -----------------------------------------------------------------------
  // 1. Crown Treez Landscaping — ALL PENDING
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2841',
    name: 'Crown Treez Landscaping',
    signedAt: 'Signed 14 min ago',
    category: 'Marketing capital',
    status: 'Ready',
    pointOfContact: 'Marcus Greene',
    email: 'marcus@crowntreez.com',
    phone: '(718) 555-1841',
    ein: '82-1749203',
    address: '2148 Linden Blvd, Brooklyn, NY 11207',
    totalAllocation: 7300,
    vendors: [
      { vendorId: 'v-1', name: 'Sigma Digital', purpose: 'Local SEO Foundation', amount: 2800, method: 'ACH', status: 'Pending' },
      { vendorId: 'v-2', name: 'Meta Business Manager', purpose: 'Meta Ads · Starter', amount: 2500, method: 'Card', status: 'Pending' },
      { vendorId: 'v-3', name: 'Google LSA', purpose: 'Local Service Ads', amount: 2000, method: 'Card', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-1', action: 'Merchant signed funding agreement', time: '14 min ago' },
      { eventId: 'h-2', action: 'Capital plan generated', time: '12 min ago' },
      { eventId: 'h-3', action: 'Awaiting disbursement', time: 'Now' },
    ],
    userEmail: 'marcus@crowntreez.com',
    userPassword: 'CrownTreez2026',
    userFullName: 'Marcus Greene',
  },

  // -----------------------------------------------------------------------
  // 2. Mattus HVAC — HAS COMPLETED VENDORS (pending + completed mix)
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2842',
    name: 'Mattus HVAC',
    signedAt: 'Signed 1 hr ago',
    category: 'Growth package',
    status: 'Review',
    pointOfContact: 'Anthony Mattus',
    email: 'anthony@mattushvac.com',
    phone: '(347) 555-2842',
    ein: '45-6039182',
    address: '3802 Steinway St, Astoria, NY 11101',
    totalAllocation: 22000,
    vendors: [
      { vendorId: 'v-4', name: 'Google Ads MCC', purpose: 'Search campaign launch', amount: 10000, method: 'Card', status: 'Pending' },
      { vendorId: 'v-5', name: 'Astoria Creative', purpose: 'Landing page build', amount: 4500, method: 'ACH', status: 'Completed' },
      { vendorId: 'v-6', name: 'Meta Business Manager', purpose: 'Paid social retargeting', amount: 7500, method: 'Card', status: 'Completed' },
    ],
    history: [
      { eventId: 'h-4', action: 'Vendor plan reviewed', time: '42 min ago' },
      { eventId: 'h-5', action: 'Meta disbursement completed', time: '31 min ago' },
      { eventId: 'h-6', action: 'Landing page payment processing', time: 'Now' },
    ],
    userEmail: 'anthony@mattushvac.com',
    userPassword: 'MattusHVAC2026',
    userFullName: 'Anthony Mattus',
  },

  // -----------------------------------------------------------------------
  // 3. Konfeti Pharmacy — ALL PENDING
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2843',
    name: 'Konfeti Pharmacy',
    signedAt: 'Signed 3 hr ago',
    category: 'Local acquisition',
    status: 'Ready',
    pointOfContact: 'Nadia Patel',
    email: 'nadia@konfetipharmacy.com',
    phone: '(929) 555-2843',
    ein: '71-9304716',
    address: '960 Flatbush Ave, Brooklyn, NY 11226',
    totalAllocation: 5300,
    vendors: [
      { vendorId: 'v-7', name: 'Klaviyo', purpose: 'Email automation setup', amount: 1800, method: 'Card', status: 'Pending' },
      { vendorId: 'v-8', name: 'Sigma Digital', purpose: 'Local SEO optimization', amount: 3500, method: 'ACH', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-7', action: 'Merchant approved vendor split', time: '2 hr ago' },
      { eventId: 'h-8', action: 'Ready for capital release', time: 'Now' },
    ],
    userEmail: 'nadia@konfetipharmacy.com',
    userPassword: 'Konfeti2026',
    userFullName: 'Nadia Patel',
  },

  // -----------------------------------------------------------------------
  // 4. Brooklyn Med Spa — ALL PENDING
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2844',
    name: 'Brooklyn Med Spa',
    signedAt: 'Signed 4 hr ago',
    category: 'Lead generation',
    status: 'Ready',
    pointOfContact: 'Elena Brooks',
    email: 'elena@bkmedspa.com',
    phone: '(917) 555-2844',
    ein: '38-5821049',
    address: '118 N 7th St, Brooklyn, NY 11249',
    totalAllocation: 9000,
    vendors: [
      { vendorId: 'v-9', name: 'Google Ads MCC', purpose: 'High-intent search ads', amount: 6200, method: 'Card', status: 'Pending' },
      { vendorId: 'v-10', name: 'Meta Business Manager', purpose: 'Retargeting campaign', amount: 2800, method: 'Card', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-9', action: 'Ad accounts verified', time: '1 hr ago' },
      { eventId: 'h-10', action: 'Ready for disbursement', time: 'Now' },
    ],
    userEmail: 'elena@bkmedspa.com',
    userPassword: 'BkMedSpa2026',
    userFullName: 'Elena Brooks',
  },

  // -----------------------------------------------------------------------
  // 5. Queens Auto Glass — ALL PENDING
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2845',
    name: 'Queens Auto Glass',
    signedAt: 'Signed 5 hr ago',
    category: 'Emergency growth',
    status: 'Ready',
    pointOfContact: 'Luis Ramirez',
    email: 'luis@queensautoglass.com',
    phone: '(646) 555-2845',
    ein: '29-7401836',
    address: '44-19 Northern Blvd, Long Island City, NY 11101',
    totalAllocation: 6300,
    vendors: [
      { vendorId: 'v-11', name: 'Google LSA', purpose: 'Local service ads', amount: 4200, method: 'Card', status: 'Pending' },
      { vendorId: 'v-12', name: 'Sigma Digital', purpose: 'Maps ranking push', amount: 2100, method: 'ACH', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-11', action: 'Service-area campaign mapped', time: '2 hr ago' },
      { eventId: 'h-12', action: 'Awaiting send', time: 'Now' },
    ],
    userEmail: 'luis@queensautoglass.com',
    userPassword: 'QueensAuto2026',
    userFullName: 'Luis Ramirez',
  },

  // -----------------------------------------------------------------------
  // 6. Astoria Dental Studio — HAS COMPLETED VENDOR (mix)
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2846',
    name: 'Astoria Dental Studio',
    signedAt: 'Signed 6 hr ago',
    category: 'Patient acquisition',
    status: 'Review',
    pointOfContact: 'Dr. Hannah Cohen',
    email: 'hannah@astoriadentalstudio.com',
    phone: '(718) 555-2846',
    ein: '64-2185097',
    address: '31-15 30th Ave, Astoria, NY 11102',
    totalAllocation: 9400,
    vendors: [
      { vendorId: 'v-13', name: 'Meta Business Manager', purpose: 'Cosmetic dental ads', amount: 5000, method: 'Card', status: 'Pending' },
      { vendorId: 'v-14', name: 'Klaviyo', purpose: 'Recall campaign', amount: 1200, method: 'Card', status: 'Completed' },
      { vendorId: 'v-15', name: 'Astoria Creative', purpose: 'Landing page refresh', amount: 3200, method: 'ACH', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-13', action: 'Recall campaign funded', time: '3 hr ago' },
      { eventId: 'h-14', action: 'Creative vendor pending', time: 'Now' },
    ],
    userEmail: 'hannah@astoriadentalstudio.com',
    userPassword: 'AstoriaDental2026',
    userFullName: 'Dr. Hannah Cohen',
  },

  // -----------------------------------------------------------------------
  // 7. SoHo Fitness Lab — ALL PENDING
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2847',
    name: 'SoHo Fitness Lab',
    signedAt: 'Signed 8 hr ago',
    category: 'Membership growth',
    status: 'Ready',
    pointOfContact: 'Darius King',
    email: 'darius@sohofitnesslab.com',
    phone: '(212) 555-2847',
    ein: '53-7916402',
    address: '78 Spring St, New York, NY 10012',
    totalAllocation: 8000,
    vendors: [
      { vendorId: 'v-16', name: 'Meta Business Manager', purpose: 'Membership offer campaign', amount: 3500, method: 'Card', status: 'Pending' },
      { vendorId: 'v-17', name: 'Google Ads MCC', purpose: 'Gym near me search', amount: 4500, method: 'Card', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-15', action: 'Campaign split approved', time: '1 hr ago' },
      { eventId: 'h-16', action: 'Awaiting release', time: 'Now' },
    ],
    userEmail: 'darius@sohofitnesslab.com',
    userPassword: 'SoHoFitness2026',
    userFullName: 'Darius King',
  },

  // -----------------------------------------------------------------------
  // 8. Harlem Roofing Co. — HAS COMPLETED VENDOR (mix)
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2848',
    name: 'Harlem Roofing Co.',
    signedAt: 'Signed 9 hr ago',
    category: 'Seasonal demand',
    status: 'Ready',
    pointOfContact: 'Terrence Wallace',
    email: 'terrence@harlemroofingco.com',
    phone: '(917) 555-2848',
    ein: '86-3047159',
    address: '2231 Adam Clayton Powell Jr Blvd, New York, NY 10027',
    totalAllocation: 11500,
    vendors: [
      { vendorId: 'v-18', name: 'Google LSA', purpose: 'Roof repair leads', amount: 8500, method: 'Card', status: 'Completed' },
      { vendorId: 'v-19', name: 'Sigma Digital', purpose: 'SEO emergency pages', amount: 3000, method: 'ACH', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-17', action: 'LSA profile connected', time: '5 hr ago' },
      { eventId: 'h-18', action: 'Ready for payment', time: 'Now' },
    ],
    userEmail: 'terrence@harlemroofingco.com',
    userPassword: 'HarlemRoof2026',
    userFullName: 'Terrence Wallace',
  },

  // -----------------------------------------------------------------------
  // 9. Jamaica Ave Urgent Care — HAS COMPLETED VENDOR (mix)
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2849',
    name: 'Jamaica Ave Urgent Care',
    signedAt: 'Signed 11 hr ago',
    category: 'Healthcare growth',
    status: 'Review',
    pointOfContact: 'Dr. Simone Ellis',
    email: 'simone@jamaicaurgentcare.com',
    phone: '(347) 555-2849',
    ein: '77-5203948',
    address: '168-02 Jamaica Ave, Jamaica, NY 11432',
    totalAllocation: 11300,
    vendors: [
      { vendorId: 'v-20', name: 'Google Ads MCC', purpose: 'Urgent care search ads', amount: 9000, method: 'Card', status: 'Completed' },
      { vendorId: 'v-21', name: 'Klaviyo', purpose: 'Patient reactivation', amount: 2300, method: 'Card', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-19', action: 'Search campaign processing', time: '48 min ago' },
      { eventId: 'h-20', action: 'Email campaign queued', time: 'Now' },
    ],
    userEmail: 'simone@jamaicaurgentcare.com',
    userPassword: 'JamaicaCare2026',
    userFullName: 'Dr. Simone Ellis',
  },

  // -----------------------------------------------------------------------
  // 10. Williamsburg Bistro — ALL PENDING
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2850',
    name: 'Williamsburg Bistro',
    signedAt: 'Signed 12 hr ago',
    category: 'Restaurant growth',
    status: 'Ready',
    pointOfContact: 'Marco Bellini',
    email: 'marco@williamsburgbistro.com',
    phone: '(718) 555-2850',
    ein: '34-6829015',
    address: '146 Bedford Ave, Brooklyn, NY 11211',
    totalAllocation: 4000,
    vendors: [
      { vendorId: 'v-22', name: 'Meta Business Manager', purpose: 'Dinner reservation ads', amount: 2200, method: 'Card', status: 'Pending' },
      { vendorId: 'v-23', name: 'Astoria Creative', purpose: 'Menu landing page', amount: 1800, method: 'ACH', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-21', action: 'Creative assets received', time: '4 hr ago' },
      { eventId: 'h-22', action: 'Ready for disbursement', time: 'Now' },
    ],
    userEmail: 'marco@williamsburgbistro.com',
    userPassword: 'WilliamsBistro2026',
    userFullName: 'Marco Bellini',
  },

  // -----------------------------------------------------------------------
  // 11. Bronx Pest Control — ALL PENDING
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2851',
    name: 'Bronx Pest Control',
    signedAt: 'Signed yesterday',
    category: 'Local services',
    status: 'Ready',
    pointOfContact: 'Andre Morales',
    email: 'andre@bronxpestcontrol.com',
    phone: '(929) 555-2851',
    ein: '90-1482607',
    address: '312 E Fordham Rd, Bronx, NY 10458',
    totalAllocation: 7700,
    vendors: [
      { vendorId: 'v-24', name: 'Google LSA', purpose: 'Emergency pest leads', amount: 5100, method: 'Card', status: 'Pending' },
      { vendorId: 'v-25', name: 'Sigma Digital', purpose: 'Local SEO pack', amount: 2600, method: 'ACH', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-23', action: 'Vendor rail verified', time: '6 hr ago' },
      { eventId: 'h-24', action: 'Awaiting send', time: 'Now' },
    ],
    userEmail: 'andre@bronxpestcontrol.com',
    userPassword: 'BronxPest2026',
    userFullName: 'Andre Morales',
  },

  // -----------------------------------------------------------------------
  // 12. Long Island Wellness — ALL PENDING
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2852',
    name: 'Long Island Wellness',
    signedAt: 'Signed yesterday',
    category: 'Wellness marketing',
    status: 'Review',
    pointOfContact: 'Priya Desai',
    email: 'priya@longislandwellness.com',
    phone: '(516) 555-2852',
    ein: '12-7095486',
    address: '92 Main St, Hempstead, NY 11550',
    totalAllocation: 8500,
    vendors: [
      { vendorId: 'v-26', name: 'Meta Business Manager', purpose: 'Wellness offer funnel', amount: 4000, method: 'Card', status: 'Pending' },
      { vendorId: 'v-27', name: 'Klaviyo', purpose: 'SMS/email campaign', amount: 1600, method: 'Card', status: 'Pending' },
      { vendorId: 'v-28', name: 'Astoria Creative', purpose: 'Booking page rebuild', amount: 2900, method: 'ACH', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-25', action: 'Booking page scoped', time: '8 hr ago' },
      { eventId: 'h-26', action: 'Review required before release', time: 'Now' },
    ],
    userEmail: 'priya@longislandwellness.com',
    userPassword: 'LIWellness2026',
    userFullName: 'Priya Desai',
  },

  // -----------------------------------------------------------------------
  // 13. Downtown Legal Group — ALL PENDING
  // -----------------------------------------------------------------------
  {
    externalId: 'FF-2853',
    name: 'Downtown Legal Group',
    signedAt: 'Signed yesterday',
    category: 'Case acquisition',
    status: 'Ready',
    pointOfContact: 'Rebecca Stein',
    email: 'rebecca@downtownlegalgroup.com',
    phone: '(212) 555-2853',
    ein: '26-8145903',
    address: '45 Broadway, New York, NY 10006',
    totalAllocation: 17500,
    vendors: [
      { vendorId: 'v-29', name: 'Google Ads MCC', purpose: 'High-value case search', amount: 12000, method: 'Card', status: 'Pending' },
      { vendorId: 'v-30', name: 'Sigma Digital', purpose: 'Practice area SEO', amount: 5500, method: 'ACH', status: 'Pending' },
    ],
    history: [
      { eventId: 'h-27', action: 'Keyword budget approved', time: '9 hr ago' },
      { eventId: 'h-28', action: 'Ready for disbursement', time: 'Now' },
    ],
    userEmail: 'rebecca@downtownlegalgroup.com',
    userPassword: 'DowntownLegal2026',
    userFullName: 'Rebecca Stein',
  },
]
