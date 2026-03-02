import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', glass = false, hover = false, hoverable = false, onClick }: CardProps) {
  const base = 'rounded-2xl border transition-all duration-200';
  const solid = 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-[var(--shadow-soft)]';
  const glassStyle = 'bg-[var(--glass-bg)] backdrop-blur-md border-[var(--glass-border)] shadow-[var(--shadow-soft)]';
  const hoverStyle = (hover || hoverable) ? 'hover:scale-[1.02] hover:shadow-lg cursor-pointer' : '';

  return (
    <div
      className={`${base} ${glass ? glassStyle : solid} ${hoverStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
