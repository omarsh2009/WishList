'use client';

import React, { useState } from 'react';
import { Lightbulb, Plus, Calendar, Tag, DollarSign, ArrowRight } from 'lucide-react';
import { useWishlistStore, Idea, IdeaStatus } from '../store/useWishlistStore';

interface IdeasScreenProps {
  onSelectIdea: (idea: Idea) => void;
  onCreateIdea: () => void;
}

export default function IdeasScreen({ onSelectIdea, onCreateIdea }: IdeasScreenProps) {
  const ideas = useWishlistStore((state) => state.ideas);
  
  const [filterStatus, setFilterStatus] = useState<IdeaStatus | 'All'>('All');

  const filteredIdeas = ideas
    .filter(idea => filterStatus === 'All' || idea.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const statusColors: Record<IdeaStatus, string> = {
    'Active': 'bg-primary-container text-on-primary-container border border-primary-container/20',
    'Converted': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/20',
    'Archived': 'bg-surface-container text-on-surface-variant border border-surface-container/20',
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col flex-1 pb-20">
      
      {/* Header & New Idea Button */}
      <div className="px-4 py-2 mb-2 flex items-center justify-between">
        <h2 className="font-manrope text-lg font-bold text-on-surface flex items-center gap-2">
          <Lightbulb size={20} className="text-primary dark:text-primary-fixed-dim" />
          Planning Board
        </h2>
        <button
          onClick={onCreateIdea}
          className="p-2 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed-dim rounded-full active:scale-95 transition-transform"
          aria-label="Create new idea"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="flex bg-surface-container p-1 rounded-full border border-outline-variant/20 overflow-x-auto no-scrollbar">
          {(['All', 'Active', 'Converted', 'Archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab as any)}
              className={`flex-1 min-w-[70px] px-3 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                filterStatus === tab 
                  ? 'bg-surface-container-lowest text-primary dark:text-primary-fixed-dim shadow-xs' 
                  : 'text-on-surface-variant/70 hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Feed */}
      <div className="px-4 flex-1 flex flex-col gap-3">
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-14 px-6 bg-surface-container-low rounded-3xl border border-outline-variant/15 shadow-inner flex flex-col items-center mx-1 mt-4">
            <div className="w-14 h-14 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center mb-4">
              <Lightbulb className="text-primary dark:text-primary-fixed-dim" size={26} strokeWidth={2} />
            </div>
            <p className="font-manrope text-base font-extrabold text-on-surface">No Ideas Found</p>
            <p className="text-xs text-on-surface-variant/75 mt-1.5 max-w-[220px] leading-relaxed">
              Jot down concepts, future purchases, and wish lists here before they become actual items.
            </p>
          </div>
        ) : (
          filteredIdeas.map(idea => (
            <div 
              key={idea.id}
              onClick={() => onSelectIdea(idea)}
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 shadow-premium hover:shadow-premium-active touch-highlight flex flex-col gap-3 cursor-pointer"
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-manrope text-base font-bold text-on-surface leading-tight">
                  {idea.title}
                </h3>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${statusColors[idea.status]}`}>
                  {idea.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-on-surface-variant">
                {idea.category && (
                  <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md">
                    <Tag size={10} /> {idea.category}
                  </span>
                )}
                {idea.targetBudget !== undefined && idea.targetBudget !== null && (
                  <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md text-primary dark:text-primary-fixed-dim">
                    <DollarSign size={10} /> Budget: ${idea.targetBudget.toFixed(2)}
                  </span>
                )}
                <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md opacity-70">
                  <Calendar size={10} /> {formatDate(idea.createdAt)}
                </span>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
