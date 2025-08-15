
export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  tags: string[];
  emotion?: 'happy' | 'sad' | 'angry' | 'calm' | 'excited';
  location?: string;
  photos?: string[];
  tasksCompleted?: number;
  aiFeedback?: AIFeedback;
}

export interface AIFeedback {
  id: string;
  content: string;
  generatedAt: string;
  tone: 'empathetic' | 'insightful' | 'encouraging';
}

export interface Gratitude {
  id: string;
  author: 'user' | 'partner';
  content: string;
  date: string;
}

export type ViewType = 'diary' | 'gratitude' | 'stats' | 'settings';
   