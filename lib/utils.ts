export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

export const fmtDate = (d: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) => {
  if (!d) return "";
  const date = new Date(d.length === 10 ? d + "T00:00:00" : d);
  return isNaN(date.getTime()) ? d : date.toLocaleDateString("en-IN", opts);
};

export const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n);
