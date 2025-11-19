import React from 'react';

const Progress = ({ currentSection, totalSections }) => {
  const progressPercentage = ((currentSection / totalSections) * 100).toFixed(2);

  return (
    <div className="w-full bg-gray-200 rounded-full">
      <div
        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
        style={{ width: `${progressPercentage}%` }}
      >
        {progressPercentage}%
      </div>
    </div>
  );
};

export default Progress;