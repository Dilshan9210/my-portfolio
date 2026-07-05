"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  skills: string[];
  videoUrl: string;
  thumbnailUrl?: string;
}



export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        
        if (json.success && json.data.length > 0) {
          setProjects(json.data);
        }
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // GSAP ScrollTrigger & 3D Dynamic Coverflow Math
  useLayoutEffect(() => {
    if (isLoading || projects.length === 0 || expandedId) return;

    let ctx = gsap.context(() => {
      const track = document.querySelector('.scroll-track') as HTMLElement;
      const wrappers = gsap.utils.toArray<HTMLElement>('.gsap-card-wrapper');
      
      const updateCards = () => {
        const center = window.innerWidth / 2;
        
        wrappers.forEach((wrapper) => {
          const card = wrapper.querySelector('.gsap-3d-card') as HTMLElement;
          if (!card) return;

          // Measure the UNTRANSFORMED wrapper
          const rect = wrapper.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = cardCenter - center;
          
          // Normalize distance. 600px away = factor of 1
          const normalized = distance / 600;
          const clamped = Math.max(-1.5, Math.min(1.5, normalized));
          
          // Calculate dynamic values
          const rotateY = clamped * 50; // up to 75 deg
          const z = Math.abs(clamped) * -300;
          const scale = 1 - Math.abs(clamped) * 0.15;
          const opacity = Math.abs(clamped) > 1.2 ? 0 : 1;
          
          gsap.set(card, {
            rotateY,
            z,
            scale,
            opacity,
            transformPerspective: 1200,
            transformOrigin: "center center"
          });
        });
      };

      // Calculate max scroll distance based on track width and viewport
      // If projects length is small, ensure we have enough scroll distance
      const scrollDistance = Math.max(track.scrollWidth - window.innerWidth, window.innerWidth);

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1, // Smooth scrubbing
          start: "center center", // Pin when section is vertically centered
          end: () => `+=${scrollDistance}`, // Scroll length matches track length
          onUpdate: updateCards,
          invalidateOnRefresh: true, // Recalculate on resize
        }
      });
      
      // Force initial calculation
      updateCards();

      // CRITICAL FIX: Because this component loads dynamically (fetch), 
      // it changes the page height AFTER downstream components (like EducationSection)
      // have already calculated their ScrollTrigger positions. 
      // We MUST force a global refresh so EducationSection recalculates its start/end points.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      
    }, containerRef);
    
    return () => ctx.revert();
  }, [isLoading, projects.length, expandedId]);

  if (isLoading) {
    return (
      <section className="relative w-full bg-black text-white h-[80vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-400 font-mono text-sm tracking-widest uppercase">Loading Projects...</p>
        </div>
      </section>
    );
  }

  const activeProject = projects.find(p => p.id === expandedId);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center"
    >
      
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/5 blur-[120px] pointer-events-none transition-opacity duration-1000" 
        style={{ opacity: expandedId ? 0 : 1 }} 
      />

      <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
        <h2 className="text-sm font-mono tracking-[0.55em] text-neutral-500 uppercase">Featured Work</h2>
        <p className="text-3xl font-black uppercase tracking-tight mt-2 text-white">Selected Projects</p>
      </div>

      {/* Horizontal Scroll Track Wrapper */}
      <div 
        className={`w-full h-full absolute inset-0 flex items-center overflow-visible transition-opacity duration-500 ${expandedId ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        style={{ perspective: "1500px" }}
      >
        {/* The Track that GSAP translates horizontally */}
        <div className="scroll-track flex gap-16 items-center shrink-0 md:px-[calc(50vw-175px)] px-[calc(50vw-150px)]">
          {projects.map((project) => {
            return (
              <div 
                key={project.id} 
                className="gsap-card-wrapper shrink-0 relative w-[300px] md:w-[350px] aspect-[9/16]"
              >
                <motion.div
                  layoutId={`project-container-${project.id}`}
                  className="gsap-3d-card w-full h-full rounded-3xl overflow-hidden group shadow-2xl border border-white/10 bg-neutral-900 cursor-pointer relative"
                  onClick={() => setExpandedId(project.id)}
                >
                  {/* STRICT LIFECYCLE: Only render an img tag in the carousel */}
                  {expandedId !== project.id && (
                    <>
                      {project.thumbnailUrl ? (
                        <img 
                          src={project.thumbnailUrl}
                          alt={project.title}
                          className="w-full h-full object-cover object-center pointer-events-none"
                          loading="lazy"
                        />
                      ) : (
                        /* Fallback for Google Drive or other unrecognizable links */
                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center p-8 text-center pointer-events-none">
                          <div>
                            <span className="text-xs font-mono tracking-widest text-white/50 uppercase block mb-2">
                              {project.subtitle}
                            </span>
                            <h3 className="text-xl font-bold uppercase tracking-tight text-white/80 leading-none">
                              {project.title}
                            </h3>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Overlay with Title */}
                  {expandedId !== project.id && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 backdrop-blur-[2px] pointer-events-none">
                      <span className="text-xs font-mono tracking-widest text-white/70 uppercase mb-2">
                        {project.subtitle}
                      </span>
                      <h3 className="text-3xl font-black uppercase tracking-tight text-white leading-none">
                        {project.title}
                      </h3>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Active State (Video Player) */}
      <AnimatePresence>
        {expandedId && activeProject && (
          <ExpandedVideoPlayer 
            key="expanded-player"
            project={activeProject} 
            onClose={() => setExpandedId(null)}
          />
        )}
      </AnimatePresence>
      
    </section>
  );
}

// ----------------------------------------------------------------------------
// Expanded Video Player Component
// ----------------------------------------------------------------------------
function ExpandedVideoPlayer({ 
  project, 
  onClose, 
}: { 
  project: Project, 
  onClose: () => void, 
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isIframe = project.videoUrl?.includes('youtube.com/embed') || project.videoUrl?.includes('drive.google.com');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
      
      {/* Layout ID container to match the carousel item seamlessly */}
      <motion.div
        layoutId={`project-container-${project.id}`}
        className="relative h-[85vh] md:h-[90vh] aspect-[9/16] bg-neutral-950 md:rounded-3xl overflow-hidden shadow-2xl group"
        initial={{ borderRadius: 32 }}
        animate={{ borderRadius: 24 }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
      >
        {/* STRICT LIFECYCLE: Video/Iframe mounts ONLY here, and destroys when this component unmounts */}
        {isIframe ? (
          <iframe
            src={`${project.videoUrl}${project.videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
            className="w-full h-full object-cover border-none"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={project.videoUrl}
            className="w-full h-full object-cover cursor-pointer"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            controls={false}
            autoPlay
            playsInline
            loop
            onClick={togglePlay}
          />
        )}

        {/* Minimalist Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
          
          {/* Top Bar */}
          <div className="p-8 md:p-12 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-5xl font-black uppercase tracking-tight text-white pointer-events-auto mix-blend-difference drop-shadow-lg"
              >
                {project.title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xs md:text-sm font-mono tracking-widest text-white/80 uppercase mt-3 mix-blend-difference drop-shadow-md"
              >
                {project.subtitle}
              </motion.p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="pointer-events-auto text-white/90 hover:text-white uppercase font-mono tracking-widest text-sm transition-colors mix-blend-difference px-4 py-2 drop-shadow-md bg-black/20 rounded-full hover:bg-black/50"
            >
              Close [X]
            </button>
          </div>

          {/* Bottom Control Bar (Hidden for iframes) */}
          {!isIframe && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8 md:p-12 flex justify-between items-end bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-auto"
            >
              {/* Mute */}
              <button 
                onClick={toggleMute}
                className="text-white/70 hover:text-white uppercase font-mono tracking-widest text-sm md:text-base transition-colors w-24 text-left drop-shadow-md"
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>

              {/* Play/Pause & Time */}
              <button 
                onClick={togglePlay}
                className="text-white uppercase font-mono tracking-widest text-sm md:text-base transition-colors group text-center drop-shadow-md"
              >
                <span className="group-hover:text-white/80 transition-colors inline-block mb-1">
                  {isPlaying ? 'Pause' : 'Play'} {formatTime(currentTime)} - {formatTime(duration)}
                </span>
                <div className="w-full h-[2px] bg-white/20 mt-2 relative rounded-full overflow-hidden">
                   <div 
                     className="absolute top-0 left-0 h-full bg-white transition-all ease-linear"
                     style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                   />
                </div>
              </button>

              {/* Empty spacer for alignment */}
              <div className="w-24"></div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
