'use client';

import { useEffect, useState } from 'react';
import questionsData from '../data/questions.json';
import QuestionForm from '../components/QuestionForm';
import ProgressBar from '../components/ProgressBar';
import SectionNavigation from '../components/SectionNavigation';
import AutoSave from '../components/AutoSave';
import ExportDialog from '../components/ExportDialog';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAutoSave } from '../hooks/useAutoSave';
import type { Responses } from '../types';

export default function Page() {
  const [responses, setResponses] = useLocalStorage<Responses>('mindclone-responses', {});
  const [currentSectionIndex, setCurrentSectionIndex] = useLocalStorage<number>('mindclone-current-section', 0);
  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useLocalStorage<string>('mindclone-email', '');
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const sections = questionsData.sections;
  const currentSection = sections[currentSectionIndex];

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Auto-save functionality
  useAutoSave(responses, 10000); // Save every 10 seconds

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleSectionJump = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
  };

  const handleExport = async () => {
    setIsSaving(true);
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        userEmail,
        responses: formatResponsesForExport(responses),
        completionPercentage: calculateCompletionPercentage()
      };
      
      // Save to API
      await fetch('/api/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportData)
      });
      
      setExportDialogOpen(true);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatResponsesForExport = (responses: Responses) => {
    const formatted: Record<string, Array<{question: string, answer: string}>> = {};
    
    sections.forEach(section => {
      formatted[section.title] = section.questions.map(question => ({
        question: question.text,
        answer: responses[question.id] || ''
      }));
    });
    
    return formatted;
  };

  const calculateCompletionPercentage = () => {
    if (!isHydrated) return 0; // Return 0 during SSR
    const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.values(responses).filter(response => response?.trim()).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const isLastSection = currentSectionIndex === sections.length - 1;
  const completionPercentage = calculateCompletionPercentage();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {questionsData.meta.title}
          </h1>
          <p className="text-gray-600 whitespace-pre-line">
            {questionsData.meta.description}
          </p>
        </div>

        {/* Email Collection */}
        {questionsData.meta.settings.collect_email && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional - for saving progress)
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
        )}

        {/* Progress Bar */}
        {questionsData.meta.settings.show_progress_bar && isHydrated && (
          <ProgressBar 
            currentSectionIndex={currentSectionIndex} 
            totalSections={sections.length}
            completionPercentage={completionPercentage}
          />
        )}

        {/* Horizontal Section Navigation */}
        {isHydrated && (
          <SectionNavigation
            sections={sections}
            currentSectionIndex={currentSectionIndex}
            onSectionSelect={handleSectionJump}
            responses={responses}
          />
        )}

        {/* Main Content */}
        <div className="mt-6">
          {isHydrated && (
            <QuestionForm
              section={currentSection}
              responses={responses}
              onResponseChange={handleResponseChange}
            />
          )}

          {/* Navigation Buttons */}
          {isHydrated && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <button
                onClick={handlePreviousSection}
                disabled={currentSectionIndex === 0}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous Section
              </button>

              <div className="text-sm text-gray-500 text-center">
                <div>Section {currentSectionIndex + 1} of {sections.length}</div>
                <div className="text-xs mt-1">{currentSection.title}</div>
              </div>

              {currentSectionIndex === sections.length - 1 ? (
                <button
                  onClick={handleExport}
                  disabled={isSaving}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Complete & Export'}
                </button>
              ) : (
                <button
                  onClick={handleNextSection}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next Section →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Auto-save indicator */}
        <AutoSave responses={responses} />

        {/* Auto-save indicator */}
        {isHydrated && <AutoSave responses={responses} />}

        {/* Export Dialog */}
        {isHydrated && (
          <ExportDialog
            isOpen={isExportDialogOpen}
            onClose={() => setExportDialogOpen(false)}
            responses={responses}
            userEmail={userEmail}
          />
        )}
      </div>
    </div>
  );
}