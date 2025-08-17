export type ViewType = 'diary' | 'stats' | 'gratitude' | 'settings';

export interface DiaryEntry {
    id: string;
    userId: string;
    date: string;
    content: string;
    tags: string[];
    emotion?: string;
    location?: string;
    aiFeedback?: AIFeedback;
}

export interface AIFeedback {
    id: string;
    content: string;
    generatedAt: string;
    tone: 'insightful' | 'supportive' | 'curious';
}

export interface User {
    id: string; // Corresponds to Firebase uid
    email: string;
    name?: string | null; // Corresponds to Firebase displayName
    picture?: string | null; // Corresponds to Firebase photoURL
}
