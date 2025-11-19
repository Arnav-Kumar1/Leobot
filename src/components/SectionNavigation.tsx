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
    if (isCurrent) return 'bg-blue-600 text-white';
    
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
      <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
      
      <nav className="space-y-2">
        {sections.map((section, index) => {
          const status = getSectionCompletionStatus(section);
          const isCurrent = index === currentSectionIndex;
          const answeredQuestions = section.questions.filter(q => responses[q.id]?.trim()).length;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionSelect(index)}
              className={`w-full text-left p-3 rounded-md text-sm transition-colors ${getStatusColor(status, isCurrent)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(status)}</span>
                  <span className={`font-medium ${isCurrent ? 'text-white' : ''}`}>
                    {section.title}
                  </span>
                </div>
                
                <div className={`text-xs ${isCurrent ? 'text-blue-100' : 'text-gray-500'}`}>
                  {answeredQuestions}/{section.questions.length}
                </div>
              </div>
              
              {!isCurrent && status === 'in-progress' && (
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(answeredQuestions / section.questions.length) * 100}%` 
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Total Progress:</span>
          <span>
            {Object.values(responses).filter(r => r?.trim()).length} / {sections.reduce((sum, s) => sum + s.questions.length, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}