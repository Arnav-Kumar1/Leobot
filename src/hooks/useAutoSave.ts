import { useEffect, useRef, useState } from 'react';
import type { Responses } from '../types';

export function useAutoSave(data: Responses, interval: number = 10000) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      if (Object.keys(data).length > 0) {
        setIsSaving(true);
        try {
          // Save to localStorage
          localStorage.setItem('mindclone-autosave', JSON.stringify({
            data,
            timestamp: new Date().toISOString()
          }));
          
          // Optionally save to server
          await fetch('/api/save-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses: data, isAutoSave: true })
          }).catch(() => {
            // Silently fail for auto-save
          });
          
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, interval]);

  return { lastSaved, isSaving };
}