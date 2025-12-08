import { ProductTableBody } from "./productPage";
import pool from "@/_lib/vendor/db";
import { verifySession } from "@/_lib/session";
import { redirect } from "next/navigation";
import { Product } from "./productPage";

export async function fetchProducts(): Promise<Product[]> {
  const session = await verifySession();
  if (!session?.id) {
    // Redirect to login if not authenticated
    redirect("/login");
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        listing_id,
        product_name,
        category,
        price,
        stock
      FROM products WHERE account_id = $1
      ORDER BY created_at DESC
    `,
      [session.id]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array on error to prevent type issues
    return [];
  }
}

export default async function Page() {
  const products = await fetchProducts();

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen font-sans">
      {products.length > 0 ? (
        <ProductTableBody products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found</p>
        </div>
      )}
    </div>
  );
}
