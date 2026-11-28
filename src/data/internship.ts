import { Bug, Braces, Globe, LucideIcon, Megaphone, PenTool } from 'lucide-react'
import { policy, TBC } from './internshipConfig'

export type Slug = 'software-engineering' | 'web-development' | 'qa-engineering' | 'ui-ux-design' | 'digital-marketing'
export interface Program {
  slug: Slug; title: string; formLabel: string; tagline: string; icon: LucideIcon; short: string; description: string
  keyTech: string[]; groups: { title: string; items: string[] }[]
  practicalTitle: string; practical: string[]; practicalText?: string; careers: string[]; duration: string
}

export const programs: Program[] = [
  {
    slug: 'software-engineering', title: 'Software Engineering & Full Stack Development', formLabel: 'Software Engineering & Full Stack Development', tagline: 'Become a Professional Software Engineer.', icon: Braces,
    short: 'Build modern, scalable applications across frontend, backend, databases, cloud, DevOps and AI-assisted development.',
    description: 'Develop comprehensive software engineering skills and learn to build modern, scalable, and high-performance applications using industry-relevant programming languages, frameworks, and technologies. This program covers frontend development, backend engineering, databases, software architecture, APIs, cloud computing, DevOps, and AI-assisted development.',
    keyTech: ['Java', 'Spring Boot', 'Python', 'React.js', 'PostgreSQL', 'Docker', 'AWS', 'Generative AI'],
    groups: [
      { title: 'A. Programming Languages', items: ['Java', 'Python', 'JavaScript', 'Object-Oriented Programming', 'Data Structures and Algorithms', 'Programming Fundamentals'] },
      { title: 'B. Java & Backend Engineering', items: ['Core Java', 'Advanced Java', 'Java 8 and Modern Java Features', 'Spring Framework', 'Spring Boot', 'Spring MVC', 'Spring Security', 'RESTful API Development', 'Microservices Architecture', 'Authentication and Authorization', 'Backend Application Development'] },
      { title: 'C. Python Development', items: ['Python Fundamentals', 'Object-Oriented Programming with Python', 'Python Application Development', 'Python Backend Development', 'API Integration', 'AI and Python Integration'] },
      { title: 'D. Frontend Development', items: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Responsive Web Design', 'Component-Based Development', 'API Integration', 'Modern Frontend Architecture'] },
      { title: 'E. Database Engineering', items: ['SQL', 'MySQL', 'PostgreSQL', 'Database Design', 'Database Relationships', 'Query Optimization', 'Database Integration'] },
      { title: 'F. AI & Modern Technologies', items: ['Artificial Intelligence Fundamentals', 'Generative AI', 'AI-Assisted Software Development', 'Large Language Model Integration', 'AI API Integration', 'Prompt Engineering', 'Intelligent Application Development'] },
      { title: 'G. Cloud & DevOps', items: ['Git and GitHub', 'Docker', 'Kubernetes', 'AWS Cloud Fundamentals', 'CI/CD Pipelines', 'Jenkins', 'Application Deployment', 'DevOps Fundamentals'] },
      { title: 'H. Modern Software Engineering Practices', items: ['Software Development Life Cycle (SDLC)', 'Agile and Scrum', 'Software Architecture', 'Design Patterns', 'Clean Code Principles', 'Unit Testing', 'Integration Testing', 'Debugging', 'Code Reviews', 'System Design', 'Team Collaboration'] },
    ],
    practicalTitle: 'Practical Project Experience',
    practicalText: 'Participants work on supervised software development projects and assigned development modules.',
    practical: ['Requirement analysis', 'Database design', 'Backend development', 'Frontend development', 'REST API integration', 'Authentication', 'Testing and debugging', 'Version control', 'Application deployment', 'Documentation'],
    careers: ['Software Engineer', 'Java Developer', 'Java Backend Developer', 'Python Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Junior Software Engineer'], duration: '6 Months',
  },
  {
    slug: 'web-development', title: 'Web Development', formLabel: 'Web Development', tagline: 'Build Modern & Responsive Websites.', icon: Globe,
    short: 'Design, develop and maintain professional websites and modern web applications.',
    description: 'Learn how to design, develop, and maintain professional websites and modern web applications.',
    keyTech: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Git & GitHub', 'Deployment'],
    groups: [{ title: 'Training Curriculum', items: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design', 'React.js', 'Modern UI Development', 'Website Development', 'API Integration', 'Website Optimization', 'Cross-Browser Compatibility', 'Website Hosting', 'Deployment', 'Git and GitHub'] }],
    practicalTitle: 'Practical Experience', practical: [], practicalText: 'Build responsive business websites, landing pages, portfolio websites, and modern web applications.',
    careers: ['Web Developer', 'Frontend Developer', 'Junior React Developer', 'Website Developer', 'Web Application Developer'], duration: '6 Months',
  },
  {
    slug: 'qa-engineering', title: 'Quality Assurance Engineering', formLabel: 'QA Engineering', tagline: 'Build Quality Software With Confidence.', icon: Bug,
    short: 'Learn professional software testing methodologies and quality assurance practices.',
    description: 'Learn professional software testing methodologies and quality assurance practices to ensure applications meet functional and quality requirements.',
    keyTech: ['Manual Testing', 'Test Cases', 'Postman', 'Selenium', 'Agile & Scrum', 'Bug Reporting'],
    groups: [{ title: 'Training Curriculum', items: ['Software Testing Fundamentals', 'Software Development Life Cycle', 'Software Testing Life Cycle', 'Manual Testing', 'Test Case Design', 'Test Planning', 'Test Execution', 'Bug Tracking and Reporting', 'Defect Life Cycle', 'Regression Testing', 'Smoke Testing', 'API Testing', 'Postman', 'Selenium Automation Testing', 'Agile and Scrum', 'Test Documentation'] }],
    practicalTitle: 'Practical Experience', practical: [], practicalText: 'Test real-world training applications, create test cases, report defects, and participate in software quality assurance activities.',
    careers: ['QA Engineer', 'Software Tester', 'Manual Tester', 'Automation Tester', 'Junior QA Analyst'], duration: '6 Months',
  },
  {
    slug: 'ui-ux-design', title: 'UI/UX Design', formLabel: 'UI/UX Design', tagline: 'Design Experiences People Love.', icon: PenTool,
    short: 'Design attractive, intuitive, accessible and user-friendly digital experiences.',
    description: 'Learn how to design attractive, intuitive, accessible, and user-friendly digital experiences.',
    keyTech: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems', 'User Research', 'Usability Testing'],
    groups: [{ title: 'Training Curriculum', items: ['UI Design Fundamentals', 'UX Design Fundamentals', 'User Research', 'User Personas', 'User Journey Mapping', 'Information Architecture', 'Wireframing', 'Prototyping', 'Figma', 'Responsive Interface Design', 'Design Systems', 'Typography', 'Color Theory', 'Usability Testing', 'Developer Handoff'] }],
    practicalTitle: 'Practical Experience', practical: [], practicalText: 'Design real-world website interfaces, dashboards, application screens, wireframes, and interactive prototypes.',
    careers: ['UI Designer', 'UX Designer', 'UI/UX Designer', 'Product Designer', 'Junior Digital Designer'], duration: '6 Months',
  },
  {
    slug: 'digital-marketing', title: 'Social Media & Digital Marketing', formLabel: 'Social Media & Digital Marketing', tagline: 'Build Brands. Grow Digital Presence.', icon: Megaphone,
    short: 'Learn how businesses build a digital presence, attract customers and run effective campaigns.',
    description: 'Learn how businesses build their digital presence, attract customers, manage social media platforms, and execute effective digital marketing strategies.',
    keyTech: ['Social Media', 'SEO', 'Google Analytics', 'Content Planning', 'Campaigns', 'AI-Assisted Content'],
    groups: [{ title: 'Training Curriculum', items: ['Digital Marketing Fundamentals', 'Social Media Marketing', 'Facebook Marketing', 'Instagram Marketing', 'LinkedIn Marketing', 'Social Media Management', 'Content Planning', 'Content Creation', 'Graphic Content Fundamentals', 'SEO Fundamentals', 'Keyword Research', 'Google Analytics', 'Campaign Planning', 'Digital Advertising Fundamentals', 'Marketing Performance Analysis', 'AI-Assisted Content Creation'] }],
    practicalTitle: 'Practical Experience', practical: [], practicalText: 'Work on supervised digital marketing projects, content calendars, social media strategies, and marketing performance reports.',
    careers: ['Digital Marketing Executive', 'Social Media Manager', 'Social Media Executive', 'SEO Executive', 'Content Marketing Executive', 'Digital Marketing Specialist'], duration: '6 Months',
  },
]
export const programBySlug = (s?: string) => programs.find(p => p.slug === s)

export const approach = ['Practical learning', 'Real-world project experience', 'Industry-relevant technologies', 'Professional mentorship', 'Technical skill development', 'Team collaboration', 'Career preparation']
export const eligible = ['University final-year students', 'Students from recognized higher education institutes', 'Recent university graduates', 'Degree holders', 'Diploma holders', 'Higher Diploma holders', 'Individuals who have completed their studies', 'Aspiring developers looking for practical experience']

export const roadmap = [
  { m: 1, title: 'Foundation & Onboarding', items: ['Program orientation', 'Development environment setup', 'Programming or specialization fundamentals', 'Tools and technologies', 'Git and GitHub', 'Professional communication'] },
  { m: 2, title: 'Technical Development', items: ['Core technologies', 'Frameworks and tools', 'Practical assignments', 'Technical exercises', 'Problem-solving', 'Mentor feedback'] },
  { m: 3, title: 'Project Introduction', items: ['Project requirements', 'Requirement analysis', 'Project planning', 'System design', 'Database design', 'Initial implementation'] },
  { m: 4, title: 'Advanced Development', items: ['Feature development', 'Integration', 'Testing', 'Debugging', 'Code review', 'Team collaboration'] },
  { m: 5, title: 'Project Experience', items: ['Assigned project responsibilities', 'Practical implementation', 'Quality improvement', 'Documentation', 'Agile collaboration', 'Deployment practices'] },
  { m: 6, title: 'Final Evaluation', items: ['Project completion', 'Final testing', 'Project presentation', 'Technical evaluation', 'Performance assessment', 'Career guidance'] },
]

export const projectActivities = ['Understanding business requirements', 'Requirement analysis', 'Project planning', 'Application development', 'Database design', 'UI/UX implementation', 'API integration', 'Software testing', 'Debugging', 'Documentation', 'Version control', 'Deployment']

export const modes = [
  { key: 'online', title: 'Online Training', text: 'Learn remotely through online mentoring, virtual meetings, collaboration platforms, and practical assignments.' },
  { key: 'hybrid', title: 'Hybrid Training', text: 'Combine online training with selected in-person sessions and collaborative project activities.' },
  { key: 'on-site', title: 'On-site Training', text: 'Gain practical experience through in-person training and collaboration at the Goalings workplace, subject to availability.' },
] as const

// Technology categories → which programs they are relevant to (so we never imply every technology is in every program)
export const techCategories: { name: string; programs: Slug[] }[] = [
  { name: 'Artificial Intelligence', programs: ['software-engineering'] },
  { name: 'Generative AI', programs: ['software-engineering', 'digital-marketing'] },
  { name: 'AI-Assisted Development', programs: ['software-engineering', 'web-development'] },
  { name: 'Modern Web Technologies', programs: ['software-engineering', 'web-development'] },
  { name: 'Cloud Computing', programs: ['software-engineering'] },
  { name: 'Microservices Architecture', programs: ['software-engineering'] },
  { name: 'Database Engineering', programs: ['software-engineering'] },
  { name: 'DevOps', programs: ['software-engineering', 'web-development'] },
  { name: 'Software Testing', programs: ['qa-engineering', 'software-engineering'] },
  { name: 'UI/UX Design Tools', programs: ['ui-ux-design'] },
  { name: 'Digital Marketing Technologies', programs: ['digital-marketing'] },
]
export const programLogos: Record<Slug, string[]> = {
  'software-engineering': ['Java Spring Boot', 'React', 'JavaScript', 'Node.js', 'PostgreSQL', 'MySQL'],
  'web-development': ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS'], 'qa-engineering': [], 'ui-ux-design': [], 'digital-marketing': [],
}

export const mentorship = ['Technical mentorship', 'Code reviews where applicable', 'Practical problem-solving', 'Project guidance', 'Development feedback', 'Team collaboration', 'Professional communication', 'Career preparation', 'Progress evaluations']
export const careerPoints = ['Performance-based evaluation', 'Technical assessment', 'Professional development feedback', 'Potential employment consideration', 'Opportunities based on available vacancies and company requirements']
export const deliverables = [['Internship Completion Certificate', 'Awarded after successfully completing the program and meeting its requirements.'], ['Internship Experience Letter', 'A formal letter describing your internship experience.'], ['Practical Project Experience', 'Hands-on work you can talk about in interviews.'], ['Professional Development Feedback', 'Constructive evaluation to guide your next steps.']]

export const faqs: { q: string; a: string }[] = [
  { q: 'Who can apply for the internship program?', a: 'University final-year students, students from recognized higher education institutes, recent graduates, degree holders, diploma and higher diploma holders, individuals who have completed their studies, and aspiring developers looking for practical experience. You do not need extensive professional experience, only passion, willingness to learn and commitment.' },
  { q: 'Can final-year university students apply?', a: 'Yes. University final-year students are welcome to apply.' },
  { q: 'Can diploma holders apply?', a: 'Yes. Diploma and Higher Diploma holders are welcome to apply.' },
  { q: 'Can recent graduates apply?', a: 'Yes. Recent graduates and degree holders are welcome to apply.' },
  { q: 'How long does the internship program last?', a: 'Each program runs for six months.' },
  { q: 'Which training programs are available?', a: 'Five programs: Software Engineering & Full Stack Development, Web Development, QA Engineering, UI/UX Design, and Social Media & Digital Marketing.' },
  { q: 'What technologies will I learn in Software Engineering?', a: 'The Software Engineering & Full Stack Development program covers Java, Python and JavaScript, Spring Boot and microservices, React.js, SQL with MySQL and PostgreSQL, AI and generative AI integration, Git, Docker, Kubernetes, AWS fundamentals, CI/CD and modern engineering practices. The roadmap is flexible, so activities are adapted to the learner and the specialization.' },
  { q: 'Will I work on real-world projects?', a: 'Yes. Interns take part in supervised development activities and assigned project modules for their specialization. Where applicable, interns may contribute to internal products, training projects, or approved company projects under appropriate supervision. Access to confidential client systems or production environments is not part of the program.' },
  { q: 'Is previous programming experience required?', a: 'No extensive experience is required. We welcome people who are passionate about technology and willing to learn. Basic familiarity with your chosen field helps, and you can describe what you already know in the application form.' },
  { q: 'What training modes are available?', a: 'Online, Hybrid and On-site (subject to availability). You choose your preferred mode in the application form.' },
  { q: 'Is the internship paid or unpaid?', a: policy.stipend || TBC },
  { q: 'Will I receive a certificate?', a: 'Yes. Participants who successfully complete the six-month program and fulfil its requirements receive an Internship Completion Certificate.' },
  { q: 'Will I receive an experience letter?', a: 'Yes. Participants who successfully complete the program and fulfil its requirements receive an Internship Experience Letter.' },
  { q: 'Can interns get permanent employment opportunities?', a: 'Employment is not guaranteed. Participants who demonstrate strong technical ability, professional commitment, teamwork and consistent performance may be considered for suitable opportunities at Goalings, based on available vacancies and company requirements.' },
  { q: 'How do I submit my application?', a: 'Complete the application form on this page, attach your CV as a PDF, accept the Privacy Policy and Terms and Conditions, and press Submit Application. You will see a confirmation with your application reference.' },
  { q: 'What happens after submitting my application?', a: `You receive a confirmation email with your reference number (when email delivery is available). Our team then reviews your application and contacts you regarding the next steps. ${policy.reviewTime}`.trim() },
]
export const faqExtra = { fees: policy.fees, hours: policy.workingHours, starts: policy.startDates, deadline: policy.applicationDeadline }
