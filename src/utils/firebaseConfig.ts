import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCpR_WqSfe8yvX8bAEAIVw_tWuiT4Oi8Eo",
  authDomain: "trivia-game-e5783.firebaseapp.com",
  databaseURL: "https://trivia-game-e5783-default-rtdb.firebaseio.com",
  projectId: "trivia-game-e5783",
  storageBucket: "trivia-game-e5783.appspot.com",
  messagingSenderId: "691408243393",
  appId: "1:691408243393:web:984c6e2f3a1f3c1d5de240",
  measurementId: "G-316XKN8TRJ",
};

export const app = initializeApp(firebaseConfig);
export const firestoreDB = getFirestore(app);