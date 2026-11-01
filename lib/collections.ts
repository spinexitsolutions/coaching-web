import type { CollectionKey } from "./types";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "image"
  | "select"
  | "list"
  | "boolean"
  | "date"
  | "datetime"
  | "color"
  | "url";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  help?: string;
  full?: boolean;
  rows?: number;
};

export type CollectionDef = {
  label: string;
  singular: string;
  description: string;
  icon: string;
  titleKey: string;
  subtitleKey?: string;
  imageKey?: string;
  badgeKey?: string;
  fields: Field[];
  blank: Record<string, unknown>;
};

const published: Field = { key: "published", label: "Published (visible on website)", type: "boolean", full: true };

export const COLLECTIONS: Record<CollectionKey, CollectionDef> = {
  courses: {
    label: "Courses",
    singular: "Course",
    description: "Programs shown on the home page carousel, /courses and individual course pages.",
    icon: "GraduationCap",
    titleKey: "title",
    subtitleKey: "tagline",
    imageKey: "image",
    badgeKey: "category",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "URL slug", type: "text", help: "Used in the page URL, e.g. jee-advanced" },
      { key: "category", label: "Category", type: "select", options: ["Engineering", "Medical", "Foundation", "Boards"] },
      { key: "classLevel", label: "Class level", type: "text" },
      { key: "duration", label: "Duration", type: "text" },
      { key: "mode", label: "Mode", type: "text" },
      { key: "fee", label: "Fee (₹)", type: "number" },
      { key: "discountedFee", label: "Discounted fee (₹)", type: "number" },
      { key: "color", label: "Accent colour", type: "color" },
      { key: "tagline", label: "Tagline", type: "text", full: true },
      { key: "image", label: "Cover image", type: "image", full: true },
      { key: "description", label: "Description", type: "textarea", full: true },
      { key: "highlights", label: "Highlights", type: "list", full: true },
      { key: "syllabus", label: "Syllabus modules", type: "list", full: true },
      { key: "featured", label: "Featured on home page", type: "boolean", full: true },
      published,
    ],
    blank: { title: "New course", slug: "new-course", category: "Engineering", classLevel: "", duration: "", mode: "Offline", fee: 0, discountedFee: 0, color: "#FF5B1F", tagline: "", image: "", description: "", highlights: [], syllabus: [], featured: false, published: true },
  },
  batches: {
    label: "Batches",
    singular: "Batch",
    description: "Upcoming batches with seat availability.",
    icon: "CalendarDays",
    titleKey: "name",
    subtitleKey: "course",
    badgeKey: "mode",
    fields: [
      { key: "name", label: "Batch name", type: "text" },
      { key: "course", label: "Course", type: "text" },
      { key: "startDate", label: "Start date", type: "date" },
      { key: "timing", label: "Timing", type: "text" },
      { key: "mode", label: "Mode / location", type: "text" },
      { key: "seats", label: "Total seats", type: "number" },
      { key: "filled", label: "Seats filled", type: "number" },
      published,
    ],
    blank: { name: "New batch", course: "", startDate: "", timing: "", mode: "Offline", seats: 40, filled: 0, published: true },
  },
  faculty: {
    label: "Faculty",
    singular: "Faculty member",
    description: "Teachers and mentors.",
    icon: "Users",
    titleKey: "name",
    subtitleKey: "subject",
    imageKey: "image",
    badgeKey: "designation",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "subject", label: "Subject", type: "text" },
      { key: "designation", label: "Designation", type: "text" },
      { key: "experience", label: "Experience", type: "text" },
      { key: "qualification", label: "Qualification", type: "text", full: true },
      { key: "image", label: "Photo", type: "image", full: true },
      { key: "bio", label: "Short bio", type: "textarea", full: true },
      published,
    ],
    blank: { name: "New faculty", subject: "", designation: "", experience: "", qualification: "", image: "", bio: "", published: true },
  },
  results: {
    label: "Results",
    singular: "Topper",
    description: "Toppers and selections shown in the results section.",
    icon: "Trophy",
    titleKey: "name",
    subtitleKey: "exam",
    imageKey: "image",
    badgeKey: "rank",
    fields: [
      { key: "name", label: "Student name", type: "text" },
      { key: "exam", label: "Exam", type: "text" },
      { key: "rank", label: "Rank / percentile", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "score", label: "Score", type: "text" },
      { key: "image", label: "Photo", type: "image", full: true },
      { key: "quote", label: "Quote", type: "textarea", full: true },
      published,
    ],
    blank: { name: "New topper", exam: "JEE Advanced", rank: "", year: String(new Date().getFullYear()), score: "", image: "", quote: "", published: true },
  },
  testimonials: {
    label: "Testimonials",
    singular: "Testimonial",
    description: "Words from students and parents.",
    icon: "MessageSquareQuote",
    titleKey: "name",
    subtitleKey: "role",
    imageKey: "image",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role (e.g. Parent of …)", type: "text" },
      { key: "rating", label: "Rating (1–5)", type: "number" },
      { key: "image", label: "Photo", type: "image", full: true },
      { key: "quote", label: "Quote", type: "textarea", full: true },
      published,
    ],
    blank: { name: "New testimonial", role: "", rating: 5, image: "", quote: "", published: true },
  },
  posts: {
    label: "Blog posts",
    singular: "Post",
    description: "Articles, strategy guides and news.",
    icon: "Newspaper",
    titleKey: "title",
    subtitleKey: "excerpt",
    imageKey: "image",
    badgeKey: "category",
    fields: [
      { key: "title", label: "Title", type: "text", full: true },
      { key: "slug", label: "URL slug", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "author", label: "Author", type: "text" },
      { key: "date", label: "Publish date", type: "date" },
      { key: "readTime", label: "Read time", type: "text" },
      { key: "image", label: "Cover image", type: "image", full: true },
      { key: "excerpt", label: "Excerpt", type: "textarea", full: true, rows: 2 },
      { key: "content", label: "Content (blank line = new paragraph)", type: "textarea", full: true, rows: 10 },
      published,
    ],
    blank: { title: "Untitled post", slug: "untitled-post", category: "News", author: "", date: new Date().toISOString().slice(0, 10), readTime: "3 min", image: "", excerpt: "", content: "", published: false },
  },
  notices: {
    label: "Notice board",
    singular: "Notice",
    description: "Short announcements shown on the notice board.",
    icon: "Megaphone",
    titleKey: "title",
    subtitleKey: "date",
    badgeKey: "tag",
    fields: [
      { key: "title", label: "Title", type: "text", full: true },
      { key: "tag", label: "Tag", type: "text" },
      { key: "date", label: "Date", type: "date" },
      { key: "href", label: "Link", type: "url", full: true },
      { key: "important", label: "Mark as important", type: "boolean", full: true },
      published,
    ],
    blank: { title: "New notice", tag: "Update", date: new Date().toISOString().slice(0, 10), href: "#", important: false, published: true },
  },
  faqs: {
    label: "FAQs",
    singular: "FAQ",
    description: "Frequently asked questions.",
    icon: "HelpCircle",
    titleKey: "question",
    subtitleKey: "answer",
    badgeKey: "category",
    fields: [
      { key: "question", label: "Question", type: "text", full: true },
      { key: "category", label: "Category", type: "text" },
      { key: "answer", label: "Answer", type: "textarea", full: true },
      published,
    ],
    blank: { question: "New question?", answer: "", category: "General", published: true },
  },
  gallery: {
    label: "Gallery",
    singular: "Photo",
    description: "Campus and event photos.",
    icon: "Images",
    titleKey: "title",
    subtitleKey: "category",
    imageKey: "image",
    fields: [
      { key: "title", label: "Caption", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "image", label: "Image", type: "image", full: true },
      published,
    ],
    blank: { title: "New photo", category: "Campus", image: "", published: true },
  },
  downloads: {
    label: "Downloads",
    singular: "Resource",
    description: "Study material, previous papers and brochures.",
    icon: "Download",
    titleKey: "title",
    subtitleKey: "category",
    badgeKey: "size",
    fields: [
      { key: "title", label: "Title", type: "text", full: true },
      { key: "category", label: "Category", type: "text" },
      { key: "size", label: "File size", type: "text" },
      { key: "fileUrl", label: "File (upload a PDF or paste a link)", type: "image", full: true },
      published,
    ],
    blank: { title: "New resource", category: "Study material", size: "", fileUrl: "", published: true },
  },
};

export const LEAD_STATUSES = [
  { id: "new", label: "New", color: "#5B5BF0" },
  { id: "contacted", label: "Contacted", color: "#0EA5E9" },
  { id: "demo", label: "Demo scheduled", color: "#F59E0B" },
  { id: "enrolled", label: "Enrolled", color: "#16A34A" },
  { id: "lost", label: "Lost", color: "#9CA3AF" },
] as const;

export const LEAD_SOURCES = [
  "Website enquiry",
  "Free demo class",
  "Scholarship test",
  "Admission popup",
  "Contact page",
  "Course page",
  "Walk-in",
  "Instagram",
  "Referral",
];
