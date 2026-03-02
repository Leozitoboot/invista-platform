import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  onChangeValue?: (value: string) => void;
  mask?: (value: string) => string;
}

export default function Input({ label, error, onChangeValue, mask, onChange, className = '', ...props }: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (mask) {
      val = mask(val);
      e.target.value = val;
    }
    onChangeValue?.(val);
    onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>{label}</label>}
      <input
        onChange={handleChange}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary-600 focus:border-primary-600 ${
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
        } ${className}`}
        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
