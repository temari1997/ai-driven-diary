import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged as onFirebaseAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from './firebaseService';
import {
    collection,
    query,
    where,
    getDocs,
    writeBatch,
    doc
} from 'firebase/firestore';
import { User, DiaryEntry } from '../types';

// --- New Firebase Auth Functions ---

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
    id: firebaseUser.uid, // Use Firebase UID
    email: firebaseUser.email!,
    name: firebaseUser.displayName,
    picture: firebaseUser.photoURL,
});

export const authService = {
    signUpWithEmail: async (email: string, password: string): Promise<User> => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = mapFirebaseUser(userCredential.user);
        // TODO: Migrate or handle initial entries for new Firebase users
        return user;
    },

    signInWithEmail: async (email: string, password: string): Promise<User> => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return mapFirebaseUser(userCredential.user);
    },

    signInWithGoogle: async (): Promise<User> => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        return mapFirebaseUser(userCredential.user);
    },

    signOutUser: async (): Promise<void> => {
        await signOut(auth);
    },

    resetPassword: async (email: string): Promise<void> => {
        await sendPasswordResetEmail(auth, email);
        alert(`A password reset link has been sent to ${email}.`);
    },

    onAuthStateChanged: (callback: (user: User | null) => void) => {
        return onFirebaseAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const user = mapFirebaseUser(firebaseUser);
                callback(user);
            } else {
                callback(null);
            }
        });
    },

    // --- Firestore Entry Functions ---

    getEntriesForUser: async (userId: string): Promise<DiaryEntry[]> => {
        const entriesCol = collection(db, 'users', userId, 'entries');
        const q = query(entriesCol);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as DiaryEntry);
    },

    saveEntriesForUser: async (userId: string, userEntries: DiaryEntry[]): Promise<void> => {
        const batch = writeBatch(db);
        const userEntriesCollection = collection(db, 'users', userId, 'entries');

        // First, get existing entries to determine which to delete
        const querySnapshot = await getDocs(userEntriesCollection);
        const existingIds = new Set(querySnapshot.docs.map(d => d.id));
        const newIds = new Set(userEntries.map(e => e.id));

        // Delete entries that are no longer in the userEntries array
        existingIds.forEach(id => {
            if (!newIds.has(id)) {
                batch.delete(doc(db, 'users', userId, 'entries', id));
            }
        });

        // Add or update entries
        userEntries.forEach(entry => {
            const entryRef = doc(db, 'users', userId, 'entries', entry.id);
            batch.set(entryRef, entry);
        });

        await batch.commit();
    }
};
