import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { FaDownload, FaFacebook, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Contact from './Contact';
import Download from './Download';
import Languages from './Languages';
import Location from './Location';
import Tools from './Tools';
import Skills from './Skills';
import { NAME, DESIGNATION, SOCIAL_LINKS } from '../../../constants/constants';

const Intro = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => axios.get('/api/profile').then(({ data }) => data).catch(() => null),
    staleTime: 1000 * 60 * 5,
  });

  const name = profile?.name || NAME;
  const designation = profile?.designation || DESIGNATION;
  const photo = profile?.profilePhoto || '/images/batombari.jpeg';
  const resumeUrl = profile?.resumeUrl || '/Batombari-Bakpo.pdf';
  const social = profile?.socialLinks || SOCIAL_LINKS;

  return (
    <>
      {/* fixed at top */}
      <div className="headerr z-50 absolute bg-MidNightBlack backdrop-blur-sm inset-y-0 h-48 top-0 flex items-center justify-center w-full flex-col px-4 gap-y-3">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow shadow-md flex items-center justify-center bg-DeepNightBlack">
          <img
            className="w-full h-full object-cover"
            src={photo}
            alt="profile picture"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/batombari.jpeg';
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-gray-300 text-base font-bold break-normal">{name}</span>
          <span className="text-xs text-LightGray text-center mt-1 px-2">{designation}</span>
        </div>
      </div>

      {/* middle components */}
      <div className="beech z-20 flex flex-col overflow-y-scroll pt-48 top-48 space-y-6 divide-y divide-white overflow-x-hidden no-scrollbar px-4">
        <Location contacts={profile?.contacts} />
        <Languages />
        <Skills skills={profile?.skills} />
        <Tools techStack={profile?.techStack} />
        <Contact contacts={profile?.contacts} />
        <Download icon={<FaDownload />} resumeUrl={resumeUrl} />
      </div>

      {/* fixed at bottom */}
      <div className="footer absolute flex justify-center space-x-6 text-xl items-center bottom-0 z-50 h-10 w-full bg-MidNightBlack text-Snow">
        {social.github && (
          <Link href={social.github} target="_blank" rel="noreferrer">
            <FaGithub />
          </Link>
        )}
        {social.linkedin && (
          <Link href={social.linkedin} target="_blank" rel="noreferrer">
            <FaLinkedin />
          </Link>
        )}
        {social.twitter && (
          <Link href={social.twitter} target="_blank" rel="noreferrer">
            <FaTwitter />
          </Link>
        )}
        {social.facebook && (
          <Link href={social.facebook} target="_blank" rel="noreferrer">
            <FaFacebook />
          </Link>
        )}
      </div>
    </>
  );
};

export default Intro;
