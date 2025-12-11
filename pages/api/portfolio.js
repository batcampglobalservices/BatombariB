const portfolio = [
  {
    id: 0,
    projectName: "BAT-AI",
    url: "https://bat-ai-sigma.vercel.app/",
    image: "projects/bat-ai.png",
    projectDetail:
      "Transform your digital experience with Bat AI, an all-in-one multi-modal AI assistant.Bat AI delivers a fast, intuitive, and modern AI solution powered by cutting-edge technology to boost productivity, creativity, and user engagement.Experience smart conversations, enhanced workflows, and seamless interactions—anytime, anywhere.",
    technologiesUsed: [
      {
        tech: "NextJS",
      },
      {
        tech: "Google AI SDK",
      },
      {
        tech: "PostgreSQL",
      },
      {
        tech: "Material UI",
      },
      {
        tech: "TailwindCSS",
      },
    ],
  },
  {
    id: 1,
    projectName: "UPSN-Website",
    url: "https://upsn-website.vercel.app/",
    image: "projects/upsn.png",
    projectDetail:
      "UPSN Result Checker offers a quick, user-friendly, and dependable solution for students to access their results with ease.",
    technologiesUsed: [
      {
        tech: "ReactJS",
      },
      {
        tech: "Supabase",
      },
      {
        tech: "Django",
      },
      {
        tech: "TailwindCSS",
      },
    ],
  },
  {
    id: 2,
    projectName: "BatCommerce",
    url: "https://batcommerce.vercel.app/",
    image: "projects/batcommerce.png",
    projectDetail:
      "Batcommerce is an e-commerce platform that allows users to buy and sell products online. It offers a wide range of features, including product listings, shopping carts, payment processing, and order management.",
    technologiesUsed: [
      {
        tech: "ReactJS",
      },
      {
        tech: ".net",
      },
      {
        tech: "REST API's",
      },
      {
        tech: "Ant Design",
      },
      {
        tech: "TailwindCSS",
      },
    ],
  },
  {
    id: 3,
    projectName: "Algorithimic Explorers Website",
    url: "https://algorithmic-explorers.pages.dev/",
    image: "projects/explorers.png",
    projectDetail:
      "Invest in Saudi Arabia, Streamline Your Business Setup Process in Saudi Arabia with FirmSanad Simplify the process of obtaining licenses and starting a business in Saudi Arabia with our streamlined platform.",
    technologiesUsed: [
      {
        tech: "ReactJS",
      },
      {
        tech: ".net",
      },
      {
        tech: "REST API's",
      },
      {
        tech: "Ant Design",
      },
      {
        tech: "TailwindCSS",
      },
    ],
  },
  {
    id: 4,
    projectName: "Bloombreed Clone",
    url: "https://bloombreed-schools.com/",
    image: "projects/bloombreed.png",
    projectDetail:
      "The clone of Bloombreed Schools website, a platform that provides information about their schools, their programs, admissions, and other related details.",
    technologiesUsed: [
      {
        tech: "ReactJS",
      },
      {
        tech: ".net",
      },
      {
        tech: "REST API's",
      },
      {
        tech: "Ant Design",
      },
      {
        tech: "TailwindCSS",
      },
    ],
  },
  {
    id: 5,
    projectName: "Jumia Clone",
    url: "/domain-expired",
    image: "projects/jumia.png",
    projectDetail:
      "Jumia is ecommerce website,  where you can open your own store and sell products of different brands!",
    technologiesUsed: [
      {
        tech: "Nextjs with SSR",
      },
      {
        tech: "Laravel",
      },
      {
        tech: "REST API's",
      },
      {
        tech: "Ant Design",
      },
      {
        tech: "TailwindCSS",
      },
    ],
  },
  {
    id: 6,
    projectName: "Batcamp Website",
    url: "https://batcamp-global-services.vercel.app/",
    image: "projects/batcamp.png",
    projectDetail:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam corrupti aut veritatis, adipisci natus optio dolores cum rem? Aut perferendis fugit, eos rerum totam aspernatur iure alias temporibus ipsa perspiciatis!",
    technologiesUsed: [
      {
        tech: "NextJS",
      },
      {
        tech: "NodeJS",
      },
      {
        tech: "REST API's",
      },
      {
        tech: "MUI",
      },
      {
        tech: "TailwindCSS",
      },
    ],
  },
  {
    id: 2,
    projectName: "Hotels.ng Clone",
    url: "https://hotels.ng/",
    image: "projects/hotels.png",
    projectDetail:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam corrupti aut veritatis, adipisci natus optio dolores cum rem? Aut perferendis fugit, eos rerum totam aspernatur iure alias temporibus ipsa perspiciatis!",
    technologiesUsed: [
      {
        tech: "ReactJS",
      },
      {
        tech: "NodeJS",
      },
      {
        tech: "REST API's",
      },
      {
        tech: "Ant Design",
      },
      {
        tech: "TailwindCSS",
      },
    ],
  },
  // {
  //     id: 2,
  //     projectName: "Culyte",
  //     url: "https://culyte.com",
  //     image: "projects/culyte.png",
  //     projectDetail: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam corrupti aut veritatis, adipisci natus optio dolores cum rem? Aut perferendis fugit, eos rerum totam aspernatur iure alias temporibus ipsa perspiciatis!",
  //     technologiesUsed: [
  //         {
  //             tech: "ReactJS"
  //         },
  //         {
  //             tech: "NodeJS"
  //         },
  //         {
  //             tech: "Ant Design"
  //         },
  //         {
  //             tech: "TailwindCSS"
  //         },
  //     ]
  // },
];
export default function handler(req, res) {
  res.status(200).json(portfolio);
}
