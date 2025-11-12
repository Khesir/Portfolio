import {Banner} from '../../components/banner-section';
import {Outlet} from 'react-router-dom';
import {Layout} from './baselayout';
import {ModeToggle} from '@/components/providers/mode-toggle';
// import {EnvironmentToggle} from '@/components/providers/environment-toggle';
import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

export function BaseLayout() {
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;

			// Show only when scroll is between 300 and 1000 pixels
			if (scrollY > 300) {
				setShowButton(true);
			} else {
				setShowButton(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);
	return (
		<Layout>
			<div className="2xl:w-[50%] xl:w-3/5 lg:w-3/5 sm:w-4/5 w-10/12 h-full ">
				<div className="flex flex-col gap-5">
					<Banner />
					{/* <Navbar /> */}
					<Outlet />
				</div>
			</div>
			{/* Environment Toggle - Always Visible */}
			{/* <motion.div
				key="environment-toggle"
				className="fixed bottom-5 right-5 bg-green-400 flex justify-center items-center w-[65px] h-[65px] rounded-full z-20 cursor-pointer"
				initial={{x: '100%', opacity: 0}}
				animate={{x: 0, opacity: 1}}
				transition={{type: 'spring', stiffness: 100, damping: 15, delay: 0.3}}
			>
				<EnvironmentToggle />
			</motion.div> */}
			{/* Theme Toggle - Scroll Dependent */}
			<AnimatePresence>
				{showButton && (
					<motion.div
						key="mode-toggle"
						className="fixed bottom-5 right-5 bg-blue-400 flex justify-center items-center w-[65px] h-[65px] rounded-full z-20 cursor-pointer"
						initial={{x: '100%', opacity: 0, rotate: 0}}
						animate={{x: 0, opacity: 1, rotate: -360}}
						exit={{x: '100%', opacity: 0, rotate: 360}}
						transition={{type: 'spring', stiffness: 100, damping: 15}}
					>
						<ModeToggle />
					</motion.div>
				)}
			</AnimatePresence>
		</Layout>
	);
}
