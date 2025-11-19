import React from 'react';
import { useAutoSave } from '../hooks/useAutoSave';
import type { Responses } from '../types';

interface AutoSaveProps {
  responses: Responses;
}

export default function AutoSave({ responses }: AutoSaveProps) {
  const { lastSaved, isSaving } = useAutoSave(responses);

  if (!lastSaved && !isSaving) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
        isSaving 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        <div className="flex items-center space-x-2">
          {isSaving ? (
            <>
              <div className="w-3 h-3 border border-yellow-600 rounded-full animate-spin border-t-transparent"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>
                Saved {lastSaved && new Date(lastSaved).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}