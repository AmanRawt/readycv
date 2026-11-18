// firebaseAuth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// 🔑 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCgK8JWEuilZmcMME9_LropW_2KUuQZItI",
  authDomain: "airesumebuilder-f732a.firebaseapp.com",
  projectId: "airesumebuilder-f732a",
  storageBucket: "airesumebuilder-f732a.firebasestorage.app",
  messagingSenderId: "431208769883",
  appId: "1:431208769883:web:53fe68f6e95d4f810c927e"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// =======================
// ✅ SIGNUP
// =======================
export async function signup(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", userCredential.user);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}


// =======================
// ✅ LOGIN
// =======================
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}


// =======================
// ✅ LOGOUT
// =======================
export async function logout() {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error(error);
  }
}