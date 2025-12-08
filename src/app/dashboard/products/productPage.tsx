// src/app/dashboard/products/productPage.tsx
"use client";

import { ReactElement } from "react";
import { useRouter } from "next/navigation";

type IconName = "PlusCircle" | "Edit" | "Trash2" | "Package";

// --- Icon SVGs (Inline to avoid lucide-react dependency issues) ---
const Icon = ({
  name,
  className = "w-5 h-5",
}: {
  name: IconName;
  className?: string;
}) => {
  // Using ReactElement type explicitly to resolve JSX namespace issue
  const icons: Record<IconName, ReactElement> = {
    PlusCircle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
    Edit: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3a2.85 2.85 0 1 1 4 4L14.7 17.3 10 22l-5-5 5.3-5.3L17 3z" />
      </svg>
    ),
    Trash2: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
      </svg>
    ),
    Package: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m7.5 4.27 9 5.15" />
        <path d="m21 12-9 5.15L3 12" />
        <path d="M3.29 7.37 12 12.5l8.71-5.13" />
        <path d="M12 22V12.5" />
      </svg>
    ),
  };
  return <span className={className}>{icons[name]}</span>;
};

export interface Product {
  listing_id: string;
  product_name: string;
  category: string;
  price: number;
  stock: number;
}

interface ProductTableBodyProps {
  products: Product[];
}

export function ProductTableBody({ products }: ProductTableBodyProps) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/dashboard/products/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/dashboard/products/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Refresh the page to show updated list
          router.refresh();
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product");
      }
    }
  };

  const handleNewListing = () => {
    router.push("/dashboard/products/new");
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen font-sans">
      {/* Header and Actions */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-amber-100">
        <h1 className="text-2xl md:text-3xl font-extrabold text-amber-900 flex items-center mb-4 sm:mb-0">
          <Icon
            name="Package"
            className="w-7 h-7 md:w-8 md:h-8 mr-3 text-amber-600"
          />
          My Product Listings
        </h1>

        <button
          onClick={handleNewListing}
          className="cursor-pointer flex items-center bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
        >
          <Icon name="PlusCircle" className="w-5 h-5 mr-2" />
          New Listing
        </button>
      </header>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product.listing_id}
                  className="hover:bg-amber-50 transition duration-100"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                    ${product.price}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                      product.stock <= 5 ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(product.listing_id)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Edit ${product.product_name}`}
                    >
                      <Icon name="Edit" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.listing_id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete ${product.product_name}`}
                    >
                      <Icon name="Trash2" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t text-sm text-gray-600 flex justify-between items-center bg-white">
          <p>Total Products: {products.length}</p>
          <p>Showing {products.length} results</p>
        </div>
      </div>
    </div>
  );
}
