import React from 'react';
import type { Section, Responses } from '../types';

interface SectionNavigationProps {
  sections: Section[];
  currentSectionIndex: number;
  onSectionSelect: (sectionIndex: number) => void;
  responses: Responses;
}

export default function SectionNavigation({ 
  sections, 
  currentSectionIndex, 
  onSectionSelect, 
  responses 
}: SectionNavigationProps) {
  
  const getSectionCompletionStatus = (section: Section) => {
    const answeredQuestions = section.questions.filter(q => responses[q.id]?.trim()).length;
    const totalQuestions = section.questions.length;
    
    if (answeredQuestions === 0) return 'not-started';
    if (answeredQuestions === totalQuestions) return 'completed';
    return 'in-progress';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '⏳';
      default: return '○';
    }
  };

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) return 'bg-blue-600 text-white border-blue-600';
    
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-800 hover:bg-green-100 border-green-300';
      case 'in-progress': return 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="font-semibold text-gray-900 mb-4 text-center">Choose Any Section to Start Filling</h3>
      
      {/* Horizontal scrollable section grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-3 min-w-max">
          {sections.map((section, index) => {
            const status = getSectionCompletionStatus(section);
            const isCurrent = index === currentSectionIndex;
            const answeredQuestions = section.questions.filter(q => responses[q.id]?.trim()).length;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionSelect(index)}
                className={`flex-shrink-0 p-4 rounded-lg text-sm transition-colors border-2 min-w-[180px] ${getStatusColor(status, isCurrent)}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{getStatusIcon(status)}</div>
                  <div className={`font-medium mb-1 ${isCurrent ? 'text-white' : ''}`}>
                    {section.title}
                  </div>
                  <div className={`text-xs ${isCurrent ? 'text-blue-100' : 'text-gray-500'}`}>
                    {answeredQuestions}/{section.questions.length} questions
                  </div>
                  
                  {status === 'in-progress' && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCurrent ? 'bg-blue-300' : 'bg-yellow-500'
                        }`}
                        style={{ 
                          width: `${(answeredQuestions / section.questions.length) * 100}%` 
                        }}
                      />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t text-sm text-gray-600 text-center">
        <span className="font-medium">
          Total Progress: {Object.values(responses).filter(r => r?.trim()).length} / {sections.reduce((sum, s) => sum + s.questions.length, 0)} questions completed
        </span>
      </div>
    </div>
  );
}