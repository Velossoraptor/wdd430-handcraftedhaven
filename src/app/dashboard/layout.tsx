"use client";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedInUser, setLoggedInUser] = useState<string | undefined>(
    undefined
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu on route change (good for mobile UX)
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setLoggedInUser(data?.fname || undefined);
        } else {
          setLoggedInUser(undefined);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setLoggedInUser(undefined);
      }
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (response.ok) {
        setLoggedInUser(undefined);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const navLinks = [
    { label: "Overview", href: "/dashboard" },
    { label: "Products", href: "/dashboard/products" },
    { label: "Orders", href: "/dashboard/orders" },
    { label: "Reviews", href: "/dashboard/reviews" },
    { label: "Profile", href: "/dashboard/profile" },
    { label: "Billing", href: "/dashboard/billing" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Toggle (Visible only on small screens) */}
      <button
        aria-label="Toggle menu"
        onClick={handleMenuClick}
        className="fixed right-4 top-4 z-50 lg:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        {menuOpen ? (
          <X className="w-6 h-6 text-amber-700 dark:text-amber-400" />
        ) : (
          <Menu className="w-6 h-6 text-amber-700 dark:text-amber-400" />
        )}
      </button>

      {/* Sidebar Panel - Fixed on all screens */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          w-64 transform transition-all duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-white dark:bg-gray-800 shadow-xl
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Branding */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-amber-700 dark:text-amber-400">
              Handcrafted Haven
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                  ${
                    pathname === link.href
                      ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            {loggedInUser ? (
              <div className="space-y-3">
                <div className="px-3 py-2">
                  <p className="text-sm text-zinc-500">Signed in as</p>
                  <p className="text-sm font-medium text-zinc-900">
                    {loggedInUser}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                  }}
                  className="block cursor-pointer w-full bg-zinc-200 text-zinc-700 px-3 py-2 rounded-md text-center hover:bg-zinc-300 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              ""
            )}
          </nav>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`
          flex-1 w-full min-h-screen transition-all duration-300
          ${menuOpen ? "ml-64" : "lg:ml-64"}
          p-4 sm:p-6 md:p-8
        `}
      >
        {children}
      </main>
    </div>
  );
}
