import axios from 'axios';
import { ApiCache } from '@/lib/apiCache';
import { useEnvironment } from '@/hooks/use-environment-store';

const API = import.meta.env.VITE_API_URL;
const PROGRESS_BASE = 'https://personal-backend-psi.vercel.app';

function authHeader() {
  return { Authorization: `Bearer ${import.meta.env.VITE_CMS_PASSWORD}` };
}

function devSkip(action: string): null {
  console.info(`[CMS dev mode] Skipped: ${action}`);
  return null;
}

// --- Image Upload ---
//
// BACKEND GUIDE — implement POST /api/upload
//
// This endpoint receives a multipart/form-data request with a single field
// named "file" containing the image. It should:
//
//   1. Parse the multipart body (e.g. multer in Express / NestJS, or busboy directly)
//   2. Validate the file is an image (check mimetype starts with "image/")
//   3. Generate a unique filename:
//        const filename = `${Date.now()}-${originalName}`;
//   4. Upload the buffer to your storage bucket, e.g. Supabase:
//        const { data, error } = await supabase.storage
//          .from('uploads')
//          .upload(`cms/${filename}`, fileBuffer, { contentType: mimetype });
//        const url = supabase.storage.from('uploads').getPublicUrl(`cms/${filename}`).data.publicUrl;
//      Or S3 / Cloudflare R2:
//        await s3.send(new PutObjectCommand({ Bucket, Key: filename, Body: buffer, ContentType }));
//        const url = `https://<your-bucket-domain>/${filename}`;
//   5. Return: { url: string }
//   6. Guard with the same Bearer auth check as other write endpoints.
//
// Express/NestJS example signature:
//   POST /api/upload
//   Headers: Authorization: Bearer <VITE_CMS_PASSWORD>
//   Body:    multipart/form-data  { file: <image file> }
//   Response 200: { url: "https://..." }
//   Response 400: { error: "Invalid file type" }
//   Response 401: { error: "Unauthorized" }

export const cmsUploadImage = async (file: File): Promise<string> => {
  // Dev mode: return a placeholder so the editor flow can be tested
  if (useEnvironment.getState().isDevelopment()) {
    await new Promise((r) => setTimeout(r, 600)); // simulate upload delay
    console.info('[CMS dev mode] Image upload mocked — returning placeholder URL');
    return `https://placehold.co/800x450?text=${encodeURIComponent(file.name)}`;
  }

  const form = new FormData();
  form.append('file', file);

  const res = await axios.post(`${API}/upload`, form, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });

  // Backend must return { url: string }
  return res.data.url as string;
};

// --- DTOs ---

export interface CreateBlogDto {
  name: string;
  releasedDate?: string;
  imageUrl?: string;
  tags?: string[];
  minRead?: number;
  markdown?: string;
  draft?: boolean;
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
}
export type UpdateExperienceDto = Partial<CreateExperienceDto>;

export interface CreateProgressDto {
  name: string;
  draft?: boolean;
}

export interface UpdateHomeConfigDto {
  available: boolean;
  languages: string[];
  description: string;
}

// --- Blogs ---

export const cmsCreateBlog = async (payload: CreateBlogDto) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('createBlog');
  const res = await axios.post(`${API}/blogs`, payload, { headers: authHeader() });
  ApiCache.invalidate('blogs:list');
  return res.data;
};

export const cmsUpdateBlog = async (id: string, payload: UpdateBlogDto) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('updateBlog');
  const res = await axios.put(`${API}/blogs/${id}`, payload, { headers: authHeader() });
  ApiCache.invalidate('blogs:list');
  ApiCache.invalidate(`blogs:id:${id}`);
  return res.data;
};

export const cmsDeleteBlog = async (id: string) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('deleteBlog');
  const res = await axios.delete(`${API}/blogs/${id}`, { headers: authHeader() });
  ApiCache.invalidate('blogs:list');
  ApiCache.invalidate(`blogs:id:${id}`);
  return res.data;
};

// --- Projects ---

export const cmsCreateProject = async (payload: CreateProjectDto) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('createProject');
  const res = await axios.post(`${API}/projects`, payload, { headers: authHeader() });
  ApiCache.invalidate('projects:list');
  return res.data;
};

export const cmsUpdateProject = async (id: string, payload: UpdateProjectDto) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('updateProject');
  const res = await axios.put(`${API}/projects/${id}`, payload, { headers: authHeader() });
  ApiCache.invalidate('projects:list');
  ApiCache.invalidate(`projects:id:${id}`);
  return res.data;
};

export const cmsDeleteProject = async (id: string) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('deleteProject');
  const res = await axios.delete(`${API}/projects/${id}`, { headers: authHeader() });
  ApiCache.invalidate('projects:list');
  ApiCache.invalidate(`projects:id:${id}`);
  return res.data;
};

// --- Experiences ---

export const cmsCreateExperience = async (payload: CreateExperienceDto) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('createExperience');
  const res = await axios.post(`${API}/experiences`, payload, { headers: authHeader() });
  ApiCache.invalidate('experiences:list:5');
  ApiCache.invalidate('experiences:list:20');
  return res.data;
};

export const cmsUpdateExperience = async (id: string, payload: UpdateExperienceDto) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('updateExperience');
  const res = await axios.put(`${API}/experiences/${id}`, payload, { headers: authHeader() });
  ApiCache.invalidate('experiences:list:5');
  ApiCache.invalidate('experiences:list:20');
  ApiCache.invalidate(`experiences:id:${id}`);
  return res.data;
};

export const cmsDeleteExperience = async (id: string) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('deleteExperience');
  const res = await axios.delete(`${API}/experiences/${id}`, { headers: authHeader() });
  ApiCache.invalidate('experiences:list:5');
  ApiCache.invalidate('experiences:list:20');
  ApiCache.invalidate(`experiences:id:${id}`);
  return res.data;
};

// --- Progress ---

export const cmsCreateProgress = async (payload: CreateProgressDto) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('createProgress');
  const res = await axios.post(`${PROGRESS_BASE}/progress`, payload, { headers: authHeader() });
  return res.data;
};

export const cmsDeleteProgress = async (id: string) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('deleteProgress');
  const res = await axios.delete(`${PROGRESS_BASE}/progress/${id}`, { headers: authHeader() });
  return res.data;
};

// --- Home Config ---

export const fetchHomeConfig = async () => {
  if (useEnvironment.getState().isDevelopment()) return { available: true, languages: [], description: '' };
  const res = await axios.get(`${API}/config`);
  return res.data;
};

export const cmsUpdateHomeConfig = async (payload: UpdateHomeConfigDto) => {
  if (useEnvironment.getState().isDevelopment()) return devSkip('updateHomeConfig');
  const res = await axios.put(`${API}/config`, payload, { headers: authHeader() });
  return res.data;
};
