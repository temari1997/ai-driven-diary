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

declare global {
    const __APP_VERSION__: string;
}
