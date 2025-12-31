import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export function useFirestore(user) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.uid) {
            setRecords([]);
            setLoading(false);
            return;
        }

        // Skip Firestore for guest users
        if (user.uid.startsWith('guest-') || user.uid.startsWith('google-fallback-')) {
            setRecords([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "records"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedRecords = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setRecords(loadedRecords);
            setLoading(false);
        }, (error) => {
            console.error("Firestore Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const saveRecord = async (recordData) => {
        if (!user) return;
        try {
            await addDoc(collection(db, "records"), {
                ...recordData,
                userId: user.uid,
                createdAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error saving record:", error);
            return false;
        }
    };

    const deleteRecord = async (id) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "records", id));
            return true;
        } catch (error) {
            console.error("Error deleting record:", error);
            return false;
        }
    };

    const migrateLocalData = async (localRecords) => {
        if (!user || !localRecords.length) return;

        let migratedCount = 0;
        for (const record of localRecords) {
            // Simple duplicate check could be added here
            try {
                await addDoc(collection(db, "records"), {
                    ...record,
                    userId: user.uid,
                    createdAt: serverTimestamp(),
                    migrated: true
                });
                migratedCount++;
            } catch (e) {
                console.error("Migration failed for record", record, e);
            }
        }
        return migratedCount;
    };

    return { records, loading, saveRecord, deleteRecord, migrateLocalData };
}
