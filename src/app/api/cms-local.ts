export type LocalSection =
	| 'projects'
	| 'about'
	| 'journey'
	| 'services'
	| 'profile';

// Always reads the current file straight off disk — never the build-time
// bundled JSON import — so CMS pages see their own writes immediately instead
// of a stale snapshot from whenever the page's JS module first loaded.
export async function fetchLocalSection<T>(section: LocalSection): Promise<T> {
	const res = await fetch(`/__cms/data/${section}`, {cache: 'no-store'});
	if (!res.ok) throw new Error(`Failed to load ${section}`);
	return res.json();
}

export async function saveLocalSection<T>(
	section: LocalSection,
	data: T,
): Promise<void> {
	const res = await fetch(`/__cms/save/${section}`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Failed to save ${section}`);
}

function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve((reader.result as string).split(',')[1]);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export async function uploadLocalImage(
	section: LocalSection,
	slug: string,
	file: File,
): Promise<string> {
	const dataBase64 = await fileToBase64(file);
	const res = await fetch('/__cms/upload-image', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({section, slug, filename: file.name, dataBase64}),
	});
	if (!res.ok) throw new Error('Failed to upload image');
	const json = await res.json();
	return json.url as string;
}

export function slugify(input: string): string {
	return (
		input
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '') || 'untitled'
	);
}

export function uniqueSlug(base: string, existingIds: string[]): string {
	const root = slugify(base);
	let slug = root;
	let i = 2;
	while (existingIds.includes(slug)) {
		slug = `${root}-${i++}`;
	}
	return slug;
}
