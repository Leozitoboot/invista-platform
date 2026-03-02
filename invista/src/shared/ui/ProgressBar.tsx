interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export default function ProgressBar({ value, className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
