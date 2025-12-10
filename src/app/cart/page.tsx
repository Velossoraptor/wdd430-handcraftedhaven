import { CartDetails } from "@/app/cart/components/CartPage";
import NavBar from "@/components/layout/NavBar";

export const metadata = {
  title: "Your Shopping Cart | Handcrafted Haven",
  description:
    "Review and manage your shopping cart. Update quantities or remove items before checkout.",
  keywords: ["cart", "shopping cart", "checkout", "handmade", "handcrafted"],
};

export default function CartPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto px-4 py-8">
        <CartDetails />
      </main>
    </>
  );
}
