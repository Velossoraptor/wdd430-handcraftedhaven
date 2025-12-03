import Reviews from '@/components/productDetails/Reviews';
import ProductSummary from '@/components/productDetails/ProductSummary';
import ReviewSummary from '@/components/productDetails/reviewSummary';
import pool from '@/_lib/vendor/db';
import { NextResponse } from 'next/server';
import { Review } from '@/components/productDetails/interfaces';
// Replace with dynamic list of reviews from db, all from the same productName and seller (product ID?)
// const mockReviews: Review[] = [
// 	{
// 		id: 1,
// 		productName: 'Rustic Wooden Bowl',
// 		rating: 5,
// 		comment: 'Beautifully made and fast shipping! Thank you.',
// 		customerName: 'A. Customer',
// 	},
// 	{
// 		id: 2,
// 		productName: 'Rustic Wooden Bowl',
// 		rating: 4,
// 		comment: 'The color is perfect, but it arrived a day late.',
// 		customerName: 'B. Shopper',
// 	},
// 	{
// 		id: 3,
// 		productName: 'Rustic Wooden Bowl',
// 		rating: 5,
// 		comment: 'High quality craftsmanship. Will order again!',
// 		customerName: 'C. Buyer',
// 	},
// ];

export default async function generateStaticParams({
	params,
}: {
	params: { id: string };
}) {
	// Get Product ID from parameters
	const resolvedParams = await params;
	const productId = resolvedParams.id;

	if (!productId) {
		return NextResponse.json(
			{ success: false, message: 'Product ID is required' },
			{ status: 400 }
		);
	}
	// Query database for the product
	const productRes = await pool.query(
		'SELECT p.product_name, p.product_image, p.price, p.stock, p.category, u.id, u.fname, u.lname FROM products p JOIN users u ON p.account_id = u.id WHERE p.listing_id = $1',
		[productId]
	);
	if (!productRes) {
		return NextResponse.json(
			{ success: false, message: 'Product not found' },
			{ status: 404 }
		);
	}
	const product = productRes.rows[0];
	// Query database for reviews of this produce
	const reviewRes = await pool.query(
		'SELECT r.id, r.listing_id, r.customer_id, r.rating, r.feedback, r.created_at, r.updated_at, u.fname, u.lname, p.product_name FROM reviews r JOIN users u ON r.customer_id = u.id JOIN products p ON r.listing_id = p.listing_id  WHERE r.listing_id = $1;',
		[productId]
	);
	if (!reviewRes) {
		// give an error message in the product section
	}
	const reviews: Review[] = reviewRes.rows;
	console.log(reviews);

	return (
		<main className='min-h-screen bg-amber-50 text-gray-900'>
			<section className='max-w-7xl mx-auto px-6 py-12'>
				<h2 className='text-3xl font-bold mb-6 text-center'>
					{product.product_name} by {product.fname} {product.lname}
				</h2>
				{/* Product Summary; Image, Information, Vendor Card*/}
				<ProductSummary productInfo={product} sellerInfo={product} />
				{/* Form to write reviews */}
				<ReviewSummary />
				{/* Load reviews that have already been written */}
				<Reviews reviewData={reviews} />
			</section>
		</main>
	);
}
