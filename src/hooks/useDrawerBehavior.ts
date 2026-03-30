import { useEffect, useRef, useState } from 'react';

interface IDrawerBehaviorOptions {
  isOpen: boolean;
  onClose: () => void;
}

export interface IDrawerBehaviorResult {
  isDescriptionExpanded: boolean;
  toggleDescription: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Manages UI-level drawer behavior: keyboard dismissal, focus restoration on open,
 * and the description expand/collapse toggle state.
 * @param options - `isOpen` flag and `onClose` callback from the parent.
 * @returns Ref for the close button, description expansion state, and a toggle function.
 */
export function useDrawerBehavior({
  isOpen,
  onClose,
}: IDrawerBehaviorOptions): IDrawerBehaviorResult {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setIsDescriptionExpanded(false);
    const timerId = setTimeout(() => closeButtonRef.current?.focus(), 100);
    return () => clearTimeout(timerId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return {
    isDescriptionExpanded,
    toggleDescription: () => setIsDescriptionExpanded((prev) => !prev),
    closeButtonRef,
  };
}
