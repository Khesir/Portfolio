import axios from 'axios';
import {ApiCache} from '@/lib/apiCache';
import {useEnvironment} from '@/hooks/use-environment-store';

const API = import.meta.env.VITE_API_URL;

function authHeader() {
	return {Authorization: `Bearer ${import.meta.env.VITE_CMS_PASSWORD}`};
}

function devSkip(action: string): null {
	console.info(`[CMS dev mode] Skipped: ${action}`);
	return null;
}

// =============================================================================
// AUTH
// =============================================================================
//
// BACKEND GUIDE — implement GET /api/auth/login
//
//   Validate the Authorization: Bearer <password> header against your secret.
//   Return 200 on success, 401 on failure. No body needed.
//
//   GET /api/auth/login
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Response 200: {}
//   Response 401: { error: "Unauthorized" }

export const cmsVerifyAuth = async (password: string): Promise<boolean> => {
	if (useEnvironment.getState().isDevelopment()) {
		const key = import.meta.env.VITE_CMS_PASSWORD;
		return Boolean(key && password === key);
	}
	try {
		await axios.get(`${API}/auth/login`, {
			headers: {Authorization: `Bearer ${password}`},
		});
		return true;
	} catch {
		return false;
	}
};

// =============================================================================
// IMAGE UPLOAD
// =============================================================================
//
// BACKEND GUIDE — implement POST /api/upload
//
//   Receives multipart/form-data with a single "file" field.
//
//   1. Parse multipart body (multer / busboy)
//   2. Validate mimetype starts with "image/"
//   3. Generate unique filename: `${Date.now()}-${originalName}`
//   4. Upload to storage (Supabase example):
//        const { data } = await supabase.storage
//          .from('uploads')
//          .upload(`cms/${filename}`, buffer, { contentType });
//        const url = supabase.storage.from('uploads')
//          .getPublicUrl(`cms/${filename}`).data.publicUrl;
//      Or S3 / Cloudflare R2:
//        await s3.send(new PutObjectCommand({ Bucket, Key: filename, Body: buffer, ContentType }));
//        const url = `https://<bucket-domain>/${filename}`;
//   5. Return: { url: string }
//
//   POST /api/upload
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    multipart/form-data  { file: <image> }
//   Response 200: { url: "https://..." }
//   Response 400: { error: "Invalid file type" }
//   Response 401: { error: "Unauthorized" }

export const cmsUploadImage = async (file: File): Promise<string> => {
	if (useEnvironment.getState().isDevelopment()) {
		await new Promise((r) => setTimeout(r, 600));
		console.info('[CMS dev mode] Image upload mocked — returning placeholder URL');
		return `https://placehold.co/800x450?text=${encodeURIComponent(file.name)}`;
	}
	const form = new FormData();
	form.append('file', file);
	const res = await axios.post(`${API}/upload`, form, {
		headers: {...authHeader(), 'Content-Type': 'multipart/form-data'},
	});
	return res.data.url as string;
};

// =============================================================================
// DTOs
// =============================================================================

export interface CreateBlogDto {
	name: string;
	releasedDate?: string;
	imageUrl?: string;
	tags?: string[];
	minRead?: number;
	markdown?: string;
	draft?: boolean;
	hideViews?: boolean;
	hideHearts?: boolean;
}
export type UpdateBlogDto = Partial<CreateBlogDto>;

export interface CreateProjectDto {
	name: string;
	releasedDate?: string;
	imageUrl?: string;
	languages?: string[];
	url?: string;
	deployment?: string;
	markdown?: string;
	draft?: boolean;
	hideViews?: boolean;
	hideHearts?: boolean;
}
export type UpdateProjectDto = Partial<CreateProjectDto>;

export interface CreateExperienceDto {
	position: string;
	companyName: string;
	jobType: 'Remote' | 'Hybrid' | 'Onsite';
	employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
	durationStart: string;
	durationEnd?: string;
	imageUrl?: string;
	pageMd?: string;
	highlightSkills?: string[];
	draft?: boolean;
	hideViews?: boolean;
	hideHearts?: boolean;
}
export type UpdateExperienceDto = Partial<CreateExperienceDto>;

export interface PostDto {
	id: string;
	content: string;
	imageUrl?: string;
	tags: string[];
	draft: boolean;
	createdAt: string;
	hideViews: boolean;
	hideHearts: boolean;
}

export interface CreatePostDto {
	content: string;
	imageUrl?: string;
	tags?: string[];
	draft?: boolean;
	hideViews?: boolean;
	hideHearts?: boolean;
}

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

export interface UpdateHomeConfigDto {
	name: string;
	role: string;
	description: string;
	contactEmail: string;
	status: StatusConfig;
	languages: LanguageEntry[];
	bannerTitle: string;
	bannerSubtitle: string;
	bannerButtons: BannerButton[];
	profileImageUrl?: string;
	bannerImageUrl?: string;
}

export interface UpdateAboutConfigDto {
	aboutTitle: string;
	lastUpdatedAt: string;
	location: string;
	profileImageUrl: string;
	aboutButtons: BannerButton[];
	professionalSummary: string;
	technicalSkills: SkillCategoryDto[];
	coreCompetencies: string[];
}

export interface UpdateServiceConfigDto {
	services: ServiceDto[];
}

// =============================================================================
// BLOGS
// =============================================================================
//
// BACKEND GUIDE
//
//   Blogs are Notion database pages. Each page has the following properties:
//     Name          (title)       — blog title
//     Released Date (date)        — ISO date string (start)
//     Image         (files)       — single file upload, used as cover image
//     Tags          (multi_select)— array of tag names
//     Min           (number)      — estimated read time in minutes
//     Draft         (checkbox)    — true = hidden from public feed
//     Hide Views    (checkbox)    — true = view count hidden on public page
//     Hide Hearts   (checkbox)    — true = heart button hidden on public page
//   Page content is stored as Notion blocks and returned as a markdown string.
//
//   POST /api/blogs
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    CreateBlogDto (JSON)
//   Response 201: { id: string, ...page }
//
//   PUT /api/blogs/:id
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    UpdateBlogDto (JSON) — partial, only provided fields are updated
//   Response 200: { id: string, ...page }
//
//   DELETE /api/blogs/:id
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Response 200: {}

export const cmsCreateBlog = async (payload: CreateBlogDto) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('createBlog');
	const res = await axios.post(`${API}/blogs`, payload, {headers: authHeader()});
	ApiCache.invalidate('blogs:list');
	return res.data;
};

export const cmsUpdateBlog = async (id: string, payload: UpdateBlogDto) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('updateBlog');
	const res = await axios.put(`${API}/blogs/${id}`, payload, {headers: authHeader()});
	ApiCache.invalidate('blogs:list');
	ApiCache.invalidate(`blogs:id:${id}`);
	return res.data;
};

export const cmsDeleteBlog = async (id: string) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('deleteBlog');
	const res = await axios.delete(`${API}/blogs/${id}`, {headers: authHeader()});
	ApiCache.invalidate('blogs:list');
	ApiCache.invalidate(`blogs:id:${id}`);
	return res.data;
};

// =============================================================================
// PROJECTS
// =============================================================================
//
// BACKEND GUIDE
//
//   Projects are Notion database pages. Each page has the following properties:
//     Name          (title)       — project name
//     Released Date (date)        — ISO date string (start)
//     Image         (files)       — single file upload, used as cover image
//     Languages     (multi_select)— tech stack / language tags
//     URL           (url)         — GitHub repository URL
//     Deployment    (url)         — live deployment URL
//     Draft         (checkbox)    — true = hidden from public feed
//     Hide Views    (checkbox)    — true = view count hidden on public page
//     Hide Hearts   (checkbox)    — true = heart button hidden on public page
//   Page content is stored as Notion blocks and returned as a markdown string.
//
//   POST /api/projects
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    CreateProjectDto (JSON)
//   Response 201: { id: string, ...page }
//
//   PUT /api/projects/:id
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    UpdateProjectDto (JSON) — partial
//   Response 200: { id: string, ...page }
//
//   DELETE /api/projects/:id
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Response 200: {}

export const cmsCreateProject = async (payload: CreateProjectDto) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('createProject');
	const res = await axios.post(`${API}/projects`, payload, {headers: authHeader()});
	ApiCache.invalidate('projects:list');
	return res.data;
};

export const cmsUpdateProject = async (id: string, payload: UpdateProjectDto) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('updateProject');
	const res = await axios.put(`${API}/projects/${id}`, payload, {headers: authHeader()});
	ApiCache.invalidate('projects:list');
	ApiCache.invalidate(`projects:id:${id}`);
	return res.data;
};

export const cmsDeleteProject = async (id: string) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('deleteProject');
	const res = await axios.delete(`${API}/projects/${id}`, {headers: authHeader()});
	ApiCache.invalidate('projects:list');
	ApiCache.invalidate(`projects:id:${id}`);
	return res.data;
};

// =============================================================================
// EXPERIENCES
// =============================================================================
//
// BACKEND GUIDE
//
//   Experiences are Notion database pages. Each page has the following properties:
//     Position       (title)       — job title / role
//     CompanyName    (rich_text)   — employer name
//     JobType        (select)      — "Remote" | "Hybrid" | "Onsite"
//     EmploymentType (select)      — "Full-time" | "Part-time" | "Contract" | "Freelance"
//     Duration       (date)        — start (required) + end (optional, null = current)
//     Image          (files)       — company logo
//     Draft          (checkbox)    — true = hidden from public feed
//     Hide Views     (checkbox)    — true = view count hidden on public page
//     Hide Hearts    (checkbox)    — true = heart button hidden on public page
//   Each experience may have a related "Highlight Skills" database linked via relation.
//   pageMd is stored as a rich_text property (long-form detail content in markdown).
//
//   POST /api/experiences
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    CreateExperienceDto (JSON)
//   Response 201: { id: string, ...page }
//
//   PUT /api/experiences/:id
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    UpdateExperienceDto (JSON) — partial
//   Response 200: { id: string, ...page }
//
//   DELETE /api/experiences/:id
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Response 200: {}

export const cmsCreateExperience = async (payload: CreateExperienceDto) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('createExperience');
	const res = await axios.post(`${API}/experiences`, payload, {headers: authHeader()});
	ApiCache.invalidate('experiences:list:5');
	ApiCache.invalidate('experiences:list:20');
	return res.data;
};

export const cmsUpdateExperience = async (id: string, payload: UpdateExperienceDto) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('updateExperience');
	const res = await axios.put(`${API}/experiences/${id}`, payload, {headers: authHeader()});
	ApiCache.invalidate('experiences:list:5');
	ApiCache.invalidate('experiences:list:20');
	ApiCache.invalidate(`experiences:id:${id}`);
	return res.data;
};

export const cmsDeleteExperience = async (id: string) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('deleteExperience');
	const res = await axios.delete(`${API}/experiences/${id}`, {headers: authHeader()});
	ApiCache.invalidate('experiences:list:5');
	ApiCache.invalidate('experiences:list:20');
	ApiCache.invalidate(`experiences:id:${id}`);
	return res.data;
};

// =============================================================================
// POSTS
// =============================================================================
//
// BACKEND GUIDE
//
//   Posts are short-form content (Twitter-like). Stored in your own database
//   (not Notion) since they have no rich page content — just text + metadata.
//
//   Schema (e.g. PostgreSQL / Supabase table "posts"):
//     id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
//     content     TEXT NOT NULL
//     image_url   TEXT
//     tags        TEXT[]           DEFAULT '{}'
//     draft       BOOLEAN          DEFAULT true
//     hide_views  BOOLEAN          DEFAULT false
//     hide_hearts BOOLEAN          DEFAULT false
//     created_at  TIMESTAMPTZ      DEFAULT now()
//
//   Public feed (no auth) — returns only non-draft posts:
//   GET /api/posts
//   Response 200: PostDto[]
//
//   CMS CRUD (auth required):
//   POST   /api/posts         Body: CreatePostDto → Response 201: PostDto
//   PUT    /api/posts/:id     Body: Partial<CreatePostDto> → Response 200: PostDto
//   DELETE /api/posts/:id     Response 200: {}
//
//   Headers for write endpoints: Authorization: Bearer <VITE_CMS_PASSWORD>

export const fetchPosts = async (): Promise<PostDto[]> => {
	if (useEnvironment.getState().isDevelopment())
		return [
			{id: '1', content: 'Just shipped the new CMS dashboard with Vercel analytics integration. Really happy with how the chart turned out.', tags: ['update', 'cms'], draft: false, createdAt: '2026-04-03T10:00:00Z', hideViews: false, hideHearts: false},
			{id: '2', content: 'Working on a new game project in Unity. Procedural generation is surprisingly fun to implement. More updates soon.', imageUrl: '', tags: ['gamedev', 'unity'], draft: false, createdAt: '2026-04-01T14:30:00Z', hideViews: false, hideHearts: false},
			{id: '3', content: 'PostgreSQL + full-text search is criminally underrated. You can avoid a whole search service for most use cases.', tags: ['postgres', 'backend'], draft: false, createdAt: '2026-03-28T09:00:00Z', hideViews: false, hideHearts: false},
		];
	const res = await axios.get(`${API}/posts`);
	return res.data;
};

export const cmsCreatePost = async (payload: CreatePostDto) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('createPost');
	const res = await axios.post(`${API}/posts`, payload, {headers: authHeader()});
	return res.data;
};

export const cmsUpdatePost = async (id: string, payload: Partial<CreatePostDto>) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('updatePost');
	const res = await axios.put(`${API}/posts/${id}`, payload, {headers: authHeader()});
	return res.data;
};

export const cmsDeletePost = async (id: string) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('deletePost');
	const res = await axios.delete(`${API}/posts/${id}`, {headers: authHeader()});
	return res.data;
};

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
//   Shape of the stored JSON (matches UpdateHomeConfigDto):
//     {
//       name:           string   — display name shown in hero + footer
//       role:           string   — job title (blue subtitle)
//       description:    string   — short bio (newlines preserved)
//       contactEmail:   string   — used in contact section + services CTA
//       status:         { type: "online"|"idle"|"dnd"|"custom", emoji?, message? }
//       languages:      { icon: string (Iconify ID), label?: string }[]
//       profileImageUrl: string  — profile photo URL (empty = default)
//       bannerImageUrl:  string  — hero banner strip URL (empty = none)
//       bannerTitle:     string  — availabanner headline
//       bannerSubtitle:  string  — availabanner subtext
//       bannerButtons:   BannerButton[]
//     }
//
//   GET /api/config/home          — public, no auth
//   Response 200: UpdateHomeConfigDto
//
//   PUT /api/config/home
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    UpdateHomeConfigDto (JSON) — full replacement
//   Response 200: UpdateHomeConfigDto

export const fetchHomeConfig = async () => {
	if (useEnvironment.getState().isDevelopment())
		return {
			name: 'Khesir (AJ)',
			role: 'Software Engineer',
			contactEmail: 'contact@khesir.com',
			description:
				'I build scalable backend systems and ship clean, maintainable code.\n\nPassionate about backend architecture, game engineering, and writing code that lasts.',
			status: {type: 'online', message: 'Available for work'},
			languages: [
				{icon: 'devicon:typescript', label: 'TypeScript'},
				{icon: 'devicon:csharp', label: 'C#'},
				{icon: 'devicon:cplusplus', label: 'C++'},
				{icon: 'devicon:python', label: 'Python'},
			],
			profileImageUrl: '',
			bannerImageUrl: '',
			bannerTitle: 'Open for Freelance & Collaborations',
			bannerSubtitle: "Let's work together to bring your ideas to life",
			bannerButtons: [
				{label: 'Contact Me', icon: 'mdi:email', action: 'contact'},
				{label: 'Read Blogs', icon: 'mdi:file-document', to: 'blogs'},
			],
		};
	const res = await axios.get(`${API}/config/home`);
	return res.data;
};

export const cmsUpdateHomeConfig = async (payload: UpdateHomeConfigDto) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('updateHomeConfig');
	const res = await axios.put(`${API}/config/home`, payload, {headers: authHeader()});
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
//   Shape of the stored JSON (matches UpdateAboutConfigDto):
//     {
//       aboutTitle:          string   — (legacy, unused in display — kept for compat)
//       lastUpdatedAt:       string   — ISO date, shown as "Last updated: April 2026"
//       location:            string   — e.g. "Remote / Flexible" (shown with pin icon)
//       profileImageUrl:     string   — overrides home config profile image if set
//       aboutButtons:        BannerButton[]
//       professionalSummary: string   — markdown
//       technicalSkills:     { category: string, items: string[] }[]
//       coreCompetencies:    string[]
//     }
//
//   GET /api/config/about          — public, no auth
//   Response 200: UpdateAboutConfigDto
//
//   PUT /api/config/about
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    UpdateAboutConfigDto (JSON) — full replacement
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
				{label: 'GitHub', icon: 'mdi:github', href: 'https://github.com/khesir', variant: 'secondary'},
				{label: 'Blogs', icon: 'mdi:file-document', to: '/blogs', variant: 'secondary'},
			],
			professionalSummary:
				'Software engineer focused on **backend development** and **game engineering**.\n\nI specialize in scalable architectures, clean system design, and writing code that makes sense long-term.',
			technicalSkills: [
				{category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind']},
				{category: 'Backend', items: ['Node.js', 'NestJS', 'PostgreSQL', 'Docker']},
				{category: 'Game Dev', items: ['Unity', 'C#', 'Lua', 'C++']},
			],
			coreCompetencies: [
				'System Design',
				'REST API Design',
				'Game Architecture',
				'CI/CD',
				'Docker',
			],
		};
	const res = await axios.get(`${API}/config/about`);
	return res.data;
};

export const cmsUpdateAboutConfig = async (payload: UpdateAboutConfigDto) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('updateAboutConfig');
	const res = await axios.put(`${API}/config/about`, payload, {headers: authHeader()});
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
//   Shape of the stored JSON (matches UpdateServiceConfigDto):
//     {
//       services: {
//         icon:        string   — Iconify icon ID (e.g. "mdi:server")
//         title:       string   — service heading
//         mainTag:     string   — badge label (e.g. "Backend")
//         description: string   — plain text description
//         tags:        string[] — tech stack pills
//       }[]
//     }
//
//   GET /api/config/services       — public, no auth
//   Response 200: UpdateServiceConfigDto
//
//   PUT /api/config/services
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    UpdateServiceConfigDto (JSON) — full replacement
//   Response 200: UpdateServiceConfigDto

export const fetchServiceConfig = async () => {
	if (useEnvironment.getState().isDevelopment())
		return {
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

export const cmsUpdateServiceConfig = async (payload: UpdateServiceConfigDto) => {
	if (useEnvironment.getState().isDevelopment()) return devSkip('updateServiceConfig');
	const res = await axios.put(`${API}/config/services`, payload, {headers: authHeader()});
	return res.data;
};

// =============================================================================
// ENGAGEMENT (views + hearts)
// =============================================================================
//
// BACKEND GUIDE
//
//   IP-based engagement — no user accounts or tokens required. The server reads
//   the client IP from the request (req.ip or X-Forwarded-For header).
//
//   Suggested schema (PostgreSQL):
//
//     CREATE TABLE engagement (
//       id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//       entity_type  TEXT NOT NULL,   -- 'blog' | 'project' | 'post' | 'progress'
//       entity_id    TEXT NOT NULL,
//       views        INT  DEFAULT 0,
//       hearts       INT  DEFAULT 0,
//       UNIQUE (entity_type, entity_id)
//     );
//
//     CREATE TABLE engagement_hearts (
//       entity_type  TEXT NOT NULL,
//       entity_id    TEXT NOT NULL,
//       ip_address   TEXT NOT NULL,
//       PRIMARY KEY (entity_type, entity_id, ip_address)
//     );
//
//   GET /api/interactions/:type/:id
//   — public, no auth
//   — returns current view count, heart count, and whether this IP has hearted
//   Response 200: { views: number, hearts: number, hearted: boolean }
//
//   POST /api/interactions/:type/:id/view
//   — public, no auth
//   — increments view count (call once on page load; debounce/dedupe server-side if needed)
//   Response 200: {}
//
//   POST /api/interactions/:type/:id/heart
//   — public, no auth
//   — toggles heart for this IP: inserts or deletes from engagement_hearts, updates hearts count
//   Response 200: { hearted: boolean, hearts: number }

export type EngagementType = 'blog' | 'project' | 'progress' | 'post';

export interface EngagementData {
	views: number;
	hearts: number;
	hearted: boolean;
}

export const fetchEngagement = async (type: EngagementType, id: string): Promise<EngagementData> => {
	if (useEnvironment.getState().isDevelopment())
		return {views: Math.floor(Math.random() * 300) + 10, hearts: Math.floor(Math.random() * 40), hearted: false};
	const res = await axios.get(`${API}/interactions/${type}/${id}`);
	return res.data;
};

export const trackView = async (type: EngagementType, id: string): Promise<void> => {
	if (useEnvironment.getState().isDevelopment()) return;
	await axios.post(`${API}/interactions/${type}/${id}/view`);
};

export const toggleHeart = async (type: EngagementType, id: string): Promise<{hearted: boolean; hearts: number}> => {
	if (useEnvironment.getState().isDevelopment()) return {hearted: true, hearts: 1};
	const res = await axios.post(`${API}/interactions/${type}/${id}/heart`);
	return res.data;
};

// =============================================================================
// ANALYTICS (Vercel via backend proxy)
// =============================================================================
//
// BACKEND GUIDE
//
//   The frontend never calls Vercel directly (CORS + token exposure). The backend
//   proxies the Vercel Analytics API and returns aggregated data.
//
//   Vercel Analytics API docs: https://vercel.com/docs/analytics/api
//   Required env vars on backend: VERCEL_TOKEN, VERCEL_PROJECT_ID
//
//   Implementation sketch (NestJS / Express):
//
//     const headers = { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` };
//     const projectId = process.env.VERCEL_PROJECT_ID;
//
//     // Fetch last 7 days of pageview data
//     const { data } = await axios.get(
//       `https://vercel.com/api/web/insights/stats/pageviews`,
//       { params: { projectId, from: sevenDaysAgo, to: today, granularity: 'day' }, headers }
//     );
//
//     // Map to: { totalVisits, todayVisits, chart: { date, visits }[] }
//
//   GET /api/analytics
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>  (CMS-only, not public)
//   Response 200: { totalVisits: number, todayVisits: number, chart: { date: string, visits: number }[] }
//
//   GET /api/analytics/blogs
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   — joins blog list with engagement table to produce per-blog stats
//   Response 200: { id, title, publishedAt, views, hearts }[]

export interface AnalyticsData {
	totalVisits: number;
	todayVisits: number;
	chart: {date: string; visits: number}[];
}

export interface BlogEngagementSummary {
	id: string;
	title: string;
	publishedAt: string;
	views: number;
	hearts: number;
}

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
	if (useEnvironment.getState().isDevelopment())
		return {
			totalVisits: 4821,
			todayVisits: 37,
			chart: [
				{date: '2026-03-28', visits: 52},
				{date: '2026-03-29', visits: 38},
				{date: '2026-03-30', visits: 71},
				{date: '2026-03-31', visits: 44},
				{date: '2026-04-01', visits: 89},
				{date: '2026-04-02', visits: 61},
				{date: '2026-04-03', visits: 37},
			],
		};
	const res = await axios.get(`${API}/analytics`, {headers: authHeader()});
	return res.data;
};

export const fetchBlogEngagementSummary = async (): Promise<BlogEngagementSummary[]> => {
	if (useEnvironment.getState().isDevelopment())
		return [
			{id: '1', title: 'Building Scalable APIs with NestJS', publishedAt: '2026-03-30', views: 241, hearts: 18},
			{id: '2', title: 'Game Architecture Patterns in Unity', publishedAt: '2026-03-22', views: 189, hearts: 12},
			{id: '3', title: 'Why I Switched to PostgreSQL', publishedAt: '2026-03-15', views: 134, hearts: 7},
			{id: '4', title: 'Docker for Solo Developers', publishedAt: '2026-03-08', views: 98, hearts: 5},
			{id: '5', title: 'TypeScript Tips I Wish I Knew Earlier', publishedAt: '2026-02-28', views: 312, hearts: 31},
		];
	const res = await axios.get(`${API}/analytics/blogs`, {headers: authHeader()});
	return res.data;
};
