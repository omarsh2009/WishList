'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, Tag, ShoppingBag, Calendar, Undo2 } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '../store/useWishlistStore';
import ConfirmModal from './ui/ConfirmModal';
import EmptyState from './ui/EmptyState';

interface PurchasedScreenProps {
  onSelectItem: (item: WishlistItem) => void;
  onBack: () => void;
}

export default function PurchasedScreen({ onSelectItem, onBack }: PurchasedScreenProps) {
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const restoreToWishlist = useWishlistStore((state) => state.restoreToWishlist);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'Newest' | 'PriceLowHigh' | 'PriceHighLow'>('Newest');
  const [itemToRestore, setItemToRestore] = useState<string | null>(null);

  // Filter only purchased items
  const purchasedItems = wishlistItems.filter((item) => item.isPurchased);

  // Filter based on search query
  const filteredItems = purchasedItems
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'PriceLowHigh') {
        const aPrice = (a.purchaseInfo?.price ?? a.price ?? 0) * (a.quantity || 1);
        const bPrice = (b.purchaseInfo?.price ?? b.price ?? 0) * (b.quantity || 1);
        return aPrice - bPrice;
      }
      if (sortBy === 'PriceHighLow') {
        const aPrice = (a.purchaseInfo?.price ?? a.price ?? 0) * (a.quantity || 1);
        const bPrice = (b.purchaseInfo?.price ?? b.price ?? 0) * (b.quantity || 1);
        return bPrice - aPrice;
      }
      
      // Default: Newest (by purchase date)
      const aDate = a.purchaseInfo?.date ? new Date(a.purchaseInfo.date).getTime() : 0;
      const bDate = b.purchaseInfo?.date ? new Date(b.purchaseInfo.date).getTime() : 0;
      return bDate - aDate;
    });

  // Calculate statistics
  const totalItems = purchasedItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalValue = purchasedItems.reduce((acc, item) => {
    const price = item.purchaseInfo?.price ?? item.price;
    return acc + ((price || 0) * (item.quantity || 1));
  }, 0);

  return (
    <div className="flex flex-col flex-1 pb-20 px-4">
      
      {/* Header bar */}
      <div className="flex items-center gap-3 py-3 mb-4 border-b border-outline-variant/10">
        <button 
          type="button" 
          onClick={onBack}
          className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container active:scale-90 transition-transform cursor-pointer"
          aria-label="Back to home screen"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-manrope text-xl font-bold text-on-surface">
          Purchased Items
        </h2>
      </div>

      {/* Premium Stats Summary Card */}
      <div className="bg-gradient-to-br from-tertiary-container to-tertiary text-white p-5 rounded-2xl shadow-premium mb-6 border border-white/5">
        <h2 className="font-manrope text-sm font-semibold tracking-wider text-on-tertiary-container uppercase">
          Purchased Summary
        </h2>
        <div className="flex justify-between items-baseline mt-2 mb-4">
          <span className="font-manrope text-3xl font-extrabold tracking-tight">
            ${totalValue.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-on-tertiary-container">
            Total Value
          </span>
        </div>
        
        <div className="flex justify-between text-xs mt-2 text-white/70">
          <span>{totalItems} Items Purchased</span>
        </div>
      </div>

      {/* Sticky Search & Sort Controls */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-2.5 border border-outline-variant/30 focus-within:border-primary/50 transition-colors">
          <Search size={18} className="text-on-surface-variant/75" />
          <input 
            type="text" 
            placeholder="Search purchased items, brands..." 
            className="bg-transparent border-0 outline-hidden w-full text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Sort Toggles */}
        <div className="flex items-center justify-end gap-2">
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

      {/* Purchased list */}
      <div className="flex-1">
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No Purchased Items"
            description="Items you mark as purchased will appear here with their purchase details."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredItems.map((item) => {
              const displayPrice = item.purchaseInfo?.price ?? item.price;
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => onSelectItem(item)}
                  className="relative bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-active touch-highlight flex gap-4 p-3 group cursor-pointer"
                >
                  {/* Photo Thumbnail */}
                  <div className="relative w-20 h-20 bg-surface-container rounded-xl overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.photo || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80'} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info Area */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-manrope text-sm font-bold text-on-surface leading-tight truncate flex-1">
                          {item.name}
                        </h3>
                        <div className="flex items-baseline gap-1 shrink-0">
                          <span className="text-sm font-extrabold text-primary dark:text-primary-fixed-dim whitespace-nowrap">
                            {displayPrice !== null ? `$${(displayPrice * (item.quantity || 1)).toFixed(2)}` : 'N/A'}
                          </span>
                          {(item.quantity || 1) > 1 && (
                            <span className="text-[10px] text-on-surface-variant font-bold">x{item.quantity}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Store & Category Tag Pill Area */}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container text-on-surface-variant text-[9px] font-semibold rounded-full">
                          <Tag size={8} />
                          {item.category}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container text-on-surface-variant text-[9px] font-semibold rounded-full">
                          <ShoppingBag size={8} />
                          {item.store}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-outline-variant/10">
                      {item.purchaseInfo?.date ? (
                        <span className="text-[10px] text-on-surface-variant/75 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(item.purchaseInfo.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      ) : (
                        <span className="text-[10px] text-on-surface-variant/70">No date</span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToRestore(item.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary-container hover:bg-secondary-container/80 text-on-secondary-container text-[10px] font-bold rounded-full transition-colors cursor-pointer"
                        aria-label="Restore item to wishlist"
                      >
                        <Undo2 size={10} />
                        Restore
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={itemToRestore !== null}
        title="Restore to Wishlist"
        message="Are you sure you want to move this item back to your active wishlist?"
        confirmText="Restore"
        onConfirm={() => {
          if (itemToRestore) restoreToWishlist(itemToRestore);
          setItemToRestore(null);
        }}
        onCancel={() => setItemToRestore(null)}
      />
    </div>
  );
}
