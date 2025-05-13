import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPFZLmcN7keGsga7R_IyXCqFlAvX-y7aA",
  authDomain: "food-track-dc8b3.firebaseapp.com",
  projectId: "food-track-dc8b3",
  storageBucket: "food-track-dc8b3.firebasestorage.app",
  messagingSenderId: "499356727647",
  appId: "1:499356727647:web:a558712600e907716c9eea",
  measurementId: "G-X4EMFQ2PYE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };