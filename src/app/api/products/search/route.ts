// src/app/api/products/search/route.ts
import { NextResponse } from "next/server";
import pool from "@/_lib/vendor/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  try {
    let sql = `
      SELECT 
        listing_id,
        product_name,
        price,
        product_image,
        category
      FROM products
      WHERE 1=1
    `;
    const params: any[] = [];

    if (query) {
      sql += ` AND 
        product_name LIKE $${params.length + 1}
        OR price LIKE $${params.length + 1}
      `;
      params.push(`%${query}%`);
    }

    if (category) {
      sql += ` AND category = $${params.length + 1}`;
      params.push(category);
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await pool.query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
