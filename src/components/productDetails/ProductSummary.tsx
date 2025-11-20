import { ProductSummaryProps } from './interfaces';
import VendorCard from './vendorCard';
import Image from 'next/image';

export default function ProductSummary({ productInfo }: ProductSummaryProps) {
	return (
		<section className='container mx-auto mb-3'>
			<div className='flex'>
				{/* LEFT: Product Image (50% width) */}
				<div className='w-1/2'>
					<Image
						src={productInfo.productImage}
						alt={`${productInfo.productName} picture`}
						width={800}
						height={800}
						className='w-full h-full object-cover'
					/>
				</div>

				{/* RIGHT: Vendor (top-left) + Price/Desc (bottom-left) */}
				<div className='w-1/2 flex flex-col justify-between p-6'>
					{/* Top Right Section */}
					<div className='self-start'>
						<VendorCard productInfo={productInfo} />
					</div>

					{/* Bottom Right Section */}
					<ul className='self-start mt-4'>
						<li>
							<b>Price:</b> ${productInfo.productPrice}
						</li>
						<li>
							<b>Description:</b> {productInfo.productDesc}
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
}
