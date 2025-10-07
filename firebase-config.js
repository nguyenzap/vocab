// Replace the placeholder values with your Firebase project configuration.
// Find these in Firebase console under Project settings > General > Your apps.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAXKROCac-S4vbGBt9ZUCELhjLbdRTZKfU",
  authDomain: "vocab-app-e5dff.firebaseapp.com",
  projectId: "vocab-app-e5dff",
  storageBucket: "vocab-app-e5dff.firebasestorage.app",
  messagingSenderId: "932424467289",
  appId: "1:932424467289:web:ef0d4f2798bfc560718248"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { firebaseConfig };
