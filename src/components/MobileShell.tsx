'use client';

import React, { useState, useEffect } from 'react';
import { Home, Eye, PlusCircle, Settings, Gift } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '../store/useWishlistStore';
import HomeScreen from './HomeScreen';
import AddItemScreen from './AddItemScreen';
import QuickLookScreen from './QuickLookScreen';
import SettingsScreen from './SettingsScreen';
import ProductDetailsModal from './ProductDetailsModal';

export default function MobileShell() {
  const [activeTab, setActiveTab] = useState<'home' | 'add' | 'quicklook' | 'settings'>('home');
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<WishlistItem | null>(null);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const darkMode = useWishlistStore((state) => state.darkMode);

  // Avoid hydration mismatch issues with Zustand persist middleware
  useEffect(() => {
    setHasMounted(true);
    // Standard initialization of root dark mode class on mount
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!hasMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface-background text-on-surface">
        <Gift className="text-primary dark:text-primary-fixed-dim animate-bounce mb-3" size={36} />
        <span className="font-manrope text-sm font-bold tracking-wide">Loading WishList Pro...</span>
      </div>
    );
  }

  // Handle item selected from listing
  const handleSelectItem = (item: WishlistItem) => {
    setSelectedItemForDetails(item);
  };

  // Handle triggered item details edit
  const handleEditItem = (item: WishlistItem) => {
    setSelectedItemForDetails(null);
    setEditingItem(item);
    setActiveTab('add');
  };

  // Close item details bottom sheet modal
  const handleCloseDetails = () => {
    setSelectedItemForDetails(null);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingItem(null);
    setActiveTab('home');
  };

  // Successful item save trigger
  const handleItemSaved = () => {
    setEditingItem(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto w-full bg-surface-background shadow-premium border-x border-outline-variant/20 relative overflow-hidden">
      
      {/* 1. App Top Header Banner */}
      <header className="sticky top-0 z-40 bg-surface-background/80 backdrop-blur-md border-b border-outline-variant/15 px-4 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Gift className="text-primary dark:text-primary-fixed-dim" size={20} strokeWidth={2.5} />
          <h1 className="font-manrope text-lg font-extrabold tracking-tight text-on-surface">
            WishList <span className="text-primary dark:text-primary-fixed-dim font-black">Pro</span>
          </h1>
        </div>
        <div className="flex items-center">
          <span className="text-[10px] font-bold px-2.5 py-0.5 bg-surface-container rounded-full text-on-surface-variant">
            {wishlistItems.length} Wishes
          </span>
        </div>
      </header>

      {/* 2. Main Content Screen Container Scrollport */}
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar pt-2 bg-surface-background relative">
        {activeTab === 'home' && (
          <HomeScreen onSelectItem={handleSelectItem} />
        )}
        
        {activeTab === 'add' && (
          <AddItemScreen 
            editItem={editingItem} 
            onSaved={handleItemSaved} 
            onCancel={editingItem ? handleCancelEdit : undefined} 
          />
        )}
        
        {activeTab === 'quicklook' && (
          <QuickLookScreen onSelectItem={handleSelectItem} />
        )}
        
        {activeTab === 'settings' && (
          <SettingsScreen />
        )}
      </main>

      {/* 3. Sticky Bottom App Navigation Bar */}
      <nav className="sticky bottom-0 z-40 bg-surface-background/95 backdrop-blur-md border-t border-outline-variant/20 flex justify-around items-center py-2.5 px-3 pb-safe shadow-2xl">
        
        {/* Navigation Button Home */}
        <button
          onClick={() => {
            setEditingItem(null);
            setActiveTab('home');
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl active:scale-90 transition-all ${
            activeTab === 'home' 
              ? 'text-primary dark:text-primary-fixed-dim font-bold' 
              : 'text-on-surface-variant/60'
          }`}
          aria-label="Wishlist feed"
        >
          <Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px]">Wishes</span>
        </button>

        {/* Navigation Button Quick Look */}
        <button
          onClick={() => {
            setEditingItem(null);
            setActiveTab('quicklook');
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl active:scale-90 transition-all ${
            activeTab === 'quicklook' 
              ? 'text-primary dark:text-primary-fixed-dim font-bold' 
              : 'text-on-surface-variant/60'
          }`}
          aria-label="Quick look carousel"
        >
          <Eye size={20} strokeWidth={activeTab === 'quicklook' ? 2.5 : 2} />
          <span className="text-[10px]">Quick Look</span>
        </button>

        {/* Navigation Button Add Item */}
        <button
          onClick={() => {
            setEditingItem(null);
            setActiveTab('add');
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl active:scale-90 transition-all ${
            activeTab === 'add' 
              ? 'text-primary dark:text-primary-fixed-dim font-bold' 
              : 'text-on-surface-variant/60'
          }`}
          aria-label="Add a wish item"
        >
          <PlusCircle size={20} strokeWidth={activeTab === 'add' ? 2.5 : 2} />
          <span className="text-[10px]">Add Item</span>
        </button>

        {/* Navigation Button Settings */}
        <button
          onClick={() => {
            setEditingItem(null);
            setActiveTab('settings');
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl active:scale-90 transition-all ${
            activeTab === 'settings' 
              ? 'text-primary dark:text-primary-fixed-dim font-bold' 
              : 'text-on-surface-variant/60'
          }`}
          aria-label="Application Settings"
        >
          <Settings size={20} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
          <span className="text-[10px]">Settings</span>
        </button>

      </nav>

      {/* 4. Global bottom sheet item details modal */}
      {selectedItemForDetails && (
        <ProductDetailsModal
          item={selectedItemForDetails}
          onClose={handleCloseDetails}
          onEdit={handleEditItem}
        />
      )}

    </div>
  );
}
