import type { Service } from "@/types";

export const APP_CONFIG = {
  bureaucracyTaxRate: 0.05, // 5% taken automatically for admin overhead
  currencySymbol: "$", // Can be swapped for € or £
};

export const SERVICES_DATA: Service[] = [
  {
    id: "health",
    name: "Public Health & Well-being",
    icon: "HeartPulse",
    description:
      "Hospitals, Pharmaceuticals, Mental Health, and Pandemic Control.",
    minCost: 0.05,
    maxCost: 0.2,
    tiers: [
      {
        level: 1,
        name: "The Safety Net",
        threshold: 0.25,
        perk: "Emergency Access",
        benefit:
          "No citizen dies from lack of urgent care. Ambulances are functional.",
        visualState: "Hospital lights flickering on.",
      },
      {
        level: 2,
        name: "Standard Care",
        threshold: 0.5,
        perk: "Zero Wait Times",
        benefit:
          "Elective surgeries in weeks, not months. Family doctors available same-day.",
        visualState: "Clean, modern clinic.",
      },
      {
        level: 3,
        name: "Total Coverage",
        threshold: 0.75,
        perk: "Dental & Vision Included",
        benefit:
          "Teeth and eyes are fully covered. Mental health therapy is free.",
        visualState: "High-tech medical scanner.",
      },
      {
        level: 4,
        name: "Bio-Futurism",
        threshold: 1.0,
        perk: "Preventative Genomics",
        benefit:
          "Personalized genetic screening for all. Life expectancy +5 years.",
        visualState: "Futuristic floating wellness center.",
      },
    ],
  },
  {
    id: "infrastructure",
    name: "Infrastructure & Transport",
    icon: "TrainFront",
    description: "Roads, Rail, Water Systems, Internet, and Waste Management.",
    minCost: 0.04,
    maxCost: 0.18,
    tiers: [
      {
        level: 1,
        name: "Basic Connectivity",
        threshold: 0.25,
        perk: "Pothole Free",
        benefit: "Major highways paved annually. Potable water in all taps.",
        visualState: "Paved road with a bus.",
      },
      {
        level: 2,
        name: "Digital Nation",
        threshold: 0.5,
        perk: "Fiber Everywhere",
        benefit:
          "High-speed fiber internet for every home, including rural farms.",
        visualState: "Glowing fiber optic cables.",
      },
      {
        level: 3,
        name: "High-Speed Network",
        threshold: 0.75,
        perk: "Bullet Trains",
        benefit:
          "Connect major cities in under 2 hours. Domestic flights obsolete.",
        visualState: "Sleek bullet train blurring past.",
      },
      {
        level: 4,
        name: "Mobility as a Right",
        threshold: 1.0,
        perk: "Zero-Fare Transport",
        benefit: "All subways, buses, and trains are 100% free for everyone.",
        visualState: "Futuristic autonomous transport pods.",
      },
    ],
  },
  {
    id: "defense",
    name: "Safety & Defense",
    icon: "ShieldCheck",
    description: "Military, Police, Fire Services, Cyber-Security, and Borders.",
    minCost: 0.04,
    maxCost: 0.18,
    tiers: [
      {
        level: 1,
        name: "Sovereignty",
        threshold: 0.25,
        perk: "Border Integrity",
        benefit:
          "Borders are monitored. Basic police response times are stable.",
        visualState: "Soldier on guard.",
      },
      {
        level: 2,
        name: "Rapid Response",
        threshold: 0.5,
        perk: "Disaster Shield",
        benefit:
          "Rescue teams deploy to any flood or fire zone within 4 hours.",
        visualState: "Rescue helicopter taking off.",
      },
      {
        level: 3,
        name: "Cyber Fortress",
        threshold: 0.75,
        perk: "Digital Iron Dome",
        benefit:
          "State AI blocks all foreign hackers and identity theft rings.",
        visualState: "Holographic shield over city.",
      },
      {
        level: 4,
        name: "Global Peacekeeper",
        threshold: 1.0,
        perk: "Superpower Status",
        benefit:
          "Military is so advanced it acts as a global deterrent. World peace enforcer.",
        visualState: "Space-based monitoring station.",
      },
    ],
  },
  {
    id: "education",
    name: "Education & Innovation",
    icon: "GraduationCap",
    description:
      "Schools, Universities, R&D Grants, Space Agencies, and Arts.",
    minCost: 0.05,
    maxCost: 0.2,
    tiers: [
      {
        level: 1,
        name: "Literacy",
        threshold: 0.25,
        perk: "School for All",
        benefit:
          "Every child guaranteed a desk, books, and a teacher up to age 18.",
        visualState: "Brick schoolhouse.",
      },
      {
        level: 2,
        name: "Skilled Workforce",
        threshold: 0.5,
        perk: "Trade Mastery",
        benefit:
          "Free vocational training for plumbers, coders, and electricians.",
        visualState: "Robotics lab workshop.",
      },
      {
        level: 3,
        name: "Knowledge Economy",
        threshold: 0.75,
        perk: "Tuition-Free University",
        benefit: "Higher education is free. Zero student debt society.",
        visualState: "University campus with glass buildings.",
      },
      {
        level: 4,
        name: "The Mars Shot",
        threshold: 1.0,
        perk: "Innovation Hub",
        benefit:
          "Massive R&D grants. Fusion energy and space travel breakthroughs.",
        visualState: "Rocket launching / Laboratory.",
      },
    ],
  },
  {
    id: "environment",
    name: "Environment & Resources",
    icon: "TreePine",
    description: "Parks, Pollution Control, Green Energy, and Agriculture.",
    minCost: 0.03,
    maxCost: 0.15,
    tiers: [
      {
        level: 1,
        name: "Clean Up",
        threshold: 0.25,
        perk: "Breathable Air",
        benefit: "Smog eliminated from cities. Industrial waste sites cleaned.",
        visualState: "Green seedling sprouting.",
      },
      {
        level: 2,
        name: "Preservation",
        threshold: 0.5,
        perk: "Rewilding",
        benefit:
          "20% of national land designated as protected nature reserves.",
        visualState: "Dense forest landscape.",
      },
      {
        level: 3,
        name: "The Transition",
        threshold: 0.75,
        perk: "100% Renewables",
        benefit: "Grid runs on Wind/Solar/Nuclear only. Fossil fuels banned.",
        visualState: "Wind turbines and solar fields.",
      },
      {
        level: 4,
        name: "Climate Engineering",
        threshold: 1.0,
        perk: "The Green Shield",
        benefit:
          "Massive sea-walls and carbon capture plants reverse climate change.",
        visualState: "Futuristic eco-city.",
      },
    ],
  },
  {
    id: "social",
    name: "Social Protection",
    icon: "Users",
    description: "Pensions, Unemployment, Housing, and Childcare.",
    minCost: 0.05,
    maxCost: 0.18,
    tiers: [
      {
        level: 1,
        name: "Dignity",
        threshold: 0.25,
        perk: "Food Security",
        benefit:
          "Food banks and emergency shelters available for the desperate.",
        visualState: "Soup kitchen / Shelter.",
      },
      {
        level: 2,
        name: "Safety Net",
        threshold: 0.5,
        perk: "Living Wages",
        benefit:
          "Unemployment benefits cover 80% of lost salary for 6 months.",
        visualState: "Social housing block.",
      },
      {
        level: 3,
        name: "Family First",
        threshold: 0.75,
        perk: "Free Childcare",
        benefit: "State-funded daycare and 1 year paid parental leave.",
        visualState: "Happy family in park.",
      },
      {
        level: 4,
        name: "Post-Scarcity",
        threshold: 1.0,
        perk: "Universal Basic Income",
        benefit:
          "Every citizen receives a monthly stipend to cover basic needs.",
        visualState: "Utopian community gathering.",
      },
    ],
  },
  {
    id: "governance",
    name: "Governance & Diplomacy",
    icon: "Landmark",
    description: "Administration, Tax Collection, Foreign Aid, and Justice.",
    minCost: 0.03,
    maxCost: 0.1,
    tiers: [
      {
        level: 1,
        name: "Functionality",
        threshold: 0.25,
        perk: "Tax & Census",
        benefit:
          "The government can collect funds and count votes accurately.",
        visualState: "City Hall building.",
      },
      {
        level: 2,
        name: "Efficiency",
        threshold: 0.5,
        perk: "Digital Bureaucracy",
        benefit:
          "No paper forms. All permits and licenses handled via app instantly.",
        visualState: "Smartphone with government logo.",
      },
      {
        level: 3,
        name: "Global Aid",
        threshold: 0.75,
        perk: "Soft Power",
        benefit:
          "Massive foreign aid budget increases global influence and trade.",
        visualState: "Globe with connecting lines.",
      },
      {
        level: 4,
        name: "Algorithmic Justice",
        threshold: 1.0,
        perk: "AI Auditing",
        benefit: "AI auditors prevent corruption and waste in real-time.",
        visualState: "Transparent digital holographic pillar.",
      },
    ],
  },
];

// Political archetypes based on highest spending
export const ARCHETYPES = {
  health: {
    name: "The Humanitarian",
    description: "You prioritize the health and wellbeing of all citizens.",
    emoji: "❤️",
  },
  infrastructure: {
    name: "The Builder",
    description: "You believe in connecting and empowering through infrastructure.",
    emoji: "🏗️",
  },
  defense: {
    name: "The Guardian",
    description: "Security and protection are your primary concerns.",
    emoji: "🛡️",
  },
  education: {
    name: "The Visionary",
    description: "You invest in the future through knowledge and innovation.",
    emoji: "🎓",
  },
  environment: {
    name: "The Naturalist",
    description: "You champion the planet and sustainable living.",
    emoji: "🌳",
  },
  social: {
    name: "The Caretaker",
    description: "You ensure no citizen is left behind in society.",
    emoji: "🤝",
  },
  governance: {
    name: "The Diplomat",
    description: "You value efficient governance and global cooperation.",
    emoji: "🏛️",
  },
};

