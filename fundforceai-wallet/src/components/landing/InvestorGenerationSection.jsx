import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvestorGenerationSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-80">
          <RainLines />
        </div>

        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fe8200]/10 blur-[140px]" />
        <div className="absolute inset-0 bg-radial-fade" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] flex-col items-center justify-center px-8 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/45">
          <Sparkles className="h-3.5 w-3.5 text-[#fe8200]" />
          New capital intelligence
        </div>

        <h2 className="max-w-4xl text-6xl font-medium leading-[0.95] tracking-[-0.065em] text-white md:text-8xl">
          Join a new generation
          <br />
          of operators
        </h2>

        <p className="mt-8 max-w-2xl text-lg leading-7 text-white/55">
          Give every client a private growth model: what was funded, what is
          pending, what vendors are attached, and what outcome the capital is
          expected to produce.
        </p>

        <Button className="mt-8 h-12 rounded-full bg-[#fe8200] px-8 font-semibold text-black shadow-[0_0_40px_rgba(254,130,0,0.25)] hover:bg-[#ff9b2f]">
          Get started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

function RainLines() {
  const lines = Array.from({ length: 70 });

  return (
    <div className="absolute inset-0">
      {lines.map((_, index) => {
        const left = `${(index * 37) % 100}%`;
        const top = `${(index * 19) % 100}%`;
        const height = 70 + ((index * 13) % 110);
        const opacity = 0.25 + ((index % 5) * 0.12);

        return (
          <span
            key={index}
            className="absolute block w-px rounded-full bg-white"
            style={{
              left,
              top,
              height,
              opacity,
              transform: `rotate(${index % 2 === 0 ? "0deg" : "1deg"})`,
            }}
          />
        );
      })}
    </div>
  );
}