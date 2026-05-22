'use client';

import React, { useState, useRef } from 'react';
import { Sun, Moon, Plus, Trash2, Shield, Download, Upload, Check, Settings, BookOpen, AlertCircle } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';

export default function SettingsScreen() {
  const darkMode = useWishlistStore((state) => state.darkMode);
  const toggleDarkMode = useWishlistStore((state) => state.toggleDarkMode);
  
  const categories = useWishlistStore((state) => state.categories);
  const addCategory = useWishlistStore((state) => state.addCategory);
  const deleteCategory = useWishlistStore((state) => state.deleteCategory);

  const stores = useWishlistStore((state) => state.stores);
  const addStore = useWishlistStore((state) => state.addStore);
  const deleteStore = useWishlistStore((state) => state.deleteStore);

  const wishlistItems = useWishlistStore((state) => state.wishlistItems);

  const [newCategory, setNewCategory] = useState('');
  const [newStore, setNewStore] = useState('');
  const [showStatus, setShowStatus] = useState<'success' | 'error' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category Actions
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    if (categories.includes(name)) {
      triggerStatus('error', 'Category already exists.');
      return;
    }
    addCategory(name);
    setNewCategory('');
    triggerStatus('success', `Added category "${name}"`);
  };

  // Store Actions
  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newStore.trim();
    if (!name) return;
    if (stores.includes(name)) {
      triggerStatus('error', 'Store already exists.');
      return;
    }
    addStore(name);
    setNewStore('');
    triggerStatus('success', `Added store "${name}"`);
  };

  const triggerStatus = (type: 'success' | 'error', msg: string) => {
    setShowStatus(type);
    setStatusMessage(msg);
    setTimeout(() => {
      setShowStatus(null);
      setStatusMessage('');
    }, 3000);
  };

  // Export Data to JSON
  const handleExportData = () => {
    try {
      const dataStr = localStorage.getItem('wishlist-pro-tracker-storage') || '{}';
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wishlist_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerStatus('success', 'Backup exported successfully!');
    } catch (e) {
      triggerStatus('error', 'Failed to export backup.');
    }
  };

  // Import Data from JSON
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        
        // Basic check for Zustand store layout
        if (!parsed.state || !Array.isArray(parsed.state.wishlistItems)) {
          throw new Error('Invalid format');
        }

        localStorage.setItem('wishlist-pro-tracker-storage', text);
        triggerStatus('success', 'Backup imported! Refreshing page...');
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        triggerStatus('error', 'Invalid JSON backup file structure.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col flex-1 pb-24 px-4 overflow-y-auto no-scrollbar">
      
      {/* Header title */}
      <div className="flex items-center gap-2.5 py-3 mb-5 border-b border-outline-variant/10">
        <Settings size={22} className="text-primary dark:text-primary-fixed-dim" />
        <h2 className="font-manrope text-xl font-bold text-on-surface">
          Preferences & Management
        </h2>
      </div>

      {/* Floating Success / Error toast notifications */}
      {showStatus && (
        <div className={`mb-5 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all animate-bounce ${
          showStatus === 'success' 
            ? 'bg-primary-container text-on-primary-container dark:bg-emerald-950 dark:text-emerald-300' 
            : 'bg-error-container text-on-error-container'
        }`}>
          {showStatus === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          {statusMessage}
        </div>
      )}

      {/* 1. Theme Configuration section */}
      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20 mb-5">
        <h3 className="text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold mb-3 flex items-center gap-2">
          {darkMode ? <Moon size={14} /> : <Sun size={14} />}
          Appearance Theme
        </h3>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-bold text-on-surface">Dark Mode Theme</span>
            <p className="text-[11px] text-on-surface-variant/75 mt-0.5">Toggle sleek deep dark visual layout backgrounds.</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-14 h-8 rounded-full transition-all flex items-center p-1 cursor-pointer ${
              darkMode ? 'bg-primary dark:bg-primary-container justify-end' : 'bg-surface-dim justify-start'
            }`}
            aria-label="Toggle dark mode"
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
              {darkMode ? (
                <Moon size={12} className="text-primary-container" />
              ) : (
                <Sun size={12} className="text-amber-500" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* 2. Custom Categories Management CRUD */}
      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20 mb-5">
        <h3 className="text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold mb-3 flex items-center gap-2">
          <BookOpen size={14} />
          Categories Catalog ({categories.length})
        </h3>
        
        {/* Simple inline add form */}
        <form onSubmit={handleAddCategory} className="flex gap-2 mb-3">
          <input 
            type="text" 
            placeholder="New Category..." 
            className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-full px-4 py-2 text-xs text-on-surface outline-hidden focus:border-primary/50"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button 
            type="submit"
            className="p-2 bg-primary text-white dark:bg-primary-container dark:text-white rounded-full active:scale-90 transition-transform shadow-xs"
            aria-label="Add category"
          >
            <Plus size={16} />
          </button>
        </form>

        {/* Categories list list view */}
        <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto no-scrollbar">
          {categories.map((cat) => (
            <div key={cat} className="flex justify-between items-center py-1.5 px-2 bg-surface-container-low rounded-xl">
              <span className="text-xs font-semibold text-on-surface">{cat}</span>
              <button
                onClick={() => deleteCategory(cat)}
                className="p-1 rounded-full text-on-error-container hover:bg-error-container/20 active:scale-90 transition-transform"
                aria-label={`Delete category ${cat}`}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Custom Stores Management CRUD */}
      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20 mb-5">
        <h3 className="text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold mb-3 flex items-center gap-2">
          <Settings size={14} />
          Stores & Merchants Catalog ({stores.length})
        </h3>
        
        {/* Simple inline add form */}
        <form onSubmit={handleAddStore} className="flex gap-2 mb-3">
          <input 
            type="text" 
            placeholder="New Store..." 
            className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-full px-4 py-2 text-xs text-on-surface outline-hidden focus:border-primary/50"
            value={newStore}
            onChange={(e) => setNewStore(e.target.value)}
          />
          <button 
            type="submit"
            className="p-2 bg-primary text-white dark:bg-primary-container dark:text-white rounded-full active:scale-90 transition-transform shadow-xs"
            aria-label="Add store"
          >
            <Plus size={16} />
          </button>
        </form>

        {/* Stores list list view */}
        <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto no-scrollbar">
          {stores.map((s) => (
            <div key={s} className="flex justify-between items-center py-1.5 px-2 bg-surface-container-low rounded-xl">
              <span className="text-xs font-semibold text-on-surface">{s}</span>
              <button
                onClick={() => deleteStore(s)}
                className="p-1 rounded-full text-on-error-container hover:bg-error-container/20 active:scale-90 transition-transform"
                aria-label={`Delete store ${s}`}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Local Backup Import / Export persistence operations */}
      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20 mb-6">
        <h3 className="text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold mb-3 flex items-center gap-2">
          <Shield size={14} />
          Local Data Backup
        </h3>
        <p className="text-[11px] text-on-surface-variant/75 mb-4 leading-relaxed">
          WishList Pro is completely offline-ready and local-first. Keep backups of your wishes locally as JSON objects.
        </p>

        <div className="grid grid-cols-2 gap-3">
          
          <button
            onClick={handleExportData}
            className="py-3 px-4 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-semibold flex items-center justify-center gap-1.5 text-xs active:scale-95 transition-all shadow-xs"
          >
            <Download size={14} />
            Export Backup
          </button>

          <button
            onClick={handleImportClick}
            className="py-3 px-4 rounded-full bg-primary text-white dark:bg-primary-container dark:text-white font-semibold flex items-center justify-center gap-1.5 text-xs active:scale-95 transition-all shadow-xs"
          >
            <Upload size={14} />
            Import Backup
          </button>

          {/* Hidden File Import Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportData}
            accept=".json" 
            className="hidden" 
          />

        </div>
      </div>

      {/* Tiny Footer */}
      <div className="text-center text-[10px] text-on-surface-variant/40 pt-2 pb-6">
        WishList Pro Tracker v1.0.0 • Local-First Sandbox
      </div>

    </div>
  );
}
