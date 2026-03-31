import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '@/app/api/blogs';
import { fetchProjects } from '@/app/api/projects';
import { fetchExperiences } from '@/app/api/experience';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCard {
  label: string;
  count: number | null;
  href: string;
}

export default function CmsDashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    { label: 'Blogs', count: null, href: '/cms/blogs' },
    { label: 'Projects', count: null, href: '/cms/projects' },
    { label: 'Experiences', count: null, href: '/cms/experiences' },
    { label: 'Progress', count: null, href: '/cms/progress' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchBlogs(),
      fetchProjects(),
      fetchExperiences(20),
      axios.get('https://personal-backend-psi.vercel.app/progress'),
    ]).then(([blogs, projects, experiences, progress]) => {
      setStats([
        {
          label: 'Blogs',
          count: blogs.status === 'fulfilled' ? (blogs.value as unknown[]).length : 0,
          href: '/cms/blogs',
        },
        {
          label: 'Projects',
          count: projects.status === 'fulfilled' ? (projects.value as unknown[]).length : 0,
          href: '/cms/projects',
        },
        {
          label: 'Experiences',
          count: experiences.status === 'fulfilled' ? (experiences.value as unknown[]).length : 0,
          href: '/cms/experiences',
        },
        {
          label: 'Progress',
          count:
            progress.status === 'fulfilled'
              ? (progress.value.data?.data?.result?.results ?? []).length
              : 0,
          href: '/cms/progress',
        },
      ]);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        {stats.map(({ label, count, href }) => (
          <Link key={label} to={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-3xl font-bold">{count}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">Manage →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        <Link to="/cms/home-config">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Home Config</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400 mt-1">Edit availability, languages, bio →</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
