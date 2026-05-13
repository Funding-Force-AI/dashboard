import { ArrowUpRight, Shield, Zap } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#fe8200] text-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-white/20 blur-[120px]" />
        <div className="absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-black/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-8 py-14">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-[#fe8200]">
                <Zap className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em]">
                Merbi AI
                </p>
                <p className="text-xs text-black/55">Capital intelligence</p>
              </div>
            </div>

            <nav className="grid gap-3 text-sm font-medium text-black/70">
              <a href="#" className="transition hover:text-black">
                Platform
              </a>
              <a href="#" className="transition hover:text-black">
                Clients
              </a>
              <a href="#" className="transition hover:text-black">
                Funding
              </a>
              <a href="#" className="transition hover:text-black">
                Support
              </a>
            </nav>
          </div>

          <div>
            <div className="mb-10 max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black/60">
                <Shield className="h-3.5 w-3.5" />
                Built to Scale
              </p>

              <h2 className="text-5xl font-semibold leading-[0.9] tracking-[-0.07em] md:text-7xl lg:text-8xl">
                Merbi AI
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-6 text-black/65 md:text-base">
                A product for modeling, mirroring, and managing
                vendor-directed growth capital.
              </p>
            </div>

            <div className="grid gap-6 border-t border-black/15 pt-8 md:grid-cols-3">
              <FooterBlock
                title="Operate"
                links={["Admin console", "Client mirror", "Capital queue"]}
              />
              <FooterBlock
                title="Model"
                links={["90-day projections", "Vendor allocation", "Funding history"]}
              />
              <FooterBlock
                title="Company"
                links={["About Merbi", "Contact", "Security"]}
              />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-black/15 pt-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-3xl text-xs leading-5 text-black/55">
            Merbi AI is a capital operations and visibility platform.
            It does not originate payments, provide investment advice, or act as
            a bank. Product availability and workflows may vary by client.
          </p>

          <div className="flex items-center gap-5 text-xs font-semibold text-black/60">
            <a href="#" className="inline-flex items-center gap-1 hover:text-black">
              Privacy <ArrowUpRight className="h-3 w-3" />
            </a>
            <a href="#" className="inline-flex items-center gap-1 hover:text-black">
              Terms <ArrowUpRight className="h-3 w-3" />
            </a>
            <span>© 2026 Merbi AI</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mb-8 overflow-hidden px-4">
        <h3 className="select-none text-[18vw] font-black leading-none tracking-[-0.12em] text-black">
          Merbi
        </h3>
      </div>
    </footer>
  );
}

function FooterBlock({ title, links }) {
  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-black/45">
        {title}
      </p>

      <div className="grid gap-2">
        {links.map((link) => (
          <a
            href="#"
            key={link}
            className="text-sm font-medium text-black/70 transition hover:text-black"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}