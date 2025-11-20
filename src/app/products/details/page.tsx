import Reviews from '@/components/productDetails/Reviews';
import ProductSummary from '@/components/productDetails/ProductSummary';
import { Review, ProductInformation } from '@/components/productDetails/interfaces';
// Replace with dynamic list of reviews from db, all from the same productName and seller (product ID?)
const mockReviews: Review[] = [
	{
		id: 1,
		productName: 'Rustic Wooden Bowl',
		rating: 5,
		comment: 'Beautifully made and fast shipping! Thank you.',
		customerName: 'A. Customer',
	},
	{
		id: 2,
		productName: 'Rustic Wooden Bowl',
		rating: 4,
		comment: 'The color is perfect, but it arrived a day late.',
		customerName: 'B. Shopper',
	},
	{
		id: 3,
		productName: 'Rustic Wooden Bowl',
		rating: 5,
		comment: 'High quality craftsmanship. Will order again!',
		customerName: 'C. Buyer',
	},
];

// Replace with image from DB. THESE IMAGES ARE STOCK FROM GOOGLE - CHANGE TO AVOID COPYRIGHT INFRINGEMENT LATER
const mockProduct: ProductInformation = {
    productName: 'Rustic Wooden Bowl',
	productId: 1,
	productImage: '/images/woodenbowl.jpg',
	productDesc: 'A lovely handcarved wooden bowl, perfect for salads, soups, or even decoration.',
	productPrice: 59.99,
	sellerName: 'Adrianna Vendor',
	sellerId: 1,
	sellerImage: '/images/vendorpfp.jpg',
}

export default function DetailPage() {
	return (
		<main className='min-h-screen bg-amber-50 text-gray-900'>
			<section className='max-w-7xl mx-auto px-6 py-12'>
				<h2 className='text-3xl font-bold mb-6 text-center'>
					Product Detail Page Title | Change Later
				</h2>
				{/* Import Reviews, product summary here */}
                <ProductSummary productInfo={mockProduct}/>
				<Reviews reviewData={mockReviews} />
			</section>
		</main>
	);
}
