import { User, DiaryEntry } from '../types';
import { generateMockEntries } from '../constants';

const USERS_KEY = 'diary_users';
const ENTRIES_KEY = 'diary_entries';

// Helper to read from localStorage
const readDB = <T>(key: string): T[] => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error(`Failed to read from localStorage key "${key}"`, e);
        return [];
    }
};

// Helper to write to localStorage
const writeDB = <T>(key: string, data: T[]): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Failed to write to localStorage key "${key}"`, e);
    }
};


export const authService = {
    signUp: async (email: string, password: string): Promise<User> => {
        const users = readDB<User>(USERS_KEY);
        if (users.some(u => u.email === email)) {
            throw new Error('User with this email already exists.');
        }
        
        // In a real app, hash the password. Here we simulate it.
        const passwordHash = `hashed_${password}`;
        const newUser: User = {
            id: new Date().toISOString(),
            email,
            passwordHash
        };

        // Add user to db
        users.push(newUser);
        writeDB(USERS_KEY, users);

        // Generate and save initial entries for the new user
        const allEntries = readDB<DiaryEntry>(ENTRIES_KEY);
        const initialEntries = generateMockEntries(newUser.id);
        writeDB(ENTRIES_KEY, [...allEntries, ...initialEntries]);

        return newUser;
    },

    signIn: async (email: string, password: string): Promise<User> => {
        const users = readDB<User>(USERS_KEY);
        const user = users.find(u => u.email === email);
        
        // Simulate password check
        const passwordHash = `hashed_${password}`;
        if (!user || user.passwordHash !== passwordHash) {
            throw new Error('Invalid email or password.');
        }
        return user;
    },
    
    // In this localStorage model, logout is handled client-side by clearing state.
    signOut: async (): Promise<void> => {
        return Promise.resolve();
    },

    resetPassword: async (email: string): Promise<void> => {
        const users = readDB<User>(USERS_KEY);
        if (!users.some(u => u.email === email)) {
            // Don't reveal if user exists for security, but for this app it's fine.
            throw new Error('User not found.');
        }
        // Simulate sending a reset email
        console.log(`Password reset link sent to ${email} (simulation).`);
        alert(`A password reset link has been sent to ${email} (simulation).`);
    },

    getEntriesForUser: (userId: string): DiaryEntry[] => {
        const allEntries = readDB<DiaryEntry>(ENTRIES_KEY);
        return allEntries.filter(entry => entry.userId === userId);
    },

    saveEntriesForUser: (userId: string, userEntries: DiaryEntry[]): void => {
        const allEntries = readDB<DiaryEntry>(ENTRIES_KEY);
        // Remove old entries for this user, then add the updated list
        const otherUsersEntries = allEntries.filter(entry => entry.userId !== userId);
        const updatedAllEntries = [...otherUsersEntries, ...userEntries];
        writeDB(ENTRIES_KEY, updatedAllEntries);
    }
};
