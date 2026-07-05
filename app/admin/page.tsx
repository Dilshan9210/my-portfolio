"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

const SKILLS_LIST = [
  'Script Writing', 'Video Editing', 'After Effects', 'Motion Graphics', 
  'AI Generations', 'Illustrator', 'Lightroom', '3ds Max', 'Maya', 
  'WordPress', 'HTML/CSS', 'Photoshop', 'Premiere Pro', 'CapCut', 
  'React', 'Next.js', 'TypeScript'
];

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  videoLink?: string;
  videoUrl?: string; // from API
  originalVideoLink?: string; // from API
  embedUrl?: string | null;
  thumbnailUrl?: string; // New field
}

// Utility function to parse video link
function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    
    // YouTube
    if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
      let videoId = '';
      if (parsedUrl.hostname.includes('youtu.be')) {
        videoId = parsedUrl.pathname.slice(1);
      } else if (parsedUrl.searchParams.has('v')) {
        videoId = parsedUrl.searchParams.get('v') || '';
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Google Drive
    if (parsedUrl.hostname.includes('drive.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
  } catch (error) {
    // Invalid URL format
    return null;
  }
  
  return null;
}

export default function AdminPage() {
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [videoLink, setVideoLink] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Fetch (Read)
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const json = await res.json();
        if (json.success) {
          setProjects(json.data);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setSelectedSkills(project.skills || []);
    setVideoLink(project.originalVideoLink || project.videoLink || project.videoUrl || "");
    setThumbnailUrl(project.thumbnailUrl || "");
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setSelectedSkills([]);
    setVideoLink("");
    setThumbnailUrl("");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });
      
      const json = await res.json();
      if (json.success) {
        setProjects(prev => prev.filter(p => p.id !== id));
        router.refresh();
        
        if (editingId === id) {
          handleCancelEdit();
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const embedUrl = getVideoEmbedUrl(videoLink);
    
    const projectData = {
      id: editingId,
      title,
      description,
      skills: selectedSkills,
      videoLink,
      thumbnailUrl,
      embedUrl
    };

    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error('Failed to save project');

      const result = await response.json();
      
      if (result.success) {
        if (editingId) {
          setProjects(prev => prev.map(p => p.id === editingId ? result.data : p));
        } else {
          setProjects(prev => [result.data, ...prev]);
        }
        
        handleCancelEdit();
        router.refresh();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Project Dashboard</h1>
          <p className="text-neutral-500 mt-2">Manage your portfolio items securely.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Form */}
          <section className="bg-neutral-900/50 border border-neutral-800/60 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>
              {editingId && (
                <button 
                  onClick={handleCancelEdit}
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-400 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-700"
                  placeholder="e.g. Cinematic Showreel 2026"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-400 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-700 resize-none"
                  placeholder="Describe the project details, your role, and the impact..."
                />
              </div>

              {/* Skills Used (Multi-select dropdown) */}
              <div className="relative">
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Skills Used
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-left flex justify-between items-center hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <span className={selectedSkills.length === 0 ? "text-neutral-700" : "text-white truncate pr-4"}>
                    {selectedSkills.length === 0 
                      ? "Select skills..." 
                      : selectedSkills.join(", ")}
                  </span>
                  <svg className={`w-5 h-5 text-neutral-500 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="p-2 space-y-1">
                      {SKILLS_LIST.map((skill) => (
                        <label 
                          key={skill} 
                          className="flex items-center px-3 py-2 hover:bg-neutral-800 rounded-md cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-neutral-900"
                          />
                          <span className="ml-3 text-sm text-neutral-300">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Link */}
              <div>
                <label htmlFor="videoLink" className="block text-sm font-medium text-neutral-400 mb-2">
                  Video Link <span className="text-neutral-600 text-xs font-normal ml-2">(YouTube or Google Drive)</span>
                </label>
                <input
                  id="videoLink"
                  type="url"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-700"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-neutral-400 mb-2">
                  Thumbnail Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="thumbnailUrl"
                  type="url"
                  required
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-700"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-4"
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isSubmitting ? (editingId ? "Updating Project..." : "Saving Project...") : (editingId ? "Update Project" : "Save Project")}
              </button>
            </form>
          </section>

          {/* Right Column: Added Projects */}
          <section className="bg-neutral-900/30 border border-neutral-800/40 rounded-2xl p-6 md:p-8 flex flex-col h-[calc(100vh-12rem)] min-h-[600px] sticky top-6">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-xl font-semibold text-white">Your Projects</h2>
              <span className="bg-blue-500/10 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-500/20">
                {projects.length} Items
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : projects.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-600 border-2 border-dashed border-neutral-800/50 rounded-xl p-8 text-center bg-neutral-950/30">
                  <svg className="w-12 h-12 mb-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p>No projects added yet.</p>
                  <p className="text-sm mt-1">Fill out the form to see a preview here.</p>
                </div>
              ) : (
                projects.map((project, idx) => (
                  <div key={project.id || idx} className={`bg-neutral-950 border ${editingId === project.id ? 'border-blue-500/50' : 'border-neutral-800'} rounded-xl p-5 hover:border-neutral-700 transition-colors group relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <h3 className="text-lg font-bold text-white">{project.title}</h3>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(project)}
                          className="p-1.5 bg-neutral-800 hover:bg-blue-600 rounded text-neutral-300 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 bg-neutral-800 hover:bg-red-600 rounded text-neutral-300 hover:text-white transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-400 mb-4 whitespace-pre-wrap">{project.description}</p>
                    
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.skills.map((skill, i) => (
                          <span key={i} className="text-[10px] font-medium bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {project.thumbnailUrl && (
                      <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-10 transition-opacity">
                        <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent"></div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #262626;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #404040;
        }
      `}} />
    </div>
  );
}
