'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, CheckCircle2, Circle, Heart, Info, DollarSign } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '../store/useWishlistStore';

interface HomeScreenProps {
  onSelectItem: (item: WishlistItem) => void;
}

export default function HomeScreen({ onSelectItem }: HomeScreenProps) {
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const categories = useWishlistStore((state) => state.categories);
  const toggleBought = useWishlistStore((state) => state.toggleBought);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterBought, setFilterBought] = useState<'All' | 'Wanted' | 'Bought'>('All');
  const [sortBy, setSortBy] = useState<'Newest' | 'PriceLowHigh' | 'PriceHighLow'>('Newest');

  // Filter items
  const filteredItems = wishlistItems
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      
      const matchesBought = filterBought === 'All' ||
                            (filterBought === 'Wanted' && !item.bought) ||
                            (filterBought === 'Bought' && item.bought);

      return matchesSearch && matchesCategory && matchesBought;
    })
    .sort((a, b) => {
      if (sortBy === 'PriceLowHigh') return a.price - b.price;
      if (sortBy === 'PriceHighLow') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Math totals for dashboard
  const totalValue = wishlistItems.reduce((acc, item) => acc + item.price, 0);
  const boughtValue = wishlistItems.filter(item => item.bought).reduce((acc, item) => acc + item.price, 0);
  const wantedValue = totalValue - boughtValue;

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
    <div className="flex flex-col flex-1 pb-20">
      
      {/* Premium Dashboard Metrics Summary */}
      <div className="bg-gradient-to-br from-primary-container to-primary text-white p-5 rounded-2xl shadow-premium mb-6 border border-white/5 mx-4 mt-2">
        <h2 className="font-manrope text-sm font-semibold tracking-wider text-on-primary-container/80 uppercase">
          Wishlist Summary
        </h2>
        <div className="flex justify-between items-baseline mt-2 mb-4">
          <span className="font-manrope text-3xl font-extrabold tracking-tight">
            ${wantedValue.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-primary-fixed/80">
            Wanted Value
          </span>
        </div>
        
        {/* Simple elegant layout visual ratio indicator */}
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden flex">
          <div 
            className="bg-secondary-container h-full transition-all duration-500" 
            style={{ width: `${totalValue > 0 ? (boughtValue / totalValue) * 100 : 0}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs mt-2 text-white/70">
          <span>{wishlistItems.filter(i => i.bought).length} Bought (${boughtValue.toFixed(0)})</span>
          <span>{wishlistItems.filter(i => !i.bought).length} Wanted (${wantedValue.toFixed(0)})</span>
        </div>
      </div>

      {/* Persistent Sticky Search & Sort Controls */}
      <div className="px-4 mb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-2.5 border border-outline-variant/30 focus-within:border-primary/50 transition-colors">
          <Search size={18} className="text-on-surface-variant/75" />
          <input 
            type="text" 
            placeholder="Search wishlist items, brands..." 
            className="bg-transparent border-0 outline-hidden w-full text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter and Sort Toggles */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Bought / Wanted tab state selector */}
          <div className="flex bg-surface-container p-1 rounded-full border border-outline-variant/20">
            {(['All', 'Wanted', 'Bought'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterBought(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  filterBought === tab 
                    ? 'bg-surface-container-lowest text-primary dark:text-primary-fixed-dim shadow-xs' 
                    : 'text-on-surface-variant/70 hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Selection dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/20 text-xs">
            <SlidersHorizontal size={12} className="text-on-surface-variant" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none outline-hidden font-medium text-on-surface-variant focus:ring-0 cursor-pointer"
            >
              <option value="Newest">Newest</option>
              <option value="PriceLowHigh">Price: Low to High</option>
              <option value="PriceHighLow">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Horizontal categories touch sliding filter */}
      <div className="mb-5 overflow-x-auto no-scrollbar flex gap-2 px-4 py-1">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all whitespace-nowrap active:scale-95 ${
            selectedCategory === 'All'
              ? 'bg-primary text-white border-primary dark:bg-primary-container'
              : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-outline-variant'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all whitespace-nowrap active:scale-95 ${
              selectedCategory === cat
                ? 'bg-primary text-white border-primary dark:bg-primary-container'
                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-outline-variant'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Wish list grid layout */}
      <div className="px-4 flex-1">
        {filteredItems.length === 0 ? (
          <div className="text-center py-14 px-6 bg-surface-container-low rounded-3xl border border-outline-variant/15 shadow-inner flex flex-col items-center mx-1">
            <div className="w-14 h-14 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="text-primary dark:text-primary-fixed-dim" size={26} strokeWidth={2} />
            </div>
            <p className="font-manrope text-base font-extrabold text-on-surface">Your Wishlist is Empty</p>
            <p className="text-xs text-on-surface-variant/75 mt-1.5 max-w-[220px] leading-relaxed">
              Track all your favorite items, rarities, and stores in one clean offline-first place.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSelectItem(item)}
                className={`relative bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-active touch-highlight flex flex-col h-full group cursor-pointer ${
                  item.bought ? 'opacity-65' : ''
                }`}
              >
                
                {/* Product Photo Thumbnail */}
                <div className="relative w-full aspect-square bg-surface-container overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.photo || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80'} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Item Availability Badge */}
                  <span className={`absolute top-2 left-2 text-[9px] font-semibold px-2 py-0.5 rounded-full ${availabilityColors[item.availability]}`}>
                    {item.availability}
                  </span>

                  {/* Immediate Mark as Bought checkbox tap target */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBought(item.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/45 backdrop-blur-xs text-white active:scale-90 transition-transform"
                    aria-label={item.bought ? 'Mark as wanted' : 'Mark as bought'}
                  >
                    {item.bought ? (
                      <CheckCircle2 size={16} className="text-secondary-container" />
                    ) : (
                      <Circle size={16} className="text-white/80" />
                    )}
                  </button>
                </div>

                {/* Info Text Area */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant/70 font-bold uppercase tracking-wider block mb-0.5">
                      {item.store}
                    </span>
                    <h3 className="font-manrope text-sm font-bold text-on-surface leading-tight line-clamp-2">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant/10">
                    <span className="text-sm font-extrabold text-primary dark:text-primary-fixed-dim">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-medium">
                      {item.category}
                    </span>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
