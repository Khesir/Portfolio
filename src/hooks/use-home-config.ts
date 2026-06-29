import {useEffect, useState} from 'react';
import {
	fetchHomeConfig,
	fetchAboutConfig,
	fetchServiceConfig,
	ServiceDto,
	SkillCategoryDto,
	StatusConfig,
	BannerButton,
	LanguageEntry,
	NeofetchRow,
	SocialLink,
	OffTheClockItem,
} from '@/app/api/cms';

export type {StatusConfig, BannerButton, LanguageEntry, NeofetchRow, SocialLink, OffTheClockItem};
export type {StatusType} from '@/app/api/cms';

export interface HomeConfig {
	name: string;
	role: string;
	description: string;
	contactEmail: string;
	status: StatusConfig;
	heroButtons: BannerButton[];
	profileImageUrl: string;
	bannerImageUrl: string;
	neofetchRows: NeofetchRow[];
	location: string;
	tags: string[];
	languages: LanguageEntry[];
	selectedWorkCount: number;
	writingCount: number;
	contactHeading: string;
	contactSubtext: string;
	socialLinks: SocialLink[];
	footerCopyright: string;
	footerTagline: string;
}

export interface AboutConfig {
	aboutTitle: string;
	lastUpdatedAt: string;
	location: string;
	profileImageUrl: string;
	aboutButtons: BannerButton[];
	professionalSummary: string;
	technicalSkills: SkillCategoryDto[];
	bioTagline: string;
	bioBody: string;
	offTheClock: OffTheClockItem[];
}

export interface ServiceConfig {
	services: ServiceDto[];
	greeting: string;
	headline: string;
	roleLabel: string;
	siteUrl: string;
	profileImageUrl: string;
	contactEmail: string;
	socialLinks: SocialLink[];
}

const DEFAULT_HOME: HomeConfig = {
	name: '',
	role: '',
	description: '',
	contactEmail: '',
	status: {type: 'online'},
	heroButtons: [],
	profileImageUrl: '',
	bannerImageUrl: '',
	neofetchRows: [],
	location: '',
	tags: [],
	languages: [],
	selectedWorkCount: 3,
	writingCount: 3,
	contactHeading: "Let's build something & make it faster.",
	contactSubtext: 'Open for engineering work and collaborations.',
	socialLinks: [],
	footerCopyright: '© 2026 AJ — Khesir',
	footerTagline: 'direction B — "Terminal" · tech-first',
};

const DEFAULT_ABOUT: AboutConfig = {
	aboutTitle: '',
	lastUpdatedAt: '',
	location: '',
	profileImageUrl: '',
	aboutButtons: [],
	professionalSummary: '',
	technicalSkills: [],
	bioTagline: '',
	bioBody: '',
	offTheClock: [] as OffTheClockItem[],
};

const DEFAULT_SERVICE: ServiceConfig = {
	services: [],
	greeting: 'Hey —',
	headline: "here's what I can help with.",
	roleLabel: 'AJ · Khesir // Full-Stack & Toolmaker',
	siteUrl: 'khesir',
	profileImageUrl: '',
	contactEmail: '',
	socialLinks: [],
};

// Module-level cache
let _homeCache: HomeConfig | null = null;
let _homePromise: Promise<HomeConfig> | null = null;
let _aboutCache: AboutConfig | null = null;
let _aboutPromise: Promise<AboutConfig> | null = null;
let _serviceCache: ServiceConfig | null = null;
let _servicePromise: Promise<ServiceConfig> | null = null;

export function invalidateAboutCache() {
	_aboutCache = null;
	_aboutPromise = null;
}

export function invalidateHomeCache() {
	_homeCache = null;
	_homePromise = null;
}

export function invalidateServiceCache() {
	_serviceCache = null;
	_servicePromise = null;
}

function makeLoader<T>(
	getCache: () => T | null,
	setCache: (v: T) => void,
	getPromise: () => Promise<T> | null,
	setPromise: (p: Promise<T> | null) => void,
	fetcher: () => Promise<unknown>,
	defaults: T,
) {
	return (): Promise<T> => {
		const cache = getCache();
		if (cache) return Promise.resolve(cache);
		const existing = getPromise();
		if (existing) return existing;
		const p = fetcher()
			.then((data) => {
				const result = {...defaults, ...(data as object)} as T;
				setCache(result);
				return result;
			})
			.catch(() => {
				setPromise(null);
				return defaults;
			});
		setPromise(p);
		return p;
	};
}

const loadHome = makeLoader(
	() => _homeCache,
	(v) => { _homeCache = v; },
	() => _homePromise,
	(p) => { _homePromise = p; },
	fetchHomeConfig,
	DEFAULT_HOME,
);

const loadAbout = makeLoader(
	() => _aboutCache,
	(v) => { _aboutCache = v; },
	() => _aboutPromise,
	(p) => { _aboutPromise = p; },
	fetchAboutConfig,
	DEFAULT_ABOUT,
);

const loadService = makeLoader(
	() => _serviceCache,
	(v) => { _serviceCache = v; },
	() => _servicePromise,
	(p) => { _servicePromise = p; },
	fetchServiceConfig,
	DEFAULT_SERVICE,
);

export const prefetchAll = () => Promise.all([loadHome(), loadAbout(), loadService()]);

export function useHomeConfig() {
	const [config, setConfig] = useState<HomeConfig>(_homeCache ?? DEFAULT_HOME);
	const [loading, setLoading] = useState(!_homeCache);
	useEffect(() => {
		loadHome().then((cfg) => { setConfig(cfg); setLoading(false); });
	}, []);
	return {config, loading};
}

export function useAboutConfig() {
	const [config, setConfig] = useState<AboutConfig>(_aboutCache ?? DEFAULT_ABOUT);
	const [loading, setLoading] = useState(!_aboutCache);
	useEffect(() => {
		loadAbout().then((cfg) => { setConfig(cfg); setLoading(false); });
	}, []);
	return {config, loading};
}

export function useServiceConfig() {
	const [config, setConfig] = useState<ServiceConfig>(_serviceCache ?? DEFAULT_SERVICE);
	const [loading, setLoading] = useState(!_serviceCache);
	useEffect(() => {
		if (_serviceCache) return;
		loadService().then((cfg) => { setConfig(cfg); setLoading(false); });
	}, []);
	return {config, loading};
}

// Derive display label from Iconify ID e.g. "devicon:typescript" → "Typescript"
export function iconLabel(iconId: string): string {
	const name = (iconId.split(':')[1] ?? iconId).replace(/[-_]/g, ' ');
	return name.charAt(0).toUpperCase() + name.slice(1);
}

// Status display helpers
export function getStatusStyle(type: StatusConfig['type']) {
	switch (type) {
		case 'online':
			return {
				dot: 'bg-green-500 animate-pulse',
				text: 'Online',
				pill: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
			};
		case 'idle':
			return {
				dot: 'bg-yellow-400',
				text: 'Idle',
				pill: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
			};
		case 'dnd':
			return {
				dot: 'bg-red-500',
				text: 'Do Not Disturb',
				pill: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
			};
		case 'custom':
			return {
				dot: 'bg-slate-400',
				text: '',
				pill: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
			};
	}
}
