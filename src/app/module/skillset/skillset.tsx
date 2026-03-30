import {Card, CardHeader, CardContent, CardFooter} from '@/components/ui/card';
import {Github, TwitterIcon, Mail} from 'lucide-react';
import {usePathname} from '@/hooks/use-pathname-store';
import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaDiscord} from 'react-icons/fa';

import {ModeToggle} from '@/components/providers/mode-toggle';
import {Button} from '@/components/ui/Button';

export default function SkillSetPage() {
	const navigate = useNavigate();
	const {setPathname} = usePathname();
	const location = useLocation();
	useEffect(() => {
		setPathname(location.pathname);
	}, [location.pathname, setPathname]);
	return (
		<div className="relative min-h-screen flex flex-col items-center dark:bg-slate-800">
			<div className="fixed bottom-5 right-10 bg-blue-400 flex justify-center items-center w-[65px] h-[65px] rounded-full z-20 cursor-pointer">
				<ModeToggle />
			</div>
			<div className="w-[80%] h-full my-5 space-y-3">
				<div>
					<Button onClick={() => navigate(-1)}>Back</Button>
				</div>
				<div className="flex flex-col md:flex-row gap-10">
					<Card className="w-full md:w-[400px] lg:w-[300px] flex flex-col md:flex-col items-center md:items-start overflow-hidden dark:bg-slate-800 dark:border-gray-700">
						<CardHeader className="flex-[5] w-full">
							<div className="w-full h-[200px] md:h-full overflow-hidden rounded-3xl border">
								<img
									src={'/img/profile3.jpg'}
									className="w-full h-full object-cover pointer-events-none"
								/>
							</div>
						</CardHeader>

						<CardContent className="flex-[3] w-full">
							<div className="text-xl block font-semibold">Khesir ( Aj )</div>
							<div>Artist, Game Developer, and Software Engineer</div>
							<div className="pt-5">
								Email me or pm me via discord for requests
							</div>
						</CardContent>

						<CardFooter className="flex-[1] w-full">
							<div className="flex flex-wrap items-center gap-2">
								<a
									href="https://github.com/khesir"
									target="_blank"
									className="text-current border dark:border-black-1 border-gray-400 p-1 rounded-md"
									rel="noreferrer"
								>
									<Github className="w-6 h-6" />
								</a>
								<a
									href="https://x.com/khesirr"
									target="_blank"
									className="text-current border dark:border-black-1 border-gray-400 p-1 rounded-md"
									rel="noreferrer"
								>
									<TwitterIcon className="w-6 h-6" />
								</a>
								<a
									href="mailto:khesir2002@gmail.com"
									className="text-current border dark:border-black-1 border-gray-400 p-1 rounded-md"
									rel="noreferrer"
								>
									<Mail className="w-6 h-6" />
								</a>
								<a
									href="https://discord.gg/B5YR7DPjFX"
									target="_blank"
									className="text-current border dark:border-black-1 border-gray-400 p-1 rounded-md"
									rel="noreferrer"
								>
									<FaDiscord className="w-6 h-6" />
								</a>
							</div>
						</CardFooter>
					</Card>
					<Card className="w-full  dark:bg-slate-800 dark:border-gray-700 p-5">
						<div className="flex w-full">
							<div className="flex-[5] flex gap-5 flex-col">
								<div className="flex flex-col">
									<h1 className="text-xl font-bold">Prefered Language</h1>
									<ul className="list-disc pl-5">
										<li className="font-semibold">Python</li>
										<li className="font-semibold">Javascript / Typescript</li>
										<li className="font-semibold">C++</li>
										<li className="font-semibold">C#</li>
									</ul>
								</div>
								<div className="flex flex-col">
									<h1 className="text-xl font-bold">Other Known Languages</h1>
									<ul className="list-disc pl-5">
										<li className="font-semibold">Java</li>
										<li className="font-semibold">Lua</li>
										<li className="font-semibold">C#</li>
										<li className="font-semibold">Bash and Shell Script</li>
									</ul>
								</div>

								<div></div>
							</div>

							<div className="flex-[5]">
								<div className="flex flex-col">
									<h1 className="text-xl font-bold">Technologies</h1>
									<ul className="list-disc pl-5">
										<li className="font-semibold">Frontend</li>
										<p className="text-slate-600">
											React.js, Next.js, Svelte.js, Zustand, Tailwind
										</p>
										<li className="font-semibold">Backend</li>
										<p className="text-slate-600">
											Express, Nest.js, Flask, Socket.io
										</p>
										<li className="font-semibold">Database</li>
										<p className="text-slate-600">MongoDB, Mysql, Posgress</p>
										<li className="font-semibold">Networking</li>
										<p className="text-slate-600">Nginx, Traefik</p>
										<li className="font-semibold">Devops</li>
										<p className="text-slate-600">
											Docker, Git, Github, Github Actions
										</p>

										<li className="font-semibold">Hosting & Servers</li>
										<p className="text-slate-600">
											Hostinger, VPS Management, Digital ocean, AWS
										</p>
										<li className="font-semibold">Gamedev/Graphics</li>
										<p className="text-slate-600">Pygame, Unity, Unreal</p>
										<li className="font-semibold">Mobile App Development</li>
										<p className="text-slate-600">Capacitor, React-native</p>
										<li className="font-semibold italic">and more...</li>
									</ul>
								</div>
							</div>
						</div>

						<div></div>
					</Card>
				</div>
			</div>
			<div className="w-[80%] h-full mb-5">
				<div className="flex flex-col md:flex-row  gap-10">
					<Card className="flex-[6] dark:bg-slate-800 dark:border-gray-700 p-5">
						<div className="flex flex-col">
							<h1 className="text-xl font-bold">Professional Experience</h1>
							<ul className="list-disc pl-5">
								<li className="font-semibold">
									Dec 2024 - Present -- BEfied (fka Edufied), as Software
									Engineer (Automation) Intern
								</li>
								<li className="font-semibold">
									July 2024 - Present -- SAMAHAN Systems Development, as a
									Fullstack Developer
								</li>
								<li className="font-semibold">
									March 2024 - Present -- years of freelancing experience mostly
									working with Bots and Websites as a fullstack developer
								</li>
							</ul>
						</div>
					</Card>
					<Card className="flex-[4] dark:bg-slate-800 dark:border-gray-700 p-5">
						<div className="flex flex-col">
							<h1 className="text-xl font-bold">Education</h1>
							<ul className="list-disc pl-5">
								<li className="font-semibold">Mostly self taught</li>
								<li className="font-semibold">
									Studying for a Bachelor&apos;s Degree -- Ateneo De Davao
									University
								</li>
							</ul>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
