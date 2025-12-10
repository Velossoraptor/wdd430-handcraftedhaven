'use client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
/*********** Lucid icon***********/
import { X, Menu } from 'lucide-react';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [menuOpen, setMenuOpen] = useState(false);
	const pathname = usePathname();

	const handleMenuClick = () => {
		setMenuOpen((open) => !open);
	};

	// Close menu on route change (good for mobile UX)
	useEffect(() => {
		// Close menu *only* when pathname changes
		setMenuOpen(false);
	}, [pathname]);

	const navLinks = [
		{ label: 'Overview', href: '/dashboard' }, // Assumes root /dashboard is the overview
		{ label: 'Products', href: '/dashboard/products' },
		{ label: 'Orders', href: '/dashboard/orders' },
		{ label: 'Reviews', href: '/dashboard/reviews' },
		{ label: 'Profile', href: '/dashboard/profile' },
		{ label: 'Billing', href: '/dashboard/billing' },
		{ label: 'Settings', href: '/dashboard/settings' },
	];

	return (
		<div className='flex min-h-screen bg-gray-50'>
      <span>
        {/* Mobile Menu Toggle */}
				<button
					onClick={handleMenuClick}
					aria-label='Open menu'
					className={`
    lg:hidden fixed top-18 -left-4 z-[999] bg-white p-2 rounded-md shadow-lg
  `}>
					{menuOpen ? (
						<X className='w-6 h-6 text-amber-700' />
					) : (
						<Menu className='w-6 h-6 text-amber-700' />
					)}
				</button>
      </span>
			{/* -------------------- Sidebar Container -------------------- */}
			<aside>
				{/* Sliding Sidebar Panel */}
				<div
					className={`
      fixed top-0 left-0 h-full bg-white dark:bg-gray-800 dark:text-gray-100
      shadow-xl z-40 overflow-y-auto p-4 transition-transform duration-300
      w-64
      ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:w-64
    `}>
					{/* Logo */}
					<div className='text-xl font-bold text-amber-600 mb-6 mt-2'>
						Handcrafted Haven
					</div>

					{/* Navigation */}
					<nav className='flex flex-col space-y-1'>
						{navLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								onClick={() => setMenuOpen(false)}
								className={`hover:bg-[#ff6900] hover:text-black p-2 rounded-lg
            transition font-medium flex items-center
            ${
							pathname === link.href
								? 'bg-[#ff6900] text-black shadow-md'
								: 'text-gray-700 dark:text-gray-300'
						}
          `}>
								{link.label}
							</Link>
						))}
					</nav>
				</div>
			</aside>

			<main className='flex-1 lg:ml-64 w-full p-4 lg:p-8'>{children}</main>
		</div>
	);
}
