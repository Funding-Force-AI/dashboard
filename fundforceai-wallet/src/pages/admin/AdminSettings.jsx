import { useState } from "react";
import {
  BadgeDollarSign,
  Building2,
  CheckCircle2,
  CreditCard,
  Database,
  Lock,
  Save,
  Settings,
  Shield,
  SlidersHorizontal,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminSettings() {
  const [availableCapital, setAvailableCapital] = useState("25840000");
  const [platformFee, setPlatformFee] = useState("3.5");
  const [processingReserve, setProcessingReserve] = useState("1.0");
  const [defaultTerm, setDefaultTerm] = useState("180");
  const [defaultSchedule, setDefaultSchedule] = useState("Monday + Friday");

  return (
    <main className="relative min-h-screen bg-[#050505] px-8 py-8 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[10%] top-[-18rem] h-[40rem] w-[40rem] rounded-full bg-[#161c2d]/70 blur-[120px]" />
        <div className="absolute right-[-12rem] top-[8rem] h-[34rem] w-[34rem] rounded-full bg-[#fe8200]/10 blur-[130px]" />
        <div className="absolute bottom-[-18rem] left-[35%] h-[30rem] w-[30rem] rounded-full bg-cyan-300/5 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <section className="mb-6 rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-7 shadow-2xl shadow-black/50">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#fe8200]">
                Firm configuration
              </p>

              <h1 className="text-5xl font-medium tracking-[-0.065em]">
                Settings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                Configure firm capital, default payment rules, platform fees,
                Stripe mode, and access behavior. Visual shell for now; backend
                settings collection comes later.
              </p>
            </div>

            <Button className="h-11 rounded-2xl bg-[#fe8200] px-5 font-semibold text-black hover:bg-[#ff9b2f]">
              <Save className="mr-2 h-4 w-4" />
              Save settings
            </Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <SettingsStat
              icon={Building2}
              label="Firm mode"
              value="MVP"
              sub="controlled rollout"
              tone="white"
            />
            <SettingsStat
              icon={Database}
              label="Capital source"
              value="Manual"
              sub="env/settings later"
              tone="orange"
            />
            <SettingsStat
              icon={CreditCard}
              label="Stripe"
              value="Test"
              sub="not live yet"
              tone="cyan"
            />
            <SettingsStat
              icon={Shield}
              label="Signup"
              value="Invite"
              sub="public disabled"
              tone="green"
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <SettingsCard
              icon={BadgeDollarSign}
              label="Capital rules"
              title="Firm capital settings"
              description="These values power dashboard metrics and default client funding calculations."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <SettingField
                  label="Available capital"
                  value={availableCapital}
                  onChange={setAvailableCapital}
                  prefix="$"
                  helper="Current firm-wide deployable capital."
                />
                <SettingField
                  label="Default funding term"
                  value={defaultTerm}
                  onChange={setDefaultTerm}
                  suffix="days"
                  helper="Used for ACH repayment estimate."
                />
                <SettingField
                  label="Default schedule"
                  value={defaultSchedule}
                  onChange={setDefaultSchedule}
                  helper="Default recurring billing rhythm."
                />
                <SettingDisplay
                  label="Risk pressure model"
                  value="Low / Moderate"
                  helper="Visual model only until underwriting is added."
                />
              </div>
            </SettingsCard>

            <SettingsCard
              icon={WalletCards}
              label="Payment rules"
              title="Fees & processing"
              description="Separate business platform fees from actual Stripe processor fees."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <SettingField
                  label="Default platform fee"
                  value={platformFee}
                  onChange={setPlatformFee}
                  suffix="%"
                  helper="What the business earns on top of funding/payment plan."
                />
                <SettingField
                  label="Processing reserve"
                  value={processingReserve}
                  onChange={setProcessingReserve}
                  suffix="%"
                  helper="Buffer to account for ACH/card processor cost."
                />
                <SettingDisplay
                  label="ACH payments"
                  value="Enabled"
                  helper="Stripe ACH direct debit later."
                />
                <SettingDisplay
                  label="Card payments"
                  value="Enabled"
                  helper="Useful fallback, higher processor fee."
                />
              </div>
            </SettingsCard>

            <SettingsCard
              icon={Lock}
              label="Access rules"
              title="Security & auth"
              description="Keep the app closed except landing/login routes."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <SettingDisplay
                  label="Public signup"
                  value="Disabled"
                  helper="Use invite/admin-created users only."
                />
                <SettingDisplay
                  label="Client access"
                  value="relatedClient only"
                  helper="Clients can only see their linked business."
                />
                <SettingDisplay
                  label="Admin access"
                  value="admin + super_admin"
                  helper="Admin app is protected by role."
                />
                <SettingDisplay
                  label="Super admin"
                  value="Full control"
                  helper="Can test admin and client views."
                />
              </div>
            </SettingsCard>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border-cyan-300/20 bg-cyan-300/[0.04] text-white">
              <CardContent className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10">
                    <SlidersHorizontal className="h-5 w-5 text-cyan-300" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                      Recommended setup
                    </p>
                    <h2 className="mt-1 text-xl font-medium">
                      Keep payment rules centralized.
                    </h2>
                  </div>
                </div>

                <p className="text-sm leading-7 text-white/65">
                  Store firm-level defaults here, then let individual clients
                  override package tier, schedule, platform fee, and payment
                  method later.
                </p>

                <div className="mt-6 space-y-3">
                  <CheckLine text="Firm defaults live in Settings." />
                  <CheckLine text="Client overrides live on the Client record." />
                  <CheckLine text="Stripe IDs stay server-side only." />
                  <CheckLine text="Frontend never stores raw card or bank data." />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-6">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fe8200]">
                    Stripe readiness
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
                    Payment integration checklist
                  </h2>
                </div>

                <div className="space-y-3">
                  <ChecklistItem status="done" text="Auth + role guards added" />
                  <ChecklistItem status="done" text="Payment wallet visual added" />
                  <ChecklistItem status="next" text="Create Stripe customer per client" />
                  <ChecklistItem status="next" text="Setup ACH/card collection flow" />
                  <ChecklistItem status="next" text="Webhook payment records" />
                  <ChecklistItem status="next" text="Recurring schedule engine" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                  Environment
                </p>

                <div className="mt-5 space-y-3">
                  <EnvRow label="Frontend URL" value="http://localhost:5173" />
                  <EnvRow label="API URL" value="http://localhost:3000" />
                  <EnvRow label="Stripe mode" value="test" />
                  <EnvRow label="CORS" value="credentials enabled" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

function SettingsCard({ icon: Icon, label, title, description, children }) {
  return (
    <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white shadow-2xl shadow-black/30">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fe8200]/10">
            <Icon className="h-5 w-5 text-[#fe8200]" />
          </div>

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

        {children}
      </CardContent>
    </Card>
  );
}

function SettingField({ label, value, onChange, prefix, suffix, helper }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4">
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/25 px-4">
        {prefix ? <span className="text-sm text-white/35">{prefix}</span> : null}
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 border-0 bg-transparent px-0 text-white focus-visible:ring-0"
        />
        {suffix ? <span className="text-sm text-white/35">{suffix}</span> : null}
      </div>

      <p className="mt-2 text-xs leading-5 text-white/35">{helper}</p>
    </div>
  );
}

function SettingDisplay({ label, value, helper }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-white/35">{helper}</p>
    </div>
  );
}

function SettingsStat({ icon: Icon, label, value, sub, tone }) {
  const toneClass =
    tone === "orange"
      ? "text-[#fe8200]"
      : tone === "green"
        ? "text-emerald-300"
        : tone === "cyan"
          ? "text-cyan-300"
          : "text-white";

  return (
    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] text-white">
      <CardContent className="p-5">
        <Icon className="mb-5 h-4 w-4 text-white/35" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
          {label}
        </p>
        <p className={`mt-2 text-2xl font-semibold tracking-[-0.05em] ${toneClass}`}>
          {value}
        </p>
        <p className="mt-1 text-xs text-white/35">{sub}</p>
      </CardContent>
    </Card>
  );
}

function CheckLine({ text }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-cyan-300/10 bg-black/20 px-4 py-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
      <p className="text-sm text-white/65">{text}</p>
    </div>
  );
}

function ChecklistItem({ status, text }) {
  const done = status === "done";

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
      <p className="text-sm text-white/65">{text}</p>
      <Badge
        className={
          done
            ? "rounded-full bg-emerald-400/10 text-emerald-300"
            : "rounded-full bg-[#fe8200]/10 text-[#fe8200]"
        }
      >
        {done ? "Done" : "Next"}
      </Badge>
    </div>
  );
}

function EnvRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
      <p className="text-sm text-white/45">{label}</p>
      <p className="max-w-[220px] truncate text-right font-mono text-xs text-white/70">
        {value}
      </p>
    </div>
  );
}