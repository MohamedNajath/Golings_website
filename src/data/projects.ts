export const categories = ['Web Applications', 'Enterprise Software', 'E-commerce', 'Management Systems', 'UI/UX Design'] as const
export interface Project { slug: string; title: string; category: typeof categories[number]; summary: string
  problem: string; solution: string; features: string[]; tech: string[]; image?: string }

// SAMPLE projects for demonstration. Replace with real client work.
export const projects: Project[] = [
  { slug: 'appointment-platform', title: 'Appointment Platform', category: 'Web Applications', image: '/Project-1.png',
    summary: 'Online booking for service businesses.', problem: 'Bookings were handled by phone and messages, causing double bookings.',
    solution: 'A web app where customers book slots and staff manage schedules.', features: ['Online booking', 'Staff calendars', 'Email reminders'], tech: ['React', 'Spring Boot', 'PostgreSQL'] },
  { slug: 'operations-suite', title: 'Operations Suite', category: 'Enterprise Software', image: '/Project-2.png',
    summary: 'Central workspace for internal operations.', problem: 'Teams tracked work across many disconnected tools.',
    solution: 'One system for tasks, approvals and reports with role-based access.', features: ['Approvals', 'Reporting', 'Role-based access'], tech: ['TypeScript', 'Spring Boot', 'PostgreSQL'] },
  { slug: 'online-storefront', title: 'Online Storefront', category: 'E-commerce', image: '/Project-3.png',
    summary: 'Product catalog, cart and checkout.', problem: 'The business sold only in person and had no online presence.',
    solution: 'A fast storefront with catalog management and order tracking.', features: ['Catalog', 'Cart and checkout', 'Order tracking'], tech: ['React', 'Tailwind CSS', 'MySQL'] },
  { slug: 'inventory-control', title: 'Inventory Control', category: 'Management Systems',
    summary: 'Stock tracking across locations.', problem: 'Spreadsheets caused stock errors and delays.',
    solution: 'A system that tracks stock in real time and flags low levels.', features: ['Stock levels', 'Low-stock alerts', 'Reports'], tech: ['React', 'Spring Boot', 'MySQL'] },
  { slug: 'mobile-banking-concept', title: 'Mobile Banking Concept', category: 'UI/UX Design',
    summary: 'A clear, accessible banking app design.', problem: 'Existing apps felt crowded and hard to navigate.',
    solution: 'Simplified flows and an accessible visual system, tested in a prototype.', features: ['User flows', 'Design system', 'Interactive prototype'], tech: ['Figma', 'Prototyping'] },
  { slug: 'staff-portal', title: 'Staff Portal', category: 'Web Applications',
    summary: 'Self-service portal for employees.', problem: 'HR requests were handled through email.',
    solution: 'A portal for requests, documents and announcements.', features: ['Leave requests', 'Documents', 'Announcements'], tech: ['React', 'TypeScript', 'PostgreSQL'] },
]
