import Link from 'next/link';

const Download = ({ icon, resumeUrl = '/Batombari-Bakpo.pdf' }) => {
  return (
    <>
      <Link href={resumeUrl} target="_blank" className="flex flex-row text-LightGray items-center gap-x-4 pb-14 pt-4 hover:text-yellow transition-colors">
        <span className="text-Snow">Download Resume</span>
        <span>{icon}</span>
      </Link>
    </>
  );
};

export default Download;
