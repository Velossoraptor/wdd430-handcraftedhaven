import pool from '@/_lib/vendor/db';

// Get user by email
export async function getUserByEmail(email: string) {
	const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
		email,
	]);
	return rows[0] || null;
}

// Create user
export async function createUser(
	fname: string,
	lname: string,
	email: string,
	account_type: string,
	password_hash: string
) {
	const { rows } = await pool.query(
		`INSERT INTO users (fname, lname, email, account_type, pword) 
     VALUES ($1, $2, $3, $4, $5 ) RETURNING *`,
		[fname, lname, email, account_type, password_hash]
	);
	return rows[0] || null;
}

export async function addReview(
	listing_id: string,
	customer_id: string,
	rating: number,
	feedback: string
) {
	const createdAtDate = new Date();
	const { rows } = await pool.query(
		`
      INSERT INTO reviews 
      (listing_id, customer_id, rating, feedback, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      ON CONFLICT (listing_id, customer_id)
      DO UPDATE SET
         rating = EXCLUDED.rating,
         feedback = EXCLUDED.feedback,
         updated_at = EXCLUDED.updated_at
      RETURNING *`,
		[listing_id, customer_id, rating, feedback, createdAtDate, createdAtDate]
	);
	return rows[0];
}
