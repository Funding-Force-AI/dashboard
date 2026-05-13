import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Clock3,
  CreditCard,
  DollarSign,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";

import UserPageShell from "@/components/user/UserPageShell";
import UserTopNav from "@/components/user/UserTopNav";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { getClients } from "@/lib/client";
import { getCurrentUser } from "@/lib/auth";
import {
  getClientFundingStats,
  normalizeClient,
} from "@/lib/userDashboard";

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function UserAccount() {
  const [client, setClient] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAccount() {
    try {
      setError("");

      const [meData, clientsData] = await Promise.all([
        getCurrentUser(),
        getClients(),
      ]);

      const normalizedClients = (clientsData.clients || []).map(normalizeClient);

      setCurrentUser(meData.user || null);
      setClient(normalizedClients[0] || null);
    } catch (error) {
      setError(error.message || "Failed to load account.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAccount();
  }, []);

  const stats = useMemo(() => {
    return getClientFundingStats(client);
  }, [client]);

  if (isLoading) {
    return (
      <UserPageShell>
        <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
          <div className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-8 text-white/50">
            Loading account...
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
            {error || "No account found for this user."}
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
                Client account
              </p>

              <h1 className="text-5xl font-medium tracking-[-0.065em]">
                Account settings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                View your business profile, linked login, funding plan, and
                future payment wallet settings.
              </p>
            </div>

            <Badge className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300 hover:bg-emerald-400/10">
              {client.status || "Active"}
            </Badge>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <AccountStat
              icon={Building2}
              label="Business"
              value={client.name}
              sub={client.category || "Client account"}
              tone="white"
            />
            <AccountStat
              icon={DollarSign}
              label="Current plan"
              value={money(stats.totalPlanned)}
              sub="vendor-directed capital"
              tone="orange"
            />
            <AccountStat
              icon={CreditCard}
              label="Payment wallet"
              value="Not linked"
              sub="Stripe setup later"
              tone="cyan"
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-6">
                <SectionHeader
                  label="Business profile"
                  title="Company information"
                  description="This information powers your client mirror and admin records."
                />

                <div className="mt-6 grid gap-3">
                  <AccountRow icon={Building2} label="Company" value={client.name} />
                  <AccountRow
                    icon={User}
                    label="Point of contact"
                    value={client.pointOfContact}
                  />
                  <AccountRow icon={Mail} label="Email" value={client.email} />
                  <AccountRow icon={Phone} label="Phone" value={client.phone} />
                  <AccountRow icon={MapPin} label="Address" value={client.address} />
                  <AccountRow label="EIN" value={client.ein} />
                </div>

                <Button
                  disabled
                  className="mt-6 h-11 rounded-2xl bg-white/10 px-5 text-white/50 hover:bg-white/10"
                >
                  Request profile update
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-6">
                <SectionHeader
                  label="Login access"
                  title="Security"
                  description="Your login is protected by role-based access."
                />

                <div className="mt-6 grid gap-3">
                  <AccountRow
                    icon={Mail}
                    label="Login email"
                    value={currentUser?.email}
                  />
                  <AccountRow
                    icon={Shield}
                    label="Role"
                    value={currentUser?.role || "client"}
                  />
                  <AccountRow
                    icon={Lock}
                    label="Password"
                    value="Managed by secure auth"
                  />
                </div>

                <Button
                  disabled
                  className="mt-6 h-11 rounded-2xl bg-white/10 px-5 text-white/50 hover:bg-white/10"
                >
                  Change password later
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-6">
                <SectionHeader
                  label="Funding summary"
                  title="Plan overview"
                  description="Current funding totals attached to this account."
                />

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <MiniMoneyCard
                    label="Funded"
                    value={money(stats.completedTotal)}
                    tone="green"
                  />
                  <MiniMoneyCard
                    label="Pending"
                    value={money(stats.pendingTotal)}
                    tone="orange"
                  />
                  <MiniMoneyCard
                    label="Total"
                    value={money(stats.totalPlanned)}
                    tone="white"
                  />
                </div>

                <div className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <div className="mb-2 flex justify-between text-xs text-white/40">
                    <span>Vendor progress</span>
                    <span>
                      {stats.completedCount} / {stats.vendors.length} completed
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full bg-[#fe8200]"
                      style={{
                        width: `${
                          (stats.completedCount /
                            Math.max(stats.vendors.length, 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-cyan-300/20 bg-cyan-300/[0.04] text-white">
              <CardContent className="p-6">
                <SectionHeader
                  label="Payment wallet"
                  title="ACH/card setup"
                  description="Visual placeholder for Stripe ACH and card payment methods."
                />

                <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/[0.1] bg-[#10131c] p-5">
                  <div className="pointer-events-none absolute" />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                        Primary rail
                      </p>
                      <h4 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                        ACH Direct Debit
                      </h4>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.08]">
                      <CreditCard className="h-4 w-4 text-[#fe8200]" />
                    </div>
                  </div>

                  <p className="mt-10 font-mono text-lg tracking-[0.16em] text-white">
                    •••• •••• •••• BANK
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                        Account
                      </p>
                      <p className="mt-1 max-w-[260px] truncate text-sm font-medium text-white">
                        {client.name}
                      </p>
                    </div>

                    <Badge className="rounded-full border border-white/[0.1] bg-white/[0.08] px-3 py-1 text-xs text-white/65">
                      Not linked
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <AccountRow
                    icon={Clock3}
                    label="Suggested schedule"
                    value="Monday + Friday"
                  />
                  <AccountRow
                    icon={DollarSign}
                    label="Outstanding plan"
                    value={money(stats.pendingTotal || stats.totalPlanned)}
                  />
                </div>

                <Button
                  disabled
                  className="mt-6 h-11 rounded-2xl bg-[#fe8200]/40 px-5 font-semibold text-black hover:bg-[#fe8200]/40"
                >
                  Add payment method later
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </UserPageShell>
  );
}

function SectionHeader({ label, title, description }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fe8200]">
        {label}
      </p>
      <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
        {description}
      </p>
    </div>
  );
}

function AccountStat({ icon: Icon, label, value, sub, tone }) {
  const toneClass =
    tone === "orange"
      ? "text-[#fe8200]"
      : tone === "cyan"
        ? "text-cyan-300"
        : "text-white";

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <Icon className="mb-5 h-4 w-4 text-white/40" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className={`mt-2 truncate text-xl font-semibold tracking-[-0.03em] ${toneClass}`}>
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-white/35">{sub}</p>
    </div>
  );
}

function AccountRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3">
      <div className="flex items-center gap-3">
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-white/40" /> : null}
        <p className="text-sm text-white/45">{label}</p>
      </div>

      <p className="max-w-[360px] truncate text-right text-sm font-medium text-white">
        {value || "—"}
      </p>
    </div>
  );
}

function MiniMoneyCard({ label, value, tone }) {
  const toneClass =
    tone === "green"
      ? "text-emerald-300"
      : tone === "orange"
        ? "text-[#fe8200]"
        : "text-white";

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className={`mt-3 text-2xl font-semibold tracking-[-0.04em] ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}