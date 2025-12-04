import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import { CartProvider } from "@/components/context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "@/app/api/auth/[...nextauth]/route"; 
import SessionProviderWrapper from "@/components/providers/sessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "Seller dashboard and artisan marketplace.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get session on the server using your existing auth function
  const session = await auth();
  
  // Extract user ID from session if available for CartProvider context
  const buyerId = session?.user?.id || null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        {/* Client component wrapper for SessionProvider */}
        <SessionProviderWrapper session={session}>
          <CartProvider buyerId={buyerId}>
            <NavBar />
            <main>
              {children}
              <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </main>
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}