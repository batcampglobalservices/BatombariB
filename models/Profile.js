import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: String, default: '80%' },
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, required: true },
  degree: { type: String, required: true },
  detail: { type: String },
  year: { type: String },
}, { _id: true });

const ExperienceSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, required: true },
  role: { type: String, required: true },
  url: { type: String, default: '#' },
  desc: { type: String },
  year: { type: String },
  location: { type: String },
}, { _id: true });

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Batombari Bakpo',
    },
    designation: {
      type: String,
      default: 'Full Stack Engineer | Ethical Hacker | UI/UX Designer',
    },
    profilePhoto: {
      type: String,
      default: '/images/batombari.jpeg',
    },
    resumeUrl: {
      type: String,
      default: '/Batombari-Bakpo.pdf',
    },
    contacts: {
      email: { type: String, default: 'bakpobatombari@gmail.com' },
      phone: { type: String, default: '+234 7048142915' },
      residence: { type: String, default: 'Nigeria' },
      city: { type: String, default: 'Nsukka' },
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com/batcampglobalservices' },
      linkedin: { type: String, default: 'https://www.linkedin.com/in/batombari-bakpo-023091414/' },
      twitter: { type: String, default: 'https://x.com/BBatombari699' },
      facebook: { type: String, default: 'https://www.facebook.com/batombarib.144/' },
    },
    skills: {
      type: [SkillSchema],
      default: [
        { title: 'MERN Stack Developer', level: '75%' },
        { title: 'React Developer', level: '91%' },
        { title: 'Backend Developer', level: '94%' },
        { title: 'Smart Contract Developer', level: '94%' },
        { title: 'Ethical Hacker', level: '94%' },
      ],
    },
    techStack: {
      type: [String],
      default: [
        'JavaScript', 'ReactJS', 'NextJS', 'TypeScript', 'NodeJS',
        'Python', 'Django', 'FastAPI', 'Solidity', 'Cairo',
        'CSS', 'SCSS', 'TailwindCSS', 'Etherjs', 'React Three Fiber',
        'Rest API', 'MongoDB', 'Git', 'GitHub'
      ],
    },
    education: {
      type: [EducationSchema],
      default: [
        {
          id: 0,
          title: 'University of Nigeria Secondary School, Nsukka',
          degree: 'Junior Secondary School Education',
          detail: 'Secondary School Education',
          year: '2023-Present',
        },
      ],
    },
    experience: {
      type: [ExperienceSchema],
      default: [
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
    },
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
