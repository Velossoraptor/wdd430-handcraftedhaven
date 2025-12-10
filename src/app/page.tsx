import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import Link from "next/link";
import pool from "@/_lib/vendor/db";

export default async function HomePage() {
  // Query the database and return products
  const retrieveData = await pool.query("SELECT * FROM products");
  if (!retrieveData.rows.length) {
    // If no products found, you might want to show an empty state
    return (
      <main className="min-h-screen bg-amber-50 text-gray-900 pt-16 md:pt-0">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold">No products found</h1>
        </div>
      </main>
    );
  }
  const products = retrieveData.rows;

  return (
    // add mobile nav (visible on small screens) and pad main on mobile to avoid overlap
    <main className="min-h-screen bg-amber-50 text-gray-900 pt-16 md:pt-0">
      <Hero />
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Explore Handcrafted Treasures
        </h2>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
