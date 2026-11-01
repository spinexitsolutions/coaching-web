export type NavLink = { label: string; href: string };

export type SectionId =
  | "hero"
  | "marquee"
  | "stats"
  | "manifesto"
  | "programs"
  | "features"
  | "results"
  | "faculty"
  | "batches"
  | "testimonials"
  | "scholarship"
  | "updates"
  | "gallery"
  | "faq"
  | "enquiry";

export type SectionToggle = { id: SectionId; label: string; enabled: boolean };

export type Stat = { value: number; suffix: string; label: string };

export type Settings = {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    phone: string;
    email: string;
    whatsapp: string;
    address: string;
    hours: string;
    mapEmbed: string;
    instagram: string;
    youtube: string;
    facebook: string;
    linkedin: string;
  };
  theme: {
    accent: string;
    accent2: string;
    ink: string;
    paper: string;
  };
  intro: {
    enabled: boolean;
    words: string[];
    duration: number;
    oncePerSession: boolean;
    background: string;
  };
  announcement: { enabled: boolean; text: string; href: string };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleAccent: string;
    titleLine2: string;
    subtitle: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
    images: string[];
  };
  manifesto: { label: string; text: string };
  nav: { links: NavLink[]; ctaLabel: string; ctaHref: string; islandStatus: string };
  sections: SectionToggle[];
  stats: Stat[];
  scholarship: {
    title: string;
    subtitle: string;
    date: string;
    maxScholarship: string;
  };
  popup: { enabled: boolean; title: string; text: string; delay: number; image: string };
  seo: { title: string; description: string };
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  category: string;
  classLevel: string;
  duration: string;
  mode: string;
  fee: number;
  discountedFee: number;
  image: string;
  tagline: string;
  description: string;
  highlights: string[];
  syllabus: string[];
  color: string;
  featured: boolean;
  published: boolean;
};

export type Batch = {
  id: string;
  course: string;
  name: string;
  startDate: string;
  timing: string;
  mode: string;
  seats: number;
  filled: number;
  published: boolean;
};

export type Faculty = {
  id: string;
  name: string;
  subject: string;
  designation: string;
  experience: string;
  qualification: string;
  image: string;
  bio: string;
  published: boolean;
};

export type Result = {
  id: string;
  name: string;
  exam: string;
  rank: string;
  year: string;
  score: string;
  image: string;
  quote: string;
  published: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  rating: number;
  published: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  published: boolean;
};

export type Notice = {
  id: string;
  title: string;
  date: string;
  tag: string;
  href: string;
  important: boolean;
  published: boolean;
};

export type Faq = { id: string; question: string; answer: string; category: string; published: boolean };

export type GalleryItem = { id: string; title: string; image: string; category: string; published: boolean };

export type Download = {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  size: string;
  published: boolean;
};

export type LeadStatus = "new" | "contacted" | "demo" | "enrolled" | "lost";

export type LeadNote = { id: string; text: string; at: string };

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  classLevel: string;
  source: string;
  message: string;
  status: LeadStatus;
  followUp: string;
  assignedTo: string;
  value: number;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
};

export type Collections = {
  courses: Course[];
  batches: Batch[];
  faculty: Faculty[];
  results: Result[];
  testimonials: Testimonial[];
  posts: Post[];
  notices: Notice[];
  faqs: Faq[];
  gallery: GalleryItem[];
  downloads: Download[];
};

export type CollectionKey = keyof Collections;

export type Database = Collections & {
  settings: Settings;
  leads: Lead[];
};
