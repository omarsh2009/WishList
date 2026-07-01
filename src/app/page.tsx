import React from 'react';
import MobileShell from '@/components/MobileShell';

export default function Home() {
  return (
    <div className="h-full bg-slate-100 dark:bg-zinc-950 flex flex-col md:py-6 sm:py-2">
      <MobileShell />
    </div>
  );
}
