'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Save, ArrowLeft, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '../store/useWishlistStore';

interface AddItemScreenProps {
  editItem?: WishlistItem | null;
  onSaved: () => void;
  onCancel?: () => void;
}

const STOCK_PHOTOS = [
  { name: 'Desk Lamp', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Keyboard', url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chair', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
  { name: 'Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
  { name: 'Coffee Cup', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },
];

export default function AddItemScreen({ editItem, onSaved, onCancel }: AddItemScreenProps) {
  const addItem = useWishlistStore((state) => state.addItem);
  const updateItem = useWishlistStore((state) => state.updateItem);
  const categories = useWishlistStore((state) => state.categories);
  const stores = useWishlistStore((state) => state.stores);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState('');
  const [description, setDescription] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [store, setStore] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState<'In Stock' | 'Out of Stock' | 'Price Drop'>('In Stock');
  const [link, setLink] = useState('');

  const [validationError, setValidationError] = useState('');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  // Load edit values
  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setPrice(editItem.price.toString());
      setPhoto(editItem.photo);
      setDescription(editItem.description);
      setSpecialNotes(editItem.specialNotes || '');
      setStore(editItem.store);
      setCategory(editItem.category);
      setAvailability(editItem.availability);
      setLink(editItem.link || '');
    } else {
      // Default fallback categories/stores
      if (categories.length > 0) setCategory(categories[0]);
      if (stores.length > 0) setStore(stores[0]);
      // Default curated stock photo
      setPhoto(STOCK_PHOTOS[0].url);
    }
  }, [editItem, categories, stores]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const parsedPrice = parseFloat(price);
    if (!name.trim()) {
      setValidationError('Please enter a product name.');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setValidationError('Please enter a valid price (e.g. 29.99).');
      return;
    }

    const payload = {
      name: name.trim(),
      price: parsedPrice,
      photo: photo.trim(),
      description: description.trim(),
      specialNotes: specialNotes.trim() || undefined,
      store: store || 'Local Shop',
      category: category || 'Lifestyle',
      availability,
      link: link.trim() || undefined,
    };

    if (editItem) {
      updateItem(editItem.id, payload);
    } else {
      addItem(payload);
    }
    onSaved();
  };

  const handlePickStockPhoto = (url: string) => {
    setPhoto(url);
    setShowPhotoPicker(false);
  };

  return (
    <div className="flex flex-col flex-1 pb-24 px-4">
      
      {/* Header bar */}
      <div className="flex items-center gap-3 py-3 mb-4 border-b border-outline-variant/10">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h2 className="font-manrope text-xl font-bold text-on-surface">
          {editItem ? 'Edit Wishlist Item' : 'Add Wishlist Item'}
        </h2>
      </div>

      {validationError && (
        <div className="mb-4 p-3 bg-error-container text-on-error-container text-xs rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle size={16} />
          {validationError}
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        
        {/* Cover Photo Area with Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Product Thumbnail Photo
          </label>
          <div className="relative w-full aspect-21/9 bg-surface-container rounded-2xl overflow-hidden shadow-inner border border-outline-variant/30 flex flex-col items-center justify-center group">
            {photo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={photo} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                  className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/75 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 active:scale-95 transition-all shadow-md font-semibold"
                >
                  <Camera size={14} />
                  Change Image
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                className="flex flex-col items-center text-on-surface-variant/70 hover:text-on-surface transition-colors"
              >
                <ImageIcon size={32} strokeWidth={1.5} className="mb-1" />
                <span className="text-xs font-medium">Choose from beautiful stock images</span>
              </button>
            )}
          </div>

          {/* Quick Select curated stock list drawer toggler */}
          {showPhotoPicker && (
            <div className="p-3 bg-surface-container rounded-2xl border border-outline-variant/20 grid grid-cols-3 gap-2 mt-1">
              {STOCK_PHOTOS.map((sp, idx) => (
                <div 
                  key={idx}
                  onClick={() => handlePickStockPhoto(sp.url)}
                  className="relative aspect-square bg-surface-container-low rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary active:scale-95 transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sp.url} alt={sp.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/40 text-[9px] text-white py-0.5 text-center truncate">
                    {sp.name}
                  </span>
                </div>
              ))}
              <div className="col-span-3 mt-1">
                <input 
                  type="text" 
                  placeholder="Or paste custom image URL..." 
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full px-4 py-1.5 text-xs text-on-surface outline-hidden focus:border-primary/50"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="itemName" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Item Name *
          </label>
          <input 
            type="text" 
            id="itemName"
            placeholder="e.g. Mechanical Keyboard" 
            required
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Price & Availability row */}
        <div className="grid grid-cols-2 gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="itemPrice" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Price ($) *
            </label>
            <input 
              type="number" 
              id="itemPrice"
              step="0.01" 
              placeholder="0.00" 
              required
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner font-mono"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="itemAvailability" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Availability
            </label>
            <select
              id="itemAvailability"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 cursor-pointer shadow-inner"
              value={availability}
              onChange={(e) => setAvailability(e.target.value as any)}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Price Drop">Price Drop</option>
            </select>
          </div>

        </div>

        {/* Store & Category selectors */}
        <div className="grid grid-cols-2 gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="itemCategory" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Category
            </label>
            <select
              id="itemCategory"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 cursor-pointer shadow-inner"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="itemStore" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Store / Merchant
            </label>
            <select
              id="itemStore"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 cursor-pointer shadow-inner"
              value={store}
              onChange={(e) => setStore(e.target.value)}
            >
              {stores.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Store Link input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="itemLink" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Shopping Link (Optional)
          </label>
          <input 
            type="url" 
            id="itemLink"
            placeholder="https://example.com/product" 
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Description textarea */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="itemDescription" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Description
          </label>
          <textarea 
            id="itemDescription"
            rows={3}
            placeholder="Describe what makes this item special or details like size/color..." 
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Special Notes textarea */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="itemNotes" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Special Notes (Optional)
          </label>
          <input 
            type="text" 
            id="itemNotes"
            placeholder="e.g. Christmas gift ideas, sizing fits large..." 
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
          />
        </div>

        {/* Action Save Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-full bg-primary text-white dark:bg-primary-container font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 hover:brightness-115 mt-2"
        >
          <Save size={18} />
          {editItem ? 'Save Changes' : 'Save to Wishlist'}
        </button>

      </form>

    </div>
  );
}
