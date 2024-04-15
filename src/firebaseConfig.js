import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBMLqEwIUeZnR5oqoimQuqfjnNbRr-zcpw",
  authDomain: "mydiary-c4b0a.firebaseapp.com",
  projectId: "mydiary-c4b0a",
  storageBucket: "mydiary-c4b0a.appspot.com",
  messagingSenderId: "344909575683",
  appId: "1:344909575683:web:6cfaf263f898935071c036"
};

const app = initializeApp(firebaseConfig);
export const db =getFirestore(app);