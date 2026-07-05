"use client";

import { useState, useRef } from "react";
import { ArrowUp, Send } from "lucide-react";

/* ─── Inline SVG social icons (avoids lucide barrel-optimisation issues) ── */
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

/* ─── Social data ─────────────────────────────────────────────────────────── */
const socials = [
  { icon: LinkedinIcon,  label: "LinkedIn",  href: "#" },
  { icon: GithubIcon,    label: "GitHub",    href: "#" },
  { icon: FacebookIcon,  label: "Facebook",  href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
];

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate send — swap with a real endpoint later
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  /* Magnetic hover for the submit button */
  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
  };
  const handleMouseLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "";
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* ─── Shared input classes ─────────────────────────────────────────────── */
  const inputCls = `w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4
                     text-white text-sm placeholder:text-neutral-600
                     focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/10
                     transition-all duration-300`;

  return (
    <section className="relative bg-black pt-32 pb-12 overflow-hidden">
      {/* ── Ambient glow ─────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-white/[0.02] blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* ══════════ Two-column grid ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ── Left column: Headline + Socials ──────────────────────────── */}
          <div className="flex flex-col justify-between gap-16">
            <div>
              <span className="block text-[10px] md:text-xs font-mono tracking-[0.6em] text-neutral-500 uppercase mb-6">
                Get in Touch
              </span>
              <h2 className="text-6xl lg:text-8xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-8">
                Let&rsquo;s Work
                <br />
                <span className="text-neutral-500">Together</span>
              </h2>
              <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-md">
                Available for freelance projects, digital solutions, and B2B
                collaborations. Whether you have a concept or need end-to-end
                creative execution — I&rsquo;d love to hear from you.
              </p>
            </div>

            {/* Socials */}
            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-14 h-14
                             border border-white/15 bg-white/[0.04] backdrop-blur-sm rounded-full
                             transition-all duration-400 ease-out
                             hover:border-white/40 hover:bg-white/[0.08]
                             hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]
                             active:scale-95"
                >
                  <s.icon
                    className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors duration-300"
                    strokeWidth={1.5}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* ── Right column: Contact form ────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl
                       rounded-3xl p-8 lg:p-12 flex flex-col gap-6
                       shadow-[0_0_80px_rgba(255,255,255,0.02)]"
          >
            <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
              Send a Message
            </h3>

            {/* Name */}
            <div>
              <label htmlFor="contact-name" className="sr-only">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="contact-email" className="sr-only">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" className="sr-only">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                placeholder="Tell me about your project…"
                value={form.message}
                onChange={handleChange}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Submit */}
            <button
              ref={btnRef}
              type="submit"
              disabled={sending}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full mt-2 py-4 rounded-xl font-semibold text-sm tracking-wide uppercase
                         bg-white text-black
                         hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all duration-500 ease-out
                         flex items-center justify-center gap-3"
            >
              {sending ? (
                <span className="inline-block w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : sent ? (
                "Message Sent ✓"
              ) : (
                <>
                  Send Message
                  <Send className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* ══════════ Footer bar ══════════ */}
        <div className="mt-28 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-600 text-xs font-mono tracking-widest">
            &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-neutral-500 text-xs font-mono tracking-widest uppercase
                       hover:text-white transition-colors duration-300"
          >
            Back to Top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
