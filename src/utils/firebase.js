import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const defaultFirebaseConfig = {
    apiKey: "AIzaSyAYv3FeLwn_xryBt2jFlPNkVns4id3brqs",
    authDomain: "kindergarten-ai-teacher-2025.firebaseapp.com",
    projectId: "kindergarten-ai-teacher-2025",
    storageBucket: "kindergarten-ai-teacher-2025.firebasestorage.app",
    messagingSenderId: "285297666982",
    appId: "1:285297666982:web:d9daf5a0204d5e89cd7d67"
};

// Check for user-provided config override
const savedConfig = localStorage.getItem('firebase_config_override');
const firebaseConfig = savedConfig ? JSON.parse(savedConfig) : defaultFirebaseConfig;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// export const loginWithMock = ... (Removed for Real Login Enforcement)

export const loginWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Error signing in with Google", error);
        if (error.code === 'auth/unauthorized-domain') {
            alert(`도메인 승인 오류: 현재 실행 중인 도메인(${window.location.hostname})이 Firebase Console의 승인된 도메인 목록에 없습니다.\nFirebase Authentication > Settings > Authorized domains 에 추가해주세요.`);
        } else if (error.code === 'auth/popup-closed-by-user') {
            // User closed popup, ignore
        } else {
            alert(`로그인 오류: ${error.message} (${error.code})`);
        }
        throw error;
    }
};

export const getGoogleResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        return result?.user;
    } catch (error) {
        console.error("Error getting redirect result", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
};
