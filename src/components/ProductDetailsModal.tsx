'use client';

import React from 'react';
import { X, ExternalLink, Check, Trash2, Tag, ShoppingBag, Eye, Heart } from 'lucide-react';
import { WishlistItem, useWishlistStore } from '../store/useWishlistStore';

import ConfirmModal from './ui/ConfirmModal';

interface ProductDetailsModalProps {
  item: WishlistItem | null;
  onClose: () => void;
  onEdit: (item: WishlistItem) => void;
}

export default function ProductDetailsModal({ item, onClose, onEdit }: ProductDetailsModalProps) {
  const deleteItem = useWishlistStore((state) => state.deleteItem);
  const markAsPurchased = useWishlistStore((state) => state.markAsPurchased);
  const restoreToWishlist = useWishlistStore((state) => state.restoreToWishlist);

  const [confirmAction, setConfirmAction] = React.useState<'restore' | 'delete' | null>(null);

  if (!item) return null;

  const handleMarkAsPurchased = () => {
    markAsPurchased(item.id);
    onClose();
  };

  const executeRestore = () => {
    restoreToWishlist(item.id);
    setConfirmAction(null);
    onClose();
  };

  const executeDelete = () => {
    deleteItem(item.id);
    setConfirmAction(null);
    onClose();
  };

  // Determine availability styling
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      {/* Tap background to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Drawer Sheet */}
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-t-3xl shadow-2xl border-t border-outline-variant/30 flex flex-col max-h-[92vh] overflow-hidden animate-slide-up">
        
        {/* Visual Swipe Handle Bar */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full" />
        </div>

        {/* Modal Content Scroll Area */}
        <div className="overflow-y-auto px-5 pb-8 flex-1 no-scrollbar">
          
          {/* Close button in corner */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface focus:outline-hidden"
          >
            <X size={20} />
          </button>

          {/* Photo Frame */}
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-surface-container shadow-premium mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={item.photo || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
            
            {/* Availability Badge */}
            <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md ${availabilityColors[item.availability]}`}>
              {item.availability}
            </span>

            {/* Bought Stamp */}
            {item.isPurchased && (
              <div className="absolute inset-0 bg-primary/75 backdrop-blur-xs flex items-center justify-center">
                <div className="border-4 border-white text-white px-6 py-2 rounded-xl text-xl font-bold uppercase tracking-wider transform -rotate-12 flex items-center gap-2">
                  <Check size={24} strokeWidth={3} />
                  Purchased
                </div>
              </div>
            )}
          </div>

          {/* Header Metadata */}
          <div className="mb-4">
            <div className="flex justify-between items-start gap-4 mb-1">
              <h2 className="font-manrope text-2xl font-bold tracking-tight text-on-surface">
                {item.name}
              </h2>
              <div className="flex flex-col items-end">
                <span className="font-manrope text-2xl font-extrabold text-primary dark:text-primary-fixed-dim whitespace-nowrap">
                  {item.price !== null ? `$${(item.price * (item.quantity || 1)).toFixed(2)}` : 'N/A'}
                </span>
                {(item.quantity || 1) > 1 && item.price !== null && (
                  <span className="text-xs text-on-surface-variant font-medium">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                )}
                {(item.quantity || 1) > 1 && item.price === null && (
                  <span className="text-xs text-on-surface-variant font-medium">
                    Qty: {item.quantity}
                  </span>
                )}
              </div>
            </div>
            
            {/* Store & Category Tag Pill Area */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full">
                <Tag size={12} />
                {item.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full">
                <ShoppingBag size={12} />
                {item.store}
              </span>
            </div>
          </div>

          <hr className="border-outline-variant/30 my-4" />

          {/* Notes (if available) */}
          {item.notes && (
            <div className="mb-6 p-3 bg-secondary-container/10 border border-secondary-container/20 rounded-xl">
              <h3 className="text-xs uppercase tracking-wider text-on-secondary-container font-bold mb-1 flex items-center gap-1.5">
                <Heart size={12} className="fill-current" />
                Notes
              </h3>
              <p className="text-sm text-on-surface font-medium italic whitespace-pre-wrap">
                {item.notes}
              </p>
            </div>
          )}

          {/* Purchase Details if available */}
          {item.isPurchased && item.purchaseInfo && (
            <div className="mb-5 p-3.5 bg-primary/5 dark:bg-primary/10 border border-primary/15 rounded-xl text-xs">
              <span className="font-bold text-on-surface uppercase tracking-wider block mb-1.5">
                Purchase Details
              </span>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">Purchase Date:</span>
                <span className="font-semibold text-on-surface">
                  {new Date(item.purchaseInfo.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {item.purchaseInfo.price !== null && (
                <div className="flex justify-between items-center py-1 border-t border-outline-variant/10 mt-1">
                  <span className="text-on-surface-variant">Purchase Price:</span>
                  <span className="font-semibold text-on-surface">
                    ${item.purchaseInfo.price.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col gap-3 mt-4">
            
            {/* Primary bought switch toggle */}
            {item.isPurchased ? (
              <button
                onClick={() => setConfirmAction('restore')}
                className="w-full py-3.5 px-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 bg-surface-container-high text-on-surface border border-outline-variant cursor-pointer"
              >
                <Check size={18} strokeWidth={2.5} />
                Restore to Wishlist
              </button>
            ) : (
              <button
                onClick={handleMarkAsPurchased}
                className="w-full py-3.5 px-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 bg-primary text-white dark:bg-primary-container dark:text-white hover:brightness-110 cursor-pointer"
              >
                <Check size={18} strokeWidth={2.5} />
                Mark as Purchased
              </button>
            )}

            <div className="grid grid-cols-3 gap-3">
              {/* Optional Store External Link */}
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 py-3 px-4 rounded-full bg-secondary-container text-on-secondary-container font-semibold transition-all flex items-center justify-center gap-2 text-sm active:scale-95 text-center shadow-xs"
                >
                  <ExternalLink size={16} />
                  Visit Store
                </a>
              ) : (
                <div className="col-span-2 py-3 px-4 rounded-full bg-surface-container/40 text-on-surface-variant/40 font-semibold flex items-center justify-center gap-2 text-sm cursor-not-allowed">
                  No Link
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => setConfirmAction('delete')}
                className="py-3 px-4 rounded-full bg-error-container text-on-error-container font-semibold transition-all flex items-center justify-center gap-2 text-sm active:scale-95 shadow-xs"
                aria-label="Delete wishlist item"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>

            {/* Quick edit fields button */}
            <button
              onClick={() => onEdit(item)}
              className="mt-2 text-center text-xs text-primary dark:text-primary-fixed-dim underline font-medium py-1 active:opacity-75"
            >
              Edit Item Details
            </button>

          </div>

        </div>
      </div>

      <ConfirmModal
        isOpen={confirmAction === 'restore'}
        title="Restore to Wishlist"
        message="Are you sure you want to move this item back to your active wishlist?"
        confirmText="Restore"
        onConfirm={executeRestore}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmModal
        isOpen={confirmAction === 'delete'}
        title="Delete Item"
        message="Are you sure you want to delete this wish list item? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
