'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save, ArrowLeft, Image as ImageIcon, Upload, AlertCircle } from 'lucide-react';
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
  const [notes, setNotes] = useState('');
  const [store, setStore] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState<'High' | 'High-Medium' | 'Medium' | 'Medium-Low' | 'Low' | 'Rare' | 'Discontinued'>('Medium');
  const [quantity, setQuantity] = useState('1');
  const [link, setLink] = useState('');
  const [priceNotAvailable, setPriceNotAvailable] = useState(false);

  const [validationError, setValidationError] = useState('');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load edit values
  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setPrice(editItem.price !== null ? editItem.price.toString() : '');
      setPriceNotAvailable(editItem.price === null);
      setPhoto(editItem.photo);
      setNotes(editItem.notes || '');
      setStore(editItem.store);
      setCategory(editItem.category);
      setAvailability(editItem.availability);
      setQuantity(editItem.quantity?.toString() || '1');
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

    let finalPrice: number | null = null;
    if (!priceNotAvailable) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        setValidationError('Please enter a valid price (e.g. 29.99).');
        return;
      }
      finalPrice = parsedPrice;
    }

    if (!name.trim()) {
      setValidationError('Please enter a product name.');
      return;
    }

    const payload = {
      name: name.trim(),
      price: finalPrice,
      photo: photo.trim(),
      notes: notes.trim() || undefined,
      store: store || 'Local Shop',
      category: category || 'Lifestyle',
      availability,
      quantity: Math.max(1, parseInt(quantity, 10) || 1),
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file.');
      return;
    }

    // Limit maximum raw file size to 15MB to prevent browser crash during loading
    const MAX_INPUT_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_INPUT_SIZE) {
      setValidationError('This image file is too large. Please upload an image smaller than 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const originalBase64 = event.target?.result as string;
      
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 800; // Optimal mobile card dimension

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 70% quality for optimal mobile visual look & tiny file size (~30KB)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setPhoto(compressedBase64);
        } else {
          // Resilient fallback if canvas is not supported/fails
          setPhoto(originalBase64);
        }
        setShowPhotoPicker(false);
      };
      
      img.onerror = () => {
        setValidationError('Failed to parse selected image file.');
      };
      
      img.src = originalBase64;
    };

    reader.onerror = () => {
      setValidationError('Failed to read selected image file.');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col flex-1 px-4">
      
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
              <div className="col-span-3 mt-1 flex flex-col gap-2">
                <input 
                  type="text" 
                  placeholder="Or paste custom image URL..." 
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full px-4 py-1.5 text-xs text-on-surface outline-hidden focus:border-primary/50"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="w-full py-2 px-3 rounded-full bg-primary text-white dark:bg-primary-container dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
                >
                  <Upload size={12} />
                  Upload from Local Device
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload} 
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
        {/* Price & Quantity row */}
        <div className="grid grid-cols-2 gap-4">
          
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="itemPrice" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Price ($) {priceNotAvailable ? '' : '*'}
              </label>
              <label className="flex items-center gap-1.5 text-[10px] text-on-surface-variant cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={priceNotAvailable} 
                  onChange={(e) => {
                    setPriceNotAvailable(e.target.checked);
                    if (e.target.checked) setPrice('');
                  }}
                  className="rounded border-outline-variant/30 text-primary focus:ring-primary/20 bg-surface-container-lowest w-3 h-3"
                />
                <span>Not Available</span>
              </label>
            </div>
            <input 
              type="number" 
              id="itemPrice"
              step="0.01" 
              placeholder={priceNotAvailable ? "N/A" : "0.00"} 
              required={!priceNotAvailable}
              disabled={priceNotAvailable}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner font-mono disabled:opacity-50 disabled:bg-surface-container"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="itemQuantity" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Quantity
            </label>
            <input 
              type="number" 
              id="itemQuantity"
              min="1"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner font-mono"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

        </div>

        {/* Availability row */}
        <div className="grid grid-cols-1 gap-4">
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
              <option value="High">High</option>
              <option value="High-Medium">High-Medium</option>
              <option value="Medium">Medium</option>
              <option value="Medium-Low">Medium-Low</option>
              <option value="Low">Low</option>
              <option value="Rare">Rare</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>
        </div>

        {/* Store & Category row */}
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

        {/* Notes textarea */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="itemNotes" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Notes (Optional)
          </label>
          <textarea 
            id="itemNotes"
            rows={3}
            placeholder="e.g. Christmas gift ideas, sizing fits large..." 
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
