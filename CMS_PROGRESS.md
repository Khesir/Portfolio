# CMS Implementation Checklist

## Setup
- [x] Add `VITE_CMS_PASSWORD` to `.env` and `.env.sample`

## Auth
- [x] `src/hooks/use-cms-auth-store.ts` — Zustand store with sessionStorage

## Write API
- [x] `src/app/api/cms.ts`
  - [x] Blogs: `cmsCreateBlog`, `cmsUpdateBlog`, `cmsDeleteBlog`
  - [x] Projects: `cmsCreateProject`, `cmsUpdateProject`, `cmsDeleteProject`
  - [x] Experiences: `cmsCreateExperience`, `cmsUpdateExperience`, `cmsDeleteExperience`
  - [x] Progress: `cmsCreateProgress`, `cmsDeleteProgress`
  - [x] Home Config: `fetchHomeConfig`, `cmsUpdateHomeConfig`

## CMS Shell
- [x] `src/app/cms/components/CmsLoginGate.tsx` — password form
- [x] `src/app/cms/layout/CmsLayout.tsx` — sidebar + `<Outlet>`
- [x] `src/app/cms/CmsApp.tsx` — auth guard + nested routes
- [x] `src/app/app.tsx` — add `<Route path="cms/*" element={<CmsApp />} />`

## Shared Components
- [x] `src/app/cms/components/ConfirmDialog.tsx`
- [x] `src/app/cms/components/CmsTable.tsx` — with `getBadge` prop for draft indicators
- [x] `src/app/cms/components/TagInput.tsx`
- [x] `src/app/cms/components/MarkdownEditor.tsx`
- [x] `src/app/cms/components/DraftToggle.tsx`
- [x] `src/app/cms/components/MarkdownCheatSheet.tsx`

## Dashboard
- [x] `src/app/cms/pages/CmsDashboard.tsx` — counts for all content types

## Blogs
- [x] `src/app/cms/pages/CmsBlogs.tsx` — list + delete + draft badge
- [x] `src/app/cms/pages/CmsBlogEditor.tsx` — create/edit form + DraftToggle

## Projects
- [x] `src/app/cms/pages/CmsProjects.tsx` — list + delete + draft badge
- [x] `src/app/cms/pages/CmsProjectEditor.tsx` — create/edit form + DraftToggle + markdown

## Experiences
- [x] `src/app/cms/pages/CmsExperiences.tsx` — list + delete + draft badge
- [x] `src/app/cms/pages/CmsExperienceEditor.tsx` — create/edit form + DraftToggle

## Progress
- [x] `src/app/cms/pages/CmsProgress.tsx` — list + delete + draft badge
- [x] `src/app/cms/pages/CmsProgressEditor.tsx` — create form + DraftToggle

## Home Config
- [x] `src/app/cms/pages/CmsHomeConfig.tsx` — availability, languages, description form
