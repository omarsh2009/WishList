'use client';

import React, { useState } from 'react';
import { Eye, ExternalLink, Check, ChevronLeft, ChevronRight, ShoppingBag, Tag, Heart } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '../store/useWishlistStore';

interface QuickLookScreenProps {
  onSelectItem: (item: WishlistItem) => void;
}

export default function QuickLookScreen({ onSelectItem }: QuickLookScreenProps) {
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const toggleBought = useWishlistStore((state) => state.toggleBought);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter out bought items or just show all active items
  const activeItems = wishlistItems.filter(item => !item.bought);

  const handleNext = () => {
    if (currentIndex < activeItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(activeItems.length - 1); // Loop to end
    }
  };

  if (activeItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 pb-24 text-center">
        <div className="p-4 rounded-full bg-surface-container mb-4 text-on-surface-variant">
          <Eye size={36} strokeWidth={1.5} />
        </div>
        <h3 className="font-manrope text-lg font-bold text-on-surface">No active wishlist items</h3>
        <p className="text-xs text-on-surface-variant/75 mt-1 max-w-[240px] mx-auto">
          Add items to your wishlist that are not marked as bought yet to inspect them in Quick Look.
        </p>
      </div>
    );
  }

  const item = activeItems[currentIndex];

  const availabilityColors: Record<string, string> = {
    'High': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/20',
    'High-Medium': 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200/20',
    'Medium': 'bg-secondary-container text-on-secondary-container border border-secondary-container/20',
    'Medium-Low': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/20',
    'Low': 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200/20',
    'Rare': 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 border border-fuchsia-200/20',
    'Discontinued': 'bg-error-container text-on-error-container border border-error-container/20',
  };

  return (
    <div className="flex flex-col flex-1 pb-24 justify-between">
      
      {/* Top Banner Indicator */}
      <div className="px-4 py-2 text-center">
        <span className="text-[10px] bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          Quick Look • {currentIndex + 1} of {activeItems.length}
        </span>
      </div>

      {/* Main Preview Deck Frame */}
      <div className="flex-1 flex flex-col justify-center px-4 max-w-sm mx-auto w-full my-4">
        
        {/* Card Body */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl overflow-hidden shadow-premium flex flex-col h-full max-h-[50vh] justify-between relative group">
          
          {/* Cover Photo */}
          <div className="relative w-full aspect-square bg-surface-container overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={item.photo || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80'} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
            
            {/* Badges */}
            <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full shadow-md ${availabilityColors[item.availability]}`}>
              {item.availability}
            </span>
          </div>

          {/* Details Bar */}
          <div className="p-4 flex flex-col justify-between flex-1">
            
            <div>
              <div className="flex justify-between items-start gap-3">
                <h3 className="font-manrope text-base font-bold text-on-surface line-clamp-1">
                  {item.name}
                </h3>
                <span className="font-manrope text-base font-extrabold text-primary dark:text-primary-fixed-dim whitespace-nowrap">
                  {item.price !== null ? `$${item.price.toFixed(2)}` : 'N/A'}
                </span>
              </div>
              
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-semibold rounded-full">
                  <Tag size={10} />
                  {item.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-semibold rounded-full">
                  <ShoppingBag size={10} />
                  {item.store}
                </span>
              </div>
            </div>

            {/* Quick Actions inside Card */}
            <div className="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
              
              <button
                onClick={() => onSelectItem(item)}
                className="text-xs text-primary dark:text-primary-fixed-dim underline font-bold active:opacity-75 flex items-center gap-1"
              >
                View Full Details
              </button>

              <button
                onClick={() => toggleBought(item.id)}
                className="px-3.5 py-1.5 bg-primary text-white dark:bg-primary-container dark:text-white rounded-full text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all shadow-xs"
              >
                <Check size={12} strokeWidth={2.5} />
                Bought
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Touch Carousel Navigation Controls */}
      <div className="px-6 flex justify-between items-center max-w-sm mx-auto w-full gap-4">
        
        <button
          onClick={handlePrev}
          className="p-4 rounded-full bg-surface-container border border-outline-variant/20 text-on-surface hover:bg-surface-container-high active:scale-90 transition-transform shadow-xs"
          aria-label="Previous wishlist item"
        >
          <ChevronLeft size={20} />
        </button>

        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-full bg-secondary-container text-on-secondary-container font-semibold transition-all flex items-center justify-center gap-2 text-sm active:scale-95 shadow-xs"
          >
            <ExternalLink size={16} />
            Go to Shop
          </a>
        ) : (
          <div className="flex-1 py-3 px-4 rounded-full bg-surface-container/50 text-on-surface-variant/40 font-semibold flex items-center justify-center gap-2 text-sm cursor-not-allowed">
            No link available
          </div>
        )}

        <button
          onClick={handleNext}
          className="p-4 rounded-full bg-surface-container border border-outline-variant/20 text-on-surface hover:bg-surface-container-high active:scale-90 transition-transform shadow-xs"
          aria-label="Next wishlist item"
        >
          <ChevronRight size={20} />
        </button>

      </div>

    </div>
  );
}
