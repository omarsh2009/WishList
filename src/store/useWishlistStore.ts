import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number | null;
  photo: string;
  description: string;
  specialNotes?: string;
  store: string;
  category: string;
  availability: 'High' | 'High-Medium' | 'Medium' | 'Medium-Low' | 'Low' | 'Rare' | 'Discontinued';
  link?: string;
  bought: boolean;
  createdAt: string;
}

interface WishlistState {
  wishlistItems: WishlistItem[];
  categories: string[];
  stores: string[];
  darkMode: boolean;
  
  // CRUD actions for items
  addItem: (item: Omit<WishlistItem, 'id' | 'createdAt' | 'bought'>) => void;
  updateItem: (id: string, updatedFields: Partial<WishlistItem>) => void;
  deleteItem: (id: string) => void;
  toggleBought: (id: string) => void;
  
  // Category management
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  
  // Store management
  addStore: (store: string) => void;
  deleteStore: (store: string) => void;
  
  // Theme management
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
}

const DEFAULT_CATEGORIES = ['Tech', 'Home Decor', 'Apparel', 'Books', 'Fitness', 'Lifestyle'];
const DEFAULT_STORES = ['Amazon', 'Best Buy', 'Apple Store', 'IKEA', 'Nike', 'Local Shop'];

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: '1',
    name: 'Minimalist Desk Lamp',
    price: 89.00,
    photo: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    description: 'Matte black aluminum lamp with adjustable warm LED, ideal for late-night reading.',
    specialNotes: 'Perfect matching accent for the main workspace setup.',
    store: 'IKEA',
    category: 'Home Decor',
    availability: 'Medium',
    link: 'https://www.ikea.com',
    bought: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Mechanical Keyboard (V3)',
    price: 189.00,
    photo: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=400&q=80',
    description: 'Hot-swappable tactile mechanical keyboard with custom brass plate and premium walnut case.',
    specialNotes: 'Buy with brown switches. Add custom keycaps later.',
    store: 'Best Buy',
    category: 'Tech',
    availability: 'Rare',
    link: 'https://www.bestbuy.com',
    bought: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Premium Leather Boots',
    price: 245.00,
    photo: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=400&q=80',
    description: 'Handcrafted full-grain leather boots designed for all-season durability and comfort.',
    specialNotes: 'Size 10 fits best. Fits slightly large.',
    store: 'Local Shop',
    category: 'Apparel',
    availability: 'Discontinued',
    bought: true,
    createdAt: new Date().toISOString()
  }
];

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      wishlistItems: INITIAL_WISHLIST,
      categories: DEFAULT_CATEGORIES,
      stores: DEFAULT_STORES,
      darkMode: false,
      
      addItem: (item) => set((state) => ({
        wishlistItems: [
          ...state.wishlistItems,
          {
            ...item,
            id: crypto.randomUUID(),
            bought: false,
            createdAt: new Date().toISOString(),
          }
        ]
      })),
      
      updateItem: (id, updatedFields) => set((state) => ({
        wishlistItems: state.wishlistItems.map((item) => 
          item.id === id ? { ...item, ...updatedFields } : item
        )
      })),
      
      deleteItem: (id) => set((state) => ({
        wishlistItems: state.wishlistItems.filter((item) => item.id !== id)
      })),
      
      toggleBought: (id) => set((state) => ({
        wishlistItems: state.wishlistItems.map((item) => 
          item.id === id ? { ...item, bought: !item.bought } : item
        )
      })),
      
      addCategory: (category) => set((state) => {
        const trimmed = category.trim();
        if (!trimmed || state.categories.includes(trimmed)) return {};
        return { categories: [...state.categories, trimmed] };
      }),
      
      deleteCategory: (category) => set((state) => ({
        categories: state.categories.filter((cat) => cat !== category),
        // Re-assign items belonging to deleted category to 'Other' or first available
        wishlistItems: state.wishlistItems.map((item) => 
          item.category === category ? { ...item, category: 'Lifestyle' } : item
        )
      })),
      
      addStore: (store) => set((state) => {
        const trimmed = store.trim();
        if (!trimmed || state.stores.includes(trimmed)) return {};
        return { stores: [...state.stores, trimmed] };
      }),
      
      deleteStore: (store) => set((state) => ({
        stores: state.stores.filter((s) => s !== store),
        wishlistItems: state.wishlistItems.map((item) => 
          item.store === store ? { ...item, store: 'Local Shop' } : item
        )
      })),
      
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      
      toggleDarkMode: () => set((state) => {
        const nextMode = !state.darkMode;
        if (typeof window !== 'undefined') {
          if (nextMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return { darkMode: nextMode };
      }),
    }),
    {
      name: 'wishlist-pro-tracker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
