import {defineConfig, type Plugin} from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const CMS_LOCAL_SECTIONS = [
	'projects',
	'about',
	'journey',
	'services',
	'profile',
] as const;

// Dev-only local CMS write endpoints. Registered only while running `vite dev` —
// never present in a production build, since configureServer only runs for the dev server.
function cmsLocalWritePlugin(): Plugin {
	return {
		name: 'cms-local-write',
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				if (!req.url?.startsWith('/__cms/')) return next();

				if (req.method === 'GET' && req.url.startsWith('/__cms/data/')) {
					const section = req.url.slice('/__cms/data/'.length);
					if (
						!CMS_LOCAL_SECTIONS.includes(
							section as (typeof CMS_LOCAL_SECTIONS)[number],
						)
					) {
						res.statusCode = 400;
						res.end('Unknown section');
						return;
					}
					const filePath = path.resolve(
						__dirname,
						'src/data',
						`${section}.json`,
					);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.setHeader('Cache-Control', 'no-store');
					res.end(fs.readFileSync(filePath, 'utf-8'));
					return;
				}

				if (req.method !== 'POST') return next();

				const chunks: Buffer[] = [];
				for await (const chunk of req) chunks.push(chunk as Buffer);
				const body = Buffer.concat(chunks).toString('utf-8');

				try {
					if (req.url.startsWith('/__cms/save/')) {
						const section = req.url.slice('/__cms/save/'.length);
						if (
							!CMS_LOCAL_SECTIONS.includes(
								section as (typeof CMS_LOCAL_SECTIONS)[number],
							)
						) {
							res.statusCode = 400;
							res.end('Unknown section');
							return;
						}
						const data = JSON.parse(body);
						const filePath = path.resolve(
							__dirname,
							'src/data',
							`${section}.json`,
						);
						fs.writeFileSync(
							filePath,
							JSON.stringify(data, null, '\t') + '\n',
							'utf-8',
						);
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ok: true}));
						return;
					}

					if (req.url === '/__cms/upload-image') {
						const {section, slug, filename, dataBase64} = JSON.parse(body);
						if (!CMS_LOCAL_SECTIONS.includes(section)) {
							res.statusCode = 400;
							res.end('Unknown section');
							return;
						}
						const safeSlug = String(slug || 'misc').replace(/[^a-z0-9-]/gi, '');
						const safeFilename = String(filename || 'image').replace(
							/[^a-zA-Z0-9._-]/g,
							'',
						);
						const dir = path.resolve(
							__dirname,
							'public/img',
							section,
							safeSlug,
						);
						fs.mkdirSync(dir, {recursive: true});
						const uniqueName = `${Date.now()}-${safeFilename}`;
						fs.writeFileSync(
							path.join(dir, uniqueName),
							Buffer.from(dataBase64, 'base64'),
						);
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(
							JSON.stringify({
								url: `/img/${section}/${safeSlug}/${uniqueName}`,
							}),
						);
						return;
					}

					next();
				} catch (err) {
					res.statusCode = 500;
					res.end(String(err));
				}
			});
		},
	};
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), cmsLocalWritePlugin()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},

	define: {
		'process.env.VITE_TOKEN': JSON.stringify(process.env.VITE_TOKEN),
	},

	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test-setup.ts'],
	},
});
