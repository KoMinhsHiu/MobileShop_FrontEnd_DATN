import React, { useEffect } from "react";
import Footer from "@/component/footer";
import Header from "@/component/header";
import ChatbotPopup from "@/component/chatbot/ChatbotPopup";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Raleway } from "next/font/google";
import NavigationBar from "@/component/navigationBar";
import { CartProvider } from "@/context/cartContext";
import { MegaMenuProvider } from "@/context/menuContext";
import { AuthProvider } from "@/context/authContext";
import { AdminProvider } from "@/context/adminContext";
import { Toaster } from "react-hot-toast";
import "./../../i18n";
import { useRouter } from "next/router";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { queryClient } from "@/const/queryClient";
import "@/lib/fontawesome";

const inter = Raleway({ subsets: ["latin"] });

type ComponentWithPageLayout = AppProps["Component"] & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: ComponentWithPageLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, [router]);

  // Use the page layout if it exists, otherwise use default layout
  const getLayout = Component.getLayout ?? ((page) => {
    // Check if it's an admin page - just return the page since AdminProvider is already global
    if (router.pathname.startsWith('/admin')) {
      return page;
    }
    
    // Check if it's the products page - don't wrap in container
    if (router.pathname === '/products') {
      return (
        <main className={inter.className}>
          <Header />
          {page}
          <NavigationBar />
          <Footer />
          <ChatbotPopup />
        </main>
      );
    }
    
    return (
      <main className={inter.className}>
        <Header />
        <div className="container">
          {page}
        </div>
        <NavigationBar />
        <Footer />
        <ChatbotPopup />
      </main>
    );
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary>
          <AuthProvider>
            <AdminProvider>
              <CartProvider>
                <MegaMenuProvider
                  initialMenu={pageProps.menu || []}
                  language={router.locale}
                >
                <div className={inter.className}>
                  <Toaster />
                  {getLayout(<Component {...pageProps} />)}
                </div>
                </MegaMenuProvider>
              </CartProvider>
            </AdminProvider>
          </AuthProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
}
