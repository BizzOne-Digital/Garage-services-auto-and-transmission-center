import type { Dictionary } from './fr';

// English copy for the entire site. Mirrors the shape of the French dictionary.
export const en: Dictionary = {
  meta: {
    htmlLang: 'en',
    title: 'Garage Services Auto and Transmission Center | Auto Repair & Transmission Specialist',
    description:
      'Garage Services Auto and Transmission Center provides professional auto repair and transmission services with dependable workmanship and fair pricing in Montreal. Contact Abdul at (514) 553-4206.',
  },

  language: {
    label: 'Language',
    fr: 'FR',
    en: 'EN',
    switchToFr: 'Switch to French',
    switchToEn: 'Switch to English',
  },

  common: {
    businessName: 'Garage Services Auto and Transmission Center',
    getQuote: 'Get a Quote',
    getFreeQuote: 'Get a Free Quote',
    requestFreeQuote: 'Request a Free Quote',
    callAbdul: 'Call Abdul',
    call: 'Call',
    close: 'Close',
    details: 'Details',
    quote: 'Quote',
    location: 'Montréal, QC',
  },

  nav: {
    home: 'Home',
    about: 'About Us',
    services: 'Services',
    pricing: 'Pricing',
    testimonials: 'Testimonials',
    contact: 'Contact',
    ariaMain: 'Main Navigation',
    ariaToggleMenu: 'Toggle Mobile Menu',
    ariaLogo: 'Garage Services Auto and Transmission Center - Return to Top',
    callAbdulWithPhone: 'Call Abdul: {phone}',
  },

  loader: {
    status: 'Initializing Diagnostic Bay...',
  },

  logo: {
    tagline: 'Montréal • Specialized Precision',
    line2: 'AUTO & TRANSMISSION CENTER',
    altEmblem: 'Garage Services Auto and Transmission Center Emblem',
  },

  hero: {
    eyebrow: "Montréal's Transmission & Auto Specialist",
    headlineLine1: 'Your Complete',
    headlineAccent: 'Auto Repair',
    headlineLine3: '& Transmission',
    subtext:
      'Professional automotive service you can count on. We provide dependable repairs, expert transmission overhauls, and honest pricing for drivers and partner garages.',
    primaryCta: 'Talk to a Specialist',
    directWorkshop: 'Direct Workshop',
    locationLabel: 'Location',
    imageAlt: 'Modern automotive repair workshop and transmission diagnostic bay',
    trust1: '25+ Years Experience',
    trust2: 'Fair & Clear Pricing',
    trust3: 'Master Tech Diagnostics',
    cards: [
      {
        serviceId: 'transmission-services',
        title: 'Transmission Overhaul & Rebuild',
        desc: 'Specialized precision rebuilds, slipping gear resolution, and torque converter calibration.',
      },
      {
        serviceId: 'brake-services',
        title: 'Brake & Stopping Systems',
        desc: 'Precision stopping power maintenance, rotor replacement, and ABS system troubleshooting.',
      },
      {
        serviceId: 'transmission-diagnostics',
        title: 'Computer Engine Diagnostics',
        desc: 'State-of-the-art computer scanning to isolate warning lights and performance faults.',
      },
    ],
    intakeBanner: 'Ready for Immediate Intake',
  },

  trustBar: {
    pillarLabel: 'Pillar',
    pillars: {
      professional: {
        title: 'Professional Service',
        subtitle: 'Expert automotive solutions',
        description: 'Certified diagnostic tools and meticulous inspection on every single repair.',
      },
      pricing: {
        title: 'Fair Pricing',
        subtitle: 'Quality service without unnecessary costs',
        description: 'Transparent quotes and honest recommendations with zero hidden fees.',
      },
      transmission: {
        title: 'Transmission Specialists',
        subtitle: 'Specialized transmission expertise',
        description: 'In-depth rebuilds, fluid service, diagnostics, and repairs for automatic, manual & CVT.',
      },
      customer: {
        title: 'Customer Focused',
        subtitle: 'Service built around your needs',
        description: 'Clear explanations, responsive updates, and respectful customer-first care.',
      },
    },
  },

  about: {
    eyebrow: 'Heritage & Craftsmanship',
    headlineLine1: 'Automotive Expertise',
    headlineAccent: 'You Can Trust',
    badgeBay: 'Transmission Diagnostic Bay',
    leadTechLabel: 'Lead Technician',
    leadTechName: 'Abdul • Master Diagnostic Lead',
    imageAlt: 'Professional mechanic inspecting engine and transmission system at Garage Services',
    ariaCall: 'Call Abdul directly',
    intro:
      'Garage Services Auto and Transmission Center is dedicated to honest diagnostics, precision transmission rebuilds, and dependable automotive care.',
    paragraph:
      'We take immense pride in serving both everyday vehicle owners seeking dependable repairs and professional mechanic garages needing trusted, high-precision transmission sub-contracting and diagnostic support.',
    highlights: [
      {
        num: '01',
        title: 'Professional Service',
        desc: 'Rigorous standards and certified diagnostic equipment on every vehicle.',
      },
      {
        num: '02',
        title: 'Fair & Clear Pricing',
        desc: 'Honest, itemized estimates with no surprise costs or unnecessary upsells.',
      },
      {
        num: '03',
        title: 'Dependable Workmanship',
        desc: 'Repairs performed right the first time with premium quality components.',
      },
      {
        num: '04',
        title: 'Transmission Expertise',
        desc: 'Specialized in-depth transmission rebuilds, diagnostics, and overhauls.',
      },
      {
        num: '05',
        title: 'Customer-First Approach',
        desc: 'Transparent communication with direct, approachable consultation from Abdul.',
      },
    ],
  },

  services: {
    eyebrow: 'Precision Diagnostic Bay',
    headlineLine1: 'Specialized',
    headlineAccent: 'Automotive Services',
    intro: 'From complete master transmission rebuilds to precision brake repairs and computer diagnostics.',
    filters: {
      all: 'All Services',
      transmission: 'Transmission',
      mechanical: 'Mechanical',
      maintenance: 'Maintenance',
    },
    specialtyBadge: 'Specialty',
    getQuote: 'Get Quote',
    ariaQuoteFor: 'Get quote for {service}',
    modal: {
      overview: 'Service Overview',
      scope: 'Scope of Work & Capabilities',
      symptomsTitle: 'Common Symptoms Indicating This Service:',
      idealFor: 'Ideal For:',
      ariaClose: 'Close modal',
      cta: 'Book / Request Quote For This',
    },
    items: {
      'auto-repair': {
        title: 'Auto Repair',
        shortDesc: 'Professional automotive repairs to keep your vehicle running reliably and smoothly.',
        fullDesc:
          'Complete bumper-to-bumper mechanical repair services. From electrical troubleshooting and suspension repairs to exhaust systems and cooling systems, we pinpoint the root cause and deliver lasting repairs.',
        features: [
          'Comprehensive vehicle safety inspection',
          'Suspension & steering system repairs',
          'Alternator, battery & starter diagnostics',
          'Cooling system, radiator & water pump service',
          'Exhaust & emission repair',
        ],
        turnaroundTime: 'Same-day or next-day turnaround',
        idealFor: 'All makes and models needing mechanical or electrical repair',
      },
      'transmission-services': {
        title: 'Transmission Services',
        shortDesc: 'Specialized transmission inspection, repair, rebuild, and complete maintenance service.',
        fullDesc:
          'Our flagship specialty. We handle complex transmission maintenance, fluid flushes, solenoid replacements, clutch replacements, and complete rebuilds with precision engineering.',
        features: [
          'Automatic, Manual, CVT & Dual-Clutch expertise',
          'Full transmission fluid flush & filter replacement',
          'Transmission rebuilds & gear replacements',
          'Torque converter & valve body repair',
          'B2B service for partner mechanic garages',
        ],
        turnaroundTime: 'Fast turnaround with detailed testing',
        commonSymptoms: ['Slipping gears', 'Rough shifting', 'Delayed engagement', 'Fluid leaks'],
        idealFor: 'Drivers and mechanic shops requiring specialized transmission care',
      },
      'transmission-diagnostics': {
        title: 'Transmission Diagnostics',
        shortDesc: 'Identify transmission problems accurately before they become bigger, costlier issues.',
        fullDesc:
          'Advanced computer diagnostics coupled with electronic sensor scanning and hydraulic road testing to accurately isolate transmission faults without guesswork.',
        features: [
          'Computerized error code reading & live data stream',
          'Electronic solenoid & sensor testing',
          'Hydraulic pressure test & road testing',
          'Transmission fluid condition & contamination analysis',
          'Itemized diagnostic report before any repair',
        ],
        turnaroundTime: 'Rapid inspection available',
        commonSymptoms: [
          'Check Engine / Transmission light on',
          'Strange RPM spikes',
          'Jerking during gear shifts',
        ],
        idealFor: 'Vehicles with intermittent shifting issues or transmission warning lights',
      },
      'brake-services': {
        title: 'Brake Services',
        shortDesc: 'Professional brake inspection, maintenance, rotor resurfacing, and complete repair.',
        fullDesc:
          'Ensure maximum stopping power and safety on every road. We service brake pads, high-performance rotors, calipers, ABS sensors, brake lines, and hydraulic fluid systems.',
        features: [
          'Pad & rotor inspection with digital micrometer measurement',
          'Ceramic & semi-metallic brake pad installation',
          'Brake caliper rebuild or replacement',
          'Brake fluid flush & hydraulic system bleed',
          'ABS diagnostic testing',
        ],
        turnaroundTime: 'Usually completed in 2–4 hours',
        commonSymptoms: ['Squeaking or grinding sounds', 'Spongy brake pedal', 'Vibration when stopping'],
        idealFor: 'Any vehicle experiencing reduced braking response or noise',
      },
      'engine-services': {
        title: 'Engine Services',
        shortDesc: 'Reliable engine diagnostics, timing systems, fuel delivery, and repair solutions.',
        fullDesc:
          'From pinpointing check engine lights to timing belt/chain replacements, fuel injection servicing, cylinder head gaskets, and ignition repair, we keep your engine operating at peak efficiency.',
        features: [
          'Check Engine light OBD-II diagnostic scanning',
          'Spark plug, ignition coil & distributor service',
          'Timing belt / timing chain replacement',
          'Fuel injector cleaning & fuel pump replacement',
          'Gasket replacements & oil leak repairs',
        ],
        turnaroundTime: 'Clear timeframe provided upon diagnostic',
        commonSymptoms: ['Engine misfiring', 'Loss of power', 'Oil leaks', 'Excessive smoke'],
        idealFor: 'Vehicles experiencing performance drops, misfires, or warning lights',
      },
      'preventive-maintenance': {
        title: 'Preventive Maintenance',
        shortDesc: 'Routine maintenance designed to extend vehicle longevity and prevent expensive future repairs.',
        fullDesc:
          'Proactive vehicle care scheduled according to factory recommendations. Keep your warranty intact and avoid surprise breakdowns with comprehensive fluid checks, filter changes, and multi-point inspections.',
        features: [
          'Full synthetic, blend & conventional oil changes',
          'Engine air filter & cabin pollen filter replacement',
          'Coolant, power steering & differential fluid service',
          'Tire rotation, pressure & tread depth check',
          'Comprehensive multi-point vehicle health check',
        ],
        turnaroundTime: 'Quick in-and-out maintenance',
        idealFor: 'Seasonal prep (Winter/Summer) and milestone vehicle mileage services',
      },
    },
  },

  pricing: {
    badge: 'Honest Automotive Valuation',
    headline: 'Quality Service.',
    headlineAccent: 'Fair Pricing.',
    intro:
      "Every vehicle and repair is different. Contact us for a professional assessment and a clear quote based on your vehicle's needs.",
    strip: 'Transparent • Fair • No Guesswork',
    card1: {
      label: 'Personal & Commuter Vehicles',
      badge: 'Custom Assessment',
      title: 'Mechanical & Maintenance',
      desc: 'Complete diagnostic assessment and repair estimate tailored to your exact make, model, and symptoms.',
      features: [
        'OBD-II Computer scan and diagnostic pinpointing',
        'Itemized parts and labor breakdown before approval',
        'Honest recommendation on urgent vs optional work',
        'Brake service, fluid flushes, suspension, and engine repairs',
        'Fair local rates with premium component options',
      ],
      cta: 'Request Mechanical Quote',
    },
    card2: {
      topBadge: 'Specialized Service',
      label: 'Transmission Department',
      badge: 'Specialist Rate',
      title: 'Transmission Diagnostics & Rebuilds',
      desc: 'Specialized transmission analysis for shifting issues, slipping gears, solenoid faults, or complete rebuilds.',
      features: [
        'Specialized electronic sensor & hydraulic pressure testing',
        'Fluid condition & metal particle contamination check',
        'Repair options: Solenoid/valve body fix vs complete rebuild',
        'Direct service for vehicle owners and partner mechanic garages',
        'Clear, upfront quotation with Abdul prior to any disassembly',
      ],
      cta: 'Request Transmission Assessment',
    },
    faqTitle: 'Frequently Asked Pricing & Service Questions',
    faqs: [
      {
        q: 'How do I know if my transmission needs repair versus simple maintenance?',
        a: 'If you notice slipping gears, hard shifting, delayed engagement into Drive/Reverse, or leaking reddish fluid, an inspection is critical. Minor issues like dirty fluid or a sensor fault can often be serviced quickly before damaging internal gears.',
      },
      {
        q: 'Do you provide services for other mechanic shops?',
        a: 'Yes. We frequently partner with independent auto repair garages that require dedicated transmission diagnostics, valve body rebuilds, or complete transmission overhauls.',
      },
      {
        q: 'How do I get an estimate for my car?',
        a: "You can call Abdul directly at (514) 553-4206 or submit the online quote form with your vehicle's make, model, year, and description of symptoms for an upfront assessment.",
      },
      {
        q: 'What types of transmissions do you service?',
        a: 'We service automatic transmissions, standard manual gearboxes, Continuously Variable Transmissions (CVT), and dual-clutch systems on domestic, European, and Asian vehicles.',
      },
    ],
  },

  testimonials: {
    badge: 'Reputation & Trust',
    headline: 'Trusted by',
    headlineAccent: 'Our Customers',
    intro:
      'See how drivers and independent partner garages rely on {shortName} for dependable auto repair and transmission solutions.',
    verified: 'Verified',
    footNote: 'Committed to honest service, fair pricing, and dependable repairs for every client.',
    items: [
      {
        id: 't1',
        name: 'Marc L.',
        role: 'Vehicle Owner',
        vehicle: '2018 Honda Accord',
        serviceCategory: 'Transmission Diagnostics & Repair',
        content:
          'My transmission was slipping between 2nd and 3rd gear and other shops quoted me outrageous prices for a full replacement. Abdul diagnosed a faulty solenoid and resolved it for a fraction of the price. Extremely honest and professional.',
        date: 'Recent Customer',
      },
      {
        id: 't2',
        name: 'S. Tremblay',
        role: 'Local Garage Owner',
        vehicle: 'B2B Transmission Partnership',
        serviceCategory: 'Transmission Sub-Contracting',
        content:
          'Whenever our garage gets a complex transmission rebuild that requires specialist tooling, we send it to Abdul at Garage Services. Fast turnaround, impeccable work, and trustworthy communication every time.',
        date: 'Partner Shop',
      },
      {
        id: 't3',
        name: 'David K.',
        role: 'Commuter & Family Driver',
        vehicle: '2019 Toyota RAV4',
        serviceCategory: 'Brake & Engine Service',
        content:
          'Took my SUV in for brake replacement and scheduled maintenance. The service was fast, the pricing was very fair, and the car drives like new. Highly recommend Abdul and his team to anyone looking for reliable mechanics.',
        date: 'Recent Customer',
      },
    ],
  },

  leadCta: {
    badge: 'Direct Diagnostic Consultation',
    headlineLine1: 'Need Auto Repair or',
    headlineAccent: 'Transmission Service?',
    intro:
      'Tell us what your vehicle needs and our team will help you find the right solution. Fast assessment, transparent communication, and honest pricing.',
    note1: '• Free Consultation',
    note2: '• No Obligation Quotes',
    note3: '• Direct Talk with Abdul',
  },

  contact: {
    badge: 'Direct Communication',
    headline: 'Get In Touch With',
    headlineAccent: 'Our Specialists',
    intro: 'Fill out the form below for an upfront quote or call Abdul directly for immediate assistance.',
    attn: 'Attn: {name} • Master Diagnostic Lead',
    phoneLabel: 'Direct Telephone',
    emailLabel: 'Email Inquiries',
    socialLabel: 'Social Media',
    areaTitle: 'Service Area & Workshop Intake',
    areaNotice:
      'Serving Montreal & Greater Metropolitan Area. Mobile consultations and shop intake available.',
    areaNote: 'Call ahead for intake scheduling & diagnostic bays.',
    formTitle: 'Request a Free Quote',
    formIntro: 'Tell us about your vehicle symptoms or required maintenance.',
    successTitle: 'Quote Request Received',
    successBody:
      'Thank you, {name}. Abdul will review your vehicle details ({vehicle}) and get back to you promptly at {phone}.',
    successCall: 'Call Abdul Now For Urgent Need',
    successReset: 'Submit Another Vehicle',
    submit: 'Request a Quote',
    submitting: 'Sending Details to Abdul...',
    dispatchNote: 'Direct confidential dispatch to Abdul ({email})',
    fields: {
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. John Doe',
      namePlaceholder: 'Your Name',
      phone: 'Phone Number',
      phonePlaceholder: 'e.g. (514) 553-4206',
      email: 'Email Address',
      emailPlaceholder: 'e.g. yourname@gmail.com',
      emailShortPlaceholder: 'name@email.com',
      vehicle: 'Vehicle Make & Model',
      vehiclePlaceholder: 'e.g. 2018 Honda Civic',
      vehicleShortPlaceholder: 'e.g. 2017 Ford F-150',
      service: 'Service Needed',
      transmissionType: 'Transmission Type',
      message: 'Describe Symptoms / Request Details (Optional)',
      messagePlaceholder: 'e.g. Shifting jerk between 2nd and 3rd gear, warning light on dashboard...',
      messageShort: 'Symptoms / Notes',
      messageShortPlaceholder: 'Brief note about the issue or required work...',
    },
    transmissionOptions: {
      automatic: 'Automatic',
      manual: 'Manual / Standard',
      cvt: 'CVT (Continuously Variable)',
      dualClutch: 'Dual-Clutch / DSG',
      unsureInspection: 'Unsure / Need Inspection',
      unsureDiagnosis: 'Unsure / Need Diagnosis',
    },
    errors: {
      fullName: 'Please provide your full name.',
      fullNameShort: 'Full name is required.',
      phoneRequired: 'Please provide a valid phone number for contact.',
      phoneShort: 'Phone number is required.',
      phoneInvalid: 'Please enter a valid 10-digit phone number.',
      emailRequired: 'Please provide your email address.',
      emailShort: 'Email address is required.',
      emailInvalid: 'Please enter a valid email address.',
      vehicle: 'Please specify your vehicle make & model.',
      vehicleShort: 'Vehicle make & model required.',
      submitFailed:
        'We could not send your request. Please try again or call Abdul directly.',
    },
  },

  quoteModal: {
    eyebrow: 'Direct Estimation System',
    title: 'Get a Free Quote',
    intro: 'Fast turnaround with honest, transparent pricing from Abdul.',
    ariaClose: 'Close quote modal',
    successTitle: 'Quote Request Dispatched',
    successBody:
      'Thank you, {name}. Abdul will review your vehicle details ({vehicle}) and contact you shortly at {phone}.',
    done: 'Done',
    submit: 'Submit Quote Request',
    submitting: 'Submitting...',
  },

  footer: {
    bannerEyebrow: 'Dependable Automotive Care',
    bannerTitle: 'Ready to Get Your Vehicle Diagnosed?',
    bio:
      'Professional automotive service, honest pricing, and dependable repairs you can trust. Complete automotive repair, precision transmission rebuilds, and diagnostic services for drivers and partner garages.',
    badge: 'Dedicated Quality & Transparent Pricing',
    navTitle: 'Navigation',
    servicesTitle: 'Core Specialties',
    contactTitle: 'Direct Contact',
    leadContact: 'Lead Contact',
    phone: 'Phone',
    email: 'Email',
    social: 'Social Media',
    rights: '© 2026 {name}. All rights reserved.',
    backToTop: 'Back to top',
    links: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      pricing: 'Pricing & FAQs',
      testimonials: 'Testimonials',
      contact: 'Contact & Location',
    },
  },
};
