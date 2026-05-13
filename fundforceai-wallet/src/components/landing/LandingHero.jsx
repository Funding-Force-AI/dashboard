import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Globe2, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingHero() {
    const navigate = useNavigate();
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#fe8200]/10 blur-[140px]" />
        <div className="absolute bottom-[-18rem] left-0 h-[28rem] w-full bg-[#161c2d]/80 blur-[90px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#161c2d]/70 to-transparent" />
      </div>

      <nav className="relative z-10 border-b border-white/[0.08] bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
              <Zap className="h-4 w-4" />
            </div>

            <p className="text-lg font-semibold tracking-tight">
           Merbi <span className="text-[#fe8200]">AI</span>
            </p>
          </div>

          <div className="ml-16 hidden items-center gap-8 text-sm text-white/70 lg:flex">
            <NavItem label="What We Offer" dropdown />
            <NavItem label="Capital Model" dropdown />
            <NavItem label="Forecast" />
            <NavItem label="Strategies" />
            <NavItem label="Learn" />
            <NavItem label="Support" />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="hidden items-center gap-2 text-sm text-white/70 hover:text-white md:flex">
              <Globe2 className="h-4 w-4" />
              US
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <Button
              onClick={()=> navigate("/signin")}
              variant="outline"
              className="rounded-full border-[#fe8200]/60 bg-transparent px-6 text-[#fe8200] hover:bg-[#fe8200]/10 hover:text-[#fe8200]"
            >
              Log in
            </Button>

            <Button className="rounded-full bg-[#fe8200] px-6 font-semibold text-black hover:bg-[#ff9b2f]">
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1500px] flex-col items-center justify-center px-8 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/45">
          <Shield className="h-3.5 w-3.5 text-[#fe8200]" />
          Capital visibility for modern operators
        </div>

        <h1 className="max-w-5xl text-6xl font-medium leading-[0.92] tracking-[-0.075em] text-white md:text-8xl lg:text-9xl">
          Fund growth
          <br />
          in one place
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-7 text-white/60 md:text-xl">
          Model vendor-directed capital, track projected outcomes, and give
          clients a clean view of what their funding is doing in real time.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button className="h-12 rounded-full bg-[#fe8200] px-8 font-semibold text-black shadow-[0_0_40px_rgba(254,130,0,0.25)] hover:bg-[#ff9b2f]">
            Get started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-12 rounded-full border-white/[0.12] bg-white/[0.03] px-8 text-white/75 hover:bg-white/[0.08] hover:text-white"
          >
            See demo model
          </Button>
        </div>
      </div>
    </section>
  );
}

function NavItem({ label, dropdown }) {
  return (
    <button className="flex items-center gap-1.5 text-white/65 transition hover:text-white">
      {label}
      {dropdown && <ChevronDown className="h-3.5 w-3.5" />}
    </button>
  );
}