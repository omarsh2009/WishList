import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-14 px-6 bg-surface-container-low rounded-3xl border border-outline-variant/15 shadow-inner flex flex-col items-center ${className}`}>
      <div className="w-14 h-14 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="text-primary dark:text-primary-fixed-dim" size={26} strokeWidth={2} />
      </div>
      <p className="font-manrope text-base font-extrabold text-on-surface">{title}</p>
      <p className="text-xs text-on-surface-variant/75 mt-1.5 max-w-[220px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
