import { useMemo } from 'react';
import type { Responses, Section } from '../types';

export function useProgress(sections: Section[], responses: Responses) {
  const progress = useMemo(() => {
    const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.values(responses).filter(response => response?.trim()).length;
    
    return {
      totalQuestions,
      answeredQuestions,
      percentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
      completedSections: sections.filter(section => 
        section.questions.every(question => responses[question.id]?.trim())
      ).length,
      totalSections: sections.length
    };
  }, [sections, responses]);

  const getSectionProgress = (section: Section) => {
    const answeredInSection = section.questions.filter(question => responses[question.id]?.trim()).length;
    return {
      answered: answeredInSection,
      total: section.questions.length,
      percentage: Math.round((answeredInSection / section.questions.length) * 100)
    };
  };

  const isComplete = progress.percentage === 100;
  
  return {
    ...progress,
    isComplete,
    getSectionProgress
  };
}