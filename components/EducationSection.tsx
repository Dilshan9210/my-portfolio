"use client";

import React, { useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function EducationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Panel 2 එක යටින් පටන් ගන්නවා
      gsap.set(panel2Ref.current, { yPercent: 100 });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          gsap.to(panel2Ref.current, {
            yPercent: 100 - (self.progress * 100),
            overwrite: "auto"
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Refresh ScrollTrigger after images load ────────────────────────────
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const images = section.querySelectorAll('img');
    let loaded = 0;
    const total = images.length;
    if (total === 0) return;

    const onLoad = () => {
      loaded++;
      if (loaded >= total) ScrollTrigger.refresh();
    };

    images.forEach((img) => {
      if (img.complete) loaded++;
      else {
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onLoad);
      }
    });

    if (loaded >= total) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onLoad);
      });
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden" style={{ zIndex: 1 }}>

      {/* ================= PANEL 1 (BOTTOM) ================= */}
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

      {/* ================= PANEL 2 (TOP / OVERLAY) ================= */}
      <div ref={panel2Ref} className="absolute inset-0 w-full h-full z-20 bg-black shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
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
    </section>
  );
}