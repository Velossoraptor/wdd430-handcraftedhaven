"use client";

import {
  useContext,
  createContext,
  useState,
   useEffect,
   ReactNode,
} from "react";
import React from "react";
import { toast } from "react-toastify";
import { getCartFromCookie, setCartCookie } from "@/_lib/buyer/cartCookie";

// -------------------------
// Cart Context
// -------------------------
const CartContext = createContext<CartContextType | undefined>(undefined);

// -------------------------
// Types
// -------------------------
export interface CartItem {
  listing_id: string;
  product_image: string;
  product_name: string;
  price: number;
  quantity: number;
}

type CartAddItem = Omit<CartItem, "quantity">;
type CartOpItem = { listing_id: string };

interface CartContextType {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  cartCount: number;
  loading: boolean;
  addToCart: (item: CartAddItem) => void;
  removeItem: (item: CartOpItem) => void;
  increaseQuantity: (item: CartOpItem) => void;
  decreaseQuantity: (item: CartOpItem) => void;
}

interface CartProviderProps {
  children: ReactNode;
}

async function getCart(): Promise<CartItem[]> {
  if (typeof window === "undefined") return [];
  try {
    return (await getCartFromCookie()) ?? [];
  } catch {
    return [];
  }
}

async function saveCart(cart: CartItem[]): Promise<void> {
  if (typeof window !== "undefined") {
    await setCartCookie(cart);
  }
}

function getCartCount(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

// -------------------------
// Cart Provider Component
// -------------------------
export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // Load cart from secure cookie
  // -------------------------
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const storedCart = await getCart();
        setCart(storedCart);
        setCartCount(getCartCount(storedCart));
      } catch {
        setCart([]);
        setCartCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // -------------------------
  // Sync across browser tabs
  // -------------------------
  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === "handcrafted-cart-session") {
        const storedCart = await getCart();
        setCart(storedCart);
        setCartCount(getCartCount(storedCart));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // -------------------------
  // Save cart to cookie when cart updates
  // -------------------------
  useEffect(() => {
    saveCart(cart);
    setCartCount(getCartCount(cart));
  }, [cart]);

  function mapAddItemToCartItem(item: CartAddItem): CartItem {
    return {
      ...item,
      quantity: 1,
    };
  }

  // -------------------------
  // Cart Actions
  // -------------------------
  const addToCart = (item: CartAddItem) => {
    // If already exists in cart, increase quantity instead
    const existing = cart.find((n) => n.listing_id === item.listing_id);
    if (existing) {
      increaseQuantity({ listing_id: item.listing_id });
      toast.success("Product added successfully");
      return;
    }
    const cartItem = mapAddItemToCartItem(item);
    setCart((prev) => [...prev, cartItem]);

    toast.success("Product added successfully");
  };

  const removeItem = (item: CartOpItem) => {
    setCart((prev) => prev.filter((n) => n.listing_id !== item.listing_id));

    toast.success("Product removed successfully");
  };

  const increaseQuantity = (item: CartOpItem) => {
    setCart((prev) => {
      const updated = prev.map((n) =>
        n.listing_id === item.listing_id
          ? { ...n, quantity: (n.quantity || 1) + 1 }
          : n
      );

      return updated;
    });
    toast.success("Item quantity updated");
  };

  const decreaseQuantity = (item: CartOpItem) => {
    setCart((prev) => {
      const existing = prev.find((n) => n.listing_id === item.listing_id);
      if (!existing) return prev;

      if (existing.quantity > 1) {
        const updated = prev.map((n) =>
          n.listing_id === item.listing_id
            ? { ...n, quantity: n.quantity - 1 }
            : n
        );

        return updated;
      } else {
        return prev.filter((n) => n.listing_id !== item.listing_id);
      }
    });
    toast.success("Item quantity updated");
  };

  return React.createElement(
    CartContext.Provider,
    {
      value: {
        cart,
        setCart,
        cartCount,
        loading,
        addToCart,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
      },
    },
    children
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
