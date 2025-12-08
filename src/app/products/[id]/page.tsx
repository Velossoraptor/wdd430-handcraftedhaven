import pool from "@/_lib/vendor/db";
import ProductSummary from "@/components/productDetails/ProductSummary";
import ReviewSummary from "@/components/productDetails/reviewSummary";

// This function runs at build time to generate all possible [id] paths
export async function generateStaticParams() {
  // Fetch all product IDs from your database
  const { rows } = await pool.query("SELECT listing_id FROM products");
  return rows.map((product: { listing_id: string }) => ({
    id: product.listing_id,
  }));
}

// This is your page component
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const resolved = await params;
  const productId = resolved.id;
  // Fetch the specific product data
  const productRes = await pool.query(
    "SELECT p.*, u.fname, u.lname FROM products p LEFT JOIN users u ON u.id = p.account_id WHERE listing_id = $1",
    [productId]
  );

  if (!productRes.rows.length) {
    <p>Page not found.</p>;
  }

  const product = productRes.rows[0];

  return (
    <main className="min-h-screen bg-amber-50 text-gray-900">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {product.product_name || "Product Details"}
        </h2>
        <ProductSummary productInfo={product} sellerInfo={product} />
        <ReviewSummary />
      </section>
    </main>
  );
}
