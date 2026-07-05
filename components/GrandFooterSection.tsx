"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function GrandFooterSection() {
  const [copied, setCopied] = useState(false);
  const email = "hello@portfolio.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email", err);
    }
  };

  return (
    <footer className="relative bg-neutral-950 text-white overflow-hidden border-t border-neutral-900 pt-32 pb-12">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-center relative z-10">
        
        {/* Massive Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full text-center cursor-default"
        >
          <h1 className="text-[12vw] md:text-[14vw] font-black uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 select-none">
            Let's Talk
          </h1>
        </motion.div>

        {/* Minimalist Footer Grid */}
        <div className="w-full mt-24 pt-8 border-t border-neutral-800/60 flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Email & Copy Button */}
          <div className="flex items-center gap-4">
            <span className="text-neutral-500 font-mono text-xs tracking-[0.2em] uppercase">Email</span>
            <button 
              onClick={handleCopyEmail}
              className="flex items-center gap-3 group hover:text-blue-400 transition-colors"
            >
              <span className="text-lg md:text-xl font-medium tracking-wide">{email}</span>
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-blue-500/30 transition-colors relative overflow-hidden">
                <motion.div 
                  initial={false}
                  animate={{ y: copied ? -30 : 0, opacity: copied ? 0 : 1 }}
                  className="absolute"
                >
                  <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </motion.div>
                <motion.div 
                  initial={false}
                  animate={{ y: copied ? 0 : 30, opacity: copied ? 1 : 0 }}
                  className="absolute"
                >
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                </motion.div>
              </div>
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {["WhatsApp", "LinkedIn", "Behance"].map((social) => (
              <a 
                key={social}
                href="#"
                className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 hover:bg-neutral-800 transition-all"
                title={social}
              >
                <span className="text-xs font-mono uppercase font-bold tracking-widest">{social.substring(0, 2)}</span>
              </a>
            ))}
          </div>

        </div>
        
        {/* Copyright */}
        <div className="w-full text-center mt-16">
          <p className="text-neutral-600 text-[10px] font-mono uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
