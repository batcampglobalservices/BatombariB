const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
let MONGODB_URI = 'mongodb://127.0.0.1:27017/portfolio';
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
    if (match && match[1]) {
      MONGODB_URI = match[1];
    }
  }
} catch (e) {}

const TechnologySchema = new mongoose.Schema({ tech: String }, { _id: false });
const ProjectSchema = new mongoose.Schema({
  id: Number,
  projectName: String,
  url: String,
  image: String,
  projectDetail: String,
  technologiesUsed: [TechnologySchema],
  order: Number,
}, { timestamps: true });

const ProfileSchema = new mongoose.Schema({
  name: String,
  designation: String,
  profilePhoto: String,
  resumeUrl: String,
  contacts: Object,
  socialLinks: Object,
  skills: Array,
  techStack: Array,
  education: Array,
  experience: Array,
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

const initialProjects = [
  {
    id: 0,
    projectName: "LWBat AI Learning Platform",
    url: "https://lwbat-tutor-seven.vercel.app/",
    image: "projects/lwbat.png",
    projectDetail:
      "LWBat is a language learning platform that uses AI to create personalized lessons for users. It features gamified lessons, a competitive leaderboard, and Google authentication.",
    technologiesUsed: [
      { tech: "NextJS" },
      { tech: "TypeScript" },
      { tech: "TailwindCSS" },
      { tech: "Mysql" },
      { tech: "Prisma" },
      { tech: "Vercel AI SDK" },
    ],
    order: 0,
  },
  {
    id: 1,
    projectName: "Bat Agents",
    url: "https://bat-agents.vercel.app/",
    image: "projects/batagent.png",
    projectDetail:
      "Bat Agents is a decentralized AI agent marketplace that allows users to create, own, list, and monetize AI agents.",
    technologiesUsed: [
      { tech: "NextJS" },
      { tech: "TypeScript" },
      { tech: "TailwindCSS" },
      { tech: "Three.js" },
      { tech: "0G AI" },
    ],
    order: 1,
  },
  {
    id: 2,
    projectName: "Real Estate Website Template",
    url: "https://batcamp-real-estate-demo.vercel.app/",
    image: "projects/real-estate.png",
    projectDetail:
      "Real Estate Website is a website template for potential real estate business owners",
    technologiesUsed: [
      { tech: "React" },
      { tech: "TailwindCSS" },
      { tech: "Three.js" },
    ],
    order: 2,
  },
  {
    id: 3,
    projectName: "Fablyte Africa Company Profile",
    url: "https://fablyte-website.vercel.app/",
    image: "projects/fablyte.png",
    projectDetail:
      "Fablyfe Africa is a climate-smart agricultural enterprise dedicated to helping growers build productive farms.",
    technologiesUsed: [
      { tech: "NextJS" },
      { tech: "TailwindCSS" },
    ],
    order: 3,
  },
  {
    id: 4,
    projectName: "Bat Blogs",
    url: "https://batblogs.vercel.app/",
    image: "projects/batblogs.png",
    projectDetail:
      "A blogs platform that allows users to create and share their blogs online.",
    technologiesUsed: [
      { tech: "React" },
      { tech: "NodeJS" },
      { tech: "MongoDB" },
    ],
    order: 4,
  },
  {
    id: 5,
    projectName: "Glohaat Ecommerce website",
    url: "https://bat-editz-glowhaat.vercel.app/",
    image: "projects/glowhaat.png",
    projectDetail:
      "An ecommerce website that allows users to buy and sell products online.",
    technologiesUsed: [
      { tech: "NextJS" },
      { tech: "NodeJS" },
      { tech: "MongoDB" },
    ],
    order: 5,
  },
  {
    id: 6,
    projectName: "BAT-AI",
    url: "https://bat-ai-sigma.vercel.app/ui/multi-modal-chat",
    image: "projects/bat-ai.png",
    projectDetail:
      "Transform your digital experience with Bat AI, an all-in-one multi-modal AI assistant.",
    technologiesUsed: [
      { tech: "NextJS" },
      { tech: "Google AI SDK" },
      { tech: "PostgreSQL" },
    ],
    order: 6,
  },
  {
    id: 7,
    projectName: "UPSN-Website",
    url: "https://upsn-website.vercel.app/",
    image: "projects/upsn.png",
    projectDetail:
      "UPSN Result Checker offers a quick, user-friendly, and dependable solution for students to access their results with ease.",
    technologiesUsed: [
      { tech: "ReactJS" },
      { tech: "Supabase" },
    ],
    order: 7,
  },
  {
    id: 8,
    projectName: "BatCommerce",
    url: "https://batcommerce.vercel.app/",
    image: "projects/batcommerce.png",
    projectDetail:
      "Batcommerce is an e-commerce platform that allows users to buy and sell products online.",
    technologiesUsed: [
      { tech: "ReactJS" },
      { tech: ".net" },
    ],
    order: 8,
  },
  {
    id: 9,
    projectName: "Algorithimic Explorers Website",
    url: "https://algorithmic-explorers.pages.dev/",
    image: "projects/explorers.png",
    projectDetail:
      "Best platform for learning data structures and algorithms with interactive visualizations and coding challenges.",
    technologiesUsed: [
      { tech: "ReactJS" },
      { tech: "Ant Design" },
    ],
    order: 9,
  },
  {
    id: 10,
    projectName: "Batcamp Website",
    url: "https://batcamp-global-services.vercel.app/",
    image: "projects/batcamp.png",
    projectDetail:
      "Official website for Batcamp Global Services showcasing company profile, digital solutions, and tech consulting offerings.",
    technologiesUsed: [
      { tech: "NextJS" },
      { tech: "NodeJS" },
    ],
    order: 10,
  },
  {
    id: 11,
    projectName: "FrontendMentor Multi-step-form",
    url: "https://frontend-mentor-bat-multi-step-form.vercel.app/",
    image: "projects/frontendmentor-multi-step-form.png",
    projectDetail:
      "A responsive multi-step subscription form challenge built with modern web technologies.",
    technologiesUsed: [
      { tech: "HTML" },
      { tech: "CSS" },
    ],
    order: 11,
  },
  {
    id: 12,
    projectName: "FrontendMentor RSS-news-feed",
    url: "https://frontend-mentor-feed-reader-main.vercel.app/",
    image: "projects/frontendmentor-rss-news-feed.png",
    projectDetail:
      "An interactive RSS Feed Reader web application providing modern news summary and article reading experience.",
    technologiesUsed: [
      { tech: "Vite" },
      { tech: "Typescript" },
    ],
    order: 12,
  },
];

const defaultProfile = {
  name: 'Batombari Bakpo',
  designation: 'Full Stack Engineer | Ethical Hacker | UI/UX Designer',
  profilePhoto: '/images/batombari.jpeg',
  resumeUrl: '/Batombari-Bakpo.pdf',
  contacts: {
    email: 'bakpobatombari@gmail.com',
    phone: '+234 7048142915',
    residence: 'Nigeria',
    city: 'Nsukka',
  },
  socialLinks: {
    github: 'https://github.com/batcampglobalservices',
    linkedin: 'https://www.linkedin.com/in/batombari-bakpo-023091414/',
    twitter: 'https://x.com/BBatombari699',
    facebook: 'https://www.facebook.com/batombarib.144/',
  },
  skills: [
    { title: 'MERN Stack Developer', level: '75%' },
    { title: 'React Developer', level: '91%' },
    { title: 'Backend Developer', level: '94%' },
    { title: 'Smart Contract Developer', level: '94%' },
    { title: 'Ethical Hacker', level: '94%' },
  ],
  techStack: [
    'JavaScript', 'ReactJS', 'NextJS', 'TypeScript', 'NodeJS',
    'Python', 'Django', 'FastAPI', 'Solidity', 'Cairo',
    'CSS', 'SCSS', 'TailwindCSS', 'Etherjs', 'React Three Fiber',
    'Rest API', 'MongoDB', 'Git', 'GitHub'
  ],
  education: [
    {
      id: 0,
      title: 'University of Nigeria Secondary School, Nsukka',
      degree: 'Junior Secondary School Education',
      detail: 'Secondary School Education',
      year: '2023-Present',
    },
  ],
  experience: [
    {
      id: 1,
      title: 'Algorithmic Explorers',
      role: 'Fullstack Engineer',
      url: 'no website',
      desc: 'As a fullstack engineer, I use React, Next, Django Rest Framework, & JavaScript to build web applications.',
      year: '08/25 - Present',
      location: 'Nigeria',
    },
    {
      id: 2,
      title: 'HNG Internship',
      role: 'Internee',
      url: 'no website',
      desc: 'As an Internee, I learned how to use React & JavaScript to build interactive websites.',
      year: '08/2025 - 12/25',
      location: 'Nigeria',
    },
    {
      id: 3,
      title: 'Ginakev Digital Academy',
      role: 'Backend Developer',
      url: 'https://www.gida.academy/',
      desc: "I work there as a Backend developer, there I learned how to do CRUD'S operations in Python, also I worked on Supabase",
      year: '08/2025 - Present',
      location: 'Nigeria',
    },
  ],
};

async function runSeed() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Seed Projects
    await Project.deleteMany({});
    const createdProjects = await Project.insertMany(initialProjects);
    console.log(`Seeded ${createdProjects.length} projects into MongoDB!`);

    // Seed Profile
    await Profile.deleteMany({});
    await Profile.create(defaultProfile);
    console.log('Seeded Profile document into MongoDB!');

    process.exit(0);
  } catch (err) {
    console.error('Seed execution error:', err.message);
    process.exit(1);
  }
}

runSeed();
