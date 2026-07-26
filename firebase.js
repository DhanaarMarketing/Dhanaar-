import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdkGge9jBCnLXZuWiXfeK7dubQDrEpvII",
  authDomain: "dhanaar-marketing.firebaseapp.com",
  databaseURL: "https://dhanaar-marketing-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dhanaar-marketing",
  storageBucket: "dhanaar-marketing.firebasestorage.app",
  messagingSenderId: "253662898503",
  appId: "1:253662898503:web:560c93941c47fb5eba8462",
  measurementId: "G-DSGVXKSXVE"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

signInAnonymously(auth)
  .then(() => {
    console.log("Anonymous Login Success");
  })
  .catch((error) => {
    console.error(error);
  });

export { auth, db };
