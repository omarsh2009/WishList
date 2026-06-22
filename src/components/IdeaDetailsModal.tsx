'use client';

import React from 'react';
import { X, Trash2, Tag, DollarSign, Calendar, RefreshCcw, ExternalLink, ArrowRight } from 'lucide-react';
import { Idea, useWishlistStore } from '../store/useWishlistStore';
import ConfirmModal from './ui/ConfirmModal';

interface IdeaDetailsModalProps {
  idea: Idea | null;
  onClose: () => void;
  onEdit: (idea: Idea) => void;
  onViewWishlistItem?: (id: string) => void;
}

export default function IdeaDetailsModal({ idea, onClose, onEdit, onViewWishlistItem }: IdeaDetailsModalProps) {
  const deleteIdea = useWishlistStore((state) => state.deleteIdea);
  const convertToWishlistItem = useWishlistStore((state) => state.convertToWishlistItem);

  const [confirmAction, setConfirmAction] = React.useState<'convert' | 'delete' | null>(null);

  if (!idea) return null;

  const executeDelete = () => {
    deleteIdea(idea.id);
    setConfirmAction(null);
    onClose();
  };

  const executeConvert = () => {
    convertToWishlistItem(idea.id);
    setConfirmAction(null);
    onClose();
  };

  const statusColors: Record<string, string> = {
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-t-3xl shadow-2xl border-t border-outline-variant/30 flex flex-col max-h-[92vh] overflow-hidden animate-slide-up">
        
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full" />
        </div>

        <div className="overflow-y-auto px-5 pb-8 flex-1 no-scrollbar">
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface focus:outline-hidden"
          >
            <X size={20} />
          </button>

          <div className="mb-4 mt-2 pr-10">
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider mb-2 ${statusColors[idea.status]}`}>
              {idea.status}
            </span>
            <h2 className="font-manrope text-2xl font-bold tracking-tight text-on-surface leading-tight">
              {idea.title}
            </h2>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {idea.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full">
                  <Tag size={12} />
                  {idea.category}
                </span>
              )}
              {idea.targetBudget !== undefined && idea.targetBudget !== null && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container text-primary dark:text-primary-fixed-dim text-xs font-bold rounded-full">
                  <DollarSign size={12} />
                  Budget: ${idea.targetBudget.toFixed(2)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full">
                <Calendar size={12} />
                Created: {formatDate(idea.createdAt)}
              </span>
              {idea.convertedDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/20 text-xs font-medium rounded-full">
                  <RefreshCcw size={12} />
                  Converted: {formatDate(idea.convertedDate)}
                </span>
              )}
            </div>
          </div>

          <hr className="border-outline-variant/30 my-4" />

          <div className="mb-5">
            <h3 className="text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold mb-2">
              Description
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {idea.description || 'No description provided.'}
            </p>
          </div>

          {idea.notes && (
            <div className="mb-6 p-3 bg-secondary-container/10 border border-secondary-container/20 rounded-xl">
              <h3 className="text-xs uppercase tracking-wider text-on-secondary-container font-bold mb-1">
                Notes
              </h3>
              <p className="text-sm text-on-surface font-medium italic">
                "{idea.notes}"
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-4">
            
            {idea.status === 'Active' && (
              <button
                onClick={() => setConfirmAction('convert')}
                className="w-full py-3.5 px-4 rounded-full bg-primary text-white dark:bg-primary-container font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 hover:brightness-110"
              >
                <ArrowRight size={18} strokeWidth={2.5} />
                Move To Wishlist
              </button>
            )}

            {idea.status === 'Converted' && idea.wishlistItemId && onViewWishlistItem && (
              <button
                onClick={() => onViewWishlistItem(idea.wishlistItemId!)}
                className="w-full py-3.5 px-4 rounded-full bg-emerald-600 text-white dark:bg-emerald-700 font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 hover:brightness-110"
              >
                <ExternalLink size={18} strokeWidth={2.5} />
                Open Wishlist Item
              </button>
            )}

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => onEdit(idea)}
                className="py-3 px-4 rounded-full bg-surface-container-high text-on-surface font-semibold transition-all flex items-center justify-center gap-2 text-sm active:scale-95 shadow-xs border border-outline-variant/30"
              >
                Edit Idea
              </button>

              <button
                onClick={() => setConfirmAction('delete')}
                className="py-3 px-4 rounded-full bg-error-container text-on-error-container font-semibold transition-all flex items-center justify-center gap-2 text-sm active:scale-95 shadow-xs"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>

          </div>

        </div>
      </div>

      <ConfirmModal
        isOpen={confirmAction === 'convert'}
        title="Move to Wishlist"
        message="Are you sure you want to move this Idea to your Wishlist? It will be marked as 'Converted'."
        confirmText="Move"
        onConfirm={executeConvert}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmModal
        isOpen={confirmAction === 'delete'}
        title="Delete Idea"
        message="Are you sure you want to delete this idea? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}


