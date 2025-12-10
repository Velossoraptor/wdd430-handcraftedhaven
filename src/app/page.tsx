import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import pool from "@/_lib/vendor/db";
import NavBar from "@/components/layout/NavBar";

interface Product {
  listing_id: string;
  product_name: string;
  price: number;
  product_image: string;
  category: string;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let query = "SELECT * FROM products";
  const params: any[] = [];
  const whereClauses: string[] = [];

  const querySearchParams = await searchParams;
  const searchQuery = querySearchParams.q as string;
  const category = querySearchParams.category as string;

  if (searchQuery) {
    const isNumeric = !isNaN(Number(searchQuery));

    if (isNumeric) {
      // If user enters a number, we search price + text
      whereClauses.push(`(price >= $${params.length + 1})`);

      params.push(Number(searchQuery)); // For numeric price search
    } else {
      // If user enters text only
      whereClauses.push(
        `(product_name ILIKE $${params.length + 1}
        OR description ILIKE $${params.length + 1})`
      );

      params.push(`%${searchQuery}%`);
    }
  }

  if (category) {
    whereClauses.push(`category = $${params.length + 1}`);
    params.push(category);
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  query += " ORDER BY created_at DESC";

  const retrieveData = await pool.query(query, params);
  const products: Product[] = retrieveData.rows;

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-amber-50 text-gray-900 pt-16 md:pt-0">
        <Hero />
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Explore Handcrafted Treasures
          </h2>
          <SearchBar />
          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>
      </main>
    </>
  );
}
