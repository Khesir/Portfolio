import {
	Bot,
	Briefcase,
	Home,
	Layers,
	LayoutIcon,
	PenLine,
	UserCircle,
} from 'lucide-react';
import {
	TbBrandCSharp,
	TbBrandTypescript,
	TbBrandPython,
	TbBrandNodejs,
	TbDeviceDesktopCode,
} from 'react-icons/tb';
import {
	SiNestjs,
	SiDrizzle,
	SiNextdotjs,
	SiMysql,
	SiMongodb,
	SiDocker,
} from 'react-icons/si';
import {FaReact, FaGamepad} from 'react-icons/fa';

export const navdata = [
	{
		name: 'Home',
		isActive: true,
		link: '/',
		emoji: Home,
	},
	{
		name: 'About',
		isActive: false,
		link: '/about',
		emoji: UserCircle,
	},
	{
		name: 'Services',
		isActive: false,
		link: '/services',
		emoji: Layers,
	},
	{
		name: 'Works',
		isActive: false,
		link: '/work',
		emoji: Briefcase,
	},
	{
		name: 'Blogs',
		isActive: false,
		link: '/blogs',
		emoji: PenLine,
	},
];

export const Experties = [
	{
		name: 'React',
		emoji: FaReact,
	},
	{
		name: 'C#',
		emoji: TbBrandCSharp,
	},
	{
		name: 'Typescript',
		emoji: TbBrandTypescript,
	},
	{
		name: 'Python',
		emoji: TbBrandPython,
	},
	{
		name: 'Node.js',
		emoji: TbBrandNodejs,
	},
	{
		name: 'Nest.js',
		emoji: SiNestjs,
	},
	{
		name: 'Drizzle ORM',
		emoji: SiDrizzle,
	},
	{
		name: 'Next.js',
		emoji: SiNextdotjs,
	},
	{
		name: 'Mysql',
		emoji: SiMysql,
	},
	{
		name: 'MongoDB',
		emoji: SiMongodb,
	},
	{
		name: 'Docker',
		emoji: SiDocker,
	},
];

export const Services = [
	{
		name: 'Bot Development',
		emoji: Bot,
	},
	{
		name: 'Web Development',
		emoji: TbDeviceDesktopCode,
	},
	{
		name: 'Web Design',
		emoji: LayoutIcon,
	},
	{
		name: 'Game Development',
		emoji: FaGamepad,
	},
];
