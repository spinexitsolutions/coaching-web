type P = React.SVGProps<SVGSVGElement>;

export const Instagram = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);
export const Youtube = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="4" />
    <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
  </svg>
);
export const Facebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
  </svg>
);
export const Linkedin = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M6.9 8.8H3.8V20h3.1V8.8zM5.4 4a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM20.2 13.6c0-3-1.6-4.9-4.2-4.9-1.4 0-2.4.8-2.8 1.5V8.8h-3V20h3.1v-5.8c0-1.5.6-2.6 2-2.6s1.8 1.1 1.8 2.6V20h3.1v-6.4z" />
  </svg>
);
