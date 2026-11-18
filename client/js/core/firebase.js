/**
 * ReadyCVs — firebase.js  (Shared Firebase config)
 */
import { initializeApp }  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth }        from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore }   from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage }     from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

export const firebaseConfig = {
  apiKey:            "AIzaSyCgK8JWEuilZmcMME9_LropW_2KUuQZItI",
  authDomain:        "airesumebuilder-f732a.firebaseapp.com",
  projectId:         "airesumebuilder-f732a",
  storageBucket:     "airesumebuilder-f732a.firebasestorage.app",
  messagingSenderId: "431208769883",
  appId:             "1:431208769883:web:53fe68f6e95d4f810c927e",
  measurementId:     "G-CEW4HM1K2Z"
};

const app       = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
