import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Crown, Sparkles, Zap } from "lucide-react";

import UserPageShell from "@/components/user/UserPageShell";
import UserTopNav from "@/components/user/UserTopNav";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { getClients } from "@/lib/client";
import { getClientFundingStats, normalizeClient } from "@/lib/userDashboard";

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

const PACKAGES = [
  {
    id: "foundation",
    marker: "🔵",
    name: "Foundation",
    price: "$10K",
    min: 10000,
    description: "Build your brand correctly.",
    features: ["Vendor setup", "Local visibility", "Basic campaign structure", "Starter growth mirror"],
  },
  {
    id: "scale",
    marker: "🟡",
    name: "Scale",
    price: "$25K",
    min: 25000,
    description: "Generate more leads and visibility.",
    features: ["Retargeting", "Stronger creative", "Expanded vendor allocation", "Lead acquisition push"],
  },
  {
    id: "domination",
    marker: "🔴",
    name: "Domination",
    price: "$50K",
    min: 50000,
    description: "Build authority and advertising systems.",
    features: ["Multi-channel acquisition", "SEO authority", "Aggressive paid traffic", "Funnel optimization"],
  },
  {
    id: "legacy",
    marker: "👑",
    name: "Legacy",
    price: "$100K+",
    min: 100000,
    description: "Create a full growth ecosystem.",
    features: ["Full growth system", "Analytics", "Automation", "Brand authority infrastructure"],
  },
];

function getSuggestedPackage(totalPlanned) {
  if (totalPlanned >= 100000) return "Legacy";
  if (totalPlanned >= 50000) return "Domination";
  if (totalPlanned >= 25000) return "Scale";
  return "Foundation";
}

export default function UserPackages() {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadClient() {
    try {
      setError("");

      const data = await getClients();
      const normalizedClients = (data.clients || []).map(normalizeClient);

      setClient(normalizedClients[0] || null);
    } catch (error) {
      setError(error.message || "Failed to load packages.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClient();
  }, []);

  const stats = useMemo(() => getClientFundingStats(client), [client]);
  const suggestedPackage = getSuggestedPackage(stats.totalPlanned);

  if (isLoading) {
    return (
      <UserPageShell>
        <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
          <div className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-8 text-white/50">
            Loading package tiers...
          </div>
        </main>
      </UserPageShell>
    );
  }

  if (error || !client) {
    return (
      <UserPageShell>
        <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
          <div className="rounded-[2rem] border border-red-500/30 bg-red-500/10 p-8 text-red-200">
            {error || "No package account found."}
          </div>
        </main>
      </UserPageShell>
    );
  }

  return (
    <UserPageShell>
      <UserTopNav client={client} onOpenAccount={() => {}} />

      <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
        <section className="mb-6 rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-7 shadow-2xl shadow-black/50">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#fe8200]">
                Growth packages
              </p>

              <h1 className="text-5xl font-medium tracking-[-0.065em]">
                Choose your level of force.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                Packages define how aggressively capital gets deployed into
                brand, visibility, acquisition, and authority.
              </p>
            </div>

            <Badge className="w-fit rounded-full border border-[#fe8200]/20 bg-[#fe8200]/10 px-4 py-2 text-xs text-[#fe8200] hover:bg-[#fe8200]/10">
              Current tier: {suggestedPackage}
            </Badge>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <TopStat label="Current planned" value={money(stats.totalPlanned)} />
            <TopStat label="Pending" value={money(stats.pendingTotal)} />
            <TopStat label="Vendors" value={stats.vendors.length} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="grid gap-4 md:grid-cols-2">
            {PACKAGES.map((item) => (
              <PackageCard
                key={item.id}
                item={item}
                active={item.name === suggestedPackage}
              />
            ))}
          </div>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border-cyan-300/20 bg-cyan-300/[0.04] text-white">
              <CardContent className="p-6">
                <Sparkles className="mb-4 h-5 w-5 text-cyan-300" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Suggested path
                </p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
                  {suggestedPackage} is your current closest fit.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  Based on your current planned capital of{" "}
                  <span className="font-semibold text-white">
                    {money(stats.totalPlanned)}
                  </span>
                  , your account currently maps to the{" "}
                  <span className="font-semibold text-[#fe8200]">
                    {suggestedPackage}
                  </span>{" "}
                  package tier.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-6">
                <Crown className="mb-4 h-5 w-5 text-[#fe8200]" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fe8200]">
                  Upgrade request
                </p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
                  Need more aggressive growth?
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/45">
                  This request button can later notify the admin/sales team to
                  model a new funding scenario.
                </p>

                <Button
                  disabled
                  className="mt-6 h-11 rounded-2xl bg-[#fe8200]/40 px-5 font-semibold text-black hover:bg-[#fe8200]/40"
                >
                  Request package change later
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </UserPageShell>
  );
}

function TopStat({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
        {value}
      </p>
    </div>
  );
}

function PackageCard({ item, active }) {
  return (
    <Card
      className={`rounded-[2rem] text-white transition ${
        active
          ? "border-[#fe8200]/40 bg-[#fe8200]/[0.06]"
          : "border-white/[0.08] bg-[#0b0d12] hover:border-[#fe8200]/35"
      }`}
    >
      <CardContent className="p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-2xl">
            {item.marker}
          </div>

          <Badge
            className={
              active
                ? "rounded-full border border-[#fe8200]/25 bg-[#fe8200]/10 text-[#fe8200]"
                : "rounded-full border border-white/[0.08] bg-white/[0.04] text-white/60"
            }
          >
            {active ? "Current tier" : item.price}
          </Badge>
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-2xl font-semibold uppercase tracking-[-0.04em]">
            {item.name}
          </h2>
          <p className="font-mono text-sm font-semibold text-[#fe8200]">
            {item.price}
          </p>
        </div>

        <p className="mt-2 text-sm font-medium text-white/70">
          {item.description}
        </p>

        <div className="mt-6 space-y-3">
          {item.features.map((feature) => (
            <div key={feature} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <p className="text-sm text-white/55">{feature}</p>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          disabled
          className="mt-6 h-10 rounded-xl px-0 text-[#fe8200] hover:bg-transparent hover:text-[#ff9a2f]"
        >
          {active ? "Current package" : "View upgrade later"}
          <Zap className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}