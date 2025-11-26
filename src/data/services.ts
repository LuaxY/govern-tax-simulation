import type { Service } from "@/types";

// All amounts in dollars (based on $500B fixed budget)
export const APP_CONFIG = {
	fixedBudget: 500_000_000_000, // $500 billion fixed budget
	currencySymbol: "$", // Default currency (USD)
};

export const SERVICES_DATA: Service[] = [
	{
		id: "debt",
		name: "Debt Servicing",
		icon: "Banknote",
		description:
			"Interest payments, bond obligations, and national debt management.",
		minCost: 50_000_000_000, // $50B minimum (10% of budget)
		maxCost: 125_000_000_000, // $125B maximum (25% of budget)
		tiers: [
			{
				level: 1,
				name: "Minimum Payments",
				threshold: 0.25,
				perk: "Credit Maintained",
				benefit:
					"Interest payments covered. Credit rating stable. No default risk.",
				visualState: "Bank ledger with checkmarks.",
			},
			{
				level: 2,
				name: "Principal Reduction",
				threshold: 0.5,
				perk: "Debt Declining",
				benefit: "Actively paying down principal. Debt-to-GDP ratio improving.",
				visualState: "Downward trending debt chart.",
			},
			{
				level: 3,
				name: "Fiscal Discipline",
				threshold: 0.75,
				perk: "Budget Surplus",
				benefit: "Running surplus budgets. Building sovereign wealth fund.",
				visualState: "Growing reserve fund.",
			},
			{
				level: 4,
				name: "AAA Rated",
				threshold: 1.0,
				perk: "Fiscal Credibility",
				benefit:
					"Highest credit rating. Lowest borrowing costs globally. Economic safe haven.",
				visualState: "Gold-standard treasury.",
			},
		],
		subServices: [
			{
				id: "interest",
				name: "Interest Payments",
				defaultPercentage: 0.5,
				minPercentage: 0.3,
			},
			{
				id: "bonds",
				name: "Bond Obligations",
				defaultPercentage: 0.3,
				minPercentage: 0.15,
			},
			{
				id: "management",
				name: "Debt Management",
				defaultPercentage: 0.2,
				minPercentage: 0.1,
			},
		],
	},
	{
		id: "health",
		name: "Public Health & Well-being",
		icon: "HeartPulse",
		description:
			"Hospitals, Pharmaceuticals, Mental Health, and Pandemic Control.",
		minCost: 56_250_000_000, // $56.25B (11.25% of budget)
		maxCost: 225_000_000_000, // $225B (45% of budget)
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
				name: "Universal Prevention",
				threshold: 1.0,
				perk: "World-Class Outcomes",
				benefit:
					"Free annual checkups for all. Comprehensive cancer screening. Top 5 global health outcomes.",
				visualState: "Modern preventive care clinic.",
			},
		],
		subServices: [
			{
				id: "hospitals",
				name: "Hospitals",
				defaultPercentage: 0.4,
				minPercentage: 0.2,
			},
			{
				id: "pharmaceuticals",
				name: "Pharmaceuticals",
				defaultPercentage: 0.25,
				minPercentage: 0.1,
			},
			{
				id: "mental-health",
				name: "Mental Health",
				defaultPercentage: 0.2,
				minPercentage: 0.1,
			},
			{
				id: "pandemic",
				name: "Pandemic Control",
				defaultPercentage: 0.15,
				minPercentage: 0.05,
			},
		],
	},
	{
		id: "infrastructure",
		name: "Infrastructure & Transport",
		icon: "TrainFront",
		description: "Roads, Rail, Water Systems, Internet, and Waste Management.",
		minCost: 35_000_000_000, // $35B (7% of budget)
		maxCost: 140_000_000_000, // $140B (28% of budget)
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
		subServices: [
			{
				id: "roads",
				name: "Roads",
				defaultPercentage: 0.3,
				minPercentage: 0.1,
			},
			{
				id: "rail",
				name: "Rail",
				defaultPercentage: 0.25,
				minPercentage: 0.05,
			},
			{
				id: "water",
				name: "Water Systems",
				defaultPercentage: 0.2,
				minPercentage: 0.1,
			},
			{
				id: "internet",
				name: "Internet",
				defaultPercentage: 0.15,
				minPercentage: 0.05,
			},
			{
				id: "waste",
				name: "Waste Management",
				defaultPercentage: 0.1,
				minPercentage: 0.05,
			},
		],
	},
	{
		id: "defense",
		name: "Safety & Defense",
		icon: "ShieldCheck",
		description:
			"Military, Police, Fire Services, Cyber-Security, and Borders.",
		minCost: 30_000_000_000, // $30B (6% of budget)
		maxCost: 120_000_000_000, // $120B (24% of budget)
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
				name: "Cyber Resilience",
				threshold: 0.75,
				perk: "Protected Infrastructure",
				benefit:
					"Critical systems hardened against attacks. Rapid incident response teams. Public cybersecurity awareness.",
				visualState: "Secure operations center.",
			},
			{
				level: 4,
				name: "Regional Security Leader",
				threshold: 1.0,
				perk: "Strategic Stability",
				benefit:
					"Advanced defense capabilities. Active peacekeeping contributions. Strong mutual defense alliances.",
				visualState: "Joint military exercise.",
			},
		],
		subServices: [
			{
				id: "military",
				name: "Military",
				defaultPercentage: 0.35,
				minPercentage: 0.1,
			},
			{
				id: "police",
				name: "Police",
				defaultPercentage: 0.25,
				minPercentage: 0.15,
			},
			{
				id: "fire",
				name: "Fire Services",
				defaultPercentage: 0.15,
				minPercentage: 0.1,
			},
			{
				id: "cyber",
				name: "Cyber-Security",
				defaultPercentage: 0.15,
				minPercentage: 0.05,
			},
			{
				id: "borders",
				name: "Border Security",
				defaultPercentage: 0.1,
				minPercentage: 0.05,
			},
		],
	},
	{
		id: "education",
		name: "Education & Innovation",
		icon: "GraduationCap",
		description: "Schools, Universities, R&D Grants, Space Agencies, and Arts.",
		minCost: 37_500_000_000, // $37.5B (7.5% of budget)
		maxCost: 150_000_000_000, // $150B (30% of budget)
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
				name: "Innovation Nation",
				threshold: 1.0,
				perk: "Global R&D Hub",
				benefit:
					"Top 10 global university rankings. R&D spending at 3%+ GDP. Thriving startup ecosystem.",
				visualState: "Research campus with tech companies.",
			},
		],
		subServices: [
			{
				id: "schools",
				name: "Schools",
				defaultPercentage: 0.35,
				minPercentage: 0.2,
			},
			{
				id: "universities",
				name: "Universities",
				defaultPercentage: 0.3,
				minPercentage: 0.1,
			},
			{
				id: "research",
				name: "R&D Grants",
				defaultPercentage: 0.2,
				minPercentage: 0.05,
			},
			{
				id: "space",
				name: "Space Agencies",
				defaultPercentage: 0.1,
				minPercentage: 0.02,
			},
			{
				id: "arts",
				name: "Arts & Culture",
				defaultPercentage: 0.05,
				minPercentage: 0.02,
			},
		],
	},
	{
		id: "environment",
		name: "Environment & Resources",
		icon: "TreePine",
		description: "Parks, Pollution Control, Green Energy, and Agriculture.",
		minCost: 25_000_000_000, // $25B (5% of budget)
		maxCost: 100_000_000_000, // $100B (20% of budget)
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
				name: "Carbon Neutral",
				threshold: 1.0,
				perk: "Net-Zero Achieved",
				benefit:
					"Net-zero emissions reached. Climate adaptation infrastructure complete. Global environmental leadership.",
				visualState: "Sustainable green city.",
			},
		],
		subServices: [
			{
				id: "parks",
				name: "Parks & Conservation",
				defaultPercentage: 0.2,
				minPercentage: 0.05,
			},
			{
				id: "pollution",
				name: "Pollution Control",
				defaultPercentage: 0.25,
				minPercentage: 0.1,
			},
			{
				id: "energy",
				name: "Green Energy",
				defaultPercentage: 0.35,
				minPercentage: 0.1,
			},
			{
				id: "agriculture",
				name: "Agriculture",
				defaultPercentage: 0.2,
				minPercentage: 0.1,
			},
		],
	},
	{
		id: "social",
		name: "Social Protection",
		icon: "Users",
		description: "Pensions, Unemployment, Housing, and Childcare.",
		minCost: 68_750_000_000, // $68.75B (13.75% of budget)
		maxCost: 275_000_000_000, // $275B (55% of budget)
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
				benefit: "Unemployment benefits cover 80% of lost salary for 6 months.",
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
		subServices: [
			{
				id: "pensions",
				name: "Pensions",
				defaultPercentage: 0.45,
				minPercentage: 0.2,
			},
			{
				id: "unemployment",
				name: "Unemployment",
				defaultPercentage: 0.2,
				minPercentage: 0.1,
			},
			{
				id: "housing",
				name: "Housing",
				defaultPercentage: 0.2,
				minPercentage: 0.1,
			},
			{
				id: "childcare",
				name: "Childcare",
				defaultPercentage: 0.15,
				minPercentage: 0.05,
			},
		],
	},
	{
		id: "governance",
		name: "Governance & Diplomacy",
		icon: "Landmark",
		description: "Administration, Tax Collection, Foreign Aid, and Justice.",
		minCost: 27_500_000_000, // $27.5B (5.5% of budget)
		maxCost: 110_000_000_000, // $110B (22% of budget)
		tiers: [
			{
				level: 1,
				name: "Functionality",
				threshold: 0.25,
				perk: "Tax & Census",
				benefit: "The government can collect funds and count votes accurately.",
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
				name: "Transparent Democracy",
				threshold: 1.0,
				perk: "Highest Trust",
				benefit:
					"Open data government. Independent anti-corruption courts. Top global trust and transparency rankings.",
				visualState: "Open government data portal.",
			},
		],
		subServices: [
			{
				id: "admin",
				name: "Administration",
				defaultPercentage: 0.3,
				minPercentage: 0.15,
			},
			{
				id: "tax",
				name: "Tax Collection",
				defaultPercentage: 0.25,
				minPercentage: 0.15,
			},
			{
				id: "foreign-aid",
				name: "Foreign Aid",
				defaultPercentage: 0.2,
				minPercentage: 0.05,
			},
			{
				id: "justice",
				name: "Justice System",
				defaultPercentage: 0.25,
				minPercentage: 0.1,
			},
		],
	},
];

// Political archetypes based on highest spending (single service)
export const ARCHETYPES: Record<
	string,
	{ name: string; description: string; emoji: string }
> = {
	debt: {
		name: "The Fiscal Hawk",
		description:
			"You prioritize financial stability and debt reduction above all.",
		emoji: "🦅",
	},
	health: {
		name: "The Humanitarian",
		description: "You prioritize the health and wellbeing of all citizens.",
		emoji: "❤️",
	},
	infrastructure: {
		name: "The Builder",
		description:
			"You believe in connecting and empowering through infrastructure.",
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

// Compound archetypes when two services are close in spending (within threshold)
// Key format: "serviceId1-serviceId2" (alphabetically sorted)
export const COMPOUND_ARCHETYPES: Record<
	string,
	{ name: string; description: string; emoji: string }
> = {
	// Health combinations
	"education-health": {
		name: "The Social Progressive",
		description:
			"A government that invests in people through health and knowledge.",
		emoji: "🌟",
	},
	"health-social": {
		name: "The Welfare Champion",
		description:
			"A compassionate state focused on citizen wellbeing and social safety.",
		emoji: "💝",
	},
	"environment-health": {
		name: "The Holistic Healer",
		description: "You believe healthy people need a healthy planet.",
		emoji: "🌿",
	},
	"defense-health": {
		name: "The Protector",
		description: "Security and health form the foundation of your nation.",
		emoji: "🏥",
	},

	// Education combinations
	"education-environment": {
		name: "The Future Planner",
		description: "Investing in minds and the planet for generations to come.",
		emoji: "🔮",
	},
	"education-infrastructure": {
		name: "The Modernizer",
		description: "Building smart infrastructure and educated citizens.",
		emoji: "🚀",
	},
	"defense-education": {
		name: "The Strategic Thinker",
		description: "Knowledge and security are your pillars of strength.",
		emoji: "🎯",
	},
	"education-social": {
		name: "The Equalizer",
		description: "Education and social support break the cycle of inequality.",
		emoji: "📚",
	},

	// Infrastructure combinations
	"defense-infrastructure": {
		name: "The Strategic Builder",
		description:
			"Strong infrastructure and strong defense make a strong nation.",
		emoji: "🏰",
	},
	"environment-infrastructure": {
		name: "The Green Engineer",
		description: "Building sustainable infrastructure for a cleaner future.",
		emoji: "🌉",
	},
	"infrastructure-social": {
		name: "The Public Servant",
		description: "Infrastructure and social services that lift all citizens.",
		emoji: "🏘️",
	},

	// Defense combinations
	"defense-environment": {
		name: "The Resource Guardian",
		description: "Protecting the nation and its natural resources.",
		emoji: "🦁",
	},
	"defense-social": {
		name: "The Sentinel State",
		description: "A secure nation with a strong social safety net.",
		emoji: "⚔️",
	},
	"defense-governance": {
		name: "The Order Keeper",
		description: "Strong institutions and security maintain stability.",
		emoji: "🏛️",
	},

	// Environment combinations
	"environment-social": {
		name: "The Green Socialist",
		description: "Environmental justice and social equality go hand in hand.",
		emoji: "🌻",
	},

	// Social combinations
	"governance-social": {
		name: "The Administrator",
		description: "Efficient governance delivering social programs to all.",
		emoji: "📋",
	},

	// Governance combinations
	"governance-health": {
		name: "The Public Health Official",
		description: "Well-organized systems delivering healthcare to all.",
		emoji: "⚕️",
	},
	"education-governance": {
		name: "The Enlightened Bureaucrat",
		description: "Smart governance powered by educated citizens.",
		emoji: "🎓",
	},
	"governance-infrastructure": {
		name: "The Systems Architect",
		description: "Building efficient systems both physical and administrative.",
		emoji: "🔧",
	},
	"environment-governance": {
		name: "The Regulator",
		description: "Strong environmental policy backed by capable institutions.",
		emoji: "📜",
	},

	// Debt combinations
	"debt-governance": {
		name: "The Fiscal Conservative",
		description:
			"Prudent spending and efficient government reduce national debt.",
		emoji: "💼",
	},
	"debt-infrastructure": {
		name: "The Pragmatic Investor",
		description:
			"Strategic infrastructure spending while managing debt responsibly.",
		emoji: "📊",
	},
	"debt-health": {
		name: "The Balanced Steward",
		description: "Maintaining fiscal health while caring for citizen health.",
		emoji: "⚖️",
	},
	"debt-education": {
		name: "The Long-Term Planner",
		description: "Investing in education while ensuring fiscal sustainability.",
		emoji: "🎯",
	},
	"debt-defense": {
		name: "The Fortress Builder",
		description: "Financial security and national security are equally vital.",
		emoji: "🏦",
	},
	"debt-environment": {
		name: "The Sustainable Economist",
		description: "Green investments that also make fiscal sense.",
		emoji: "💚",
	},
	"debt-social": {
		name: "The Responsible Caretaker",
		description: "Social programs funded sustainably for the long term.",
		emoji: "🤲",
	},
};

// Subservice trait definitions - triggers when allocation % exceeds threshold
export interface PolicyTrait {
	id: string;
	name: string;
	emoji: string;
	serviceId: string;
	subServiceId: string;
	threshold: number; // Percentage of parent (0-1) to trigger this trait
}

export const POLICY_TRAITS: PolicyTrait[] = [
	// Health subservices
	{
		id: "mental-health-champion",
		name: "Mental Health Champion",
		emoji: "🧠",
		serviceId: "health",
		subServiceId: "mental-health",
		threshold: 0.3,
	},
	{
		id: "pandemic-prepared",
		name: "Pandemic Prepared",
		emoji: "🦠",
		serviceId: "health",
		subServiceId: "pandemic",
		threshold: 0.25,
	},
	{
		id: "pharma-focus",
		name: "Pharma Focused",
		emoji: "💊",
		serviceId: "health",
		subServiceId: "pharmaceuticals",
		threshold: 0.35,
	},
	{
		id: "hospital-builder",
		name: "Hospital Builder",
		emoji: "🏥",
		serviceId: "health",
		subServiceId: "hospitals",
		threshold: 0.55,
	},

	// Education subservices
	{
		id: "space-enthusiast",
		name: "Space Enthusiast",
		emoji: "🚀",
		serviceId: "education",
		subServiceId: "space",
		threshold: 0.15,
	},
	{
		id: "arts-patron",
		name: "Arts Patron",
		emoji: "🎨",
		serviceId: "education",
		subServiceId: "arts",
		threshold: 0.1,
	},
	{
		id: "research-driven",
		name: "Research Driven",
		emoji: "🔬",
		serviceId: "education",
		subServiceId: "research",
		threshold: 0.3,
	},
	{
		id: "university-champion",
		name: "University Champion",
		emoji: "🎓",
		serviceId: "education",
		subServiceId: "universities",
		threshold: 0.4,
	},

	// Infrastructure subservices
	{
		id: "rail-enthusiast",
		name: "Rail Enthusiast",
		emoji: "🚄",
		serviceId: "infrastructure",
		subServiceId: "rail",
		threshold: 0.35,
	},
	{
		id: "digital-first",
		name: "Digital First",
		emoji: "🌐",
		serviceId: "infrastructure",
		subServiceId: "internet",
		threshold: 0.25,
	},
	{
		id: "road-warrior",
		name: "Road Warrior",
		emoji: "🛣️",
		serviceId: "infrastructure",
		subServiceId: "roads",
		threshold: 0.45,
	},
	{
		id: "water-guardian",
		name: "Water Guardian",
		emoji: "💧",
		serviceId: "infrastructure",
		subServiceId: "water",
		threshold: 0.3,
	},

	// Defense subservices
	{
		id: "cyber-defender",
		name: "Cyber Defender",
		emoji: "🔐",
		serviceId: "defense",
		subServiceId: "cyber",
		threshold: 0.25,
	},
	{
		id: "military-strong",
		name: "Military Strong",
		emoji: "🎖️",
		serviceId: "defense",
		subServiceId: "military",
		threshold: 0.5,
	},
	{
		id: "firefighter-hero",
		name: "First Responder Focus",
		emoji: "🚒",
		serviceId: "defense",
		subServiceId: "fire",
		threshold: 0.25,
	},
	{
		id: "border-hawk",
		name: "Border Hawk",
		emoji: "🚧",
		serviceId: "defense",
		subServiceId: "borders",
		threshold: 0.2,
	},

	// Environment subservices
	{
		id: "climate-forward",
		name: "Climate Forward",
		emoji: "⚡",
		serviceId: "environment",
		subServiceId: "energy",
		threshold: 0.5,
	},
	{
		id: "park-ranger",
		name: "Park Ranger",
		emoji: "🏕️",
		serviceId: "environment",
		subServiceId: "parks",
		threshold: 0.3,
	},
	{
		id: "pollution-fighter",
		name: "Pollution Fighter",
		emoji: "🌬️",
		serviceId: "environment",
		subServiceId: "pollution",
		threshold: 0.35,
	},
	{
		id: "farm-supporter",
		name: "Farm Supporter",
		emoji: "🌾",
		serviceId: "environment",
		subServiceId: "agriculture",
		threshold: 0.3,
	},

	// Social subservices
	{
		id: "housing-advocate",
		name: "Housing Advocate",
		emoji: "🏠",
		serviceId: "social",
		subServiceId: "housing",
		threshold: 0.3,
	},
	{
		id: "childcare-champion",
		name: "Childcare Champion",
		emoji: "👶",
		serviceId: "social",
		subServiceId: "childcare",
		threshold: 0.25,
	},
	{
		id: "pension-protector",
		name: "Pension Protector",
		emoji: "👴",
		serviceId: "social",
		subServiceId: "pensions",
		threshold: 0.55,
	},
	{
		id: "job-security",
		name: "Job Security Advocate",
		emoji: "💼",
		serviceId: "social",
		subServiceId: "unemployment",
		threshold: 0.3,
	},

	// Governance subservices
	{
		id: "global-aid-leader",
		name: "Global Aid Leader",
		emoji: "🌍",
		serviceId: "governance",
		subServiceId: "foreign-aid",
		threshold: 0.3,
	},
	{
		id: "justice-seeker",
		name: "Justice Seeker",
		emoji: "⚖️",
		serviceId: "governance",
		subServiceId: "justice",
		threshold: 0.35,
	},
	{
		id: "tax-reformer",
		name: "Tax Reformer",
		emoji: "📝",
		serviceId: "governance",
		subServiceId: "tax",
		threshold: 0.35,
	},
	{
		id: "efficient-admin",
		name: "Efficient Administrator",
		emoji: "🗂️",
		serviceId: "governance",
		subServiceId: "admin",
		threshold: 0.4,
	},

	// Debt subservices
	{
		id: "bond-manager",
		name: "Bond Manager",
		emoji: "📈",
		serviceId: "debt",
		subServiceId: "bonds",
		threshold: 0.4,
	},
	{
		id: "debt-hawk",
		name: "Debt Hawk",
		emoji: "🦅",
		serviceId: "debt",
		subServiceId: "management",
		threshold: 0.3,
	},
];
