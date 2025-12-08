"use client";

import { useEffect, useState } from "react";
// REMOVED: import DashboardLayout from '@/app/layout/DashboardLayout';
import SellerStats from "@/components/dashboard/SellerStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentOrders from "@/components/dashboard/RecentOrders";
import ProfileSummary from "@/components/dashboard/ProfileSummary";

// --- Initial Data ---
const initialSellerData = {
  activeListings: 0, // Will be updated from API
  pendingOrders: 0,
  totalSales: 0,
  averageRating: 0,
};

async function fetchTotalListedProducts() {
  try {
    const response = await fetch("/api/total-listed-products");
    if (!response.ok) {
      throw new Error("Failed to fetch total listed products");
    }
    const data = await response.json();
    return data.total || 0;
  } catch (error) {
    console.error("Error fetching total listed products:", error);
    return 0;
  }
}

export default function DashboardPage() {
  const [sellerData, setSellerData] = useState(initialSellerData);

  useEffect(() => {
    // Fetch total listed products when component mounts
    const fetchData = async () => {
      const totalListings = await fetchTotalListedProducts();
      setSellerData((prevData) => ({
        ...prevData,
        activeListings: Number(totalListings),
      }));
    };

    fetchData();
  }, []);
  return (
    // REMOVED: <DashboardLayout> wrapper.
    // The DashboardLayout from the Canvas already wraps this component.
    <div className="p-6 md:p-10 space-y-8 bg-gray-50 rounded-xl min-h-full">
      <header>
        <h1 className="text-3xl font-extrabold text-amber-900 mb-2">
          Artisan Workshop Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here is a summary of your shops performance.
        </p>
      </header>

      {/* 🏆 Section 1: Key Metrics and Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seller Performance Metrics (Takes 2/3 width) */}
        <div className="lg:col-span-2">
          {/* Assuming SellerStats is a component you have */}
          <SellerStats data={sellerData} />
        </div>

        {/* Quick Actions (Takes 1/3 width) */}
        <div className="lg:col-span-1">
          {/* Assuming QuickActions is a component you have */}
          <QuickActions />
        </div>
      </div>

      {/* 🛠️ Section 2: Management & Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📦 Recent Orders (Takes 2/3 width) */}
        <div className="lg:col-span-2">
          {/* Assuming RecentOrders is a component you have */}
          <RecentOrders />
        </div>

        {/* 👤 Profile/Reviews Summary (Takes 1/3 width) */}
        <div className="lg:col-span-1">
          {/* Assuming ProfileSummary is a component you have */}
          <ProfileSummary />
        </div>
      </div>
    </div>
    // REMOVED: </DashboardLayout>
  );
}
