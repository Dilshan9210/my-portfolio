"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Custom Magnetic Button Component
const MagneticButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.4, y: middleY * 0.4 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-wider text-lg overflow-hidden group w-fit cursor-pointer"
    >
      <span className="relative z-10 group-hover:text-white transition-colors duration-500">{children}</span>
      <div className="absolute inset-0 bg-blue-600 transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-in-out z-0 rounded-full" />
    </motion.button>
  );
};

export default function HireMeSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax setup for the image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Moves the image slightly up/down as we scroll past it
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={containerRef} className="py-24 px-6 md:px-12 lg:px-24 bg-black border-t border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Column: Portrait with Parallax */}
        <div className="relative w-full aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden group">
          {/* A slight scale-110 ensures we don't see blank edges during parallax */}
          <motion.div style={{ y }} className="absolute inset-0 w-full h-[130%] -top-[15%]">
            <img 
              src="https://assets.mixkit.co/images/preview/mixkit-cinematic-portrait-of-a-man-in-neon-lights-29711-large.jpg" 
              alt="Professional Portrait"
              className="w-full h-full object-cover filter brightness-75 contrast-125 grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
          {/* Overlay to blend better into the dark theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 border border-neutral-800/60 rounded-[2rem] pointer-events-none" />
        </div>

        {/* Right Column: Copy & Magnetic Button */}
        <div className="flex flex-col items-start justify-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-mono tracking-[0.55em] text-blue-500 uppercase mb-6"
          >
            Availability
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9]"
          >
            Ready to <br className="hidden md:block"/> build <span className="text-neutral-500">something</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">extraordinary?</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-400 mt-8 text-lg leading-relaxed max-w-lg mb-12 font-light"
          >
            I partner with forward-thinking brands and ambitious creators to forge digital experiences that refuse to be ignored. From high-end motion graphics to AI-driven visual narratives, let's bring your vision into reality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            <MagneticButton>
              Hire Me
            </MagneticButton>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
