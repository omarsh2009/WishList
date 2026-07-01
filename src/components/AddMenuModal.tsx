'use client';

import React from 'react';
import { Package, FolderGit2, X } from 'lucide-react';

interface AddMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSingleItem: () => void;
  onSelectProject: () => void;
}

export default function AddMenuModal({ isOpen, onClose, onSelectSingleItem, onSelectProject }: AddMenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-t-3xl shadow-2xl border-t border-outline-variant/30 flex flex-col overflow-hidden animate-slide-up pb-8">
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full" />
        </div>
        <div className="px-5">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface focus:outline-none"
          >
            <X size={20} />
          </button>
          
          <h2 className="font-manrope text-xl font-bold tracking-tight text-on-surface mb-6 mt-2">
            What would you like to add?
          </h2>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onSelectSingleItem();
                onClose();
              }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 shadow-sm active:scale-95 transition-all text-left"
            >
              <div className="p-3 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed-dim rounded-xl">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-base">Single Item</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Add a specific wish or product</p>
              </div>
            </button>
            
            <button
              onClick={() => {
                onSelectProject();
                onClose();
              }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 shadow-sm active:scale-95 transition-all text-left"
            >
              <div className="p-3 bg-secondary/10 text-secondary dark:bg-secondary-container/20 dark:text-secondary-container rounded-xl">
                <FolderGit2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-base">Project</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Group related wishes together</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
