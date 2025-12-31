import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export function useTemplates(user) {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.uid) {
            setTemplates([]);
            setLoading(false);
            return;
        }

        // Skip Firestore for guest users
        if (user.uid.startsWith('guest-') || user.uid.startsWith('google-fallback-') || user.uid.startsWith('naver:')) {
            setTemplates([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "templates"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedTemplates = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setTemplates(loadedTemplates);
            setLoading(false);
        }, (error) => {
            console.error("Firestore Error (Templates):", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addTemplate = async (templateData) => {
        if (!user) return;
        try {
            await addDoc(collection(db, "templates"), {
                ...templateData,
                userId: user.uid,
                createdAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error adding template:", error);
            return false;
        }
    };

    const updateTemplate = async (id, templateData) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, "templates", id), {
                ...templateData,
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error updating template:", error);
            return false;
        }
    };

    const deleteTemplate = async (id) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "templates", id));
            return true;
        } catch (error) {
            console.error("Error deleting template:", error);
            return false;
        }
    };

    return { templates, loading, addTemplate, updateTemplate, deleteTemplate };
}
