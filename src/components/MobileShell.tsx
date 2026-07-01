'use client';

import React, { useState, useEffect } from 'react';
import { Home, PlusCircle, Settings, Gift, Lightbulb } from 'lucide-react';
import { useWishlistStore, WishlistItem, Idea } from '../store/useWishlistStore';
import HomeScreen from './HomeScreen';
import AddItemScreen from './AddItemScreen';
import SettingsScreen from './SettingsScreen';
import ProductDetailsModal from './ProductDetailsModal';
import IdeasScreen from './IdeasScreen';
import AddIdeaScreen from './AddIdeaScreen';
import IdeaDetailsModal from './IdeaDetailsModal';
import PurchasedScreen from './PurchasedScreen';

export default function MobileShell() {
  const [activeTab, setActiveTab] = useState<'home' | 'add' | 'ideas' | 'addIdea' | 'settings' | 'purchased'>('home');
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<WishlistItem | null>(null);
  const [selectedIdeaForDetails, setSelectedIdeaForDetails] = useState<Idea | null>(null);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
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

  // Idea actions
  const handleSelectIdea = (idea: Idea) => {
    setSelectedIdeaForDetails(idea);
  };

  const handleEditIdea = (idea: Idea) => {
    setSelectedIdeaForDetails(null);
    setEditingIdea(idea);
    setActiveTab('addIdea');
  };

  const handleCloseIdeaDetails = () => {
    setSelectedIdeaForDetails(null);
  };

  const handleCancelIdeaEdit = () => {
    setEditingIdea(null);
    setActiveTab('ideas');
  };

  const handleIdeaSaved = () => {
    setEditingIdea(null);
    setActiveTab('ideas');
  };

  // Successful item save trigger
  const handleItemSaved = () => {
    setEditingItem(null);
    setActiveTab('home');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col max-w-md mx-auto w-full bg-surface-background shadow-premium border-x border-outline-variant/20 relative">
      
      {/* 1. App Top Header Banner */}
      <header className="shrink-0 z-40 bg-surface-background/80 backdrop-blur-md border-b border-outline-variant/15 px-4 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Gift className="text-primary dark:text-primary-fixed-dim" size={20} strokeWidth={2.5} />
          <h1 className="font-manrope text-lg font-extrabold tracking-tight text-on-surface">
            WishList <span className="text-primary dark:text-primary-fixed-dim font-black">Pro</span>
          </h1>
        </div>
        <div className="flex items-center">
          <span className="text-[10px] font-bold px-2.5 py-0.5 bg-surface-container rounded-full text-on-surface-variant">
            {wishlistItems.filter(i => !i.isPurchased).length} Wishes
          </span>
        </div>
      </header>

      {/* 2. Main Content Screen Container Scrollport */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pt-2 bg-surface-background relative flex flex-col">
        {activeTab === 'home' && (
          <HomeScreen 
            onSelectItem={handleSelectItem} 
            onNavigateToPurchased={() => setActiveTab('purchased')}
          />
        )}
        
        {activeTab === 'add' && (
          <AddItemScreen 
            editItem={editingItem} 
            onSaved={handleItemSaved} 
            onCancel={editingItem ? handleCancelEdit : undefined} 
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasScreen 
            onSelectIdea={handleSelectIdea} 
            onCreateIdea={() => {
              setEditingIdea(null);
              setActiveTab('addIdea');
            }}
          />
        )}

        {activeTab === 'addIdea' && (
          <AddIdeaScreen 
            editIdea={editingIdea} 
            onSaved={handleIdeaSaved} 
            onCancel={editingIdea ? handleCancelIdeaEdit : undefined} 
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsScreen />
        )}

        {activeTab === 'purchased' && (
          <PurchasedScreen 
            onSelectItem={handleSelectItem}
            onBack={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* 3. Bottom App Navigation Bar */}
      <nav className="shrink-0 z-40 bg-surface-background/95 backdrop-blur-md border-t border-outline-variant/20 flex justify-around items-center py-2.5 px-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-2xl">
        
        {/* Navigation Button Home */}
        <button
          onClick={() => {
            setEditingItem(null);
            setActiveTab('home');
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl touch-highlight transition-all active:scale-95 ${
            activeTab === 'home' 
              ? 'text-primary dark:text-primary-fixed-dim font-bold bg-primary/5 dark:bg-primary/10 shadow-xs' 
              : 'text-on-surface-variant/60 hover:text-on-surface'
          }`}
          aria-label="Wishlist feed"
        >
          <Home size={19} strokeWidth={activeTab === 'home' ? 2.5 : 2} className="transition-transform duration-300 active:scale-110" />
          <span className="text-[10px] tracking-wide">Wishlist</span>
        </button>

        {/* Navigation Button Add Item */}
        <button
          onClick={() => {
            setEditingItem(null);
            setActiveTab('add');
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl touch-highlight transition-all active:scale-95 ${
            activeTab === 'add' 
              ? 'text-primary dark:text-primary-fixed-dim font-bold bg-primary/5 dark:bg-primary/10 shadow-xs' 
              : 'text-on-surface-variant/60 hover:text-on-surface'
          }`}
          aria-label="Add a wish item"
        >
          <PlusCircle size={19} strokeWidth={activeTab === 'add' ? 2.5 : 2} className="transition-transform duration-300 active:scale-110" />
          <span className="text-[10px] tracking-wide">Add Item</span>
        </button>

        {/* Navigation Button Ideas */}
        <button
          onClick={() => {
            setEditingIdea(null);
            setActiveTab('ideas');
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl touch-highlight transition-all active:scale-95 ${
            (activeTab === 'ideas' || activeTab === 'addIdea')
              ? 'text-primary dark:text-primary-fixed-dim font-bold bg-primary/5 dark:bg-primary/10 shadow-xs' 
              : 'text-on-surface-variant/60 hover:text-on-surface'
          }`}
          aria-label="Ideas and Planning"
        >
          <Lightbulb size={19} strokeWidth={(activeTab === 'ideas' || activeTab === 'addIdea') ? 2.5 : 2} className="transition-transform duration-300 active:scale-110" />
          <span className="text-[10px] tracking-wide">Ideas</span>
        </button>

        {/* Navigation Button Settings */}
        <button
          onClick={() => {
            setEditingItem(null);
            setActiveTab('settings');
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl touch-highlight transition-all active:scale-95 ${
            activeTab === 'settings' 
              ? 'text-primary dark:text-primary-fixed-dim font-bold bg-primary/5 dark:bg-primary/10 shadow-xs' 
              : 'text-on-surface-variant/60 hover:text-on-surface'
          }`}
          aria-label="Application Settings"
        >
          <Settings size={19} strokeWidth={activeTab === 'settings' ? 2.5 : 2} className="transition-transform duration-300 active:scale-110" />
          <span className="text-[10px] tracking-wide">Settings</span>
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

      {selectedIdeaForDetails && (
        <IdeaDetailsModal
          idea={selectedIdeaForDetails}
          onClose={handleCloseIdeaDetails}
          onEdit={handleEditIdea}
          onViewWishlistItem={(id) => {
            const item = wishlistItems.find(i => i.id === id);
            if (item) {
              handleCloseIdeaDetails();
              setEditingItem(null);
              setActiveTab('home');
              setSelectedItemForDetails(item);
            }
          }}
        />
      )}

    </div>
  );
}
