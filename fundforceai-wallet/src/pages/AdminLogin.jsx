import { ArrowRight, KeyRound, Lock, Mail, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const navigate = useNavigate();

  function handleMockLogin(event) {
    event.preventDefault();

    // Later:
    // await payloadLogin(email, password)
    // then navigate("/admin")

    navigate("/admin");
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#fe8200] text-black lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-16 h-[34rem] w-[34rem] rounded-full bg-white/20 blur-[120px]" />
            <div className="absolute -right-40 bottom-[-10rem] h-[34rem] w-[34rem] rounded-full bg-black/15 blur-[110px]" />
          </div>

          <div className="relative z-10 p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-[#fe8200]">
                <Zap className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em]">
                  Merbi
                </p>
                <p className="text-xs font-medium text-black/55">
                  Admin workspace
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 px-10 pb-14">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black/60">
              <ShieldCheck className="h-3.5 w-3.5" />
              Private console
            </p>

            <h1 className="max-w-2xl text-7xl font-black leading-[0.9] tracking-[-0.085em] xl:text-8xl">
              Admin
              <br />
              access only.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-black/65">
              Manage client accounts, capital mirrors, funding events, vendor
              allocations, and internal operations from one secure workspace.
            </p>

            <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
              <SecurityStat label="Scope" value="Admin" />
              <SecurityStat label="Access" value="Private" />
              <SecurityStat label="Mode" value="Secure" />
            </div>
          </div>

          <div className="relative z-10 -mb-6 px-6">
            <p className="select-none text-[12vw] font-black leading-none tracking-[-0.12em] text-black/95">
              Merbi
            </p>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-[-12rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#fe8200]/12 blur-[130px]" />
            <div className="absolute left-[-12rem] bottom-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#161c2d]/80 blur-[120px]" />
          </div>

          <div className="relative z-10 w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fe8200] text-black">
                <Zap className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em]">
                  Merbi
                </p>
                <p className="text-xs text-white/40">Admin workspace</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12]/90 p-7 shadow-2xl shadow-black/60 backdrop-blur-xl">
              <div className="mb-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fe8200]/10 text-[#fe8200]">
                  <KeyRound className="h-5 w-5" />
                </div>

                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#fe8200]/20 bg-[#fe8200]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#fe8200]">
                  Admin login
                </p>

                <h2 className="text-4xl font-semibold tracking-[-0.055em]">
                  Sign in to the
                  <br />
                  admin console.
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/45">
                  This area is restricted to authorized Merbi operators.
                </p>
              </div>

              <form onSubmit={handleMockLogin} className="space-y-4">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                    Admin email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="email"
                      placeholder="admin@merbi.com"
                      className="h-12 rounded-2xl border-white/[0.08] bg-black/30 pl-11 text-white placeholder:text-white/25 focus-visible:ring-[#fe8200]/50"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-medium text-[#fe8200] hover:text-[#ff9b2f]"
                    >
                      Reset access
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 rounded-2xl border-white/[0.08] bg-black/30 pl-11 text-white placeholder:text-white/25 focus-visible:ring-[#fe8200]/50"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-2xl bg-[#fe8200] font-semibold text-black shadow-[0_0_32px_rgba(254,130,0,0.22)] hover:bg-[#ff9b2f]"
                >
                  Enter admin console
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                  <p className="text-xs leading-5 text-white/45">
                    Later this will use Payload auth with admin-only role
                    checks, HTTP-only cookies, password reset, and protected
                    routes.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-5 text-xs text-white/30">
              <button className="hover:text-white/60">Security</button>
              <button className="hover:text-white/60">Privacy</button>
              <button className="hover:text-white/60">Support</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SecurityStat({ label, value }) {
  return (
    <div className="rounded-3xl border border-black/15 bg-black/5 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-[-0.05em]">{value}</p>
    </div>
  );
}