import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase web config is public by design; access is controlled by Realtime
// Database security rules, not by hiding these values.
const firebaseConfig = {
  apiKey: 'AIzaSyDezStBQ7zwfGwmIfyxBIAT5SqKHg_xTqo',
  authDomain: 'myportfolio-b381e.firebaseapp.com',
  databaseURL: 'https://myportfolio-b381e-default-rtdb.firebaseio.com/',
  projectId: 'myportfolio-b381e',
  storageBucket: 'myportfolio-b381e.firebasestorage.app',
  messagingSenderId: '315710216774',
  appId: '1:315710216774:web:2af0f21cb1053d24684847',
  measurementId: 'G-P30QYV1SFQ',
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export default app;
