import dbConnect from '../../../utils/dbConnect';
import Project from '../../../models/Project';

const initialProjects = [
  {
    id: 0,
    projectName: "LWBat AI Learning Platform",
    url: "https://lwbat-tutor-seven.vercel.app/",
    image: "projects/lwbat.png",
    projectDetail:
      "LWBat is a language learning platform that uses AI to create personalized lessons for users. It features gamified lessons, a competitive leaderboard, and Google authentication. The platform is designed to help users learn languages in a fun and engaging way.",
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
      "Bat Agents is a decentralized AI agent marketplace that allows users to create, own, list, and monetize AI agents. Creators can build agents using system prompts and resources, while users can hire these agents for real tasks like coding, research, business support, content creation, and automation. The project combines AI and Web3 to make agent ownership, access, and payments more transparent.",
    technologiesUsed: [
      { tech: "NextJS" },
      { tech: "TypeScript" },
      { tech: "TailwindCSS" },
      { tech: "Three.js" },
      { tech: "0G AI" },
      { tech: "0G Infrastructure" },
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
      { tech: "CSS" },
      { tech: "SCSS" },
    ],
    order: 2,
  },
  {
    id: 3,
    projectName: "Fablyte Africa Company Profile",
    url: "https://fablyte-website.vercel.app/",
    image: "projects/fablyte.png",
    projectDetail:
      "Fablyfe Africa is a climate-smart agricultural enterprise dedicated to helping growers build productive farms. The platform showcases their premium organic farming solutions, including greenhouse and open field setup, climate-smart training for growers, and the supply of premium organic Growmix for healthier crop establishment.",
    technologiesUsed: [
      { tech: "NextJS" },
      { tech: "TailwindCSS" },
      { tech: "CSS" },
      { tech: "SCSS" },
    ],
    order: 3,
  },
  {
    id: 4,
    projectName: "Bat Blogs",
    url: "https://batblogs.vercel.app/",
    image: "projects/batblogs.png",
    projectDetail:
      "A blogs platform that allows users to create and share their blogs online. It offers a wide range of features, including blog creation, editing, and sharing.",
    technologiesUsed: [
      { tech: "React" },
      { tech: "NodeJS" },
      { tech: "MongoDB" },
      { tech: "Express" },
      { tech: "TailwindCSS" },
      { tech: "Scss" },
      { tech: "AI SDK" },
    ],
    order: 4,
  },
  {
    id: 5,
    projectName: "Glohaat Ecommerce website",
    url: "https://bat-editz-glowhaat.vercel.app/",
    image: "projects/glowhaat.png",
    projectDetail:
      "An ecommerce website that allows users to buy and sell products online. It offers a wide range of features, including product listings, shopping carts, payment processing, and order management.",
    technologiesUsed: [
      { tech: "NextJS" },
      { tech: "NodeJS" },
      { tech: "MongoDB" },
      { tech: "Express" },
      { tech: "TailwindCSS" },
      { tech: "AI SDK" },
      { tech: "Stripe" },
    ],
    order: 5,
  },
  {
    id: 6,
    projectName: "BAT-AI",
    url: "https://bat-ai-sigma.vercel.app/ui/multi-modal-chat",
    image: "projects/bat-ai.png",
    projectDetail:
      "Transform your digital experience with Bat AI, an all-in-one multi-modal AI assistant. Bat AI delivers a fast, intuitive, and modern AI solution powered by cutting-edge technology to boost productivity, creativity, and user engagement. Experience smart conversations, enhanced workflows, and seamless interactions—anytime, anywhere.",
    technologiesUsed: [
      { tech: "NextJS" },
      { tech: "Google AI SDK" },
      { tech: "PostgreSQL" },
      { tech: "Material UI" },
      { tech: "TailwindCSS" },
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
      { tech: "Django" },
      { tech: "TailwindCSS" },
    ],
    order: 7,
  },
  {
    id: 8,
    projectName: "BatCommerce",
    url: "https://batcommerce.vercel.app/",
    image: "projects/batcommerce.png",
    projectDetail:
      "Batcommerce is an e-commerce platform that allows users to buy and sell products online. It offers a wide range of features, including product listings, shopping carts, payment processing, and order management.",
    technologiesUsed: [
      { tech: "ReactJS" },
      { tech: ".net" },
      { tech: "REST API's" },
      { tech: "Ant Design" },
      { tech: "TailwindCSS" },
    ],
    order: 8,
  },
  {
    id: 9,
    projectName: "Algorithimic Explorers Website",
    url: "https://algorithmic-explorers.pages.dev/",
    image: "projects/explorers.png",
    projectDetail:
      "Best platform for learning data structures and algorithms with interactive visualizations and coding challenges to enhance problem-solving skills.",
    technologiesUsed: [
      { tech: "ReactJS" },
      { tech: ".net" },
      { tech: "REST API's" },
      { tech: "Ant Design" },
      { tech: "TailwindCSS" },
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
      { tech: "REST API's" },
      { tech: "MUI" },
      { tech: "TailwindCSS" },
    ],
    order: 10,
  },
  {
    id: 11,
    projectName: "FrontendMentor Multi-step-form",
    url: "https://frontend-mentor-bat-multi-step-form.vercel.app/",
    image: "projects/frontendmentor-multi-step-form.png",
    projectDetail:
      "A responsive multi-step subscription form challenge built with modern web technologies, complete with dynamic step validation.",
    technologiesUsed: [
      { tech: "HTML" },
      { tech: "CSS" },
      { tech: "Javascript" },
      { tech: "TailwindCSS" },
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
      { tech: "Javascript" },
      { tech: "TailwindCSS" },
    ],
    order: 12,
  },
];

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'POST' || req.method === 'GET') {
      const force = req.query.force === 'true';
      const existingCount = await Project.countDocuments();

      if (existingCount > 0 && !force) {
        return res.status(200).json({
          success: true,
          message: `Database already contains ${existingCount} projects. Use ?force=true to re-seed.`,
          count: existingCount,
        });
      }

      if (force) {
        await Project.deleteMany({});
      }

      const createdProjects = await Project.insertMany(initialProjects);

      return res.status(201).json({
        success: true,
        message: `Successfully seeded ${createdProjects.length} initial portfolio projects into MongoDB.`,
        data: createdProjects,
      });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Seed API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message,
    });
  }
}
