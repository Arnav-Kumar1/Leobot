import React, { useState } from 'react';
import type { Responses } from '../types';
import questionsData from '../data/questions.json';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  responses: Responses;
}

export default function ExportDialog({ isOpen, onClose, responses }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Helper function to find question details from questions data
  const findQuestionById = (questionId: string) => {
    for (const section of questionsData.sections) {
      for (const question of section.questions) {
        if (question.id === questionId) {
          return {
            question: question.text,
            section: section.title
          };
        }
      }
    }
    return {
      question: questionId.replace(/_/g, ' ').replace(/^q_/, ''),
      section: 'Unknown'
    };
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Calculate total questions from questionsData
      const totalQuestionsInSurvey = questionsData.sections.reduce((sum, section) => sum + section.questions.length, 0);
      const answeredQuestions = Object.values(responses).filter(r => r?.trim()).length;
      
      // Clean export data for mindclone training
      const exportData = {
        timestamp: new Date().toISOString(),
        totalResponses: answeredQuestions,
        completionRate: `${Math.round((answeredQuestions / totalQuestionsInSurvey) * 100)}%`,
        
        // Clean Q&A pairs for AI training
        trainingData: Object.entries(responses)
          .filter(([_, answer]) => answer?.trim())
          .map(([questionId, answer]) => {
            const questionData = findQuestionById(questionId);
            return {
              question: questionData?.question || questionId,
              answer: answer.trim(),
              section: questionData?.section || 'General'
            };
          }),
          
        // Raw data (for reference)
        rawResponses: responses,
          
        metadata: {
          exportedAt: new Date().toISOString(),
          version: '3.0',
          source: 'Mindclone Data Intake',
          purpose: 'AI Personality Clone Training Data'
        }
      };
      
      // Create and download JSON file
      const jsonData = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindclone-responses-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Also try to save to server
      try {
        await fetch('/api/export-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exportData)
        });
      } catch (serverError) {
        console.log('Server save failed, but local download succeeded');
      }

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };



  if (!isOpen) return null;

  const totalQuestions = questionsData.sections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = Object.values(responses).filter(r => r?.trim()).length;
  const completionRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            Export Your Responses
          </h2>
          
          <p className="text-center text-gray-600 mb-6">
            Download your responses and email the JSON file to arnav9637@gmail.com
          </p>

          {/* Stats */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{answeredQuestions}</div>
                <div className="text-sm text-gray-600">Responses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>



          {/* Email Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-blue-800">Next Step:</span>
            </div>
            <p className="text-blue-700 text-sm">
              After downloading, please email the JSON file to: <span className="font-mono bg-blue-100 px-1 rounded">arnav9637@gmail.com</span>
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Close
            </button>
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download JSON
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}