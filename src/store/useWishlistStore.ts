import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type IdeaStatus = 'Active' | 'Converted' | 'Archived';

export interface Idea {
  id: string;
  title: string;
  targetBudget?: number;
  notes?: string;
  category?: string;
  createdAt: string;
  status: IdeaStatus;
  convertedDate?: string;
  wishlistItemId?: string;
}

export interface Project {
  id: string;
  name: string;
  budget?: number | null;
  notes?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number | null;
  photo: string;
  notes?: string;
  store: string;
  category: string;
  availability: 'High' | 'High-Medium' | 'Medium' | 'Medium-Low' | 'Low' | 'Rare' | 'Discontinued';
  link?: string;
  isPurchased: boolean;
  purchaseInfo?: {
    date: string;
    price: number | null;
  };
  quantity: number;
  createdAt: string;
}

interface WishlistState {
  wishlistItems: WishlistItem[];
  ideas: Idea[];
  projects: Project[];
  categories: string[];
  stores: string[];
  darkMode: boolean;
  
  // CRUD actions for items
  addItem: (item: Omit<WishlistItem, 'id' | 'createdAt' | 'isPurchased' | 'purchaseInfo'>) => void;
  updateItem: (id: string, updatedFields: Partial<WishlistItem>) => void;
  deleteItem: (id: string) => void;
  markAsPurchased: (id: string) => void;
  restoreToWishlist: (id: string) => void;
  
  // Category management
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  
  // Store management
  addStore: (store: string) => void;
  deleteStore: (store: string) => void;
  
  // Theme management
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
  
  // Idea management
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'status'>) => void;
  updateIdea: (id: string, updatedFields: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  convertToWishlistItem: (ideaId: string) => void;
  
  // Project management
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => string;
  updateProject: (id: string, updatedFields: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const DEFAULT_CATEGORIES = ['Tech', 'Home Decor', 'Apparel', 'Books', 'Fitness', 'Lifestyle'];
const DEFAULT_STORES = ['Amazon', 'Best Buy', 'Apple Store', 'IKEA', 'Nike', 'Local Shop'];

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: '1',
    name: 'Minimalist Desk Lamp',
    price: 89.00,
    photo: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    notes: 'Perfect matching accent for the main workspace setup.',
    store: 'IKEA',
    category: 'Home Decor',
    availability: 'Medium',
    link: 'https://www.ikea.com',
    isPurchased: false,
    quantity: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Mechanical Keyboard (V3)',
    price: 189.00,
    photo: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=400&q=80',
    notes: 'Buy with brown switches. Add custom keycaps later.',
    store: 'Best Buy',
    category: 'Tech',
    availability: 'Rare',
    link: 'https://www.bestbuy.com',
    isPurchased: false,
    quantity: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Premium Leather Boots',
    price: 245.00,
    photo: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=400&q=80',
    notes: 'Size 10 fits best. Fits slightly large.',
    store: 'Local Shop',
    category: 'Apparel',
    availability: 'Discontinued',
    isPurchased: true,
    purchaseInfo: {
      date: new Date().toISOString(),
      price: 245.00
    },
    quantity: 1,
    createdAt: new Date().toISOString()
  }
];

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      wishlistItems: INITIAL_WISHLIST,
      ideas: [],
      projects: [],
      categories: DEFAULT_CATEGORIES,
      stores: DEFAULT_STORES,
      darkMode: false,
      
      addItem: (item) => set((state) => ({
        wishlistItems: [
          ...state.wishlistItems,
          {
            ...item,
            id: crypto.randomUUID(),
            isPurchased: false,
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
      
      markAsPurchased: (id) => set((state) => ({
        wishlistItems: state.wishlistItems.map((item) => 
          item.id === id 
            ? { 
                ...item, 
                isPurchased: true, 
                purchaseInfo: { date: new Date().toISOString(), price: item.price } 
              } 
            : item
        )
      })),
      
      restoreToWishlist: (id) => set((state) => ({
        wishlistItems: state.wishlistItems.map((item) => 
          item.id === id 
            ? { 
                ...item, 
                isPurchased: false, 
                purchaseInfo: undefined 
              } 
            : item
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

      addIdea: (idea) => set((state) => ({
        ideas: [
          ...state.ideas,
          {
            ...idea,
            id: crypto.randomUUID(),
            status: 'Active',
            createdAt: new Date().toISOString(),
          }
        ]
      })),
      
      updateIdea: (id, updatedFields) => set((state) => ({
        ideas: state.ideas.map((idea) => 
          idea.id === id ? { ...idea, ...updatedFields } : idea
        )
      })),
      
      deleteIdea: (id) => set((state) => ({
        ideas: state.ideas.filter((idea) => idea.id !== id)
      })),
      
      convertToWishlistItem: (ideaId) => set((state) => {
        const idea = state.ideas.find(i => i.id === ideaId);
        if (!idea || idea.status !== 'Active') return state;

        const newWishlistItemId = crypto.randomUUID();
        
        const newWishlistItem: WishlistItem = {
          id: newWishlistItemId,
          name: idea.title,
          price: null, // Price not available yet
          photo: '', // To be added later
          notes: idea.notes || undefined,
          store: state.stores.length > 0 ? state.stores[0] : 'Local Shop',
          category: idea.category || (state.categories.length > 0 ? state.categories[0] : 'Lifestyle'),
          availability: 'Medium',
          isPurchased: false,
          quantity: 1,
          createdAt: new Date().toISOString()
        };

        return {
          wishlistItems: [...state.wishlistItems, newWishlistItem],
          ideas: state.ideas.map(i => 
            i.id === ideaId 
              ? { ...i, status: 'Converted', convertedDate: new Date().toISOString(), wishlistItemId: newWishlistItemId } 
              : i
          )
        };
      }),

      addProject: (project) => {
        const newId = crypto.randomUUID();
        set((state) => ({
          projects: [
            ...(state.projects || []),
            {
              ...project,
              id: newId,
              createdAt: new Date().toISOString()
            }
          ]
        }));
        return newId;
      },
      
      updateProject: (id, updatedFields) => set((state) => ({
        projects: (state.projects || []).map((project) => 
          project.id === id ? { ...project, ...updatedFields } : project
        )
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: (state.projects || []).filter((project) => project.id !== id)
      })),
    }),
    {
      name: 'wishlist-pro-tracker-storage',
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: (persistedState: any, version: number) => {
        if (version === 0 || version === 1 || version === 2 || !version) {
          if (persistedState && persistedState.wishlistItems) {
            persistedState.wishlistItems = persistedState.wishlistItems.map((item: any) => {
              if (item.isPurchased === undefined) {
                item.isPurchased = !!item.bought;
              }
              if (item.isPurchased && !item.purchaseInfo) {
                item.purchaseInfo = {
                  date: item.createdAt || new Date().toISOString(),
                  price: item.price
                };
              }
              delete item.bought;
              
              if (item.quantity === undefined) {
                item.quantity = 1;
              }
              
              let currentNotes = item.notes || item.specialNotes || '';
              if (!currentNotes && item.description) {
                currentNotes = item.description;
              }
              item.notes = currentNotes || undefined;
              
              delete item.description;
              delete item.specialNotes;
              
              return item;
            });
          }
          if (persistedState && persistedState.ideas) {
            persistedState.ideas = persistedState.ideas.map((idea: any) => {
              let currentNotes = idea.notes || '';
              if (!currentNotes && idea.description) {
                currentNotes = idea.description;
              }
              idea.notes = currentNotes || undefined;
              delete idea.description;
              return idea;
            });
          }
          if (persistedState && !persistedState.projects) {
            persistedState.projects = [];
          }
        }
        return persistedState;
      }
    }
  )
);
