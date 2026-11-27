// TODO: replace the placeholder team members and open roles with real ones.
// Put member photos in /public/team/ and set `photo` (e.g. '/team/sara.jpg').
export interface Member { name: string; role: string; bio: string; photo?: string }

export const team: Member[] = [
  { name: 'Najath', role: 'Founder & CEO', bio: 'Leads company vision and client partnerships.', photo: '/tech/najath.jpg' },
  { name: 'Afnan', role: 'CO-Founder', bio: 'Builds modern digital solutions using cutting-edge technologies.', photo: '/tech/afnan.jpg' },
  { name: 'Firnas', role: 'Human Resources Manager', bio: 'Manages talent acquisition, employee relations, and human resource operations.', photo: '/tech/firnas.jpg' },
  { name: 'Amanda', role: 'Business Development Manager', bio: 'Builds strategic partnerships, develops business opportunities, and drives company growth.', photo: '/tech/Amanda.jpg' },
  { name: 'John', role: 'Project Manager', bio: 'Keeps projects on track and clients informed.', photo: '/tech/John.jpg' },
  { name: 'Sarah', role: 'QA Engineer', bio: 'Makes sure what we ship works the way it should.', photo: '/tech/Sarah.jpg' },
]

export interface Job { slug: string; title: string; type: string; location: string; summary: string; skills: string[] }

export const jobs: Job[] = [
  { slug: 'frontend-developer', title: 'Frontend Developer', type: 'Full-time', location: 'On-site / Hybrid', summary: 'Build responsive, accessible interfaces for client web applications.', skills: ['React', 'TypeScript', 'Tailwind CSS'] },
  { slug: 'java-backend-developer', title: 'Java Spring Boot Developer', type: 'Full-time', location: 'On-site / Hybrid', summary: 'Design REST APIs and data models that power our custom software.', skills: ['Java', 'Spring Boot', 'PostgreSQL'] },
  { slug: 'ui-ux-designer', title: 'UI/UX Designer', type: 'Full-time', location: 'On-site / Hybrid', summary: 'Create wireframes, prototypes and design systems clients love.', skills: ['Figma', 'Prototyping', 'Design systems'] },
  { slug: 'software-intern', title: 'Software Development Intern', type: 'Internship', location: 'On-site', summary: 'Learn on real projects with mentoring from our engineers.', skills: ['Curiosity', 'Any web basics', 'Eagerness to learn'] },
]

export const perks = [
  ['Real projects', 'Work on client products from week one, not busywork.'],
  ['Mentoring', 'Learn from experienced engineers and designers.'],
  ['Modern stack', 'React, TypeScript, Spring Boot and PostgreSQL.'],
  ['Growth', 'Training, internships and a path to bigger roles.'],
] as const
