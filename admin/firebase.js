// admin/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDnOHPQ7ggf8PmFEMzpM9xPHChb02TItxk",
    authDomain: "gola-galaxy.firebaseapp.com",
    projectId: "gola-galaxy",
    storageBucket: "gola-galaxy.firebasestorage.app",
    messagingSenderId: "583080269044",
    appId: "1:583080269044:web:5b087ca34155bf3822faa1"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
