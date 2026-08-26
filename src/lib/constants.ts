import { ServiceItem, TrustPillar, WhyChoosePoint, ProcessStep, Testimonial, TransmissionSymptom } from '../types';

export const BUSINESS_INFO = {
  name: "Garage Services Auto Et Centre De Transmission",
  shortName: "Garage Services",
  tagline: "Your Complete Auto Repair & Transmission Specialist",
  subTagline: "Professional automotive service, honest pricing, and dependable repairs you can trust.",
  contactPerson: "Abdul",
  phone: "(514) 993-7705",
  phoneRaw: "5149937705",
  email: "seeratsalam@gmail.com",
  socialMediaName: "garage services auto and transmission center",
  locationNotice: "Serving Montreal & Greater Metropolitan Area. Mobile consultations and shop intake available.",
  yearsServingNotice: "Dedicated automotive craftsmanship & transmission diagnostic excellence.",
  logoUrl: "https://res.cloudinary.com/dobtsjhb2/image/upload/v1787785423/image_cx6qfr.png",
};

export const TRUST_PILLARS: TrustPillar[] = [
  {
    title: "Professional Service",
    subtitle: "Expert automotive solutions",
    iconName: "ShieldCheck",
    description: "Certified diagnostic tools and meticulous inspection on every single repair.",
  },
  {
    title: "Fair Pricing",
    subtitle: "Quality service without unnecessary costs",
    iconName: "BadgeDollarSign",
    description: "Transparent quotes and honest recommendations with zero hidden fees.",
  },
  {
    title: "Transmission Specialists",
    subtitle: "Specialized transmission expertise",
    iconName: "Cog",
    description: "In-depth rebuilds, fluid service, diagnostics, and repairs for automatic, manual & CVT.",
  },
  {
    title: "Customer Focused",
    subtitle: "Service built around your needs",
    iconName: "HeartHandshake",
    description: "Clear explanations, responsive updates, and respectful customer-first care.",
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: "auto-repair",
    title: "Auto Repair",
    category: "mechanical",
    shortDesc: "Professional automotive repairs to keep your vehicle running reliably and smoothly.",
    fullDesc: "Complete bumper-to-bumper mechanical repair services. From electrical troubleshooting and suspension repairs to exhaust systems and cooling systems, we pinpoint the root cause and deliver lasting repairs.",
    iconName: "Wrench",
    features: [
      "Comprehensive vehicle safety inspection",
      "Suspension & steering system repairs",
      "Alternator, battery & starter diagnostics",
      "Cooling system, radiator & water pump service",
      "Exhaust & emission repair"
    ],
    turnaroundTime: "Same-day or next-day turnaround",
    idealFor: "All makes and models needing mechanical or electrical repair",
  },
  {
    id: "transmission-services",
    title: "Transmission Services",
    category: "transmission",
    shortDesc: "Specialized transmission inspection, repair, rebuild, and complete maintenance service.",
    fullDesc: "Our flagship specialty. We handle complex transmission maintenance, fluid flushes, solenoid replacements, clutch replacements, and complete rebuilds with precision engineering.",
    iconName: "Cpu",
    features: [
      "Automatic, Manual, CVT & Dual-Clutch expertise",
      "Full transmission fluid flush & filter replacement",
      "Transmission rebuilds & gear replacements",
      "Torque converter & valve body repair",
      "B2B service for partner mechanic garages"
    ],
    turnaroundTime: "Fast turnaround with detailed testing",
    commonSymptoms: ["Slipping gears", "Rough shifting", "Delayed engagement", "Fluid leaks"],
    idealFor: "Drivers and mechanic shops requiring specialized transmission care",
  },
  {
    id: "transmission-diagnostics",
    title: "Transmission Diagnostics",
    category: "transmission",
    shortDesc: "Identify transmission problems accurately before they become bigger, costlier issues.",
    fullDesc: "Advanced computer diagnostics coupled with electronic sensor scanning and hydraulic road testing to accurately isolate transmission faults without guesswork.",
    iconName: "Activity",
    features: [
      "Computerized error code reading & live data stream",
      "Electronic solenoid & sensor testing",
      "Hydraulic pressure test & road testing",
      "Transmission fluid condition & contamination analysis",
      "Itemized diagnostic report before any repair"
    ],
    turnaroundTime: "Rapid inspection available",
    commonSymptoms: ["Check Engine / Transmission light on", "Strange RPM spikes", "Jerking during gear shifts"],
    idealFor: "Vehicles with intermittent shifting issues or transmission warning lights",
  },
  {
    id: "brake-services",
    title: "Brake Services",
    category: "mechanical",
    shortDesc: "Professional brake inspection, maintenance, rotor resurfacing, and complete repair.",
    fullDesc: "Ensure maximum stopping power and safety on every road. We service brake pads, high-performance rotors, calipers, ABS sensors, brake lines, and hydraulic fluid systems.",
    iconName: "Disc",
    features: [
      "Pad & rotor inspection with digital micrometer measurement",
      "Ceramic & semi-metallic brake pad installation",
      "Brake caliper rebuild or replacement",
      "Brake fluid flush & hydraulic system bleed",
      "ABS diagnostic testing"
    ],
    turnaroundTime: "Usually completed in 2–4 hours",
    commonSymptoms: ["Squeaking or grinding sounds", "Spongy brake pedal", "Vibration when stopping"],
    idealFor: "Any vehicle experiencing reduced braking response or noise",
  },
  {
    id: "engine-services",
    title: "Engine Services",
    category: "mechanical",
    shortDesc: "Reliable engine diagnostics, timing systems, fuel delivery, and repair solutions.",
    fullDesc: "From pinpointing check engine lights to timing belt/chain replacements, fuel injection servicing, cylinder head gaskets, and ignition repair, we keep your engine operating at peak efficiency.",
    iconName: "Flame",
    features: [
      "Check Engine light OBD-II diagnostic scanning",
      "Spark plug, ignition coil & distributor service",
      "Timing belt / timing chain replacement",
      "Fuel injector cleaning & fuel pump replacement",
      "Gasket replacements & oil leak repairs"
    ],
    turnaroundTime: "Clear timeframe provided upon diagnostic",
    commonSymptoms: ["Engine misfiring", "Loss of power", "Oil leaks", "Excessive smoke"],
    idealFor: "Vehicles experiencing performance drops, misfires, or warning lights",
  },
  {
    id: "preventive-maintenance",
    title: "Preventive Maintenance",
    category: "maintenance",
    shortDesc: "Routine maintenance designed to extend vehicle longevity and prevent expensive future repairs.",
    fullDesc: "Proactive vehicle care scheduled according to factory recommendations. Keep your warranty intact and avoid surprise breakdowns with comprehensive fluid checks, filter changes, and multi-point inspections.",
    iconName: "CheckCircle2",
    features: [
      "Full synthetic, blend & conventional oil changes",
      "Engine air filter & cabin pollen filter replacement",
      "Coolant, power steering & differential fluid service",
      "Tire rotation, pressure & tread depth check",
      "Comprehensive multi-point vehicle health check"
    ],
    turnaroundTime: "Quick in-and-out maintenance",
    idealFor: "Seasonal prep (Winter/Summer) and milestone vehicle mileage services",
  },
];

export const TRANSMISSION_SYMPTOMS: TransmissionSymptom[] = [
  {
    id: "slipping",
    name: "Slipping Gears / Loss of Power",
    severity: "critical",
    description: "Vehicle revs up in RPM without accelerating properly, or shifts into neutral unexpectedly while driving.",
    recommendation: "Immediate inspection needed to prevent internal clutch and band burnout.",
  },
  {
    id: "delayed",
    name: "Delayed or Hard Engagement",
    severity: "high",
    description: "Noticeable pause when shifting from Park to Drive or Reverse, accompanied by a harsh clunk or jerk.",
    recommendation: "Diagnostic check for low fluid pressure, failing solenoids, or worn valve bodies.",
  },
  {
    id: "noise",
    name: "Grinding, Whining, or Clunking",
    severity: "high",
    description: "Unusual humming, buzzing, or metal-on-metal grinding sounds when the vehicle is in gear or shifting.",
    recommendation: "Bearings, planetary gears, or low lubrication should be inspected immediately.",
  },
  {
    id: "fluid",
    name: "Fluid Leak or Burnt Odor",
    severity: "critical",
    description: "Reddish or dark brown fluid puddle under your car, or a distinct burnt toast/sweet chemical odor.",
    recommendation: "Stop driving under heavy load; low transmission fluid causes catastrophic failure.",
  },
  {
    id: "warning",
    name: "Check Engine / Transmission Light",
    severity: "medium",
    description: "Dashboard indicator illuminates or vehicle enters 'Limp Mode' to protect the drivetrain.",
    recommendation: "Computer OBD-II scan will retrieve exact diagnostic trouble codes (DTCs).",
  },
];

export const WHY_CHOOSE_US: WhyChoosePoint[] = [
  {
    number: "01",
    title: "Fair & Transparent Pricing",
    description: "Quality automotive service at a fair price. We provide upfront estimates before touching your vehicle, ensuring zero surprise bills.",
    highlight: "No Hidden Fees",
    iconName: "BadgeDollarSign",
  },
  {
    number: "02",
    title: "Professional Workmanship",
    description: "Focused on reliable, quality service. Every repair is performed using proper factory specs, specialized tools, and premium parts.",
    highlight: "Rigorous Standards",
    iconName: "Award",
  },
  {
    number: "03",
    title: "Transmission Expertise",
    description: "Specialized knowledge for transmission-related needs. From delicate automatic solenoids to heavy-duty manual gearboxes and modern CVTs.",
    highlight: "Specialist Certified",
    iconName: "Cog",
  },
  {
    number: "04",
    title: "Customer First",
    description: "We believe good service starts with treating customers with respect, explaining issues in plain language, and offering honest advice.",
    highlight: "Honest Advice",
    iconName: "Users",
  },
  {
    number: "05",
    title: "Reliable Service",
    description: "Dependable automotive solutions you can count on. Trusted both by daily commuters and fellow mechanic garages across the area.",
    highlight: "Dependable Results",
    iconName: "CheckCircle",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Tell Us About Your Vehicle",
    description: "Contact us and explain what your vehicle needs.",
    detail: "Give Abdul a call at (514) 993-7705 or fill out our online quote form with your vehicle details and symptoms.",
    iconName: "PhoneCall",
  },
  {
    step: "02",
    title: "Inspection & Diagnosis",
    description: "We assess the issue and identify the appropriate service.",
    detail: "Our technicians run computer diagnostics, perform visual checks, and road-test if necessary to pinpoint the exact issue.",
    iconName: "Search",
  },
  {
    step: "03",
    title: "Clear Recommendation",
    description: "We explain the recommended work and pricing.",
    detail: "We walk you through our findings with complete transparency and provide a clear, fair quote before any repair work begins.",
    iconName: "FileText",
  },
  {
    step: "04",
    title: "Professional Service",
    description: "Our team gets the job done with care and professionalism.",
    detail: "We complete the repairs with precision craftsmanship, test the vehicle thoroughly, and get you safely back on the road.",
    iconName: "Car",
  },
];

export const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Marc L.",
    role: "Vehicle Owner",
    vehicle: "2018 Honda Accord",
    serviceCategory: "Transmission Diagnostics & Repair",
    rating: 5,
    content: "My transmission was slipping between 2nd and 3rd gear and other shops quoted me outrageous prices for a full replacement. Abdul diagnosed a faulty solenoid and resolved it for a fraction of the price. Extremely honest and professional.",
    date: "Recent Customer",
    verified: true,
  },
  {
    id: "t2",
    name: "S. Tremblay",
    role: "Local Garage Owner",
    vehicle: "B2B Transmission Partnership",
    serviceCategory: "Transmission Sub-Contracting",
    rating: 5,
    content: "Whenever our garage gets a complex transmission rebuild that requires specialist tooling, we send it to Abdul at Garage Services. Fast turnaround, impeccable work, and trustworthy communication every time.",
    date: "Partner Shop",
    verified: true,
  },
  {
    id: "t3",
    name: "David K.",
    role: "Commuter & Family Driver",
    vehicle: "2019 Toyota RAV4",
    serviceCategory: "Brake & Engine Service",
    rating: 5,
    content: "Took my SUV in for brake replacement and scheduled maintenance. The service was fast, the pricing was very fair, and the car drives like new. Highly recommend Abdul and his team to anyone looking for reliable mechanics.",
    date: "Recent Customer",
    verified: true,
  },
];

export const FAQS = [
  {
    q: "How do I know if my transmission needs repair versus simple maintenance?",
    a: "If you notice slipping gears, hard shifting, delayed engagement into Drive/Reverse, or leaking reddish fluid, an inspection is critical. Minor issues like dirty fluid or a sensor fault can often be serviced quickly before damaging internal gears.",
  },
  {
    q: "Do you provide services for other mechanic shops?",
    a: "Yes! We frequently partner with independent auto repair garages that require dedicated transmission diagnostics, valve body rebuilds, or complete transmission overhauls.",
  },
  {
    q: "How do I get an estimate for my car?",
    a: "You can call Abdul directly at (514) 993-7705 or submit the online quote form with your vehicle's make, model, year, and description of symptoms for an upfront assessment.",
  },
  {
    q: "What types of transmissions do you service?",
    a: "We service automatic transmissions, standard manual gearboxes, Continuously Variable Transmissions (CVT), and dual-clutch systems on domestic, European, and Asian vehicles.",
  },
];
