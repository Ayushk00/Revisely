// Revisely mark: a page with a check, on a brand gradient tile
export default function Logo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="revisely-logo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7257fb" />
          <stop offset="1" stopColor="#4229ac" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#revisely-logo)" />
      <path d="M10 8.5h8.5l3.5 3.5v11.5H10z" fill="white" fillOpacity="0.95" />
      <path d="M18.5 8.5V12H22" fill="none" stroke="#b6aeff" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="m12.8 17.2 2.4 2.4 4.3-4.6" fill="none" stroke="#5f3ff0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
