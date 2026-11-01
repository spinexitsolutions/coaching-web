import type { Database, Lead, LeadStatus } from "./types";

export const u = (id: string, w = 1200, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80`;

/** Curated image library offered in the admin image picker. */
export const IMAGE_LIBRARY = [
  "1524178232363-1fb2b075b655",
  "1571260899304-425eee4c7efc",
  "1522202176988-66273c2fd55f",
  "1541339907198-e08756dedf3f",
  "1635070041078-e363dbe005cb",
  "1532094349884-543bc11b234d",
  "1554475901-4538ddfbccc2",
  "1606761568499-6d2451b23c66",
  "1580582932707-520aed937b7b",
  "1564981797816-1043664bf78d",
  "1427504494785-3a9ca7044f45",
  "1456513080510-7bf3a84b82f8",
  "1434030216411-0b793f4b4173",
  "1513258496099-48168024aec0",
  "1627556704290-2b1f5853ff78",
  "1492538368677-f6e0afe31dcc",
  "1543269865-cbf427effbad",
  "1509062522246-3755977927d7",
  "1503676260728-1c00da094a0b",
  "1497633762265-9d179a990aa6",
  "1488190211105-8b0e65b80b4e",
  "1588072432836-e10032774350",
  "1531545514256-b1400bc00f31",
  "1517486808906-6ca8b3f04846",
  "1557862921-37829c790f19",
  "1567532939604-b6b5b0db2604",
  "1560250097-0b93528c311a",
  "1573497019940-1c28c88b4f3e",
  "1595152772835-219674b2a8a6",
  "1607746882042-944635dfe10e",
  "1633332755192-727a05c4013d",
  "1527980965255-d3b416303d12",
  "1544717305-2782549b5136",
  "1596495578065-6e0763fa1178",
  "1599566150163-29194dcaad36",
  "1573496359142-b8d87734a5a2",
  "1539571696357-5a69c17a67c6",
  "1615109398623-88346a601842",
  "1534528741775-53994a69daeb",
  "1506794778202-cad84cf45f1d",
].map((id) => u(id, 1200));

const daysAgo = (d: number, h = 10) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h, (d * 17) % 60, 0, 0);
  return t.toISOString();
};
const daysAhead = (d: number) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().slice(0, 10);
};

const firstNames = [
  "Aarav", "Ananya", "Vivaan", "Diya", "Arjun", "Ishita", "Kabir", "Saanvi", "Reyansh", "Myra",
  "Aditya", "Kiara", "Rohan", "Anika", "Vihaan", "Tara", "Krish", "Meera", "Dhruv", "Riya",
  "Atharv", "Navya", "Shaurya", "Aadhya", "Yash", "Pari", "Arnav", "Sara", "Ayaan", "Nisha",
];
const lastNames = ["Sharma", "Verma", "Gupta", "Patel", "Singh", "Iyer", "Reddy", "Mehta", "Joshi", "Nair", "Kapoor", "Bansal"];
const courseNames = ["JEE Advanced 2-Year", "NEET Ultimate", "Foundation (Class 9–10)", "JEE Main Crash Course", "Boards + CUET", "Olympiad Pro"];
const sources = ["Website enquiry", "Free demo class", "Scholarship test", "Admission popup", "Contact page", "Walk-in", "Instagram"];
const statuses: LeadStatus[] = ["new", "new", "contacted", "contacted", "demo", "enrolled", "enrolled", "lost"];
const counsellors = ["Priya (Counsellor)", "Rahul (Counsellor)", "Neha (Counsellor)"];

function makeLeads(): Lead[] {
  const leads: Lead[] = [];
  for (let i = 0; i < 46; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 7) % lastNames.length];
    const status = statuses[(i * 5) % statuses.length];
    const created = daysAgo(Math.floor(Math.pow(((i * 37) % 46) / 46, 1.35) * 29), 9 + (i % 9));
    const course = courseNames[(i * 5) % courseNames.length];
    leads.push({
      id: `lead_${(1000 + i).toString(36)}${i}`,
      name: `${fn} ${ln}`,
      phone: `+91 9${(812345670 + i * 7919).toString().slice(0, 9)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@gmail.com`,
      course,
      classLevel: ["Class 9", "Class 10", "Class 11", "Class 12", "Dropper"][i % 5],
      source: sources[(i * 3) % sources.length],
      message: i % 3 === 0 ? "Want to know about batch timings and fee instalments." : i % 3 === 1 ? "Interested in the scholarship test." : "",
      status,
      followUp: status === "lost" || status === "enrolled" ? "" : daysAhead((i % 6) - 1),
      assignedTo: counsellors[i % counsellors.length],
      value: status === "enrolled" ? [145000, 165000, 89000, 49000][i % 4] : 0,
      notes:
        status === "new"
          ? []
          : [
              { id: `n${i}a`, text: "Called the parent, shared brochure on WhatsApp.", at: created },
              ...(status === "demo" || status === "enrolled"
                ? [{ id: `n${i}b`, text: "Attended demo class — really liked the Physics session.", at: created }]
                : []),
            ],
      createdAt: created,
      updatedAt: created,
    });
  }
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSeed(): Database {
  return {
    settings: {
      brand: {
        name: "Lumina Academy",
        shortName: "Lumina",
        tagline: "Where toppers are made, not born.",
        phone: "+91 98765 43210",
        email: "hello@lumina.academy",
        whatsapp: "919876543210",
        address: "4th Floor, Skyline Tower, Sector 18, Noida, Uttar Pradesh 201301",
        hours: "Mon – Sat · 8:00 AM – 8:00 PM",
        mapEmbed: "https://www.google.com/maps?q=Sector+18+Noida&output=embed",
        instagram: "https://instagram.com",
        youtube: "https://youtube.com",
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com",
      },
      theme: { accent: "#1F4D3F", accent2: "#E8B04B", ink: "#15171A", paper: "#F4F1EA" },
      intro: {
        enabled: true,
        words: ["Focus.", "Discipline.", "Clarity.", "Results."],
        duration: 2.6,
        oncePerSession: true,
        background: "#15171A",
      },
      announcement: {
        enabled: true,
        text: "Admissions open for 2027 batches — up to 100% scholarship",
        href: "/admissions",
      },
      hero: {
        eyebrow: "JEE · NEET · Foundation · Olympiads",
        titleLine1: "Learn with",
        titleAccent: "clarity,",
        titleLine2: "rank with confidence.",
        subtitle:
          "Small batches, India's sharpest mentors and a learning system engineered around you. Fourteen years of turning curious students into IIT & AIIMS toppers.",
        primaryCta: "Book a free demo",
        primaryHref: "#enquiry",
        secondaryCta: "Explore programs",
        secondaryHref: "/courses",
        images: [
          u("1524178232363-1fb2b075b655", 1400),
          u("1522202176988-66273c2fd55f", 1400),
          u("1606761568499-6d2451b23c66", 1400),
        ],
      },
      manifesto: {
        label: "Our philosophy",
        text: "We believe every student is capable of extraordinary results. Not through endless pressure, but through clarity of concepts, honest mentorship and a system that adapts to how you learn. That is the Lumina way.",
      },
      nav: {
        links: [
          { label: "Programs", href: "/courses" },
          { label: "Results", href: "/results" },
          { label: "Faculty", href: "/faculty" },
          { label: "Admissions", href: "/admissions" },
          { label: "Resources", href: "/resources" },
          { label: "Blog", href: "/blog" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
        ctaLabel: "Enrol now",
        ctaHref: "/admissions",
        islandStatus: "Admissions open · 2027",
      },
      sections: [
        { id: "hero", label: "Hero", enabled: true },
        { id: "marquee", label: "Exam marquee", enabled: true },
        { id: "manifesto", label: "Manifesto (scroll text)", enabled: true },
        { id: "stats", label: "Stats bento", enabled: true },
        { id: "programs", label: "Programs carousel", enabled: true },
        { id: "features", label: "Why us (features)", enabled: true },
        { id: "results", label: "Results & toppers", enabled: true },
        { id: "faculty", label: "Faculty", enabled: true },
        { id: "batches", label: "Upcoming batches", enabled: true },
        { id: "testimonials", label: "Testimonials", enabled: true },
        { id: "scholarship", label: "Scholarship test", enabled: true },
        { id: "updates", label: "Notices & blog", enabled: true },
        { id: "gallery", label: "Campus gallery", enabled: true },
        { id: "faq", label: "FAQs", enabled: true },
        { id: "enquiry", label: "Enquiry / demo form", enabled: true },
      ],
      stats: [
        { value: 14, suffix: "+", label: "Years of excellence" },
        { value: 12500, suffix: "+", label: "Students mentored" },
        { value: 1840, suffix: "", label: "IIT & AIIMS selections" },
        { value: 98, suffix: "%", label: "Parent satisfaction" },
      ],
      scholarship: {
        title: "Lumina Scholarship Test",
        subtitle: "One test. Up to 100% fee waiver. Online & offline, for Classes 8 – 12.",
        date: daysAhead(24) + "T10:00",
        maxScholarship: "100%",
      },
      popup: {
        enabled: true,
        title: "Get a free counselling session",
        text: "Talk to our academic counsellor and get a personalised study plan — free.",
        delay: 18,
        image: u("1522202176988-66273c2fd55f", 900),
      },
      seo: {
        title: "Lumina Academy — JEE, NEET & Foundation Coaching",
        description:
          "Lumina Academy is a premium coaching institute for JEE, NEET, Foundation and Olympiads with small batches, top faculty and proven results.",
      },
    },

    courses: [
      {
        id: "c1",
        slug: "jee-advanced-2-year",
        title: "JEE Advanced 2-Year",
        category: "Engineering",
        classLevel: "Class 11 – 12",
        duration: "2 years",
        mode: "Offline + Live",
        fee: 185000,
        discountedFee: 165000,
        image: u("1635070041078-e363dbe005cb"),
        tagline: "The complete road to IIT.",
        description:
          "A rigorous two-year program that builds JEE-level problem solving from first principles. Integrated with your Class 11 & 12 boards, weekly tests and 1:1 mentorship.",
        highlights: ["6 days/week classroom", "Weekly JEE-pattern tests", "1:1 mentor every fortnight", "Doubt desk till 9 PM", "Printed study modules"],
        syllabus: ["Mechanics & Waves", "Electrodynamics & Optics", "Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Calculus", "Algebra & Coordinate Geometry", "Modern Physics"],
        color: "#1F4D3F",
        featured: true,
        published: true,
      },
      {
        id: "c2",
        slug: "neet-ultimate",
        title: "NEET Ultimate",
        category: "Medical",
        classLevel: "Class 11 – 12",
        duration: "2 years",
        mode: "Offline + Live",
        fee: 170000,
        discountedFee: 149000,
        image: u("1532094349884-543bc11b234d"),
        tagline: "Your white coat starts here.",
        description:
          "NCERT-first, concept-deep preparation for NEET with a special focus on Biology mastery, MCQ speed drills and all-India test series.",
        highlights: ["NCERT line-by-line", "40+ full mock tests", "Biology diagram labs", "Weekly parent reports", "Hostel assistance"],
        syllabus: ["Human Physiology", "Genetics & Evolution", "Plant Physiology", "Ecology", "Physical Chemistry", "Organic Chemistry", "Mechanics", "Modern Physics"],
        color: "#16A34A",
        featured: true,
        published: true,
      },
      {
        id: "c3",
        slug: "foundation-9-10",
        title: "Foundation (Class 9–10)",
        category: "Foundation",
        classLevel: "Class 9 – 10",
        duration: "1 year",
        mode: "Offline",
        fee: 72000,
        discountedFee: 59000,
        image: u("1503676260728-1c00da094a0b"),
        tagline: "Start early. Think deeper.",
        description:
          "Build a rock-solid base in Maths & Science, prepare for NTSE / Olympiads and score 95%+ in boards — all while falling in love with learning.",
        highlights: ["Olympiad & NTSE prep", "Mental-ability training", "Board exam excellence", "Activity-based labs"],
        syllabus: ["Number Systems", "Algebra", "Geometry", "Physics fundamentals", "Chemistry fundamentals", "Biology", "Mental ability"],
        color: "#7C3AED",
        featured: true,
        published: true,
      },
      {
        id: "c4",
        slug: "jee-main-crash-course",
        title: "JEE Main Crash Course",
        category: "Engineering",
        classLevel: "Class 12 / Dropper",
        duration: "90 days",
        mode: "Live online",
        fee: 39000,
        discountedFee: 29000,
        image: u("1434030216411-0b793f4b4173"),
        tagline: "90 days. Every chapter. Zero panic.",
        description:
          "A high-intensity revision program with chapter-wise PYQs, speed strategies and 25 full-length mocks designed to push your percentile above 99.",
        highlights: ["Daily 4-hour live sessions", "25 full mocks", "PYQ masterclasses", "Rank predictor"],
        syllabus: ["Full Physics revision", "Full Chemistry revision", "Full Maths revision", "Mock analysis"],
        color: "#0EA5E9",
        featured: false,
        published: true,
      },
      {
        id: "c5",
        slug: "boards-cuet",
        title: "Boards + CUET",
        category: "Boards",
        classLevel: "Class 12",
        duration: "1 year",
        mode: "Offline + Live",
        fee: 58000,
        discountedFee: 49000,
        image: u("1456513080510-7bf3a84b82f8"),
        tagline: "Top your boards, ace CUET.",
        description: "Score 95%+ in CBSE boards while preparing for CUET with domain-specific mocks and answer-writing practice.",
        highlights: ["Answer-writing workshops", "CUET domain mocks", "Sample-paper marathons"],
        syllabus: ["Physics", "Chemistry", "Maths / Biology", "English", "General Test"],
        color: "#E11D48",
        featured: false,
        published: true,
      },
      {
        id: "c6",
        slug: "olympiad-pro",
        title: "Olympiad Pro",
        category: "Foundation",
        classLevel: "Class 6 – 10",
        duration: "Weekend · 1 year",
        mode: "Hybrid",
        fee: 36000,
        discountedFee: 30000,
        image: u("1588072432836-e10032774350"),
        tagline: "For the curious, the relentless.",
        description: "Weekend program for IMO, NSO, IOQM and NSEJS with problem-solving circles led by former olympiad medallists.",
        highlights: ["Weekend batches", "Medallist mentors", "Problem circles"],
        syllabus: ["Number theory", "Combinatorics", "Physics puzzles", "Logical reasoning"],
        color: "#F59E0B",
        featured: false,
        published: true,
      },
    ],

    batches: [
      { id: "b1", course: "JEE Advanced 2-Year", name: "Phoenix — Morning", startDate: daysAhead(12), timing: "7:30 AM – 12:30 PM", mode: "Offline · Noida", seats: 40, filled: 31, published: true },
      { id: "b2", course: "NEET Ultimate", name: "Aster — Evening", startDate: daysAhead(19), timing: "3:00 PM – 8:00 PM", mode: "Offline · Noida", seats: 45, filled: 38, published: true },
      { id: "b3", course: "Foundation (Class 9–10)", name: "Spark — Weekday", startDate: daysAhead(26), timing: "4:00 PM – 7:00 PM", mode: "Offline", seats: 30, filled: 14, published: true },
      { id: "b4", course: "JEE Main Crash Course", name: "Sprint — Live", startDate: daysAhead(8), timing: "6:00 PM – 10:00 PM", mode: "Live online", seats: 200, filled: 172, published: true },
    ],

    faculty: [
      { id: "f1", name: "Dr. Raghav Menon", subject: "Physics", designation: "Academic Director", experience: "18 yrs", qualification: "Ph.D., IIT Bombay", image: u("1557862921-37829c790f19", 800), bio: "Former IIT faculty who has mentored 600+ IITians. Known for making Mechanics feel like storytelling.", published: true },
      { id: "f2", name: "Aditi Rao", subject: "Chemistry", designation: "HOD Chemistry", experience: "12 yrs", qualification: "M.Sc., IIT Delhi", image: u("1567532939604-b6b5b0db2604", 800), bio: "Organic chemistry wizard. Her reaction-mechanism maps are legendary among NEET aspirants.", published: true },
      { id: "f3", name: "Vikram Sethi", subject: "Mathematics", designation: "Senior Faculty", experience: "15 yrs", qualification: "B.Tech, IIT Kanpur", image: u("1560250097-0b93528c311a", 800), bio: "Turns calculus into intuition. Author of the best-selling 'Think in Calculus'.", published: true },
      { id: "f4", name: "Dr. Kavya Iyer", subject: "Biology", designation: "HOD Biology", experience: "11 yrs", qualification: "MBBS, AIIMS Delhi", image: u("1573497019940-1c28c88b4f3e", 800), bio: "AIIMS alumna who teaches Biology the way doctors actually think — through cases and connections.", published: true },
      { id: "f5", name: "Arjun Malhotra", subject: "Physics", designation: "Faculty", experience: "8 yrs", qualification: "B.Tech, IIT Roorkee", image: u("1595152772835-219674b2a8a6", 800), bio: "Electrodynamics specialist and the students' favourite for late-night doubt sessions.", published: true },
      { id: "f6", name: "Sneha Kulkarni", subject: "Mathematics", designation: "Foundation Lead", experience: "9 yrs", qualification: "M.Sc. Mathematics", image: u("1607746882042-944635dfe10e", 800), bio: "Builds olympiad thinking in young minds with puzzles, games and patience.", published: true },
    ],

    results: [
      { id: "r1", name: "Aarav Sharma", exam: "JEE Advanced", rank: "AIR 7", year: "2026", score: "331/360", image: u("1527980965255-d3b416303d12", 700), quote: "The weekly tests made the real exam feel like practice.", published: true },
      { id: "r2", name: "Ishita Verma", exam: "NEET UG", rank: "AIR 23", year: "2026", score: "710/720", image: u("1544717305-2782549b5136", 700), quote: "Kavya ma'am's Biology notes were my bible.", published: true },
      { id: "r3", name: "Kabir Mehta", exam: "JEE Advanced", rank: "AIR 41", year: "2026", score: "312/360", image: u("1599566150163-29194dcaad36", 700), quote: "Mentorship kept me calm during the toughest months.", published: true },
      { id: "r4", name: "Saanvi Iyer", exam: "NEET UG", rank: "AIR 58", year: "2026", score: "705/720", image: u("1596495578065-6e0763fa1178", 700), quote: "Small batches meant no doubt went unanswered.", published: true },
      { id: "r5", name: "Rohan Gupta", exam: "JEE Main", rank: "99.98 %ile", year: "2026", score: "99.98", image: u("1615109398623-88346a601842", 700), quote: "The crash course was pure gold.", published: true },
      { id: "r6", name: "Meera Nair", exam: "NEET UG", rank: "AIR 112", year: "2025", score: "700/720", image: u("1573496359142-b8d87734a5a2", 700), quote: "I found my confidence here.", published: true },
      { id: "r7", name: "Dhruv Kapoor", exam: "JEE Advanced", rank: "AIR 96", year: "2025", score: "298/360", image: u("1539571696357-5a69c17a67c6", 700), quote: "Physics finally clicked in my second month.", published: true },
      { id: "r8", name: "Riya Bansal", exam: "NTSE", rank: "Scholar", year: "2025", score: "Stage II", image: u("1534528741775-53994a69daeb", 700), quote: "Foundation made me fall in love with Maths.", published: true },
    ],

    testimonials: [
      { id: "t1", name: "Mrs. Sunita Sharma", role: "Parent of Aarav (AIR 7)", quote: "The weekly parent reports and how personally the mentors cared about Aarav made all the difference. We never felt like just another fee receipt.", image: u("1580489944761-15a19d654956", 400), rating: 5, published: true },
      { id: "t2", name: "Ishita Verma", role: "NEET 2026 · AIR 23", quote: "The test series was harder than NEET itself. By exam day, nothing could surprise me. Lumina gave me a system, not just classes.", image: u("1544717305-2782549b5136", 400), rating: 5, published: true },
      { id: "t3", name: "Mr. Rajesh Mehta", role: "Parent of Kabir", quote: "Beautiful campus, disciplined environment and teachers who actually reply at 10 PM. Worth every rupee.", image: u("1506794778202-cad84cf45f1d", 400), rating: 5, published: true },
      { id: "t4", name: "Rohan Gupta", role: "JEE Main 2026 · 99.98 %ile", quote: "I joined the crash course with 92 percentile in mocks. Ninety days later I scored 99.98. The PYQ masterclasses are insane.", image: u("1615109398623-88346a601842", 400), rating: 5, published: true },
    ],

    posts: [
      { id: "p1", slug: "jee-2027-strategy", title: "The 300-day strategy to crack JEE 2027", category: "Strategy", excerpt: "A month-by-month blueprint from our Academic Director on balancing boards, JEE Main and Advanced.", content: "Cracking JEE is less about studying harder and more about studying in the right order.\n\nIn the first 100 days, focus entirely on building concepts. Don't chase advanced problems before your basics are rock-solid.\n\nThe next 100 days are for application — solve chapter-wise PYQs, analyse every mistake and maintain an error notebook.\n\nThe final 100 days are about simulation. Take full-length mocks in exam conditions, revise from your own short notes and protect your sleep.\n\nConsistency beats intensity. Every single time.", image: u("1434030216411-0b793f4b4173"), author: "Dr. Raghav Menon", date: daysAhead(-3), readTime: "6 min", published: true },
      { id: "p2", slug: "ncert-biology-neet", title: "Why NCERT Biology is still your best friend for NEET", category: "NEET", excerpt: "90% of NEET Biology comes straight from NCERT lines. Here's how to read it like a topper.", content: "Every year, students chase reference books while the answers are hiding in plain sight — in NCERT.\n\nRead every line, including diagrams, tables and summaries. Make your own flashcards for examples and exceptions.\n\nRevise each chapter at least five times before the exam, and attempt line-based MCQs after each reading.", image: u("1554475901-4538ddfbccc2"), author: "Dr. Kavya Iyer", date: daysAhead(-9), readTime: "4 min", published: true },
      { id: "p3", slug: "exam-stress", title: "Managing exam stress: a guide for students & parents", category: "Wellbeing", excerpt: "Pressure is normal. Burnout isn't. Practical habits to stay calm, focused and healthy.", content: "Sleep is not a luxury — it's when your brain consolidates memory. Protect 7 hours.\n\nBreak study into 50-minute focus blocks with short walks in between.\n\nParents: ask about effort, not marks. The conversation changes everything.", image: u("1513258496099-48168024aec0"), author: "Lumina Mentorship Team", date: daysAhead(-16), readTime: "5 min", published: true },
    ],

    notices: [
      { id: "n1", title: "Lumina Scholarship Test registrations are now open", date: daysAhead(-1), tag: "Admissions", href: "/admissions#scholarship", important: true, published: true },
      { id: "n2", title: "JEE Main 2027 full mock #4 — results published", date: daysAhead(-2), tag: "Results", href: "/results", important: false, published: true },
      { id: "n3", title: "Diwali break: campus closed from 30 Oct to 3 Nov", date: daysAhead(-5), tag: "Holiday", href: "#", important: false, published: true },
      { id: "n4", title: "Parent–Teacher meeting for NEET batches on Sunday", date: daysAhead(-6), tag: "Event", href: "#", important: false, published: true },
      { id: "n5", title: "New Phoenix batch for JEE Advanced starts soon", date: daysAhead(-8), tag: "Batch", href: "/courses/jee-advanced-2-year", important: true, published: true },
    ],

    faqs: [
      { id: "q1", question: "How big are the batches?", answer: "We cap classroom batches at 40–45 students so every student gets attention. Doubt sessions are held in groups of 8–10.", category: "Academics", published: true },
      { id: "q2", question: "Do you offer scholarships?", answer: "Yes. Through the Lumina Scholarship Test (LST) you can get up to 100% fee waiver. We also offer merit- and need-based scholarships.", category: "Fees", published: true },
      { id: "q3", question: "Can I pay the fee in instalments?", answer: "Absolutely. Fees can be paid in 2–4 instalments, and we have zero-cost EMI options with partner banks.", category: "Fees", published: true },
      { id: "q4", question: "Is there a free demo class?", answer: "Yes — book a free demo class from any page. You'll attend a real class with the actual faculty before deciding.", category: "Admissions", published: true },
      { id: "q5", question: "Do you provide hostel facilities?", answer: "We have tie-ups with verified, safe hostels and PGs within walking distance, with separate accommodation for girls.", category: "Campus", published: true },
      { id: "q6", question: "How do parents track progress?", answer: "Parents get weekly test reports on WhatsApp and access to the Lumina parent app with attendance, scores and mentor remarks.", category: "Academics", published: true },
    ],

    gallery: [
      { id: "g1", title: "Main lecture hall", image: u("1606761568499-6d2451b23c66"), category: "Campus", published: true },
      { id: "g2", title: "Chemistry lab", image: u("1554475901-4538ddfbccc2"), category: "Labs", published: true },
      { id: "g3", title: "Library", image: u("1564981797816-1043664bf78d"), category: "Campus", published: true },
      { id: "g4", title: "Results celebration 2026", image: u("1627556704290-2b1f5853ff78"), category: "Events", published: true },
      { id: "g5", title: "Group study pods", image: u("1522202176988-66273c2fd55f"), category: "Campus", published: true },
      { id: "g6", title: "Classroom", image: u("1580582932707-520aed937b7b"), category: "Campus", published: true },
      { id: "g7", title: "Seminar day", image: u("1492538368677-f6e0afe31dcc"), category: "Events", published: true },
      { id: "g8", title: "Reading room", image: u("1427504494785-3a9ca7044f45"), category: "Campus", published: true },
    ],

    downloads: [
      { id: "d1", title: "JEE Main 2026 — All shifts PYQ (solved)", category: "Previous papers", fileUrl: "#", size: "12.4 MB", published: true },
      { id: "d2", title: "NEET 2026 — Paper with detailed solutions", category: "Previous papers", fileUrl: "#", size: "8.1 MB", published: true },
      { id: "d3", title: "Physics formula handbook", category: "Study material", fileUrl: "#", size: "3.2 MB", published: true },
      { id: "d4", title: "Organic chemistry reaction map", category: "Study material", fileUrl: "#", size: "2.7 MB", published: true },
      { id: "d5", title: "Lumina brochure 2027", category: "Brochure", fileUrl: "#", size: "5.5 MB", published: true },
    ],

    leads: makeLeads(),
  };
}
