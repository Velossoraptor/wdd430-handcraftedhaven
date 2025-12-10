// src/components/SearchBar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface Category {
  value: string;
  label: string;
}

const categories: Category[] = [
  { value: "Jewelry", label: "Jewelry" },
  { value: "Woodwork", label: "Woodwork" },
  { value: "Textiles", label: "Textiles" },
  { value: "Pottery", label: "Pottery" },
];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    router.push("/");
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full md:w-64 pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
          >
            Search
          </button>
        </div>
        {(searchQuery || selectedCategory) && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">Filters:</span>
            {searchQuery && (
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full mr-2 flex items-center">
                {searchQuery}
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    handleSearch(new Event("submit") as any);
                  }}
                  className="ml-1 text-amber-600 hover:text-amber-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex items-center">
                {categories.find((c) => c.value === selectedCategory)?.label}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("");
                    handleSearch(new Event("submit") as any);
                  }}
                  className="ml-1 text-amber-600 hover:text-amber-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {(searchQuery || selectedCategory) && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-2 text-amber-600 hover:text-amber-800 text-sm"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
