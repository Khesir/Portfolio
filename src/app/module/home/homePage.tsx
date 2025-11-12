import {useLocation, useNavigate} from 'react-router-dom';
import {usePathname} from '@/hooks/use-pathname-store';
import {useEffect, useState} from 'react';

import {TopProjects} from '@/app/module/home/topProjects';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {toast} from 'sonner';
import {ExperienceSection} from './experienceSection';
import {Icon} from '@iconify/react';
import {motion} from 'framer-motion';

// Iconify icon names for the respective languages
const goIcon = 'devicon:go';
const csharpIcon = 'devicon:csharp';
const cplusplusIcon = 'devicon:cplusplus';
const typescriptIcon = 'devicon:typescript';
export default function Homepage() {
	const {setPathname} = usePathname();
	const location = useLocation();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [emailError, setEmailError] = useState('');
	const [messageError, setMessageError] = useState('');
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setPathname(location.pathname);
	}, [location.pathname, setPathname]);

	const onSubmit = async () => {
		let valid = true;
		setEmailError('');
		setMessageError('');
		setLoading(true);
		if (!email || !/\S+@\S+\.\S+/.test(email)) {
			setEmailError('Please enter a valid email.');
			valid = false;
		}
		if (!message) {
			setMessageError('Please enter a message.');
			valid = false;
		}
		if (!valid) return;

		const payload = {
			content: '<@409467545951928322> Someone Reached out',
			allowed_mentions: {
				users: ['409467545951928322'],
			},
			embeds: [
				{
					description: 'Source: Personal Website',
					color: 0x00bfff,
					fields: [
						{
							name: 'Email',
							value: email,
							inline: true,
						},
						{
							name: 'Message',
							value: message,
							inline: false,
						},
						{
							name: 'Quick Reply',
							value: `[📧 Reply via Gmail](https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)})`,
						},
					],
					footer: {
						text: 'Sent via webhook',
					},
					timestamp: new Date().toISOString(),
				},
			],
		};
		try {
			setLoading(true);
			const resPromise = fetch(import.meta.env.VITE_WEBHOOK_CONTACT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			await toast.promise(resPromise, {
				loading: 'Sending...',
				success: 'Message sent successfully!',
				error: 'Error sending message, please try again later',
			});
		} catch (err) {
			toast.error(`Error sending embed: ${err}`);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="dark:text-white flex flex-col gap-8 mt-5">
			{/* About Me Section */}
			<motion.div
				className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden"
				initial={{y: -50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
					{/* Profile Image */}
					<div className="flex-shrink-0">
						<div className="w-48 h-48 md:w-56 md:h-56 mx-auto md:mx-0">
							<img
								src={'/img/profile3.jpg'}
								alt="Khesir Profile"
								className="w-full h-full object-cover rounded-2xl border-4 border-slate-200 dark:border-slate-700 shadow-md"
							/>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 flex flex-col justify-center space-y-4">
						<div>
							<h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
								Khesir (AJ)
							</h2>
							<p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
								Software Engineer
							</p>
						</div>

						<div className="space-y-3 text-slate-700 dark:text-slate-300">
							<p className="leading-relaxed">
								👋 Hey there! I'm AJ (also known as Khesir), a Software Engineer
								with a passion for backend development and game engineering.
							</p>
							<p className="leading-relaxed">
								🚀 I specialize in building scalable architectures for games and
								software platforms, turning complex problems into elegant
								solutions.
							</p>
						</div>

						{/* Tech Stack */}
						<div>
							<p className="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">
								Tech Stack
							</p>
							<div className="flex gap-3 flex-wrap">
								<div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
									<Icon icon={goIcon} className="w-6 h-6" />
									<span className="text-sm font-medium">Go</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
									<Icon icon={csharpIcon} className="w-6 h-6" />
									<span className="text-sm font-medium">C#</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
									<Icon icon={cplusplusIcon} className="w-6 h-6" />
									<span className="text-sm font-medium">C++</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
									<Icon icon={typescriptIcon} className="w-6 h-6" />
									<span className="text-sm font-medium">TypeScript</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
			{/* <iframe
				frameBorder="0"
				className="w-full h-[180px] 3xl:h-[180px] rounded-3xl"
				src="https://git-graph.vercel.app/embed/khesir?showColorLegend=false&showWeekdayLabels=false&showMonthLabels=true&showTotalCount=false&blockMargin=2&blockRadius=5&blockSize=17&fontSize=15&weekStart=6&year=2025"
			></iframe> */}
			{/* CTA Section */}
			<motion.div
				className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4"
				initial={{y: 50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<div className="text-center sm:text-left">
					<p className="font-bold text-lg text-slate-900 dark:text-white">
						Want to know more about me?
					</p>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						Check out my full story, skills, and journey
					</p>
				</div>
				<Button
					size="lg"
					onClick={() => navigate('about')}
					className="whitespace-nowrap"
				>
					View Full Profile →
				</Button>
			</motion.div>
			<TopProjects />
			<ExperienceSection pageSize={4} displayHeader={true} />
			{/* Contact Section */}
			<motion.div
				id="contact"
				className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden"
				initial={{y: 100, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<div className="p-6 md:p-8">
					{/* Header */}
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
							Get in Touch
						</h2>
						<p className="text-slate-600 dark:text-slate-400">
							Have a project in mind? Let's collaborate!
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{/* Contact Form */}
						<div className="space-y-5">
							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm font-semibold">
									Email Address
								</Label>
								<Input
									placeholder="your.email@example.com"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									type="email"
									disabled={loading}
									required
									className="h-11"
								/>
								{emailError && (
									<span className="text-red-500 text-xs">{emailError}</span>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="message" className="text-sm font-semibold">
									Your Message
								</Label>
								<Textarea
									placeholder="Tell me about your project or idea..."
									id="message"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									disabled={loading}
									required
									className="min-h-[150px] resize-none"
								/>
								{messageError && (
									<span className="text-red-500 text-xs">{messageError}</span>
								)}
							</div>

							<Button
								onClick={onSubmit}
								disabled={loading}
								className="w-full h-11 text-base"
								size="lg"
							>
								{loading ? 'Sending...' : 'Send Message'}
							</Button>
						</div>

						{/* Info Card */}
						<div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col justify-center space-y-6">
							<div className="space-y-3">
								<h3 className="font-bold text-lg text-slate-900 dark:text-white">
									💡 Let's Build Something Great
								</h3>
								<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
									Whether you have a project idea, need technical consultation,
									or just want to say hello — I'm always excited to connect with
									fellow developers and creators.
								</p>
							</div>

							<div className="space-y-3">
								<div className="flex items-start gap-3">
									<div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
										<span className="text-white text-xs">✓</span>
									</div>
									<p className="text-sm text-slate-700 dark:text-slate-300">
										Quick response time (usually within 24 hours)
									</p>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
										<span className="text-white text-xs">✓</span>
									</div>
									<p className="text-sm text-slate-700 dark:text-slate-300">
										Open to freelance projects and collaborations
									</p>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
										<span className="text-white text-xs">✓</span>
									</div>
									<p className="text-sm text-slate-700 dark:text-slate-300">
										Available for technical consultations
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
			<div className="text-xs flex justify-center gap-5">
				<a href="https://github.com/khesir">Github</a>
				<a href="https://x.com/khesirr">Twitter</a>
				<a href="https://www.twitch.tv/khesir">Twitch</a>
			</div>
		</div>
	);
}
