import React from 'react';

export function GlassPanel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] shadow-[var(--shadow-soft)] ${className}`}>
      {children}
    </div>
  );
}
