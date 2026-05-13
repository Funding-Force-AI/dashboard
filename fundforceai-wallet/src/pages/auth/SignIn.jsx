import { useState } from "react";
import { ArrowRight, Lock, Mail, Shield, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getCurrentUser, loginUser, logoutUser } from "@/lib/auth";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      await loginUser({
        email,
        password,
      });

      const me = await getCurrentUser();
      const role = me.user?.role;

      if (!["super_admin", "client"].includes(role)) {
        await logoutUser();
        throw new Error("This account is not authorized for client access.");
      }

      navigate("/user");
    } catch (error) {
      setError(error.message || "Sign in failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-[#fe8200] text-black lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-24 h-[34rem] w-[34rem] rounded-full bg-white/20 blur-[120px]" />
            <div className="absolute bottom-[-12rem] right-[-12rem] h-[32rem] w-[32rem] rounded-full bg-black/15 blur-[100px]" />
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
                  Capital intelligence
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 px-10 pb-14">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black/60">
              <Shield className="h-3.5 w-3.5" />
              Funding Force AI
            </p>

            <h1 className="max-w-2xl text-7xl font-black leading-[0.9] tracking-[-0.085em] xl:text-8xl">
              Capital ops,
              <br />
              controlled.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-black/65">
              Manage client funding mirrors, vendor allocations, capital
              history, and projected outcomes from one secure Merbi workspace.
            </p>

            <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
              <Metric label="Clients" value="13" />
              <Metric label="Tracked" value="$2.84M" />
              <Metric label="Status" value="Live" />
            </div>
          </div>

          <div className="relative z-10 -mb-6 px-6">
            <p className="select-none text-[12vw] font-black leading-none tracking-[-0.12em] text-black/95">
              Merbi
            </p>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 py-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-[-12rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#fe8200]/12 blur-[130px]" />
            <div className="absolute left-[-12rem] bottom-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#161c2d]/80 blur-[120px]" />
          </div>

          <div className="relative z-10 w-full max-w-md">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fe8200] text-black">
                  <Zap className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em]">
                    Merbi
                  </p>
                  <p className="text-xs text-white/40">Capital intelligence</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12]/90 p-7 shadow-2xl shadow-black/60 backdrop-blur-xl">
              <div className="mb-7">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#fe8200]/20 bg-[#fe8200]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#fe8200]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Secure workspace
                </p>

                <h2 className="text-4xl font-semibold tracking-[-0.055em]">
                  Sign in to
                  <br />
                  Funding Force AI.
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/45">
                  Access your secure client mirror.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      required
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
                      Forgot?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="h-12 rounded-2xl border-white/[0.08] bg-black/30 pl-11 text-white placeholder:text-white/25 focus-visible:ring-[#fe8200]/50"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-2xl bg-[#fe8200] font-semibold text-black shadow-[0_0_32px_rgba(254,130,0,0.22)] hover:bg-[#ff9b2f] disabled:opacity-60"
                >
                  {isSubmitting ? "Checking access..." : "Sign in"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex gap-3">
                  <Shield className="mt-0.5 h-4 w-4 text-emerald-300" />
                  <p className="text-xs leading-5 text-white/45">
                    Access is role-based. Client users only see their linked
                    account mirror.
                  </p>
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-white/35">
                Need access?{" "}
                <button
                  type="button"
                  className="font-medium text-white/70 hover:text-white"
                >
                  Contact your Merbi admin
                </button>
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-5 text-xs text-white/30">
              <button className="hover:text-white/60">Privacy</button>
              <button className="hover:text-white/60">Terms</button>
              <button className="hover:text-white/60">Security</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-3xl border border-black/15 bg-black/5 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-[-0.05em]">{value}</p>
    </div>
  );
}