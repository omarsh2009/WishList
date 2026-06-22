import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-fade-in px-4">
      <div className="absolute inset-0" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-outline-variant/30">
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDestructive ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
              <AlertCircle size={24} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-center text-on-surface mb-2 font-manrope">
            {title}
          </h3>
          <p className="text-sm text-center text-on-surface-variant leading-relaxed mb-6">
            {message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-full font-semibold transition-all text-sm active:scale-95 bg-surface-container-high text-on-surface border border-outline-variant/30"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 px-4 rounded-full font-semibold transition-all text-sm active:scale-95 text-white ${
                isDestructive 
                  ? 'bg-error hover:bg-error/90' 
                  : 'bg-primary dark:bg-primary-container hover:brightness-110'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
