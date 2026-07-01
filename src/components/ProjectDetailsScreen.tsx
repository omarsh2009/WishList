'use client';

import React from 'react';
import { ArrowLeft, FolderGit2, PlusCircle, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Project } from '../store/useWishlistStore';
import ConfirmModal from './ui/ConfirmModal';

interface ProjectDetailsScreenProps {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProjectDetailsScreen({ project, onBack, onEdit, onDelete }: ProjectDetailsScreenProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(project.createdAt));

  return (
    <div className="flex flex-col flex-1 bg-surface-background animate-fade-in relative h-full overflow-y-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-surface-background/90 backdrop-blur-md border-b border-outline-variant/15">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-on-surface hover:bg-surface-container active:scale-90 transition-all"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-2">
          <FolderGit2 className="text-secondary dark:text-secondary-fixed-dim" size={18} />
          <span className="font-bold text-sm text-on-surface">Project</span>
        </div>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Project Header Info */}
        <div className="flex flex-col gap-2">
          <h1 className="font-manrope text-3xl font-extrabold text-on-surface leading-tight tracking-tight">
            {project.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface text-xs font-bold">
              0 Items
            </span>
            {project.budget && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed-dim text-xs font-bold">
                Budget: ${project.budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs">
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>
        </div>

        {project.notes && (
          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Notes</h3>
            <p className="text-on-surface text-sm whitespace-pre-wrap leading-relaxed">
              {project.notes}
            </p>
          </div>
        )}

        {/* Empty State Action */}
        <div className="mt-8 flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30 text-center">
          <div className="w-16 h-16 bg-primary/5 dark:bg-primary/10 rounded-full flex items-center justify-center text-primary dark:text-primary-fixed-dim mb-4">
            <PlusCircle size={32} />
          </div>
          <h3 className="font-bold text-lg text-on-surface mb-2">Start building your project</h3>
          <p className="text-sm text-on-surface-variant mb-6 max-w-[250px]">
            Add items from your wishlist or create new ones directly in this project.
          </p>
          <button className="w-full max-w-[200px] py-3 rounded-xl font-bold bg-primary text-on-primary shadow-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2">
            <PlusCircle size={18} />
            Add First Item
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={onEdit}
            className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-secondary text-on-secondary shadow-md hover:bg-secondary/90 active:scale-[0.98] transition-all"
          >
            <Edit2 size={20} />
            <span>Edit Project</span>
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-error/10 text-error shadow-sm hover:bg-error/20 active:scale-[0.98] transition-all"
          >
            <Trash2 size={20} />
            <span>Delete Project</span>
          </button>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Project?"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive
      />
    </div>
  );
}
