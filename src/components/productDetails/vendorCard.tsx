import { ProductSummaryProps } from './interfaces';
import Image from 'next/image';

export default function VendorCard({ productInfo }: ProductSummaryProps) {
	return (
		<div>
			<Image
				src={productInfo.sellerImage}
				alt={`${productInfo.sellerName}'s Profile Picture`}
				className='rounded-full'
				width={200}
				height={200}
			/>
			<p>Sold by: {productInfo.sellerName}</p>
		</div>
	);
}
