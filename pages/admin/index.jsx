import { useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaDatabase, 
  FaSearch, 
  FaArrowLeft, 
  FaLock, 
  FaKey, 
  FaTimes,
  FaCheck,
  FaSync,
  FaUser,
  FaGraduationCap,
  FaTools,
  FaShareAlt,
  FaFilePdf,
  FaCrop,
  FaCloudUploadAlt,
  FaGripVertical,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import BannerLayout from '../../components/Common/BannerLayout';
import Footer from '../../components/Footer';
import Badge from '../../components/Common/Badge';
import ImageCropperModal from '../../components/Admin/ImageCropperModal';
import ClientPortal from '../../components/Common/ClientPortal';

export default function AdminCMS() {
  const queryClient = useQueryClient();
  // Active Tab
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'profile' | 'skills' | 'background' | 'social'

  // Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);
  const projectFileInputRef = useRef(null);

  // Drag & Drop State
  const [draggedProjectIndex, setDraggedProjectIndex] = useState(null);
  const [dragOverProjectIndex, setDragOverProjectIndex] = useState(null);

  const [draggedEduIndex, setDraggedEduIndex] = useState(null);
  const [dragOverEduIndex, setDragOverEduIndex] = useState(null);

  const [draggedExpIndex, setDraggedExpIndex] = useState(null);
  const [dragOverExpIndex, setDragOverExpIndex] = useState(null);

  // Profile State
  const [profile, setProfile] = useState({
    name: '',
    designation: '',
    profilePhoto: '',
    resumeUrl: '',
    contacts: { email: '', phone: '', residence: '', city: '' },
    socialLinks: { github: '', linkedin: '', twitter: '', facebook: '' },
    skills: [],
    techStack: [],
    education: [],
    experience: [],
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  // Modals for Background (Edu / Exp)
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState(-1);
  const [eduForm, setEduForm] = useState({ title: '', degree: '', detail: '', year: '' });

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState(-1);
  const [expForm, setExpForm] = useState({ title: '', role: '', url: '', desc: '', year: '', location: '' });

  // General State
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Security Lock State
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Project Form State
  const [projectFormData, setProjectFormData] = useState({
    projectName: '',
    url: '',
    image: '',
    projectDetail: '',
    order: 0,
  });
  const [techInput, setTechInput] = useState('');
  const [techList, setTechList] = useState([]);

  // Skills & Tech Form State
  const [newSkillTitle, setNewSkillTitle] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('85%');
  const [newTechStackInput, setNewTechStackInput] = useState('');

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('portfolio_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    fetchProjects();
    fetchProfile();
  }, []);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await axios.get('/api/portfolio');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await axios.get('/api/profile');
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode.trim().length > 0) {
      setIsAuthenticated(true);
      sessionStorage.setItem('portfolio_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Please try again.');
    }
  };

  // --- Drag and Drop Helper & Actions ---
  const reorderArray = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Projects DND Actions
  const handleSaveProjectsOrder = async (newProjectsList) => {
    setSubmitting(true);
    try {
      const payload = newProjectsList.map((p, idx) => ({
        id: p._id || p.id,
        order: idx,
      }));
      await axios.put('/api/portfolio/reorder', { items: payload });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      showMessage('Projects display order updated!');
    } catch (err) {
      console.error('Error saving projects order:', err);
      showMessage('Failed to save project order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProjectDragStart = (e, index) => {
    setDraggedProjectIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    if (e.dataTransfer.setData) {
      e.dataTransfer.setData('text/plain', index.toString());
    }
  };

  const handleProjectDragOver = (e, index) => {
    e.preventDefault();
    if (dragOverProjectIndex !== index) {
      setDragOverProjectIndex(index);
    }
  };

  const handleProjectDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedProjectIndex === null || draggedProjectIndex === dropIndex) {
      setDraggedProjectIndex(null);
      setDragOverProjectIndex(null);
      return;
    }

    const updatedProjects = reorderArray(projects, draggedProjectIndex, dropIndex);
    setProjects(updatedProjects);
    setDraggedProjectIndex(null);
    setDragOverProjectIndex(null);
    await handleSaveProjectsOrder(updatedProjects);
  };

  const handleMoveProject = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updatedProjects = reorderArray(projects, index, targetIndex);
    setProjects(updatedProjects);
    await handleSaveProjectsOrder(updatedProjects);
  };

  // Education DND Actions
  const handleEduDragStart = (e, index) => {
    setDraggedEduIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleEduDragOver = (e, index) => {
    e.preventDefault();
    if (dragOverEduIndex !== index) {
      setDragOverEduIndex(index);
    }
  };

  const handleEduDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedEduIndex === null || draggedEduIndex === dropIndex) {
      setDraggedEduIndex(null);
      setDragOverEduIndex(null);
      return;
    }

    const updatedEdu = reorderArray(profile.education || [], draggedEduIndex, dropIndex);
    setDraggedEduIndex(null);
    setDragOverEduIndex(null);

    const updatedProfile = { ...profile, education: updatedEdu };
    setProfile(updatedProfile);
    await handleSaveProfile(updatedProfile);
    queryClient.invalidateQueries({ queryKey: ['background'] });
  };

  const handleMoveEdu = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentEdu = profile.education || [];
    if (targetIndex < 0 || targetIndex >= currentEdu.length) return;

    const updatedEdu = reorderArray(currentEdu, index, targetIndex);
    const updatedProfile = { ...profile, education: updatedEdu };
    setProfile(updatedProfile);
    await handleSaveProfile(updatedProfile);
    queryClient.invalidateQueries({ queryKey: ['background'] });
  };

  // Experience DND Actions
  const handleExpDragStart = (e, index) => {
    setDraggedExpIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleExpDragOver = (e, index) => {
    e.preventDefault();
    if (dragOverExpIndex !== index) {
      setDragOverExpIndex(index);
    }
  };

  const handleExpDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedExpIndex === null || draggedExpIndex === dropIndex) {
      setDraggedExpIndex(null);
      setDragOverExpIndex(null);
      return;
    }

    const updatedExp = reorderArray(profile.experience || [], draggedExpIndex, dropIndex);
    setDraggedExpIndex(null);
    setDragOverExpIndex(null);

    const updatedProfile = { ...profile, experience: updatedExp };
    setProfile(updatedProfile);
    await handleSaveProfile(updatedProfile);
    queryClient.invalidateQueries({ queryKey: ['background'] });
  };

  const handleMoveExp = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentExp = profile.experience || [];
    if (targetIndex < 0 || targetIndex >= currentExp.length) return;

    const updatedExp = reorderArray(currentExp, index, targetIndex);
    const updatedProfile = { ...profile, experience: updatedExp };
    setProfile(updatedProfile);
    await handleSaveProfile(updatedProfile);
    queryClient.invalidateQueries({ queryKey: ['background'] });
  };

  // --- Profile & Photo Actions ---
  const handleSaveProfile = async (updatedData = profile) => {
    setSubmitting(true);
    try {
      const res = await axios.put('/api/profile', updatedData);
      if (res.data?.data) {
        setProfile(res.data.data);
        queryClient.setQueryData(['profile'], res.data.data);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['background'] });
      }
      showMessage('Profile settings saved successfully!');
    } catch (err) {
      console.error('Profile save error:', err);
      showMessage('Failed to save profile settings', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCroppedPhoto = (croppedDataUrl) => {
    const updated = { ...profile, profilePhoto: croppedDataUrl };
    setProfile(updated);
    handleSaveProfile(updated);
  };

  // --- Skills & Tech Stack Actions ---
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillTitle.trim()) return;
    const levelStr = newSkillLevel.includes('%') ? newSkillLevel : `${newSkillLevel}%`;
    const updatedSkills = [...(profile.skills || []), { title: newSkillTitle.trim(), level: levelStr }];
    const updated = { ...profile, skills: updatedSkills };
    setProfile(updated);
    setNewSkillTitle('');
    handleSaveProfile(updated);
  };

  const handleRemoveSkill = (indexToRemove) => {
    const updatedSkills = (profile.skills || []).filter((_, idx) => idx !== indexToRemove);
    const updated = { ...profile, skills: updatedSkills };
    setProfile(updated);
    handleSaveProfile(updated);
  };

  const handleAddTechStackItem = (e) => {
    e.preventDefault();
    if (!newTechStackInput.trim()) return;
    const trimmed = newTechStackInput.trim();
    if (profile.techStack?.includes(trimmed)) return;
    const updatedTech = [...(profile.techStack || []), trimmed];
    const updated = { ...profile, techStack: updatedTech };
    setProfile(updated);
    setNewTechStackInput('');
    handleSaveProfile(updated);
  };

  const handleRemoveTechStackItem = (itemToRemove) => {
    const updatedTech = (profile.techStack || []).filter((t) => t !== itemToRemove);
    const updated = { ...profile, techStack: updatedTech };
    setProfile(updated);
    handleSaveProfile(updated);
  };

  // --- Education & Experience Actions ---
  const handleSaveEdu = (e) => {
    e.preventDefault();
    if (!eduForm.title || !eduForm.degree) return;
    let updatedEdu = [...(profile.education || [])];
    if (editingEduIndex >= 0) {
      updatedEdu[editingEduIndex] = { ...eduForm, id: updatedEdu[editingEduIndex].id || editingEduIndex };
    } else {
      updatedEdu.push({ ...eduForm, id: updatedEdu.length });
    }
    const updated = { ...profile, education: updatedEdu };
    setProfile(updated);
    setIsEduModalOpen(false);
    handleSaveProfile(updated);
  };

  const handleDeleteEdu = (index) => {
    const updatedEdu = (profile.education || []).filter((_, idx) => idx !== index);
    const updated = { ...profile, education: updatedEdu };
    setProfile(updated);
    handleSaveProfile(updated);
  };

  const handleSaveExp = (e) => {
    e.preventDefault();
    if (!expForm.title || !expForm.role) return;
    let updatedExp = [...(profile.experience || [])];
    if (editingExpIndex >= 0) {
      updatedExp[editingExpIndex] = { ...expForm, id: updatedExp[editingExpIndex].id || editingExpIndex };
    } else {
      updatedExp.push({ ...expForm, id: updatedExp.length });
    }
    const updated = { ...profile, experience: updatedExp };
    setProfile(updated);
    setIsExpModalOpen(false);
    handleSaveProfile(updated);
  };

  const handleDeleteExp = (index) => {
    const updatedExp = (profile.experience || []).filter((_, idx) => idx !== index);
    const updated = { ...profile, experience: updatedExp };
    setProfile(updated);
    handleSaveProfile(updated);
  };

  // --- Project Actions ---
  const handleOpenAddProjectModal = () => {
    setEditingProject(null);
    setProjectFormData({
      projectName: '',
      url: '',
      image: '',
      projectDetail: '',
      order: projects.length,
    });
    setTechList([]);
    setTechInput('');
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProjectModal = (project) => {
    setEditingProject(project);
    setProjectFormData({
      projectName: project.projectName || '',
      url: project.url || '',
      image: project.image || '',
      projectDetail: project.projectDetail || '',
      order: project.order !== undefined ? project.order : 0,
    });
    const techs = Array.isArray(project.technologiesUsed)
      ? project.technologiesUsed.map((t) => (typeof t === 'string' ? t : t.tech))
      : [];
    setTechList(techs);
    setTechInput('');
    setIsProjectModalOpen(true);
  };

  const handleAddProjectTech = (e) => {
    if (e) e.preventDefault();
    const trimmed = techInput.trim();
    if (trimmed && !techList.includes(trimmed)) {
      setTechList([...techList, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveProjectTech = (techToRemove) => {
    setTechList(techList.filter((t) => t !== techToRemove));
  };

  const handleProjectImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setUploadingProjectImage(true);
      try {
        const res = await axios.post('/api/upload', {
          image: reader.result,
          folder: 'portfolio_projects',
        });
        if (res.data?.url) {
          setProjectFormData((prev) => ({ ...prev, image: res.data.url }));
          showMessage('Image uploaded to Cloudinary successfully!');
        }
      } catch (err) {
        console.error('Project image upload error:', err);
        showMessage('Failed to upload image to Cloudinary', 'error');
      } finally {
        setUploadingProjectImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProjectFormSubmit = async (e) => {
    e.preventDefault();
    if (!projectFormData.projectName || !projectFormData.image || !projectFormData.projectDetail) {
      showMessage('Please fill in required fields (Name, Image, Details)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...projectFormData,
        technologiesUsed: techList.map((tech) => ({ tech })),
      };

      if (editingProject) {
        const projectKey = editingProject._id || editingProject.id;
        await axios.put(`/api/portfolio/${projectKey}`, payload);
        showMessage(`Project "${projectFormData.projectName}" updated!`);
      } else {
        await axios.post('/api/portfolio', payload);
        showMessage(`Project "${projectFormData.projectName}" created!`);
      }

      setIsProjectModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Project submit error:', err);
      showMessage(err.response?.data?.message || 'Error saving project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProjectConfirm = async () => {
    if (!projectToDelete) return;
    setSubmitting(true);
    try {
      const projectKey = projectToDelete._id || projectToDelete.id;
      await axios.delete(`/api/portfolio/${projectKey}`);
      showMessage(`Project "${projectToDelete.projectName}" deleted.`);
      setIsDeleteProjectModalOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
      showMessage(err.response?.data?.message || 'Failed to delete project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedDatabase = async (force = false) => {
    if (!confirm(force ? 'Re-seed database? This will reset all current projects.' : 'Seed initial projects into MongoDB?')) {
      return;
    }
    setSeeding(true);
    try {
      const res = await axios.post(`/api/portfolio/seed${force ? '?force=true' : ''}`);
      showMessage(res.data.message || 'Database seeded successfully!');
      fetchProjects();
    } catch (err) {
      console.error('Seed error:', err);
      showMessage('Failed to seed database: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSeeding(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.projectName?.toLowerCase().includes(query) ||
      p.projectDetail?.toLowerCase().includes(query) ||
      p.technologiesUsed?.some((t) => (typeof t === 'string' ? t : t.tech)?.toLowerCase().includes(query))
    );
  });

  return (
    <BannerLayout>
      <Head>
        <title>Portfolio CMS Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto text-Snow font-circular">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-EveningBlack p-6 rounded-2xl border border-LightGray/10 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/portfolio" className="text-LightGray hover:text-Green transition-colors">
                <FaArrowLeft className="text-xl" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold font-circular-bold text-Snow flex items-center gap-3">
                <FaDatabase className="text-Green" /> Portfolio CMS Dashboard
              </h1>
            </div>
            <p className="text-sm text-LightGray mt-1 font-circular-light">
              Manage your projects, profile photo, CV, background, skills, and social links in MongoDB.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-DeepNightBlack px-3 py-1.5 rounded-lg text-xs text-LightGray border border-LightGray/10">
              Projects: <strong className="text-Green font-bold">{projects.length}</strong>
            </span>
            <button
              onClick={() => handleSeedDatabase(false)}
              disabled={seeding}
              className="flex items-center gap-2 bg-EveningBlack hover:bg-DeepNightBlack text-Green border border-Green/40 hover:border-Green text-xs px-3.5 py-2 rounded-xl transition-all duration-300 font-semibold"
            >
              <FaSync className={seeding ? 'animate-spin text-Green' : 'text-Green'} />
              {seeding ? 'Seeding...' : 'Seed Projects'}
            </button>
          </div>
        </div>

        {/* Message Toast */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm shadow-lg font-medium ${
              message.type === 'error'
                ? 'bg-red-950/80 border border-red-500/50 text-red-200'
                : 'bg-emerald-950/80 border border-Green/50 text-emerald-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <FaCheck className="text-Green" /> {message.text}
            </span>
            <button onClick={() => setMessage({ text: '', type: '' })}>
              <FaTimes />
            </button>
          </div>
        )}

        {!isAuthenticated ? (
          /* Passcode Unlock Prompt */
          <div className="bg-EveningBlack p-8 rounded-2xl border border-Green/30 max-w-md mx-auto my-12 text-center shadow-2xl">
            <div className="w-16 h-16 bg-Green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-Green text-2xl">
              <FaLock />
            </div>
            <h2 className="text-xl font-bold text-Snow mb-2 font-circular-bold">CMS Admin Access</h2>
            <p className="text-xs text-LightGray mb-6 font-circular-light">
              Enter your passcode to unlock the portfolio & profile management tools.
            </p>
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <FaKey className="absolute left-3 top-3.5 text-LightGray" />
                <input
                  type="password"
                  placeholder="Enter passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl py-2.5 pl-10 pr-4 text-Snow focus:border-Green focus:outline-none text-sm"
                />
              </div>
              {authError && <p className="text-xs text-red-400 font-medium">{authError}</p>}
              <button
                type="submit"
                className="bg-Green hover:bg-Green/90 text-DeepNightBlack font-bold py-2.5 rounded-xl text-sm transition-all shadow-md"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* CMS Navigation Tabs (Following Typography Rules & High Contrast Text) */}
            <div className="flex flex-wrap gap-2 mb-8 bg-EveningBlack p-2 rounded-2xl border border-LightGray/10">
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeTab === 'projects'
                    ? 'bg-Green text-DeepNightBlack shadow-md font-circular-bold'
                    : 'text-LightGray hover:text-Snow hover:bg-DeepNightBlack font-medium'
                }`}
              >
                <FaDatabase /> Projects ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeTab === 'profile'
                    ? 'bg-Green text-DeepNightBlack shadow-md font-circular-bold'
                    : 'text-LightGray hover:text-Snow hover:bg-DeepNightBlack font-medium'
                }`}
              >
                <FaUser /> Profile Photo & Bio
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeTab === 'skills'
                    ? 'bg-Green text-DeepNightBlack shadow-md font-circular-bold'
                    : 'text-LightGray hover:text-Snow hover:bg-DeepNightBlack font-medium'
                }`}
              >
                <FaTools /> Skills & Tech Stack
              </button>
              <button
                onClick={() => setActiveTab('background')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeTab === 'background'
                    ? 'bg-Green text-DeepNightBlack shadow-md font-circular-bold'
                    : 'text-LightGray hover:text-Snow hover:bg-DeepNightBlack font-medium'
                }`}
              >
                <FaGraduationCap /> Education & Experience
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeTab === 'social'
                    ? 'bg-Green text-DeepNightBlack shadow-md font-circular-bold'
                    : 'text-LightGray hover:text-Snow hover:bg-DeepNightBlack font-medium'
                }`}
              >
                <FaShareAlt /> Social & Contacts
              </button>
            </div>

            {/* TAB 1: PROJECTS */}
            {activeTab === 'projects' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                  <div className="relative w-full sm:w-96">
                    <FaSearch className="absolute left-4 top-3.5 text-LightGray" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-EveningBlack border border-LightGray/10 rounded-xl py-2.5 pl-12 pr-4 text-Snow placeholder-LightGray/50 focus:border-Green focus:outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={handleOpenAddProjectModal}
                    className="w-full sm:w-auto bg-Green text-DeepNightBlack font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg hover:bg-Green/90 transition-all flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Add New Project
                  </button>
                </div>

                <div className="mb-4 p-3 bg-EveningBlack rounded-xl border border-Green/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-LightGray shadow-md">
                  <span className="flex items-center gap-2">
                    <FaGripVertical className="text-Green text-sm" /> Drag cards using the grip handle or click <FaArrowUp className="inline text-Green" /> <FaArrowDown className="inline text-Green" /> to arrange display order.
                  </span>
                  <span className="text-[11px] text-Green font-bold font-circular-bold bg-DeepNightBlack px-2.5 py-1 rounded-lg border border-Green/30">Auto-saves to database</span>
                </div>

                {loadingProjects ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-EveningBlack h-64 rounded-2xl animate-pulse border border-LightGray/10" />
                    ))}
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="bg-EveningBlack p-12 rounded-2xl text-center border border-LightGray/10">
                    <FaDatabase className="text-4xl text-LightGray/30 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-Snow">No Projects Found</h3>
                    <p className="text-xs text-LightGray mt-1 mb-4">Add your first project or seed initial items.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, idx) => {
                      const techs = Array.isArray(project.technologiesUsed)
                        ? project.technologiesUsed.map((t) => (typeof t === 'string' ? t : t.tech))
                        : [];

                      return (
                        <div
                          key={project._id || project.id || idx}
                          draggable={!searchQuery}
                          onDragStart={(e) => handleProjectDragStart(e, idx)}
                          onDragOver={(e) => handleProjectDragOver(e, idx)}
                          onDrop={(e) => handleProjectDrop(e, idx)}
                          onDragEnd={() => {
                            setDraggedProjectIndex(null);
                            setDragOverProjectIndex(null);
                          }}
                          className={`bg-EveningBlack rounded-2xl border overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                            draggedProjectIndex === idx
                              ? 'opacity-40 border-dashed border-Green scale-95'
                              : dragOverProjectIndex === idx
                              ? 'border-2 border-Green shadow-2xl scale-[1.02] bg-DeepNightBlack/90'
                              : 'border-LightGray/10 hover:border-Green/40'
                          }`}
                        >
                          <div>
                            <div className="relative h-44 bg-DeepNightBlack overflow-hidden">
                              <img
                                src={project.image}
                                alt={project.projectName}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-500"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/600x400?text=Project+Image';
                                }}
                              />
                              {/* Position Badge & Drag Controls */}
                              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-DeepNightBlack/90 border border-Green/30 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-lg">
                                <span className="cursor-grab active:cursor-grabbing text-Green hover:text-white p-0.5 transition-colors" title="Drag to reorder">
                                  <FaGripVertical className="text-xs" />
                                </span>
                                <span className="text-[11px] font-bold text-Snow font-circular-bold">#{idx + 1}</span>
                                <div className="flex gap-0.5 ml-1 border-l border-LightGray/20 pl-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveProject(idx, 'up')}
                                    className="p-0.5 text-LightGray hover:text-Green disabled:opacity-30 disabled:hover:text-LightGray transition-colors"
                                    title="Move Up"
                                  >
                                    <FaArrowUp className="text-[10px]" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === filteredProjects.length - 1}
                                    onClick={() => handleMoveProject(idx, 'down')}
                                    className="p-0.5 text-LightGray hover:text-Green disabled:opacity-30 disabled:hover:text-LightGray transition-colors"
                                    title="Move Down"
                                  >
                                    <FaArrowDown className="text-[10px]" />
                                  </button>
                                </div>
                              </div>

                              <div className="absolute top-3 right-3 flex gap-2">
                                <button
                                  onClick={() => handleOpenEditProjectModal(project)}
                                  className="p-2 bg-DeepNightBlack/80 text-Green hover:bg-Green hover:text-DeepNightBlack rounded-lg text-xs transition-colors"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => {
                                    setProjectToDelete(project);
                                    setIsDeleteProjectModalOpen(true);
                                  }}
                                  className="p-2 bg-DeepNightBlack/80 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs transition-colors"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                            <div className="p-5">
                              <h3 className="font-bold text-lg text-Snow group-hover:text-Green transition-colors mb-2 font-circular-bold">
                                {project.projectName}
                              </h3>
                              <p className="text-xs text-LightGray line-clamp-3 mb-4 font-circular-light">{project.projectDetail}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {techs.map((tech, tIdx) => (
                                  <Badge key={tIdx} title={tech} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROFILE PHOTO & BIO */}
            {activeTab === 'profile' && (
              <div className="bg-EveningBlack p-6 rounded-2xl border border-LightGray/10 shadow-xl space-y-6">
                <h2 className="text-lg font-bold text-Snow flex items-center gap-2 font-circular-bold">
                  <FaUser className="text-Green" /> Profile & Avatar Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  {/* Photo Avatar Box */}
                  <div className="flex flex-col items-center p-6 bg-DeepNightBlack rounded-2xl border border-Green/20 text-center">
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-Green mb-4 shadow-xl group flex items-center justify-center bg-DeepNightBlack">
                      {loadingProfile ? (
                        <div className="w-full h-full bg-EveningBlack animate-pulse rounded-full" />
                      ) : (
                        <img
                          src={profile.profilePhoto || '/images/batombari.jpeg'}
                          alt="Profile Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            if (!e.target.src.endsWith('/images/batombari.jpeg')) {
                              e.target.src = '/images/batombari.jpeg';
                            }
                          }}
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCropperOpen(true)}
                      className="bg-Green hover:bg-Green/90 text-DeepNightBlack font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all font-circular-bold"
                    >
                      <FaCrop /> Edit & Crop Profile Photo
                    </button>
                    <p className="text-[11px] text-LightGray/60 mt-3 font-circular-light">
                      Upload any photo from your computer, zoom and crop to fit your sidebar avatar circle.
                    </p>
                  </div>

                  {/* Bio & Resume Form */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-LightGray mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2.5 text-Snow text-sm focus:border-Green focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-LightGray mb-1">Professional Title / Designation</label>
                      <input
                        type="text"
                        value={profile.designation}
                        onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                        className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2.5 text-Snow text-sm focus:border-Green focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-LightGray mb-1">CV / Resume File Path or Link</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FaFilePdf className="absolute left-3 top-3.5 text-red-400" />
                          <input
                            type="text"
                            placeholder="e.g. /Batombari-Bakpo.pdf or https://..."
                            value={profile.resumeUrl}
                            onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                            className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl pl-10 pr-4 py-2.5 text-Snow text-sm focus:border-Green focus:outline-none"
                          />
                        </div>
                        {profile.resumeUrl && (
                          <a
                            href={profile.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-EveningBlack hover:bg-DeepNightBlack border border-Green/40 text-Green text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-1 transition-all"
                          >
                            Test Link
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleSaveProfile()}
                        className="bg-Green text-DeepNightBlack font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg hover:bg-Green/90 transition-all font-circular-bold"
                      >
                        {submitting ? 'Saving...' : 'Save Profile Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SKILLS & TECH STACK */}
            {activeTab === 'skills' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skills Section */}
                <div className="bg-EveningBlack p-6 rounded-2xl border border-LightGray/10 shadow-xl">
                  <h3 className="text-base font-bold text-Snow mb-4 flex items-center gap-2 font-circular-bold">
                    <FaTools className="text-Green" /> Skills & Proficiency Levels
                  </h3>

                  <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      placeholder="Skill name (e.g. React Developer)"
                      value={newSkillTitle}
                      onChange={(e) => setNewSkillTitle(e.target.value)}
                      className="flex-1 bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Level (e.g. 90%)"
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value)}
                      className="w-24 bg-DeepNightBlack border border-LightGray/20 rounded-xl px-3 py-2 text-Snow text-xs focus:border-Green focus:outline-none text-center"
                    />
                    <button
                      type="submit"
                      className="bg-Green text-DeepNightBlack font-bold text-xs px-4 py-2 rounded-xl hover:bg-Green/90 transition-all"
                    >
                      Add
                    </button>
                  </form>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {(profile.skills || []).map((skill, idx) => (
                      <div
                        key={idx}
                        className="bg-DeepNightBlack p-3 rounded-xl border border-LightGray/10 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-Snow">{skill.title}</span>
                          <span className="ml-3 text-[11px] text-Green font-bold">{skill.level}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSkill(idx)}
                          className="text-LightGray hover:text-red-400 text-xs p-1 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack List */}
                <div className="bg-EveningBlack p-6 rounded-2xl border border-LightGray/10 shadow-xl">
                  <h3 className="text-base font-bold text-Snow mb-4 flex items-center gap-2 font-circular-bold">
                    <FaTools className="text-Green" /> Tech Stack Badges
                  </h3>

                  <form onSubmit={handleAddTechStackItem} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      placeholder="Add tech badge (e.g. Solidity, Python)"
                      value={newTechStackInput}
                      onChange={(e) => setNewTechStackInput(e.target.value)}
                      className="flex-1 bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-Green text-DeepNightBlack font-bold text-xs px-4 py-2 rounded-xl hover:bg-Green/90 transition-all"
                    >
                      Add Badge
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto">
                    {(profile.techStack || []).map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-DeepNightBlack border border-Green/30 text-Snow text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm font-medium"
                      >
                        {item}
                        <button
                          onClick={() => handleRemoveTechStackItem(item)}
                          className="text-LightGray hover:text-red-400 transition-colors"
                        >
                          <FaTimes className="text-[10px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: EDUCATION & EXPERIENCE */}
            {activeTab === 'background' && (
              <div className="space-y-8">
                {/* Education Section */}
                <div className="bg-EveningBlack p-6 rounded-2xl border border-LightGray/10 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                    <h3 className="text-base font-bold text-Snow flex items-center gap-2 font-circular-bold">
                      <FaGraduationCap className="text-Green" /> Education Cards
                    </h3>
                    <button
                      onClick={() => {
                        setEditingEduIndex(-1);
                        setEduForm({ title: '', degree: '', detail: '', year: '' });
                        setIsEduModalOpen(true);
                      }}
                      className="bg-Green text-DeepNightBlack font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:bg-Green/90 transition-all self-start sm:self-auto"
                    >
                      <FaPlus /> Add Education
                    </button>
                  </div>

                  <div className="mb-4 text-xs text-LightGray flex items-center gap-1.5">
                    <FaGripVertical className="text-Green" /> Drag cards or click <FaArrowUp className="inline text-Green" /> <FaArrowDown className="inline text-Green" /> to rearrange Education entries.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(profile.education || []).map((edu, idx) => (
                      <div
                        key={idx}
                        draggable={true}
                        onDragStart={(e) => handleEduDragStart(e, idx)}
                        onDragOver={(e) => handleEduDragOver(e, idx)}
                        onDrop={(e) => handleEduDrop(e, idx)}
                        onDragEnd={() => {
                          setDraggedEduIndex(null);
                          setDragOverEduIndex(null);
                        }}
                        className={`bg-DeepNightBlack p-4 rounded-xl border flex justify-between items-start transition-all duration-300 ${
                          draggedEduIndex === idx
                            ? 'opacity-40 border-dashed border-Green scale-95'
                            : dragOverEduIndex === idx
                            ? 'border-2 border-Green shadow-xl scale-[1.01]'
                            : 'border-LightGray/10 hover:border-Green/30'
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          <div className="flex flex-col items-center gap-1 mt-1 bg-EveningBlack/80 p-1 rounded-lg border border-LightGray/10">
                            <span className="cursor-grab active:cursor-grabbing text-Green hover:text-white p-0.5 transition-colors" title="Drag to reorder">
                              <FaGripVertical className="text-xs" />
                            </span>
                            <span className="text-[10px] font-bold text-Snow">#{idx + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-Snow font-circular-bold">{edu.title}</h4>
                            <p className="text-xs text-Green font-medium mt-0.5">{edu.degree}</p>
                            <p className="text-xs text-LightGray/70 mt-1 font-circular-light">{edu.detail}</p>
                            <span className="text-[10px] text-LightGray/50 mt-2 block">{edu.year}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-0.5 border-r border-LightGray/10 pr-2 mr-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveEdu(idx, 'up')}
                              className="p-1 text-LightGray hover:text-Green disabled:opacity-30 transition-colors"
                              title="Move Up"
                            >
                              <FaArrowUp className="text-[10px]" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (profile.education || []).length - 1}
                              onClick={() => handleMoveEdu(idx, 'down')}
                              className="p-1 text-LightGray hover:text-Green disabled:opacity-30 transition-colors"
                              title="Move Down"
                            >
                              <FaArrowDown className="text-[10px]" />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setEditingEduIndex(idx);
                              setEduForm(edu);
                              setIsEduModalOpen(true);
                            }}
                            className="text-Green text-xs hover:underline transition-all p-1"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteEdu(idx)}
                            className="text-red-400 text-xs hover:underline transition-all p-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Section */}
                <div className="bg-EveningBlack p-6 rounded-2xl border border-LightGray/10 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                    <h3 className="text-base font-bold text-Snow flex items-center gap-2 font-circular-bold">
                      <FaGraduationCap className="text-Green" /> Experience Cards
                    </h3>
                    <button
                      onClick={() => {
                        setEditingExpIndex(-1);
                        setExpForm({ title: '', role: '', url: '', desc: '', year: '', location: '' });
                        setIsExpModalOpen(true);
                      }}
                      className="bg-Green text-DeepNightBlack font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:bg-Green/90 transition-all self-start sm:self-auto"
                    >
                      <FaPlus /> Add Experience
                    </button>
                  </div>

                  <div className="mb-4 text-xs text-LightGray flex items-center gap-1.5">
                    <FaGripVertical className="text-Green" /> Drag cards or click <FaArrowUp className="inline text-Green" /> <FaArrowDown className="inline text-Green" /> to rearrange Experience entries.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(profile.experience || []).map((exp, idx) => (
                      <div
                        key={idx}
                        draggable={true}
                        onDragStart={(e) => handleExpDragStart(e, idx)}
                        onDragOver={(e) => handleExpDragOver(e, idx)}
                        onDrop={(e) => handleExpDrop(e, idx)}
                        onDragEnd={() => {
                          setDraggedExpIndex(null);
                          setDragOverExpIndex(null);
                        }}
                        className={`bg-DeepNightBlack p-4 rounded-xl border flex justify-between items-start transition-all duration-300 ${
                          draggedExpIndex === idx
                            ? 'opacity-40 border-dashed border-Green scale-95'
                            : dragOverExpIndex === idx
                            ? 'border-2 border-Green shadow-xl scale-[1.01]'
                            : 'border-LightGray/10 hover:border-Green/30'
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          <div className="flex flex-col items-center gap-1 mt-1 bg-EveningBlack/80 p-1 rounded-lg border border-LightGray/10">
                            <span className="cursor-grab active:cursor-grabbing text-Green hover:text-white p-0.5 transition-colors" title="Drag to reorder">
                              <FaGripVertical className="text-xs" />
                            </span>
                            <span className="text-[10px] font-bold text-Snow">#{idx + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-Snow font-circular-bold">{exp.title}</h4>
                            <p className="text-xs text-Green font-medium mt-0.5">{exp.role} ({exp.location})</p>
                            <p className="text-xs text-LightGray/70 mt-1 font-circular-light">{exp.desc}</p>
                            <span className="text-[10px] text-LightGray/50 mt-2 block">{exp.year}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-0.5 border-r border-LightGray/10 pr-2 mr-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveExp(idx, 'up')}
                              className="p-1 text-LightGray hover:text-Green disabled:opacity-30 transition-colors"
                              title="Move Up"
                            >
                              <FaArrowUp className="text-[10px]" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (profile.experience || []).length - 1}
                              onClick={() => handleMoveExp(idx, 'down')}
                              className="p-1 text-LightGray hover:text-Green disabled:opacity-30 transition-colors"
                              title="Move Down"
                            >
                              <FaArrowDown className="text-[10px]" />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setEditingExpIndex(idx);
                              setExpForm(exp);
                              setIsExpModalOpen(true);
                            }}
                            className="text-Green text-xs hover:underline transition-all p-1"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteExp(idx)}
                            className="text-red-400 text-xs hover:underline transition-all p-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SOCIAL & CONTACTS */}
            {activeTab === 'social' && (
              <div className="bg-EveningBlack p-6 rounded-2xl border border-LightGray/10 shadow-xl space-y-6">
                <h3 className="text-base font-bold text-Snow flex items-center gap-2 font-circular-bold">
                  <FaShareAlt className="text-Green" /> Social Links & Contact Info
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-LightGray mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={profile.socialLinks?.github || ''}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, github: e.target.value },
                        })
                      }
                      className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-LightGray mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profile.socialLinks?.linkedin || ''}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                        })
                      }
                      className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-LightGray mb-1">Twitter / X URL</label>
                    <input
                      type="text"
                      value={profile.socialLinks?.twitter || ''}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, twitter: e.target.value },
                        })
                      }
                      className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-LightGray mb-1">Facebook URL</label>
                    <input
                      type="text"
                      value={profile.socialLinks?.facebook || ''}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, facebook: e.target.value },
                        })
                      }
                      className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-LightGray mb-1">Contact Email</label>
                    <input
                      type="text"
                      value={profile.contacts?.email || ''}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          contacts: { ...profile.contacts, email: e.target.value },
                        })
                      }
                      className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-LightGray mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={profile.contacts?.phone || ''}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          contacts: { ...profile.contacts, phone: e.target.value },
                        })
                      }
                      className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSaveProfile()}
                    className="bg-Green text-DeepNightBlack font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg hover:bg-Green/90 transition-all font-circular-bold"
                  >
                    {submitting ? 'Saving...' : 'Save Social Links'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Profile Photo Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCroppedPhoto}
        initialImage={profile.profilePhoto}
      />

      {/* Add / Edit Project Modal */}
      {isProjectModalOpen && (
        <ClientPortal>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-EveningBlack rounded-2xl border border-Green/30 w-full max-w-2xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center px-6 py-4 border-b border-LightGray/10 bg-DeepNightBlack">
                <h2 className="text-lg font-bold text-Snow flex items-center gap-2 font-circular-bold">
                  {editingProject ? <FaEdit className="text-Green" /> : <FaPlus className="text-Green" />}
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button onClick={() => setIsProjectModalOpen(false)} className="text-LightGray hover:text-Snow">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleProjectFormSubmit} className="p-6 space-y-4 overflow-y-auto font-circular">
                <div>
                  <label className="block text-xs font-semibold text-LightGray mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={projectFormData.projectName}
                    onChange={(e) => setProjectFormData({ ...projectFormData, projectName: e.target.value })}
                    className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2.5 text-Snow text-sm focus:border-Green focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-LightGray mb-1">Image URL or Cloudinary Link *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Image URL or upload file"
                        value={projectFormData.image}
                        onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                        className="flex-1 bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2.5 text-Snow text-xs focus:border-Green focus:outline-none"
                      />
                      <input
                        type="file"
                        ref={projectFileInputRef}
                        accept="image/*"
                        onChange={handleProjectImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingProjectImage}
                        onClick={() => projectFileInputRef.current?.click()}
                        className="bg-EveningBlack hover:bg-DeepNightBlack border border-Green/40 hover:border-Green text-Green px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                        title="Upload to Cloudinary"
                      >
                        <FaCloudUploadAlt className={uploadingProjectImage ? 'animate-bounce' : ''} />
                        {uploadingProjectImage ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-LightGray mb-1">Live Demo URL</label>
                    <input
                      type="text"
                      value={projectFormData.url}
                      onChange={(e) => setProjectFormData({ ...projectFormData, url: e.target.value })}
                      className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2.5 text-Snow text-sm focus:border-Green focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-LightGray mb-1">Project Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={projectFormData.projectDetail}
                    onChange={(e) => setProjectFormData({ ...projectFormData, projectDetail: e.target.value })}
                    className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl p-4 text-Snow text-sm focus:border-Green focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-LightGray mb-1">Technologies Used</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. NextJS, TypeScript"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      className="flex-1 bg-DeepNightBlack border border-LightGray/20 rounded-xl px-4 py-2 text-Snow text-sm focus:border-Green focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddProjectTech}
                      className="bg-EveningBlack border border-Green/40 text-Green px-4 py-2 rounded-xl text-xs font-semibold hover:bg-Green/10 transition-all"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {techList.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-DeepNightBlack border border-Green/30 text-Green text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5"
                      >
                        {t}
                        <button type="button" onClick={() => handleRemoveProjectTech(t)} className="text-LightGray hover:text-red-400">
                          <FaTimes className="text-[10px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-LightGray/10">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-LightGray/20 text-LightGray text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl bg-Green text-DeepNightBlack font-bold text-xs shadow-lg hover:bg-Green/90 transition-all"
                  >
                    {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* Delete Project Modal */}
      {isDeleteProjectModalOpen && (
        <ClientPortal>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-EveningBlack rounded-2xl border border-red-500/30 w-full max-w-md p-6 text-center shadow-2xl font-circular my-auto">
              <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaTrash className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-Snow mb-1 font-circular-bold">Delete Project?</h3>
              <p className="text-xs text-LightGray mb-6 font-circular-light">
                Are you sure you want to delete <strong className="text-Snow">"{projectToDelete?.projectName}"</strong>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-LightGray/20 text-LightGray text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProjectConfirm}
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-red-500 text-white text-xs font-bold shadow-lg hover:bg-red-600 transition-all"
                >
                  {submitting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* Education Modal */}
      {isEduModalOpen && (
        <ClientPortal>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-EveningBlack rounded-2xl border border-Green/30 w-full max-w-md p-6 shadow-2xl font-circular my-auto">
              <h3 className="text-base font-bold text-Snow mb-4 font-circular-bold">
                {editingEduIndex >= 0 ? 'Edit Education' : 'Add Education'}
              </h3>
              <form onSubmit={handleSaveEdu} className="space-y-3">
                <div>
                  <label className="block text-xs text-LightGray mb-1">Institution Title *</label>
                  <input
                    type="text"
                    required
                    value={eduForm.title}
                    onChange={(e) => setEduForm({ ...eduForm, title: e.target.value })}
                    className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-3 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-LightGray mb-1">Degree / Certification *</label>
                  <input
                    type="text"
                    required
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-3 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-LightGray mb-1">Year Period</label>
                  <input
                    type="text"
                    value={eduForm.year}
                    onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                    className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-3 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-LightGray mb-1">Details</label>
                  <textarea
                    rows={2}
                    value={eduForm.detail}
                    onChange={(e) => setEduForm({ ...eduForm, detail: e.target.value })}
                    className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl p-3 text-Snow text-xs focus:border-Green focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEduModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-LightGray font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-Green text-DeepNightBlack font-bold text-xs rounded-xl shadow-md hover:bg-Green/90"
                  >
                    Save Education
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* Experience Modal */}
      {isExpModalOpen && (
        <ClientPortal>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-EveningBlack rounded-2xl border border-Green/30 w-full max-w-md p-6 shadow-2xl font-circular my-auto">
              <h3 className="text-base font-bold text-Snow mb-4 font-circular-bold">
                {editingExpIndex >= 0 ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <form onSubmit={handleSaveExp} className="space-y-3">
                <div>
                  <label className="block text-xs text-LightGray mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={expForm.title}
                    onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                    className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-3 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-LightGray mb-1">Role / Position *</label>
                  <input
                    type="text"
                    required
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-3 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-LightGray mb-1">Location</label>
                    <input
                      type="text"
                      value={expForm.location}
                      onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-3 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-LightGray mb-1">Year Period</label>
                    <input
                      type="text"
                      value={expForm.year}
                      onChange={(e) => setExpForm({ ...expForm, year: e.target.value })}
                      className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl px-3 py-2 text-Snow text-xs focus:border-Green focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-LightGray mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={expForm.desc}
                    onChange={(e) => setExpForm({ ...expForm, desc: e.target.value })}
                    className="w-full bg-DeepNightBlack border border-LightGray/20 rounded-xl p-3 text-Snow text-xs focus:border-Green focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsExpModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-LightGray font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-Green text-DeepNightBlack font-bold text-xs rounded-xl shadow-md hover:bg-Green/90"
                  >
                    Save Experience
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ClientPortal>
      )}

      <Footer />
    </BannerLayout>
  );
}
