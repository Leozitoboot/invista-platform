export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="/" className={`flex items-center gap-2 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#006856"/>
        <path d="M8 22L16 10L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.5 22L16 14.5L20.5 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
      </svg>
      <span className="font-semibold text-xl tracking-tight" style={{ color: 'var(--text-nav)' }}>
        in<span className="font-bold">Vista</span>
      </span>
    </a>
  );
}
