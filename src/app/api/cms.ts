import axios from 'axios';
import {useEnvironment} from '@/hooks/use-environment-store';

const API = import.meta.env.VITE_API_URL;

// =============================================================================
// UPLOAD
// =============================================================================
//
// BACKEND GUIDE
//
//   POST /api/upload — multipart/form-data, field "file", CmsAuthGuard
//   (Authorization: Bearer <CMS_PASSWORD>). Response 200: { url: string }
//   Used as the default image uploader for CMS pages still backed by the
//   Nest API (Blogs, Experiences, Certifications, Recommendations, Posts).
//   Projects/About/Journey/Services pass their own local-file uploader instead.

export const cmsUploadImage = async (file: File): Promise<string> => {
	const form = new FormData();
	form.append('file', file);
	const res = await axios.post(`${API}/upload`, form, {
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${import.meta.env.VITE_CMS_PASSWORD}`,
		},
	});
	return res.data.url;
};

// =============================================================================
// DTOs
// =============================================================================

export interface ServiceDto {
	icon: string;
	title: string;
	mainTag: string;
	description: string;
	tags: string[];
}

export interface SkillCategoryDto {
	category: string;
	items: string[];
}

export interface OffTheClockItem {
	label: string;
	description: string;
	icon: string;
}

export type StatusType = 'online' | 'idle' | 'dnd' | 'custom';

export interface StatusConfig {
	type: StatusType;
	emoji?: string;
	message?: string;
}

export interface LanguageEntry {
	icon: string;
	label?: string;
}

export interface BannerButton {
	label: string;
	icon?: string;
	href?: string;
	to?: string;
	action?: 'contact';
	variant?: 'primary' | 'secondary';
}

export interface NeofetchRow {
	key: string;
	value: string;
}

export interface SocialLink {
	label: string;
	href: string;
	icon: string;
}

// =============================================================================
// HOME CONFIG
// =============================================================================
//
// BACKEND GUIDE
//
//   Home config is a single JSON document stored in your database or a config
//   table. Suggested schema (Supabase / PostgreSQL):
//
//     CREATE TABLE config (
//       key   TEXT PRIMARY KEY,
//       value JSONB NOT NULL
//     );
//     -- seed: INSERT INTO config VALUES ('home', '{}'::jsonb);
//
//   GET /api/config/home          — public, no auth
//   Response 200: UpdateHomeConfigDto

export const fetchHomeConfig = async () => {
	if (useEnvironment.getState().isDevelopment())
		return {
			name: 'AJ',
			secondName: 'Khesir',
			role: 'Software Engineer',
			contactEmail: 'contact@khesir.com',
			description:
				'I build scalable backend systems and ship clean, maintainable code.\n\nPassionate about backend architecture, game engineering, and writing code that lasts.',
			status: {type: 'online', message: 'Available for work'},
			profileImageUrl: '',
			bannerImageUrl: '',
			heroButtons: [
				{label: 'View work →', to: '/work'},
				{label: '$ cat about.me', to: '/about'},
			],
			neofetchRows: [
				{key: 'Role', value: 'Full-Stack · Toolmaker'},
				{key: 'Uptime', value: 'building since 2020'},
				{key: 'Editor', value: 'VS Code · Cursor'},
				{key: 'Lang', value: 'TypeScript · C# · Py'},
				{key: 'Stack', value: 'React · Flutter · Node'},
				{key: 'Locale', value: 'PH · UTC+8'},
			],
			location: 'Philippines · UTC+8',
			tags: ['agentic AI', 'APIs & tooling'],
			selectedWorkCount: 3,
			writingCount: 3,
			contactHeading: "Let's build something & make it faster.",
			contactSubtext: 'Open for engineering work and collaborations.',
			socialLinks: [
				{label: 'GitHub', href: 'https://github.com/khesir', icon: 'mdi:github'},
				{label: 'LinkedIn', href: '#', icon: 'mdi:linkedin'},
				{label: 'Twitter', href: '#', icon: 'mdi:twitter'},
				{label: 'Email', href: 'mailto:contact@khesir.com', icon: 'mdi:email'},
			],
			footerCopyright: '© 2026 AJ — Khesir',
			footerTagline: 'direction B — "Terminal" · tech-first',
		};
	const res = await axios.get(`${API}/config/home`);
	return res.data;
};

// =============================================================================
// ABOUT CONFIG
// =============================================================================
//
// BACKEND GUIDE
//
//   Stored as key "about" in the same config table as home config.
//
//   GET /api/config/about          — public, no auth
//   Response 200: UpdateAboutConfigDto

export const fetchAboutConfig = async () => {
	if (useEnvironment.getState().isDevelopment())
		return {
			aboutTitle: '',
			lastUpdatedAt: '2026-04-03',
			location: 'Remote / Flexible',
			profileImageUrl: '',
			aboutButtons: [
				{label: 'Contact Me', icon: 'mdi:email', action: 'contact'},
				{
					label: 'GitHub',
					icon: 'mdi:github',
					href: 'https://github.com/khesir',
					variant: 'secondary',
				},
				{
					label: 'Blogs',
					icon: 'mdi:file-document',
					to: '/blogs',
					variant: 'secondary',
				},
			],
			professionalSummary:
				'Software engineer focused on **backend development** and **game engineering**.\n\nI specialize in scalable architectures, clean system design, and writing code that makes sense long-term.',
			technicalSkills: [
				{category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind']},
				{
					category: 'Backend',
					items: ['Node.js', 'NestJS', 'PostgreSQL', 'Docker'],
				},
				{category: 'Game Dev', items: ['Unity', 'C#', 'Lua', 'C++']},
			],
			bioTagline: 'I build software — and I build the tools that build software.',
			bioBody: "I'm a full-stack engineer shipping web and mobile apps in **TypeScript, C#, Python and Flutter**. I enjoy spotting the slow, repetitive parts of a workflow and replacing them with a tool, an API or an automation.\n\nLately a lot of that is AI-driven — wiring up **agentic workflows** with n8n and LLMs. Always building something.",
			offTheClock: [
				{label: 'At the gym', description: 'Lifting and staying consistent.', icon: 'mdi:dumbbell'},
				{label: 'Reading', description: 'Buried in a book — mostly non-fiction.', icon: 'mdi:book-open-variant'},
			],
		};
	const res = await axios.get(`${API}/config/about`);
	return res.data;
};

// =============================================================================
// SERVICE CONFIG
// =============================================================================
//
// BACKEND GUIDE
//
//   Stored as key "services" in the same config table.
//
//   GET /api/config/services       — public, no auth
//   Response 200: UpdateServiceConfigDto

export const fetchServiceConfig = async () => {
	if (useEnvironment.getState().isDevelopment())
		return {
			greeting: 'Hey —',
			headline: "here's what I can help with.",
			roleLabel: 'AJ · Khesir // Full-Stack & Toolmaker',
			siteUrl: 'khesir',
			profileImageUrl: '',
			contactEmail: 'hello@khesir.dev',
			socialLinks: [
				{label: 'Twitter / X', href: 'https://x.com/khesir_dev', icon: 'ri:twitter-x-fill'},
				{label: 'Discord', href: '#', icon: 'ic:baseline-discord'},
				{label: 'Email', href: 'mailto:hello@khesir.dev', icon: 'mdi:email'},
			],
			services: [
				{
					icon: 'mdi:server',
					title: 'Web Development',
					mainTag: 'Backend',
					description:
						'Designing and building scalable server-side systems, REST APIs, microservices, and infrastructure. Focus on performance, reliability, and clean architecture.',
					tags: ['NestJS', 'PostgreSQL', 'Docker', 'Redis'],
				},
				{
					icon: 'mdi:robot',
					title: 'Bot Development',
					mainTag: 'Automation',
					description:
						'Building bots and automation systems for Discord, Telegram, and custom platforms — from game economy bots to workflow automation and third-party integrations.',
					tags: ['Discord.js', 'TypeScript', 'Webhooks'],
				},
				{
					icon: 'mdi:gamepad-variant',
					title: 'Game Development',
					mainTag: 'Gameplay',
					description:
						'Focused on gameplay programming, simulation systems, and designing scalable game codebases. From core mechanics to architecting systems that keep complexity manageable.',
					tags: ['Unity', 'C#', 'C++', 'WebSockets'],
				},
			],
		};
	const res = await axios.get(`${API}/config/services`);
	return res.data;
};
