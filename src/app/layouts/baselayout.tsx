interface ContentLayoutProps {
	children: React.ReactNode;
}
export function Layout({children}: ContentLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col bg-white dark:bg-slate-800">
			<div className="flex-grow mb-5">
				<div className="h-full flex justify-center pt-10">{children}</div>
			</div>
			<footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 mt-20">
				<div className="max-w-7xl mx-auto px-4 py-12">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
						{/* About Section */}
						<div className="space-y-3">
							<h3 className="font-bold text-lg text-slate-900 dark:text-white">
								Khesir (Aj)
							</h3>
							<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
								Full-stack developer passionate about building scalable applications
								and solving complex problems with modern technologies.
							</p>
						</div>

						{/* Quick Links */}
						<div className="space-y-3">
							<h3 className="font-bold text-lg text-slate-900 dark:text-white">
								Quick Links
							</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="/#about"
										className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
									>
										About Me
									</a>
								</li>
								<li>
									<a
										href="/projects"
										className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
									>
										Projects
									</a>
								</li>
								<li>
									<a
										href="/experiences"
										className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
									>
										Experience
									</a>
								</li>
								<li>
									<a
										href="/blogs"
										className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
									>
										Blog
									</a>
								</li>
							</ul>
						</div>

						{/* Tech Stack */}
						<div className="space-y-3">
							<h3 className="font-bold text-lg text-slate-900 dark:text-white">
								Built With
							</h3>
							<div className="flex flex-wrap gap-2 text-xs">
								<span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
									React
								</span>
								<span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
									TypeScript
								</span>
								<span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
									Nest.js
								</span>
								<span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-medium">
									Notion SDK
								</span>
								<span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full font-medium">
									Tailwind CSS
								</span>
							</div>
							<p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
								Hosted on{' '}
								<a
									href="https://vercel.com"
									className="underline hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
									target="_blank"
									rel="noopener noreferrer"
								>
									Vercel
								</a>
							</p>
						</div>
					</div>

					{/* Bottom Bar */}
					<div className="pt-8 border-t border-slate-200 dark:border-slate-700">
						<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
							<p>
								© {new Date().getFullYear()} Khesir (Aj). Made with 💜
							</p>
							<div className="flex gap-6">
								<a
									href="https://github.com"
									className="hover:text-slate-900 dark:hover:text-white transition-colors"
									target="_blank"
									rel="noopener noreferrer"
								>
									GitHub
								</a>
								<a
									href="https://linkedin.com"
									className="hover:text-slate-900 dark:hover:text-white transition-colors"
									target="_blank"
									rel="noopener noreferrer"
								>
									LinkedIn
								</a>
								<a
									href="/#contact"
									className="hover:text-slate-900 dark:hover:text-white transition-colors"
								>
									Contact
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
