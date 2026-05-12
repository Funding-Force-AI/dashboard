import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Bolt,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Search,
  Shield,
  Sparkles,
  User as UserIcon,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getClients } from "@/lib/client";

function money(value, compact = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(Number(value || 0));
}

function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const CLIENT_MATCH_NAME = "Crown Treez Landscaping";

const PACKAGE_OPTIONS = [
  {
    id: "foundation",
    marker: "🔵",
    name: "Foundation",
    price: "$10K",
    description: "Build your brand correctly.",
    detail:
      "Core vendor setup, brand positioning, local visibility, and clean campaign infrastructure.",
  },
  {
    id: "scale",
    marker: "🟡",
    name: "Scale",
    price: "$25K",
    description: "Generate more leads and visibility.",
    detail:
      "Higher-intent campaigns, retargeting, stronger creative, and expanded vendor allocation.",
  },
  {
    id: "domination",
    marker: "🔴",
    name: "Domination",
    price: "$50K",
    description: "Build authority and advertising systems.",
    detail:
      "Multi-channel acquisition, stronger SEO authority, aggressive paid traffic, and funnel optimization.",
  },
  {
    id: "legacy",
    marker: "👑",
    name: "Legacy",
    price: "$100K+",
    description: "Create a full growth ecosystem.",
    detail:
      "Full-scale growth infrastructure across paid media, automation, analytics, creative, and brand authority.",
  },
];

function normalizeClient(client) {
  return {
    ...client,
    payloadId: client.payloadId || client.id,
    id: client.externalId || client.id,
    vendors: client.vendors || [],
    history: client.history || [],
  };
}

function buildScenario(client) {
  const totalPlanned = (client.vendors || []).reduce(
    (sum, vendor) => sum + Number(vendor.amount || 0),
    0
  );

  const deployAmount = totalPlanned || 7300;
  const revenueLift = Math.round(deployAmount * 3.2);
  const revenueLow = Math.round(revenueLift * 0.62);
  const revenueHigh = Math.round(revenueLift * 1.4);
  const costOfCapital = Math.round(deployAmount * 0.18);
  const netEquityGain = revenueLift - costOfCapital;
  const dailyAch = Math.max(1, Math.round((deployAmount + costOfCapital) / 180));

  return {
    todayScore: 67,
    day90Score: 78,
    scoreGain: 11,
    deployAmount,
    revenueLift,
    revenueRange: `${money(revenueLow, true)}–${money(revenueHigh, true)}`,
    netEquityGain,
    costOfCapital,
    dailyAch,
    dailyAchTerm: "~180 days",
  };
}

function getSuggestedPackage(totalPlanned) {
  if (totalPlanned >= 100000) return "Legacy";
  if (totalPlanned >= 50000) return "Domination";
  if (totalPlanned >= 25000) return "Scale";
  return "Foundation";
}

export default function User() {
  const [client, setClient] = useState(null);
  const [isLoadingClient, setIsLoadingClient] = useState(true);
  const [clientError, setClientError] = useState("");
  const [showAccountModal, setShowAccountModal] = useState(false);

  async function loadClient() {
    try {
      setClientError("");

      const data = await getClients();
      const normalizedClients = (data.clients || []).map(normalizeClient);

      const matchedClient =
        normalizedClients.find((item) => item.name === CLIENT_MATCH_NAME) ||
        normalizedClients.find((item) => item.id === "FF-2841") ||
        normalizedClients[0] ||
        null;

      setClient(matchedClient);
    } catch (error) {
      setClientError(error.message || "Failed to load client data.");
    } finally {
      setIsLoadingClient(false);
    }
  }

  useEffect(() => {
    loadClient();

    const intervalId = window.setInterval(() => {
      loadClient();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  const scenario = useMemo(() => {
    return buildScenario(client || { vendors: [] });
  }, [client]);

  const projectedVendors = client?.vendors || [];

  const totalPlanned = projectedVendors.reduce(
    (sum, vendor) => sum + Number(vendor.amount || 0),
    0
  );

  const completedTotal = projectedVendors
    .filter((vendor) => vendor.status === "Completed")
    .reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0);

  const pendingTotal = totalPlanned - completedTotal;

  const completedCount = projectedVendors.filter(
    (vendor) => vendor.status === "Completed"
  ).length;

  if (isLoadingClient) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-[12%] top-[-18rem] h-[40rem] w-[40rem] rounded-full bg-[#161c2d]/70 blur-[120px]" />
          <div className="absolute right-[-12rem] top-[5rem] h-[35rem] w-[35rem] rounded-full bg-[#fe8200]/12 blur-[130px]" />
          <div className="absolute bottom-[-16rem] left-[28%] h-[30rem] w-[30rem] rounded-full bg-cyan-300/5 blur-[110px]" />
        </div>

        <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
          <div className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-8 text-white/50">
            Loading live funding model...
          </div>
        </main>
      </div>
    );
  }

  if (clientError || !client) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-[12%] top-[-18rem] h-[40rem] w-[40rem] rounded-full bg-[#161c2d]/70 blur-[120px]" />
          <div className="absolute right-[-12rem] top-[5rem] h-[35rem] w-[35rem] rounded-full bg-[#fe8200]/12 blur-[130px]" />
          <div className="absolute bottom-[-16rem] left-[28%] h-[30rem] w-[30rem] rounded-full bg-cyan-300/5 blur-[110px]" />
        </div>

        <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
          <div className="rounded-[2rem] border border-red-500/30 bg-red-500/10 p-8 text-red-200">
            {clientError || "No client record found."}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[12%] top-[-18rem] h-[40rem] w-[40rem] rounded-full bg-[#161c2d]/70 blur-[120px]" />
        <div className="absolute right-[-12rem] top-[5rem] h-[35rem] w-[35rem] rounded-full bg-[#fe8200]/12 blur-[130px]" />
        <div className="absolute bottom-[-16rem] left-[28%] h-[30rem] w-[30rem] rounded-full bg-cyan-300/5 blur-[110px]" />
      </div>

      <header className="relative z-10 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center gap-5 px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
              <Shield className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                FundingForce <span className="text-[#fe8200]">AI</span>
              </p>
              <p className="text-xs text-white/40">Client capital portal</p>
            </div>
          </div>

          <div className="relative ml-8 hidden w-full max-w-md md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <Input
              placeholder="Search funding, vendors, account activity..."
              className="h-10 rounded-xl border-white/[0.08] bg-white/[0.04] pl-10 text-sm text-white placeholder:text-white/35"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Badge className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-400/10">
              Live
            </Badge>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-xl text-white/60 hover:bg-white/[0.06] hover:text-white"
            >
              <Bell className="h-4 w-4" />
            </Button>

            <button
              onClick={() => setShowAccountModal(true)}
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#161c2d] text-xs font-semibold text-white transition hover:bg-[#20283d]"
            >
              {initials(client.pointOfContact || client.name)}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
        <section className="mb-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="flex min-h-[520px] flex-col justify-between rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-8 shadow-2xl shadow-black/50">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#fe8200]">
                Client growth model
              </p>

              <h1 className="max-w-3xl text-5xl font-medium tracking-[-0.06em] md:text-7xl">
                See your brand,{" "}
                <span className="text-[#fe8200]">ninety days</span> from now.
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-6 text-white/50">
                Funding Force models the impact of deployed capital across
                vendors, campaigns, cost of capital, and projected outcomes for{" "}
                <span className="text-white">{client.name}</span>.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <MiniStat
                label="Merchant"
                value={client.name}
                sub={client.category}
                icon={Building2}
              />
              <MiniStat
                label="Current plan"
                value={money(totalPlanned)}
                sub="vendor-directed capital"
                icon={DollarSign}
              />
              <MiniStat
                label="Status"
                value={client.status}
                sub={client.signedAt}
                icon={CheckCircle2}
              />
            </div>
          </div>

          <ProjectionCard scenario={scenario} />
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[1fr_420px]">
          <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white shadow-2xl shadow-black/40">
            <CardContent className="p-0">
              <div className="border-b border-white/[0.08] p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                      Deploy this much
                    </p>
                    <h2 className="mt-3 text-5xl font-semibold tracking-[-0.055em] text-[#fe8200]">
                      {money(scenario.deployAmount)}
                    </h2>
                  </div>

                  <Button className="h-12 rounded-2xl bg-[#fe8200] px-6 font-semibold text-black shadow-[0_0_32px_rgba(254,130,0,0.25)] hover:bg-[#ff9b2f]">
                    <Bolt className="mr-2 h-4 w-4" />
                    Lock in this scenario
                    <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-8">
                  <div className="relative h-2 rounded-full bg-white/[0.08]">
                    <div className="absolute left-0 top-0 h-2 w-[16%] rounded-full bg-[#fe8200]" />
                    <div className="absolute left-[15%] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-[#050505] bg-[#fe8200] shadow-[0_0_30px_rgba(254,130,0,0.6)]" />
                  </div>

                  <div className="mt-4 flex justify-between text-xs font-medium text-white/35">
                    <span>$5K</span>
                    <span>$15K</span>
                    <span>$30K</span>
                    <span>$50K</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-px bg-white/[0.06] md:grid-cols-4">
                <OutcomeCard
                  label="Revenue lift"
                  value={money(scenario.revenueLift, true)}
                  sub={`range ${scenario.revenueRange}`}
                  tone="cyan"
                />
                <OutcomeCard
                  label="Net equity gain"
                  value={`+${money(scenario.netEquityGain, true)}`}
                  sub="rev lift − capital cost"
                  tone="green"
                />
                <OutcomeCard
                  label="Cost of capital"
                  value={money(scenario.costOfCapital)}
                  sub="0.18 factor premium"
                  tone="white"
                />
                <OutcomeCard
                  label="Daily ACH"
                  value={money(scenario.dailyAch)}
                  sub={`for ${scenario.dailyAchTerm}`}
                  tone="orange"
                />
              </div>
            </CardContent>
          </Card>

          <ForceAiNote scenario={scenario} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
            <CardContent className="p-0">
              <div className="border-b border-white/[0.08] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-medium tracking-tight">
                      Capital allocation
                    </h2>
                    <p className="mt-1 text-sm text-white/40">
                      Vendor lines attached to this projection.
                    </p>
                  </div>

                  <Badge className="rounded-full bg-[#fe8200]/10 text-[#fe8200] hover:bg-[#fe8200]/10">
                    {projectedVendors.length} vendors
                  </Badge>
                </div>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {projectedVendors.map((vendor) => (
                  <div
                    key={vendor.id || vendor.vendorId}
                    className="grid gap-4 p-6 md:grid-cols-[1fr_130px_110px_110px] md:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#161c2d]">
                        <Building2 className="h-4 w-4 text-white/60" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">{vendor.name}</p>
                        <p className="mt-1 text-xs text-white/40">
                          {vendor.purpose}
                        </p>
                      </div>
                    </div>

                    <p className="font-mono text-sm font-semibold">
                      {money(vendor.amount)}
                    </p>

                    <p className="text-xs text-white/45">{vendor.method}</p>

                    <Badge
                      className={`w-fit rounded-full ${
                        vendor.status === "Completed"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : vendor.status === "Processing"
                            ? "bg-[#fe8200]/10 text-[#fe8200]"
                            : "bg-white/[0.05] text-white/50"
                      } hover:bg-white/[0.05]`}
                    >
                      {vendor.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
            <CardContent className="p-0">
              <div className="border-b border-white/[0.08] p-6">
                <h2 className="text-xl font-medium tracking-tight">
                  Funding summary
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  What has happened so far.
                </p>
              </div>

              <div className="grid gap-4 p-6">
                <SummaryRow
                  label="Funded"
                  value={money(completedTotal)}
                  tone="green"
                />
                <SummaryRow
                  label="Pending"
                  value={money(pendingTotal)}
                  tone="orange"
                />
                <SummaryRow
                  label="Total planned"
                  value={money(totalPlanned)}
                  tone="white"
                />

                <div className="mt-2">
                  <div className="mb-2 flex justify-between text-xs text-white/40">
                    <span>Funding progress</span>
                    <span>
                      {completedCount} / {projectedVendors.length} sent
                    </span>
                  </div>
                  <Progress
                    value={
                      (completedCount / Math.max(projectedVendors.length, 1)) *
                      100
                    }
                    className="h-1.5 bg-white/[0.08]"
                  />
                </div>
              </div>

              <div className="border-t border-white/[0.08] p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                  Timeline
                </p>

                <div className="space-y-3">
                  {(client.history || []).map((item) => (
                    <div
                      key={item.id || item.eventId}
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3"
                    >
                      <p className="text-sm text-white/70">{item.action}</p>
                      <p className="mt-1 text-xs text-white/35">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <UserAccountModal
        open={showAccountModal}
        client={client}
        onOpenChange={setShowAccountModal}
      />
    </div>
  );
}

function ProjectionCard({ scenario }) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white shadow-2xl shadow-black/40">
      <CardContent className="p-0">
        <div className="border-b border-white/[0.08] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                Brand build score
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                90-day projection
              </h2>
            </div>

            <Badge className="rounded-full bg-cyan-300/10 text-cyan-300 hover:bg-cyan-300/10">
              +{scenario.scoreGain} pts
            </Badge>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <ScoreBlock label="Today" value={scenario.todayScore} />
            <ScoreBlock label="Day 90" value={scenario.day90Score} accent />
          </div>
        </div>

        <div className="p-6">
          <div className="relative h-72 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#161c2d]/45 p-6">
            <div className="absolute inset-x-8 bottom-20 h-px bg-white/[0.07]" />
            <div className="absolute inset-x-8 bottom-32 h-px bg-white/[0.04]" />
            <div className="absolute inset-x-8 bottom-44 h-px bg-white/[0.04]" />

            <div className="absolute bottom-20 left-8 right-8 h-32 rounded-[50%] bg-[#fe8200]/10 blur-2xl" />

            <svg
              viewBox="0 0 600 220"
              className="absolute bottom-14 left-6 right-6 h-44 w-[calc(100%-3rem)]"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 160 C 120 160, 160 150, 230 125 C 320 92, 410 72, 600 54 L 600 220 L 0 220 Z"
                fill="rgba(254,130,0,0.18)"
              />
              <path
                d="M 0 160 C 120 160, 160 150, 230 125 C 320 92, 410 72, 600 54"
                fill="none"
                stroke="rgba(254,130,0,0.85)"
                strokeWidth="4"
              />
              <path
                d="M 0 160 C 110 160, 190 155, 280 140 C 390 120, 470 106, 600 106"
                fill="none"
                stroke="rgba(103,232,249,0.9)"
                strokeWidth="3"
              />
            </svg>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-white/35">
              <span>Today</span>
              <span>Day 30</span>
              <span>Day 60</span>
              <span>Day 90</span>
            </div>

            <div className="absolute bottom-20 left-8 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.9)]" />
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
            <div className="flex gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-cyan-300" />
              <p className="text-sm leading-6 text-white/65">
                Modeled on{" "}
                <span className="font-semibold text-white">
                  1,247 similar merchants
                </span>{" "}
                in Commercial Landscaping.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value, sub, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <Icon className="mb-5 h-4 w-4 text-white/40" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className="mt-2 truncate text-lg font-semibold tracking-[-0.03em]">
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-white/35">{sub}</p>
    </div>
  );
}

function ScoreBlock({ label, value, accent }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
        {label}
      </p>
      <p
        className={`mt-3 text-5xl font-semibold tracking-[-0.06em] ${
          accent ? "text-[#fe8200]" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function OutcomeCard({ label, value, sub, tone }) {
  const toneClass =
    tone === "cyan"
      ? "text-cyan-300"
      : tone === "green"
        ? "text-emerald-300"
        : tone === "orange"
          ? "text-[#fe8200]"
          : "text-white";

  return (
    <div className="bg-[#0b0d12] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold tracking-[-0.05em] ${toneClass}`}>
        {value}
      </p>
      <p className="mt-2 text-xs text-white/35">{sub}</p>
    </div>
  );
}

function ForceAiNote({ scenario }) {
  return (
    <Card className="rounded-[2rem] border-cyan-300/20 bg-cyan-300/[0.04] text-white shadow-[0_0_50px_rgba(103,232,249,0.06)]">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300/10">
            <Sparkles className="h-4 w-4 text-cyan-300" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Force AI · Scenario read
            </p>
            <h2 className="mt-2 text-xl font-medium">
              Conservative — but you can move faster.
            </h2>
          </div>
        </div>

        <p className="text-sm italic leading-7 text-white/70">
          At {money(scenario.deployAmount)} you’ll see steady growth. Cash flow
          can absorb the strain without overleveraging. Worth modeling a{" "}
          <span className="text-white">$15K</span> to{" "}
          <span className="text-white">$20K</span> path if the priority is
          faster acquisition.
        </p>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
          <div className="mb-2 flex justify-between text-xs text-white/40">
            <span>Risk pressure</span>
            <span>Low/moderate</span>
          </div>
          <Progress value={38} className="h-1.5 bg-white/[0.08]" />
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value, tone }) {
  const toneClass =
    tone === "green"
      ? "text-emerald-300"
      : tone === "orange"
        ? "text-[#fe8200]"
        : "text-white";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-4">
      <p className="text-sm text-white/45">{label}</p>
      <p className={`font-mono text-sm font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function UserAccountModal({ open, client, onOpenChange }) {
  const totalPlanned = (client.vendors || []).reduce(
    (sum, vendor) => sum + Number(vendor.amount || 0),
    0
  );

  const completedTotal = (client.vendors || [])
    .filter((vendor) => vendor.status === "Completed")
    .reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0);

  const pendingTotal = totalPlanned - completedTotal;
  const suggestedPackage = getSuggestedPackage(totalPlanned);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!h-[92vh] !w-[94vw] !max-w-[1180px] overflow-hidden rounded-[2rem] border-white/[0.08] bg-[#080a0f] p-0 text-white shadow-2xl shadow-black/60">
        <Button
          onClick={() => onOpenChange(false)}
          size="icon"
          variant="ghost"
          className="absolute right-5 top-5 z-50 h-10 w-10 rounded-full border border-white/[0.12] bg-white/[0.06] text-white/70 backdrop-blur-xl hover:bg-white/[0.12] hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-[#fe8200]/15 blur-[100px]" />
          <div className="absolute left-[-8rem] bottom-[-8rem] h-80 w-80 rounded-full bg-[#161c2d] blur-[90px]" />
        </div>

        <div className="relative z-10 border-b border-white/[0.08] p-7 pr-20">
          <DialogHeader>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#fe8200]">
              Client account
            </p>

            <DialogTitle className="max-w-3xl text-4xl font-medium tracking-[-0.055em] text-white md:text-5xl">
              {client.name}
            </DialogTitle>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/40">
              <span className="font-semibold text-[#fe8200]">{client.id}</span>
              <span>{client.signedAt}</span>
              <span>{client.category}</span>
              <Badge className="rounded-full bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
                {client.status}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="relative z-10 h-[calc(92vh-132px)] overflow-y-auto p-7">
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <UserModalMoneyCard
              label="Funded"
              value={money(completedTotal)}
              tone="green"
            />
            <UserModalMoneyCard
              label="Pending"
              value={money(pendingTotal)}
              tone="orange"
            />
            <UserModalMoneyCard
              label="Total planned"
              value={money(totalPlanned)}
              tone="white"
            />
          </div>

          <section className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                    Account details
                  </p>
                  <h3 className="mt-2 text-xl font-medium tracking-[-0.03em]">
                    Merchant profile
                  </h3>
                  <p className="mt-1 text-xs text-white/40">
                    Live account information attached to this funding profile.
                  </p>
                </div>

                <div className="grid gap-3">
                  <UserAccountRow
                    icon={UserIcon}
                    label="Point of contact"
                    value={client.pointOfContact}
                  />
                  <UserAccountRow icon={Mail} label="Email" value={client.email} />
                  <UserAccountRow icon={Phone} label="Phone" value={client.phone} />
                  <UserAccountRow icon={CreditCard} label="EIN" value={client.ein} />
                  <UserAccountRow
                    icon={MapPin}
                    label="Address"
                    value={client.address}
                  />
                  <UserAccountRow
                    icon={Clock3}
                    label="Funding method"
                    value="Vendor-directed capital"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                    Recent activity
                  </p>
                  <h3 className="mt-2 text-xl font-medium tracking-[-0.03em]">
                    Funding timeline
                  </h3>
                </div>

                <div className="space-y-3">
                  {(client.history || []).slice(0, 4).map((item) => (
                    <div
                      key={item.id || item.eventId}
                      className="rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3"
                    >
                      <p className="text-sm text-white/70">{item.action}</p>
                      <p className="mt-1 text-xs text-white/35">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#fe8200]">
                      Growth packages
                    </p>
                    <h3 className="mt-2 text-3xl font-medium tracking-[-0.055em]">
                      Choose the level of force.
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                      Packages define how aggressively capital gets deployed
                      into brand, visibility, acquisition, and authority.
                    </p>
                  </div>

                  <Badge className="rounded-full bg-[#fe8200]/10 px-3 py-1.5 text-xs text-[#fe8200] hover:bg-[#fe8200]/10">
                    View packages
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {PACKAGE_OPTIONS.map((option) => (
                    <PackageCard
                      key={option.id}
                      option={option}
                      active={option.name === suggestedPackage}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.04] p-5">
                <div className="flex gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Suggested next step
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      Based on the current planned capital of{" "}
                      <span className="font-semibold text-white">
                        {money(totalPlanned)}
                      </span>
                      , this account is currently closest to the{" "}
                      <span className="font-semibold text-[#fe8200]">
                        {suggestedPackage}
                      </span>{" "}
                      package tier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UserModalMoneyCard({ label, value, tone }) {
  const toneClass =
    tone === "green"
      ? "text-emerald-300"
      : tone === "orange"
        ? "text-[#fe8200]"
        : "text-white";

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className={`mt-3 text-2xl font-semibold tracking-[-0.04em] ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

function UserAccountRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-white/40" />
        <p className="text-sm text-white/45">{label}</p>
      </div>

      <p className="max-w-[360px] truncate text-right text-sm font-medium text-white">
        {value || "—"}
      </p>
    </div>
  );
}

function PackageCard({ option, active }) {
  return (
    <div
      className={`group rounded-3xl border p-5 transition ${
        active
          ? "border-[#fe8200]/40 bg-[#fe8200]/[0.06]"
          : "border-white/[0.08] bg-black/20 hover:border-[#fe8200]/35 hover:bg-[#fe8200]/[0.04]"
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-2xl">
          {option.marker}
        </div>

        <Badge
          className={`rounded-full border px-3 py-1 text-xs ${
            active
              ? "border-[#fe8200]/25 bg-[#fe8200]/10 text-[#fe8200]"
              : "border-white/[0.08] bg-white/[0.04] text-white/60 group-hover:border-[#fe8200]/25 group-hover:text-[#fe8200]"
          }`}
        >
          {active ? "Current tier" : option.price}
        </Badge>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold uppercase tracking-[-0.03em] text-white">
          {option.name}
        </p>
        <p className="font-mono text-sm font-semibold text-[#fe8200]">
          {option.price}
        </p>
      </div>

      <p className="mt-2 text-sm font-medium text-white/70">
        {option.description}
      </p>

      <p className="mt-4 text-sm leading-6 text-white/40">{option.detail}</p>

      <Button
        variant="ghost"
        className="mt-5 h-10 rounded-xl px-0 text-[#fe8200] hover:bg-transparent hover:text-[#ff9a2f]"
      >
        View package
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}