'use client';

import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useWishlistStore, Project } from '../store/useWishlistStore';

interface AddProjectScreenProps {
  editProject?: Project | null;
  onSaved: (projectId: string) => void;
  onCancel: () => void;
}

export default function AddProjectScreen({ editProject, onSaved, onCancel }: AddProjectScreenProps) {
  const addProject = useWishlistStore((state) => state.addProject);
  const updateProject = useWishlistStore((state) => state.updateProject);
  
  const [name, setName] = useState(editProject?.name || '');
  const [budget, setBudget] = useState(editProject?.budget?.toString() || '');
  const [notes, setNotes] = useState(editProject?.notes || '');
  
  const isFormValid = name.trim().length > 0;

  const handleSave = () => {
    if (!isFormValid) return;
    
    const parsedBudget = budget.trim() !== '' ? parseFloat(budget) : null;
    
    if (editProject) {
      updateProject(editProject.id, {
        name: name.trim(),
        budget: parsedBudget && !isNaN(parsedBudget) ? parsedBudget : null,
        notes: notes.trim() || undefined,
      });
      onSaved(editProject.id);
    } else {
      const newProjectId = addProject({
        name: name.trim(),
        budget: parsedBudget && !isNaN(parsedBudget) ? parsedBudget : null,
        notes: notes.trim() || undefined,
      });
      onSaved(newProjectId);
    }
  };

  return (
    <div className="flex flex-col flex-1 px-4 pb-20 animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center gap-3 py-3 mb-2 border-b border-outline-variant/10">
        <button 
          type="button" 
          onClick={onCancel}
          className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-manrope text-xl font-bold text-on-surface">
          {editProject ? 'Edit Project' : 'New Project'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pt-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">
              Project Name <span className="text-error">*</span>
            </label>
            <input
              id="projectName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Living Room Renovation"
              className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant/40"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="projectBudget" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">
              Budget (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">
                $
              </span>
              <input
                id="projectBudget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>

          <div>
            <label htmlFor="projectNotes" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">
              Notes (Optional)
            </label>
            <textarea
              id="projectNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific goals or ideas for this project?"
              rows={4}
              className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant/40 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-outline-variant/10 mt-auto">
        <button
          onClick={handleSave}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isFormValid
              ? 'bg-primary text-on-primary shadow-md hover:bg-primary/90' 
              : 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed'
          }`}
        >
          <Save size={20} />
          <span>{editProject ? 'Save Changes' : 'Create Project'}</span>
        </button>
      </div>
    </div>
  );
}
