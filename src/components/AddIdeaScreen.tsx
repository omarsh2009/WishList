'use client';

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { useWishlistStore, Idea } from '../store/useWishlistStore';

interface AddIdeaScreenProps {
  editIdea?: Idea | null;
  onSaved: () => void;
  onCancel?: () => void;
}

export default function AddIdeaScreen({ editIdea, onSaved, onCancel }: AddIdeaScreenProps) {
  const addIdea = useWishlistStore((state) => state.addIdea);
  const updateIdea = useWishlistStore((state) => state.updateIdea);
  const categories = useWishlistStore((state) => state.categories);

  const [title, setTitle] = useState('');
  const [targetBudget, setTargetBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [validationError, setValidationError] = useState('');

  // Load edit values
  useEffect(() => {
    if (editIdea) {
      setTitle(editIdea.title);
      setTargetBudget(editIdea.targetBudget ? editIdea.targetBudget.toString() : '');
      setNotes(editIdea.notes || '');
      setCategory(editIdea.category || '');
    } else {
      if (categories.length > 0) setCategory(categories[0]);
    }
  }, [editIdea, categories]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Please enter a title for your idea.');
      return;
    }

    let parsedBudget: number | undefined = undefined;
    if (targetBudget.trim() !== '') {
      parsedBudget = parseFloat(targetBudget);
      if (isNaN(parsedBudget) || parsedBudget < 0) {
        setValidationError('Please enter a valid target budget or leave it blank.');
        return;
      }
    }

    const payload = {
      title: title.trim(),
      targetBudget: parsedBudget,
      notes: notes.trim() || undefined,
      category: category || undefined,
    };

    if (editIdea) {
      updateIdea(editIdea.id, payload);
    } else {
      addIdea(payload);
    }
    onSaved();
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
          {editIdea ? 'Edit Idea' : 'Add New Idea'}
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
        
        {/* Title input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ideaTitle" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Idea Title *
          </label>
          <input 
            type="text" 
            id="ideaTitle"
            placeholder="What are you planning to get?" 
            required
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ideaCategory" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Category (Optional)
          </label>
          <select
            id="ideaCategory"
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 cursor-pointer shadow-inner"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Target Budget */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ideaBudget" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Target Budget ($)
          </label>
          <input 
            type="number" 
            id="ideaBudget"
            step="0.01" 
            placeholder="Optional budget estimate" 
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner font-mono"
            value={targetBudget}
            onChange={(e) => setTargetBudget(e.target.value)}
          />
        </div>

        {/* Notes textarea */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ideaNotes" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Notes (Optional)
          </label>
          <textarea 
            id="ideaNotes"
            rows={4}
            placeholder="Any additional thoughts, specifications, or details..." 
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
          {editIdea ? 'Save Changes' : 'Save Idea'}
        </button>

      </form>
    </div>
  );
}
