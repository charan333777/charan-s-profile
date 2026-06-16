/**
 * Static content for "Field Notes" — Charan's explorer portfolio. No CMS.
 */

export const PERSON = {
  name: 'Saicharan Duduka',
  nick: 'Charan',
  role: 'DevOps & Cloud Engineer',
  tagline: 'I build reliable cloud platforms and ship SaaS products end-to-end',
  location: 'UK · always exploring',
};

export const CV_HREF = '/cv.pdf';

export const CONTACT = {
  email: 'charan777492@gmail.com',
  linkedin: {
    label: 'linkedin.com/in/saicharan-duduka-b02204233',
    href: 'https://www.linkedin.com/in/saicharan-duduka-b02204233',
  },
  github: {
    label: 'github.com/charan333777',
    href: 'https://github.com/charan333777',
  },
};

export const NAV_LINKS = [
  { href: '#path', label: 'Path' },
  { href: '#grown', label: 'Products' },
  { href: '#lens', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];

/** Intro — explorer + engineer story. Curiosity is the throughline. */
export const INTRO_LINES = [
  'I’m Charan — a DevOps & Cloud Engineer who’s endlessly curious about how things are put together, whether that’s a cloud platform or a house built into a hillside.',
  'Over 5+ years across cloud, automation and product delivery, I’ve learned to design systems that are reliable, secure and cost-aware on Azure, AWS and GCP — and I bring an explorer’s eye to all of it.',
  'Cloud engineer by day, founder by night: I’ve shipped two live SaaS products end-to-end. Off the clock you’ll find me travelling, chasing greenery, and photographing the places that make me stop.',
];

/** Off-the-clock personality — what makes me, me. */
export const INTERESTS = [
  'Traveling',
  'Exploring new places',
  'Greenery & the outdoors',
  'Architecture & design',
  'Figuring out how things work',
];

export const TECH_CHIPS = [
  'Azure',
  'AWS',
  'GCP',
  'CI/CD',
  'Terraform',
  'Azure DevOps',
  'Jenkins',
  'Docker',
  'Kubernetes',
  'Helm',
  'Ansible',
  'Datadog',
  'CloudWatch',
  'Supabase',
  'Stripe',
  'OpenAI API',
];

export const PROOF_POINTS = [
  {
    value: '5+',
    label: 'years combined experience',
    detail: 'cloud, CI/CD, automation and SaaS delivery',
  },
  {
    value: '2',
    label: 'live SaaS products',
    detail: 'designed, shipped and operated solo',
  },
  {
    value: '3',
    label: 'cloud platforms',
    detail: 'hands-on across Azure, AWS and GCP',
  },
];

export const SYSTEMS_I_OWN = [
  {
    title: 'Delivery pipelines',
    detail: 'Azure DevOps, Jenkins, YAML pipelines, Maven, Nexus, SonarQube and release safety.',
  },
  {
    title: 'Cloud foundations',
    detail: 'Azure, AWS and GCP infrastructure using Terraform, ARM Templates and CloudFormation.',
  },
  {
    title: 'Container platforms',
    detail: 'Docker, Kubernetes, Helm, ECS, container registries and service runtime hygiene.',
  },
  {
    title: 'Observability & security',
    detail: 'Datadog, Azure Monitor, CloudWatch, IAM, MFA, private networking and vulnerability scanning.',
  },
  {
    title: 'Product engineering',
    detail: 'Next.js, Node.js, TypeScript, Supabase, Stripe, OpenAI API and production SaaS operations.',
  },
];

export type Milestone = {
  org: string;
  role: string;
  period: string;
  blurb: string;
  tags: string[];
  side: 'left' | 'right';
  metric?: string;
  now?: boolean;
};

export const TIMELINE: Milestone[] = [
  {
    org: 'Capgemini',
    role: 'DevOps Engineer',
    period: 'Mar 2021 - May 2023',
    blurb:
      'Managed Azure and GCP infrastructure, reusable Terraform modules, CI/CD pipelines, container workflows and monitoring for enterprise environments.',
    tags: ['Azure', 'GCP', 'Terraform'],
    side: 'left',
  },
  {
    org: 'University of East London',
    role: 'Cloud Engineer Intern',
    period: 'Aug 2023 - Jun 2024',
    blurb:
      'Deployed AWS infrastructure with EC2, RDS, VPC, Route 53, IAM, CloudFormation, S3 and CloudWatch while supporting Jenkins pipelines.',
    tags: ['AWS', 'CloudFormation', 'Jenkins'],
    side: 'right',
  },
  {
    org: 'University of East London',
    role: 'Software & Project Intern',
    period: 'Jun 2024 - Feb 2025',
    blurb:
      'Supported a university web application moving toward production with backend work, DevOps process improvements and release coordination.',
    tags: ['Backend', 'DevOps', 'Delivery'],
    side: 'left',
  },
  {
    org: 'CUBE',
    role: 'DevOps Engineer',
    period: 'Feb 2025 - Mar 2026',
    blurb:
      'Designed Azure and GCP IaaS/PaaS solutions, built release pipelines, automated tooling with Ansible and managed Docker/Kubernetes workloads.',
    tags: ['Azure', 'GCP', 'Kubernetes'],
    side: 'right',
  },
  {
    org: 'CVMindAI',
    role: 'Founder & Full-Stack Developer',
    period: 'Apr 2026 - present',
    blurb:
      'Sole founder of an AI-powered CV optimisation platform, owning product design, full-stack engineering, AI workflows, Stripe payments and production operations.',
    tags: ['Next.js', 'OpenAI', 'Stripe'],
    side: 'left',
    now: true,
  },
];

export type Product = {
  name: string;
  pitch: string;
  problem: string;
  built: string;
  result: string;
  url: string;
  domain: string;
  tags: string[];
  status: string;
  preview: 'board' | 'cv';
};

export const PRODUCTS: Product[] = [
  {
    name: 'Banddle',
    pitch:
      'A free, no-friction tracker for every job application — stages, notes and follow-ups on one calm board.',
    problem: 'Job hunters lose momentum when applications, follow-ups and notes live in different places.',
    built: 'A Next.js and Tailwind app with Supabase PostgreSQL, auth, Row-Level Security and structured job tracking.',
    result: 'Live on Vercel with custom DNS, SSL, SEO, accessibility improvements, privacy policy and terms.',
    url: 'https://banddle.com',
    domain: 'banddle.com',
    tags: ['Next.js', 'Supabase', 'RLS', 'Vercel'],
    status: 'Live · solo SaaS · production',
    preview: 'board',
  },
  {
    name: 'CVMindAI',
    pitch:
      'An AI-powered CV optimisation platform for UK job seekers — from CV parsing to ATS-style scoring and polished exports.',
    problem: 'Strong candidates still get filtered out when their CV does not mirror the role language.',
    built: 'A Next.js, TypeScript and Node.js product with OpenAI CV parsing, job analysis, ATS scoring, rewrites and PDF/DOCX exports.',
    result: 'Live with Supabase auth/data, Stripe payments, entitlements, analytics and production validation checks.',
    url: 'https://cvmindai.com',
    domain: 'cvmindai.com',
    tags: ['Next.js', 'OpenAI', 'Stripe', 'Supabase'],
    status: 'Live · founder-built · production',
    preview: 'cv',
  },
];

export const GALLERY_CAPTION =
  'From the road — greenery, ridgelines, and the buildings that made me stop.';

export const WORKING_STYLE = [
  'Cloud breadth: Azure, AWS and GCP with infrastructure-as-code discipline.',
  'Production ownership: CI/CD, observability, security and release reliability.',
  'Founder mindset: I care about users, cost, maintainability and shipping.',
];
