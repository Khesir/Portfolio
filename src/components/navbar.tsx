import {useLocation, useNavigate} from 'react-router-dom';
import {navdata} from './constant/data';

export function Navbar() {
	const location = useLocation();
	const pathname = location.pathname;
	const navigate = useNavigate();

	return (
		<div className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
			<div className="2xl:w-[50%] xl:w-3/5 lg:w-3/5 sm:w-4/5 w-10/12 mx-auto flex items-center justify-between h-14">
				{/* Logo */}
				<button
					onClick={() => navigate('/')}
					className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
				>
					Khesir
				</button>

				{/* Links */}
				<nav className="flex items-center gap-1">
					{navdata.map((item) => {
						const isActive =
							item.link === '/'
								? pathname === '/'
								: pathname.startsWith(item.link);
						return (
							<button
								key={item.link}
								onClick={() => navigate(item.link)}
								className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
									isActive
										? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
										: 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
								}`}
							>
								{item.name}
							</button>
						);
					})}
				</nav>
			</div>
		</div>
	);
}
