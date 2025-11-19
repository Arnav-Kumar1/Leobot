export interface Question {
  id: string;
  text: string;
  hint: string;
  example_good: string;
  example_bad: string;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface Meta {
  title: string;
  description: string;
  settings: {
    show_progress_bar: boolean;
    allow_save_and_resume: boolean;
    collect_email: boolean;
  };
}

export interface QuestionsData {
  meta: Meta;
  sections: Section[];
}

export interface Responses {
  [questionId: string]: string;
}

export interface ExportData {
  timestamp: string;
  userEmail?: string;
  responses: Record<string, Array<{question: string, answer: string}>>;
  completionPercentage: number;
}