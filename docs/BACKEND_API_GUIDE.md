# Backend API Guide

This document describes every endpoint the backend must implement for the portfolio CMS and public-facing frontend to function correctly.

---

## Base URL

All endpoints live under a single base URL configured via the `VITE_API_URL` env var on the frontend.

```
https://<your-backend-domain>/api
```

---

## Authentication

Write endpoints (create, update, delete, upload) are protected by a shared secret.

**Header:**
```
Authorization: Bearer <CMS_PASSWORD>
```

The backend must read `CMS_PASSWORD` from its own environment variables and compare it against the incoming `Authorization` header value. If the token is missing or does not match, respond with `401`.

The frontend reads the same password from `VITE_CMS_PASSWORD` and sends it as the Bearer token automatically on every write request.

**Auth middleware example (Express):**
```ts
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== process.env.CMS_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
```

---

## Auth Verification

### `GET /api/auth/login`
**Auth required: yes**

Used by the frontend login gate to verify the entered password against the backend. Returns `200` if the Bearer token matches `CMS_PASSWORD`, `401` otherwise. No request body needed.

**Response `200`:** `{ "ok": true }`

**Response `401`:** `{ "error": "Unauthorized" }`

---

## Image Upload

### `POST /api/upload`
**Auth required: yes**

Receives a single image file and returns its public URL.

**Request:** `multipart/form-data`
| Field | Type   | Description        |
|-------|--------|--------------------|
| file  | File   | The image to upload |

**Response `200`:**
```json
{ "url": "https://..." }
```

**Response `400`:** `{ "error": "Invalid file type" }` — if mimetype does not start with `image/`

**Implementation notes:**
1. Parse the multipart body (e.g. `multer`, `busboy`)
2. Validate `mimetype.startsWith('image/')`
3. Generate a unique filename: `` `${Date.now()}-${originalName}` ``
4. Upload to storage (Supabase Storage, S3, Cloudflare R2, etc.) and return the public URL

---

## Blogs

### `GET /api/blogs`
**Auth required: no**

Returns a list of all published blog entries.

**Response `200`:** array of blog objects
```json
[
  {
    "id": "string",
    "properties": {
      "Name":         { "title": [{ "plain_text": "string" }] },
      "Released Date":{ "date": { "start": "YYYY-MM-DD" } },
      "Image":        { "files": [{ "file": { "url": "string" } }] },
      "Tags":         { "multi_select": [{ "name": "string" }] },
      "Min":          { "number": 5 },
      "Draft":        { "checkbox": false }
    }
  }
]
```

### `GET /api/blogs/:id`
**Auth required: no**

Returns a single blog entry with its rendered markdown.

**Response `200`:**
```json
{
  "result": {
    "id": "string",
    "properties": { ...same shape as list item... },
    "markdown": "string"
  }
}
```

**Response `404`:** `{ "error": "Not found" }`

### `POST /api/blogs`
**Auth required: yes**

Creates a new blog entry.

**Request body (JSON):**
```json
{
  "name":         "string (required)",
  "releasedDate": "YYYY-MM-DD (optional)",
  "imageUrl":     "string (optional)",
  "tags":         ["string"] ,
  "minRead":      5,
  "markdown":     "string (optional)",
  "draft":        true
}
```

**Response `201`:** the created blog object

### `PUT /api/blogs/:id`
**Auth required: yes**

Updates an existing blog entry. All fields are optional (partial update).

**Request body (JSON):** same fields as `POST /api/blogs`, all optional

**Response `200`:** the updated blog object

**Response `404`:** `{ "error": "Not found" }`

### `DELETE /api/blogs/:id`
**Auth required: yes**

Deletes a blog entry.

**Response `200`:** `{ "message": "Deleted" }`

**Response `404`:** `{ "error": "Not found" }`

---

## Projects

### `GET /api/projects`
**Auth required: no**

Returns a list of projects. Supports optional pagination.

**Query params:**
| Param    | Type   | Description                        |
|----------|--------|------------------------------------|
| pageSize | number | Max number of results (default: 6) |

**Response `200`:** array of project objects
```json
[
  {
    "id": "string",
    "properties": {
      "Name":          { "title": [{ "plain_text": "string" }] },
      "Released Date": { "date": { "start": "YYYY-MM-DD" } },
      "Image":         { "files": [{ "file": { "url": "string" } }] },
      "Languages":     { "multi_select": [{ "name": "string" }] },
      "URL":           { "url": "string" },
      "Deployment":    { "select": { "name": "string" } },
      "Draft":         { "checkbox": false }
    }
  }
]
```

### `GET /api/projects/:id`
**Auth required: no**

Returns a single project with its rendered markdown.

**Response `200`:**
```json
{
  "result": {
    "id": "string",
    "properties": { ...same shape as list item... },
    "markdown": "string"
  }
}
```

**Response `404`:** `{ "error": "Not found" }`

### `POST /api/projects`
**Auth required: yes**

Creates a new project entry.

**Request body (JSON):**
```json
{
  "name":         "string (required)",
  "releasedDate": "YYYY-MM-DD (optional)",
  "imageUrl":     "string (optional)",
  "languages":    ["string"],
  "url":          "string (optional)",
  "deployment":   "string (optional)",
  "markdown":     "string (optional)",
  "draft":        true
}
```

**Response `201`:** the created project object

### `PUT /api/projects/:id`
**Auth required: yes**

Updates an existing project. All fields optional.

**Request body (JSON):** same fields as `POST /api/projects`, all optional

**Response `200`:** the updated project object

### `DELETE /api/projects/:id`
**Auth required: yes**

**Response `200`:** `{ "message": "Deleted" }`

---

## Experiences

### `GET /api/experiences`
**Auth required: no**

Returns a list of work experiences.

**Query params:**
| Param    | Type   | Description              |
|----------|--------|--------------------------|
| pageSize | number | Max number of results    |

**Response `200`:** array of experience objects
```json
[
  {
    "id": "string",
    "properties": {
      "Position":       { "title": [{ "plain_text": "string" }] },
      "Company Name":   { "rich_text": [{ "plain_text": "string" }] },
      "Job Type":       { "select": { "name": "Remote | Hybrid | Onsite" } },
      "Employment Type":{ "select": { "name": "Full-time | Part-time | Contract | Freelance" } },
      "Duration Start": { "date": { "start": "YYYY-MM-DD" } },
      "Duration End":   { "date": { "start": "YYYY-MM-DD" } },
      "Image":          { "files": [{ "file": { "url": "string" } }] },
      "Highlight Skills":{ "multi_select": [{ "name": "string" }] },
      "Draft":          { "checkbox": false }
    }
  }
]
```

### `GET /api/experiences/:id`
**Auth required: no**

Returns a single experience with its rendered markdown (`pageMd`).

**Response `200`:**
```json
{
  "result": {
    "id": "string",
    "properties": { ...same shape as list item... },
    "markdown": "string"
  }
}
```

**Response `404`:** `{ "error": "Not found" }`

### `POST /api/experiences`
**Auth required: yes**

**Request body (JSON):**
```json
{
  "position":        "string (required)",
  "companyName":     "string (required)",
  "jobType":         "Remote | Hybrid | Onsite",
  "employmentType":  "Full-time | Part-time | Contract | Freelance",
  "durationStart":   "YYYY-MM-DD (required)",
  "durationEnd":     "YYYY-MM-DD (optional, omit if current role)",
  "imageUrl":        "string (optional)",
  "pageMd":          "string (optional)",
  "highlightSkills": ["string"],
  "draft":           true
}
```

**Response `201`:** the created experience object

### `PUT /api/experiences/:id`
**Auth required: yes**

All fields optional.

**Response `200`:** the updated experience object

### `DELETE /api/experiences/:id`
**Auth required: yes**

**Response `200`:** `{ "message": "Deleted" }`

---

## Progress

### `GET /api/progress`
**Auth required: no**

Returns all progress/skill entries.

**Response `200`:** array of progress objects
```json
[
  {
    "id": "string",
    "name": "string",
    "draft": false
  }
]
```

### `POST /api/progress`
**Auth required: yes**

**Request body (JSON):**
```json
{
  "name":     "string (required)",
  "imageUrl": "string (optional)",
  "draft":    false
}
```

**Response `201`:** `{ "id": "string", "name": "string", "imageUrl": "string", "draft": false }`

### `PUT /api/progress/:id`
**Auth required: yes**

All fields optional.

**Response `200`:** the updated progress object

### `DELETE /api/progress/:id`
**Auth required: yes**

**Response `200`:** `{ "message": "Deleted" }`

---

## Home Config

### `GET /api/config/home`
**Auth required: no**

Returns the home page configuration.

**Response `200`:**
```json
{
  "available":   true,
  "greeting":    "Hey there!",
  "title":       "Software Engineer",
  "description": "Short intro shown on profile card.",
  "languages":   ["devicon:typescript", "devicon:go"]
}
```

### `PUT /api/config/home`
**Auth required: yes**

**Request body (JSON):** same shape as `GET` response, all fields required

**Response `200`:** the updated home config object

---

## About Config

### `GET /api/config/about`
**Auth required: no**

Returns the about page configuration.

**Response `200`:**
```json
{
  "professionalSummary": "Markdown string",
  "technicalSkills": [
    { "category": "Frontend", "items": ["React", "TypeScript", "Tailwind"] },
    { "category": "Backend",  "items": ["Node.js", "Go", "PostgreSQL"] }
  ],
  "coreCompetencies": ["System Design", "REST APIs", "CI/CD"],
  "services": [
    {
      "icon":    "mdi:code-braces",
      "title":   "Full Stack Development",
      "mainTag": "Backend",
      "tags":    ["Node.js", "React", "PostgreSQL"]
    }
  ]
}
```

### `PUT /api/config/about`
**Auth required: yes**

**Request body (JSON):** same shape as `GET` response, all fields required

**Response `200`:** the updated about config object

---

## Service Config

### `GET /api/config/services`
**Auth required: no**

**Response `200`:**
```json
{
  "services": [
    {
      "icon":        "mdi:server",
      "title":       "Web Development",
      "mainTag":     "Backend",
      "description": "Scalable server-side systems, REST APIs, and infrastructure.",
      "tags":        ["NestJS", "PostgreSQL", "Docker"]
    }
  ]
}
```

### `PUT /api/config/services`
**Auth required: yes**

**Request body (JSON):** same shape as `GET` response

**Response `200`:** the updated service config object

---

## Analytics

Both analytics endpoints are CMS-only (auth required). The backend proxies Vercel's Analytics API so the frontend never exposes the Vercel token.

**Required backend env vars:** `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`

---

### `GET /api/analytics`
**Auth required: yes**

Proxies Vercel Analytics and returns aggregated visit data for the last 7 days.

**Response `200`:**
```json
{
  "totalVisits": 4821,
  "todayVisits": 37,
  "chart": [
    { "date": "2026-03-28", "visits": 52 },
    { "date": "2026-03-29", "visits": 38 }
  ]
}
```

**Implementation (Express/NestJS):**
```ts
// GET /api/analytics
router.get('/analytics', requireAuth, async (req, res) => {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const headers = { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` };

  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  const { data } = await axios.get(
    'https://vercel.com/api/web/insights/stats/pageviews',
    { params: { projectId, from: sevenDaysAgo, to: today, granularity: 'day' }, headers }
  );

  // Vercel returns data.data — array of { key: "YYYY-MM-DD", total: number }
  const chart = data.data.map((d) => ({ date: d.key, visits: d.total }));
  const totalVisits = chart.reduce((sum, d) => sum + d.visits, 0);
  const todayVisits = chart.find((d) => d.date === today)?.visits ?? 0;

  res.json({ totalVisits, todayVisits, chart });
});
```

> **Note:** Vercel's pageview endpoint shape may vary. Check the [Vercel Analytics API docs](https://vercel.com/docs/analytics/api) for the exact response shape for your plan. The field names above (`d.key`, `d.total`) are illustrative — adjust to match what Vercel actually returns.

---

### `GET /api/analytics/blogs`
**Auth required: yes**

Joins your blog list with the `engagement` table to return per-blog view and heart counts. Relies on the same `engagement` table used by `GET /api/interactions/:type/:id`.

**Response `200`:**
```json
[
  {
    "id": "string",
    "title": "string",
    "publishedAt": "YYYY-MM-DD",
    "views": 241,
    "hearts": 18
  }
]
```

**Implementation (Express/NestJS with PostgreSQL):**
```ts
// GET /api/analytics/blogs
router.get('/analytics/blogs', requireAuth, async (req, res) => {
  // Fetch all blogs from your data source (Notion, DB, etc.)
  const blogs = await fetchAllBlogs(); // your existing blog-fetch logic

  // Bulk-fetch engagement rows for all blog IDs in one query
  const blogIds = blogs.map((b) => b.id);
  const { rows } = await db.query(
    `SELECT entity_id, views, hearts
     FROM engagement
     WHERE entity_type = 'blog' AND entity_id = ANY($1)`,
    [blogIds]
  );

  const engagementMap = Object.fromEntries(rows.map((r) => [r.entity_id, r]));

  const result = blogs.map((blog) => {
    const title = blog.properties['Name']?.title?.[0]?.plain_text ?? '';
    const publishedAt = blog.properties['Released Date']?.date?.start ?? '';
    const eng = engagementMap[blog.id] ?? { views: 0, hearts: 0 };
    return { id: blog.id, title, publishedAt, views: eng.views, hearts: eng.hearts };
  });

  // Sort by publishedAt descending (most recent first)
  result.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  res.json(result);
});
```

> **Note:** The `engagement` table schema is defined in the Engagement section above. If a blog has never been viewed it won't have a row — the `?? { views: 0, hearts: 0 }` fallback handles that.

---

## Error Response Shape

All errors must return JSON in this shape:
```json
{ "error": "human-readable message" }
```

| Status | Meaning               |
|--------|-----------------------|
| 400    | Bad request / invalid input |
| 401    | Missing or wrong Bearer token |
| 404    | Resource not found    |
| 500    | Internal server error |
