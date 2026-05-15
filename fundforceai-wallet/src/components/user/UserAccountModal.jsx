import {
  ArrowRight,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User as UserIcon,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import WalletPaymentCards from "@/components/user/WalletPaymentCards";

import { money } from "@/lib/helpers";

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

function getSuggestedPackage(totalPlanned) {
  if (totalPlanned >= 100000) return "Legacy";
  if (totalPlanned >= 50000) return "Domination";
  if (totalPlanned >= 25000) return "Scale";
  return "Foundation";
}

export default function UserAccountModal({ open, client, onOpenChange }) {
  if (!client) return null;

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
      <DialogContent className="!h-[94vh] !w-[96vw] !max-w-[1380px] overflow-hidden rounded-[2.25rem] border-white/[0.08] bg-[#080a0f] p-0 text-white shadow-2xl shadow-black/60">
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

            <DialogTitle className="max-w-4xl text-4xl font-medium tracking-[-0.055em] text-white md:text-5xl">
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

        <div className="relative z-10 h-[calc(94vh-132px)] overflow-y-auto p-7">
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

          <WalletPaymentCards
            client={client}
            totalPlanned={totalPlanned}
            pendingTotal={pendingTotal}
          />

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