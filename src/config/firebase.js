import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase yapılandırmanızı buraya ekleyin
// Firebase Console'dan (https://console.firebase.google.com) alacağınız config bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyDezStBQ7zwfGwmIfyxBIAT5SqKHg_xTqo",
  authDomain: "myportfolio-b381e.firebaseapp.com",
  databaseURL: "https://myportfolio-b381e-default-rtdb.firebaseio.com/",
  projectId: "myportfolio-b381e",
  storageBucket: "myportfolio-b381e.firebasestorage.app",
  messagingSenderId: "315710216774",
  appId: "1:315710216774:web:2af0f21cb1053d24684847",
  measurementId: "G-P30QYV1SFQ"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Realtime Database referansını al
export const database = getDatabase(app);
export default app;

