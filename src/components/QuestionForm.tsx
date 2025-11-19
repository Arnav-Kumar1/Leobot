import React from 'react';
import type { Section, Responses } from '../types';
import { Card } from './ui/card';

interface QuestionFormProps {
  section: Section;
  responses: Responses;
  onResponseChange: (questionId: string, value: string) => void;
}

export default function QuestionForm({ section, responses, onResponseChange }: QuestionFormProps) {
  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
        <div className="text-sm text-gray-500">
          {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {section.questions.map((question, index) => {
        const currentResponse = responses[question.id] || '';
        const wordCount = getWordCount(currentResponse);
        const isAnswered = currentResponse.trim().length > 0;

        return (
          <Card key={question.id} className="p-6">
            <div className="space-y-4">
              {/* Question Header */}
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                  {index + 1}. {question.text}
                </h3>
                {isAnswered && (
                  <div className="flex-shrink-0 ml-4">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      ✓ Answered
                    </span>
                  </div>
                )}
              </div>

              {/* Hint */}
              {question.hint && (
                <p className="text-sm text-gray-600 italic">
                  💡 {question.hint}
                </p>
              )}

              {/* Examples */}
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {question.example_good && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="font-medium text-green-800 mb-1">✅ Good example:</div>
                    <div className="text-green-700">{question.example_good}</div>
                  </div>
                )}
                {question.example_bad && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="font-medium text-red-800 mb-1">❌ Avoid:</div>
                    <div className="text-red-700">{question.example_bad}</div>
                  </div>
                )}
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <textarea
                  value={currentResponse}
                  onChange={(e) => onResponseChange(question.id, e.target.value)}
                  placeholder="Share your thoughts here..."
                  className="w-full min-h-[120px] p-4 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
                
                {/* Word Count */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Recommended: 30-100 words</span>
                  <span className={`${wordCount < 30 ? 'text-orange-500' : wordCount > 100 ? 'text-red-500' : 'text-green-600'}`}>
                    {wordCount} word{wordCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}