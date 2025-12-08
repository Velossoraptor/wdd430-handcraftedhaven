import pool from "@/_lib/vendor/db";
import { verifySession } from "@/_lib/session";

export async function GET() {
   const session = await verifySession();
   if (!session || !session.id) {
      return Response.json({ status: 401 });
   }

   const { rows } = await pool.query(
     "SELECT COUNT(listing_id) AS total FROM products WHERE account_id = $1",
     [session.id]
   );

   return Response.json({ total: rows[0].total });
}
