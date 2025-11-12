/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock data for blogs list
export const mockBlogs = [
  {
    id: 'mock-blog-1',
    properties: {
      Name: {
        title: [
          {
            plain_text: 'Getting Started with React and TypeScript',
          },
        ],
      },
      'Released Date': {
        date: {
          start: '2024-01-15',
        },
      },
    },
  },
  {
    id: 'mock-blog-2',
    properties: {
      Name: {
        title: [
          {
            plain_text: 'Building Modern Web Applications with Vite',
          },
        ],
      },
      'Released Date': {
        date: {
          start: '2024-02-20',
        },
      },
    },
  },
  {
    id: 'mock-blog-3',
    properties: {
      Name: {
        title: [
          {
            plain_text: 'Understanding Zustand State Management',
          },
        ],
      },
      'Released Date': {
        date: {
          start: '2024-03-10',
        },
      },
    },
  },
  {
    id: 'mock-blog-4',
    properties: {
      Name: {
        title: [
          {
            plain_text: 'Tailwind CSS Best Practices',
          },
        ],
      },
      'Released Date': {
        date: null,
      },
    },
  },
];

// Mock data for projects list
export const mockProjects = [
  {
    id: 'mock-project-1',
    properties: {
      Name: {
        title: [
          {
            plain_text: 'E-Commerce Platform',
          },
        ],
      },
      'Released Date': {
        date: {
          start: '2024-01-10',
        },
      },
      Image: {
        files: [
          {
            file: {
              url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
            },
          },
        ],
      },
      Languages: {
        multi_select: [
          { name: 'React' },
          { name: 'TypeScript' },
          { name: 'Node.js' },
          { name: 'PostgreSQL' },
        ],
      },
      URL: {
        url: 'https://github.com/example/ecommerce-platform',
      },
      Deployment: {
        url: 'https://ecommerce-demo.vercel.app',
      },
    },
    relatedData: [
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'React',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'TypeScript',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'Node.js',
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'mock-project-2',
    properties: {
      Name: {
        title: [
          {
            plain_text: 'Task Management App',
          },
        ],
      },
      'Released Date': {
        date: {
          start: '2024-02-15',
        },
      },
      Image: {
        files: [
          {
            file: {
              url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
            },
          },
        ],
      },
      Languages: {
        multi_select: [
          { name: 'React' },
          { name: 'TypeScript' },
          { name: 'Firebase' },
        ],
      },
      URL: {
        url: 'https://github.com/example/task-manager',
      },
      Deployment: {
        url: null,
      },
    },
    relatedData: [
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'React',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'Firebase',
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'mock-project-3',
    properties: {
      Name: {
        title: [
          {
            plain_text: 'Weather Dashboard',
          },
        ],
      },
      'Released Date': {
        date: {
          start: '2024-03-20',
        },
      },
      Image: {
        files: [
          {
            file: {
              url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800',
            },
          },
        ],
      },
      Languages: {
        multi_select: [
          { name: 'React' },
          { name: 'JavaScript' },
          { name: 'API Integration' },
        ],
      },
      URL: {
        url: 'https://github.com/example/weather-dashboard',
      },
      Deployment: {
        url: 'https://weather-dashboard-demo.netlify.app',
      },
    },
    relatedData: [
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'React',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'JavaScript',
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'mock-project-4',
    properties: {
      Name: {
        title: [
          {
            plain_text: 'Social Media Clone',
          },
        ],
      },
      'Released Date': {
        date: null,
      },
      Image: {
        files: [
          {
            file: {
              url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
            },
          },
        ],
      },
      Languages: {
        multi_select: [
          { name: 'Next.js' },
          { name: 'TypeScript' },
          { name: 'Prisma' },
          { name: 'PostgreSQL' },
        ],
      },
      URL: {
        url: null,
      },
      Deployment: {
        url: null,
      },
    },
    relatedData: [
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'Next.js',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'TypeScript',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'Prisma',
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'mock-project-5',
    properties: {
      Name: {
        title: [
          {
            plain_text: 'Portfolio Website',
          },
        ],
      },
      'Released Date': {
        date: {
          start: '2024-04-01',
        },
      },
      Image: {
        files: [
          {
            file: {
              url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            },
          },
        ],
      },
      Languages: {
        multi_select: [
          { name: 'React' },
          { name: 'TypeScript' },
          { name: 'Tailwind CSS' },
        ],
      },
      URL: {
        url: 'https://github.com/example/portfolio',
      },
      Deployment: {
        url: 'https://portfolio.example.com',
      },
    },
    relatedData: [
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'React',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'Tailwind CSS',
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'mock-project-6',
    properties: {
      Name: {
        title: [
          {
            plain_text: 'Real-Time Chat Application',
          },
        ],
      },
      'Released Date': {
        date: {
          start: '2024-05-10',
        },
      },
      Image: {
        files: [
          {
            file: {
              url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
            },
          },
        ],
      },
      Languages: {
        multi_select: [
          { name: 'React' },
          { name: 'Socket.io' },
          { name: 'Node.js' },
          { name: 'MongoDB' },
        ],
      },
      URL: {
        url: 'https://github.com/example/chat-app',
      },
      Deployment: {
        url: 'https://chat-app-demo.herokuapp.com',
      },
    },
    relatedData: [
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'Socket.io',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'Node.js',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'MongoDB',
              },
            ],
          },
        },
      },
    ],
  },
];

// Mock data for experiences list
export const mockExperiences = [
  {
    id: 'mock-exp-1',
    properties: {
      Position: {
        title: [
          {
            plain_text: 'Senior Fullstack Developer',
          },
        ],
      },
      CompanyName: {
        rich_text: [
          {
            plain_text: 'Tech Innovations Inc.',
          },
        ],
      },
      JobType: {
        select: {
          name: 'Remote',
        },
      },
      EmploymentType: {
        select: {
          name: 'Full-time',
        },
      },
      Duration: {
        date: {
          start: '2023-01-15',
          end: null,
        },
      },
      Image: {
        files: [
          {
            file: {
              url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
            },
          },
        ],
      },
      pageMd: `## Overview

As a Senior Fullstack Developer at Tech Innovations Inc., I lead the development of cutting-edge web applications using modern technologies.

### Key Responsibilities

- Architecting and implementing scalable microservices
- Leading a team of 5 developers
- Code review and mentorship
- Performance optimization and monitoring

### Technologies Used

- React, TypeScript, Node.js
- PostgreSQL, Redis
- AWS, Docker, Kubernetes
- CI/CD with GitHub Actions

### Achievements

- Reduced application load time by 60%
- Implemented automated testing, increasing coverage to 85%
- Successfully launched 3 major features ahead of schedule`,
    },
    highlightSkills: [
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'React',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'TypeScript',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'Node.js',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'AWS',
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'mock-exp-2',
    properties: {
      Position: {
        title: [
          {
            plain_text: 'Fullstack Developer',
          },
        ],
      },
      CompanyName: {
        rich_text: [
          {
            plain_text: 'StartUp Solutions',
          },
        ],
      },
      JobType: {
        select: {
          name: 'Hybrid',
        },
      },
      EmploymentType: {
        select: {
          name: 'Full-time',
        },
      },
      Duration: {
        date: {
          start: '2021-06-01',
          end: '2022-12-31',
        },
      },
      Image: {
        files: [
          {
            file: {
              url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
            },
          },
        ],
      },
      pageMd: `## Overview

Developed and maintained multiple client-facing applications in a fast-paced startup environment.

### Key Responsibilities

- Full-stack development of web applications
- Database design and optimization
- API development and integration
- Collaborating with designers and product managers

### Technologies Used

- React, JavaScript, Next.js
- Express.js, MongoDB
- Firebase Authentication
- Vercel, Netlify deployment

### Achievements

- Built 5 production applications from scratch
- Improved database query performance by 40%
- Implemented real-time features using WebSockets`,
    },
    highlightSkills: [
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'JavaScript',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'Next.js',
              },
            ],
          },
        },
      },
      {
        properties: {
          Name: {
            title: [
              {
                plain_text: 'MongoDB',
              },
            ],
          },
        },
      },
    ],
  },
];

// Mock data for individual blog/project detail view
export const mockBlogDetail: any = {
  markdown: `# Getting Started with React and TypeScript

TypeScript has become an essential tool in modern React development. This guide will help you understand the fundamentals and best practices.

## Why TypeScript?

TypeScript provides several benefits:

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Improved autocomplete and IntelliSense
- **Refactoring**: Safer code refactoring
- **Documentation**: Types serve as inline documentation

## Setting Up Your Project

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

## Basic Component Example

\`\`\`tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
\`\`\`

## Conclusion

TypeScript makes React development more robust and maintainable. Start small and gradually add types to your existing projects.
`,
  data: {
    properties: {
      Name: {
        title: [
          {
            plain_text: 'Getting Started with React and TypeScript',
          },
        ],
      },
      'Released Date': {
        date: {
          start: '2024-01-15',
        },
      },
      Min: {
        number: 5,
      },
    },
  },
};

export const mockProjectDetail: any = {
  markdown: `# E-Commerce Platform

A full-featured e-commerce platform built with modern web technologies.

## Features

- **User Authentication**: Secure login and registration
- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add/remove items with real-time updates
- **Payment Integration**: Stripe payment processing
- **Admin Dashboard**: Manage products, orders, and users

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Payment: Stripe API

## Architecture

\`\`\`
Frontend (React)
    ↓
API Gateway
    ↓
Microservices
    ↓
Database
\`\`\`

## Screenshots

![Dashboard](https://images.unsplash.com/photo-1557821552-17105176677c?w=800)

## Demo

Check out the live demo at [demo.example.com](https://demo.example.com)

## Challenges

Building this platform involved several technical challenges:

1. Optimizing database queries for large product catalogs
2. Implementing secure payment processing
3. Building a responsive UI that works across devices

## Lessons Learned

This project taught me the importance of:

- Proper state management
- API design best practices
- Security considerations in e-commerce
`,
  data: {
    properties: {
      Name: {
        title: [
          {
            plain_text: 'E-Commerce Platform',
          },
        ],
      },
      'Released Date': {
        date: {
          start: '2024-01-10',
        },
      },
      Min: {
        number: 8,
      },
    },
  },
};

// Helper function to get mock detail by ID
export const getMockDetailById = (id: string, type: 'blogs' | 'projects') => {
  if (type === 'blogs') {
    const blog = mockBlogs.find((b) => b.id === id);
    if (!blog) return mockBlogDetail;

    return {
      ...mockBlogDetail,
      data: {
        properties: {
          ...blog.properties,
          Min: { number: Math.floor(Math.random() * 10) + 3 },
        },
      },
    };
  } else {
    const project = mockProjects.find((p) => p.id === id);
    if (!project) return mockProjectDetail;

    return {
      ...mockProjectDetail,
      data: {
        properties: {
          ...project.properties,
          Min: { number: Math.floor(Math.random() * 15) + 5 },
        },
      },
    };
  }
};
