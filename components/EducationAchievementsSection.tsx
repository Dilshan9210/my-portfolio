"use client";

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function EducationAchievementsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const eduPanel2Ref = useRef<HTMLDivElement>(null);
  const achWrapperRef = useRef<HTMLDivElement>(null);
  const achPanel2Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(eduPanel2Ref.current, { yPercent: 100 });
      gsap.set(achWrapperRef.current, { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(achPanel2Ref.current, { clipPath: 'inset(100% 0 0 0)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%",    // 4 viewport-heights of scroll
          pin: true,
          pinSpacing: true,
          scrub: 1,
        }
      });

      // Phase 1 (0 → 0.25 = 100vh): Education Panel 2 slides up over Panel 1
      tl.to(eduPanel2Ref.current, {
        yPercent: 0,
        ease: "none",
        duration: 0.25
      }, 0);

      // Phase 2 (0.25 → 0.5 = 100vh): Achievements wrapper reveals over Education
      tl.to(achWrapperRef.current, {
        clipPath: 'inset(0% 0 0 0)',
        ease: "none",
        duration: 0.25
      }, 0.25);

      // Phase 3 (0.5 → 1.0 = 200vh): Achievements Panel 2 reveals over Panel 1
      tl.to(achPanel2Ref.current, {
        clipPath: 'inset(0% 0 0 0)',
        ease: "none",
        duration: 0.5
      }, 0.5);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">

      {/* ================= EDUCATION PANEL 1 (Bottom layer) ================= */}
      <div className="absolute inset-0 w-full h-full z-10 flex flex-col justify-end">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img src="/maradana-bg.jpg.png" className="w-full h-full object-cover" />
        </div>
        {/* පැහැදිලි බව වැඩි කරන්න තද gradient එකක් */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="relative z-10 p-8 md:p-16 lg:p-24 flex flex-col justify-between h-full">
          <div className="flex justify-end pt-4"><span className="text-6xl md:text-8xl font-black text-white/20 tracking-tighter">01</span></div>
          <div className="flex flex-col gap-8 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white/10 p-4 border border-white/20 flex items-center justify-center">
                <img src="/maradana-logo.png.jfif" className="w-full h-full object-contain" />
              </div>
              <div className="px-6 py-2.5 rounded-full bg-white/20 text-white text-lg font-medium border border-white/20">2021 - 2023</div>
            </div>
            <div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight leading-[1.1]">Diploma in information and communication technology</h2>
              <p className="text-xl md:text-3xl text-neutral-200 font-light">Sri lanka College of Technology Maradana</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDUCATION PANEL 2 (Slides up from bottom) ================= */}
      <div ref={eduPanel2Ref} className="absolute inset-0 w-full h-full z-20 bg-black shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img src="/uovt-bg.jpg.jpg" className="w-full h-full object-cover" />
        </div>
        {/* පැහැදිලි බව වැඩි කරන්න තද gradient එකක් */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="relative z-10 p-8 md:p-16 lg:p-24 flex flex-col justify-between h-full">
          <div className="flex justify-end pt-4"><span className="text-6xl md:text-8xl font-black text-white/20 tracking-tighter">02</span></div>
          <div className="flex flex-col gap-8 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white/10 p-4 border border-white/20 flex items-center justify-center">
                <img src="/uovt-logo.png.jfif" className="w-full h-full object-contain" />
              </div>
              <div className="px-6 py-2.5 rounded-full bg-white/20 text-white text-lg font-medium border border-white/20">2024 - Present</div>
            </div>
            <div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight leading-[1.1]">Bachelor of Technology in Web and Creative Media Undergraduate</h2>
              <p className="text-xl md:text-3xl text-neutral-200 font-light">University of Vocational Technology (UoVT)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACHIEVEMENTS WRAPPER (Reveals over Education) ================= */}
      <div ref={achWrapperRef} className="absolute inset-0 w-full h-full z-30">

        {/* ACHIEVEMENTS PANEL 1 - JAT */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/jat-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl md:text-7xl font-black text-white text-center">JAT Paints AI Video Competition 2026</h1>
          </div>
        </div>

        {/* ACHIEVEMENTS PANEL 2 - DAKSHINA */}
        <div ref={achPanel2Ref} className="absolute inset-0 w-full h-full">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/dakshina-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl md:text-7xl font-black text-white text-center">Dakshina Prabha National Online Video Competition 2026</h1>
          </div>
        </div>

      </div>

    </section>
  );
}
