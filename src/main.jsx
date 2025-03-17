import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@radix-ui/themes/styles.css";
import "./index.css";
import { Theme } from "@radix-ui/themes";
import App from "./App";
import { config } from "./config/wallet-connection/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { AppProvider } from "./contexts/appContext";
import { BrowserRouter, Routes, Route } from "react-router";
import Profile from "./pages/Profile";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

let queryClient;

const getQueryClient = () => {
  if (!queryClient) {
    queryClient = new QueryClient();
  }

  return queryClient;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
        
        <Theme>
        <WagmiProvider config={config}>
          <QueryClientProvider client={getQueryClient()}>
            <AppProvider>
            <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
            <Routes>

            <Route path="/" element={<App />} />
            <Route path="/profile" element={<Profile />} />
            </Routes>     

              {/* <App /> */}
            </AppProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </Theme>
    </BrowserRouter>
  </StrictMode>
);
