import dbConnect from '../../utils/dbConnect';
import Profile from '../../models/Profile';

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

export default async function handler(req, res) {
  const { method } = req;

  try {
    await dbConnect();

    switch (method) {
      case 'GET': {
        let profile = await Profile.findOne();
        if (!profile) {
          // Auto initialize profile if none exists
          profile = await Profile.create(defaultProfile);
        }
        return res.status(200).json(profile);
      }

      case 'PUT': {
        const updateData = req.body;

        let profile = await Profile.findOne();
        if (!profile) {
          profile = await Profile.create({ ...defaultProfile, ...updateData });
        } else {
          profile = await Profile.findByIdAndUpdate(
            profile._id,
            { $set: updateData },
            { new: true, runValidators: true }
          );
        }

        return res.status(200).json({
          success: true,
          message: 'Profile updated successfully!',
          data: profile,
        });
      }

      case 'POST': {
        // Force seed profile
        if (req.query.seed === 'true') {
          await Profile.deleteMany({});
          const seeded = await Profile.create(defaultProfile);
          return res.status(201).json({
            success: true,
            message: 'Profile seeded with default configuration',
            data: seeded,
          });
        }
        return res.status(400).json({ success: false, message: 'Invalid operation' });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'POST']);
        return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Profile API Error:', error);
    if (method === 'GET') {
      return res.status(200).json(defaultProfile);
    }
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message,
    });
  }
}
