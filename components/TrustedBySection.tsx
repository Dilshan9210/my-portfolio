"use client";

const clients = [
  { name: "RP Nursing Consultancy", logo: "/rpnursing.png" },
  { name: "JAT Holdings", logo: "/jat.png" },
  { name: "JADE Restaurant", logo: "/jaderesturent.png" },
  { name: "Pacific Duty Free", logo: "/pacific.png" },
  { name: "Family Masters Quality Home Products", logo: "/master.png" },
  { name: "Eswaran Brothers", logo: "/eswaran.png" },
  { name: "Metrixo", logo: "/metrixo.png" },
];

export default function TrustedBySection() {
  // Duplicate array for seamless loop — two full copies side by side
  const track = [...clients, ...clients];

  return (
    <section className="relative py-28 md:py-36 bg-black overflow-hidden">

      {/* ── Heading ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <span className="block text-[10px] md:text-xs font-mono tracking-[0.6em] text-neutral-500 uppercase mb-5">
          Collaborations
        </span>
        <h2 className="text-5xl md:text-8xl font-black uppercase text-white tracking-tighter leading-[0.9]">
          Services
          <br />
          <span className="text-neutral-600">Provided To</span>
        </h2>
      </div>

      {/* ── Edge fade masks ───────────────────────────────────────────────── */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* ── Marquee track — pauses on hover via group ─────────────────────── */}
      <div className="relative w-full overflow-hidden group">
        <div className="flex w-fit animate-marquee group-hover:[animation-play-state:paused]">
          {track.map((client, idx) => (
            <div
              key={idx}
              className="mx-4 md:mx-6 shrink-0 w-[200px] md:w-[240px]
                         flex flex-col items-center gap-5
                         bg-white/[0.04] backdrop-blur-md
                         border border-white/[0.08]
                         rounded-2xl p-6 md:p-8
                         transition-all duration-500 ease-out
                         hover:bg-white/[0.08] hover:border-white/[0.18]
                         hover:shadow-[0_0_50px_rgba(255,255,255,0.04)]
                         cursor-default group/card"
            >
              {/* Logo */}
              <div className="w-full aspect-[3/2] flex items-center justify-center">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-w-full max-h-full object-contain
                             grayscale opacity-50
                             group-hover/card:grayscale-0 group-hover/card:opacity-100
                             transition-all duration-500 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    // Graceful fallback: hide broken image, show name only
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Company name */}
              <span className="text-[11px] md:text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase text-center leading-snug
                               group-hover/card:text-neutral-300 transition-colors duration-500">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Keyframe animation ────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}} />
    </section>
  );
}
