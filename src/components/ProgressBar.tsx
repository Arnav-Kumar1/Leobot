import React from 'react';

interface ProgressBarProps {
  currentSectionIndex: number;
  totalSections: number;
  completionPercentage: number;
}

export default function ProgressBar({ currentSectionIndex, totalSections, completionPercentage }: ProgressBarProps) {
  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Overall Progress
        </span>
        <span className="text-sm text-gray-600">
          {completionPercentage}% complete
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Section {currentSectionIndex + 1} of {totalSections}</span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>Auto-saving enabled</span>
        </span>
      </div>
    </div>
  );
}