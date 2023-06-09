import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Navbar from "../components/Navbar";
import AlertCenter from "../components/AlertCenter";

function MainApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <AlertCenter />
        <Component {...pageProps} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MainApp;
