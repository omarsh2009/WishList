'use client';

import React from 'react';
import { FolderGit2, PlusCircle, Calendar } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import EmptyState from './ui/EmptyState';

interface ProjectsScreenProps {
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
}

export default function ProjectsScreen({ onSelectProject, onCreateProject }: ProjectsScreenProps) {
  const projects = useWishlistStore((state) => state.projects);

  return (
    <div className="flex flex-col h-full animate-fade-in relative px-4">
      <div className="flex items-center justify-between py-3 mb-2">
        <div className="flex items-center gap-2">
          <FolderGit2 className="text-secondary dark:text-secondary-fixed-dim" size={24} />
          <h1 className="font-manrope text-2xl font-extrabold text-on-surface tracking-tight">
            Projects
          </h1>
        </div>
        
        <button
          onClick={onCreateProject}
          className="p-2 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed-dim hover:bg-primary/20 transition-colors active:scale-95"
          aria-label="New Project"
        >
          <PlusCircle size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {(!projects || projects.length === 0) ? (
          <div className="h-full flex items-center justify-center -mt-10">
            <div className="flex flex-col items-center gap-4">
              <EmptyState
                icon={FolderGit2}
                title="No projects yet"
                description="Group related wishes into projects like 'Living Room Renovation' or 'Summer Vacation'."
              />
              <button
                onClick={onCreateProject}
                className="py-2.5 px-6 rounded-xl font-bold bg-primary text-on-primary shadow-sm hover:bg-primary/90 active:scale-95 transition-all"
              >
                + New Project
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {projects.map((project) => (
              <div 
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:border-primary/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-on-surface text-lg leading-tight line-clamp-1">{project.name}</h3>
                  {project.budget && (
                    <span className="shrink-0 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed-dim px-2 py-0.5 rounded-md text-xs font-bold">
                      ${project.budget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span className="font-bold">0 Items</span>
                  <div className="w-1 h-1 rounded-full bg-outline-variant/50" />
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(project.createdAt))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
