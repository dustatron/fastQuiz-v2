import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Navbar from "../components/Navbar";

function MainApp({ Component, pageProps }: AppProps) {
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const firestoreDB = getFirestore(app);
  const queryClient = new QueryClient();
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Component {...pageProps} firestore={firestoreDB} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MainApp;
