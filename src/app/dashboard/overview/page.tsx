import CardWrapper from '@/components/ui/dashboard/Cards';
import { HeroSection } from '@/app/dashboard/overview/hero-section';
export default function Dashboard() {
	return (
		<>
			<HeroSection />
			<section className='mt-10'>
				<CardWrapper />
			</section>
		</>
	);
}
