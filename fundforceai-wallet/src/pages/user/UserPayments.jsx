import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  DollarSign,
  RefreshCw,
  Shield,
  WalletCards,
} from "lucide-react";

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

const MOCK_PAYMENT_HISTORY = [
  {
    id: "PAY-1001",
    amount: 450,
    method: "ACH",
    status: "Paid",
    date: "Today",
    note: "Recurring funding payment",
  },
  {
    id: "PAY-0998",
    amount: 450,
    method: "ACH",
    status: "Paid",
    date: "Monday",
    note: "Recurring funding payment",
  },
  {
    id: "PAY-0989",
    amount: 450,
    method: "ACH",
    status: "Processing",
    date: "Last Friday",
    note: "Settlement pending",
  },
];

const MOCK_UPCOMING = [
  {
    id: "SCH-501",
    amount: 450,
    date: "Friday",
    method: "ACH",
    status: "Scheduled",
  },
  {
    id: "SCH-502",
    amount: 450,
    date: "Monday",
    method: "ACH",
    status: "Scheduled",
  },
];

export default function UserPayments() {
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
      setError(error.message || "Failed to load payments.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClient();
  }, []);

  const stats = useMemo(() => getClientFundingStats(client), [client]);

  const totalPaid = MOCK_PAYMENT_HISTORY.filter((item) => item.status === "Paid").reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const nextCharge = MOCK_UPCOMING[0];

  if (isLoading) {
    return (
      <UserPageShell>
        <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
          <div className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-8 text-white/50">
            Loading payment center...
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
            {error || "No payment account found."}
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
                Payment center
              </p>

              <h1 className="text-5xl font-medium tracking-[-0.065em]">
                Payments & Schedule
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                View your recurring payment schedule, payment method status,
                upcoming charges, and payment history.
              </p>
            </div>

            <Button
              disabled
              className="h-11 w-fit rounded-2xl bg-[#fe8200]/40 px-5 font-semibold text-black hover:bg-[#fe8200]/40"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Update payment method later
            </Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <PaymentStat
              icon={DollarSign}
              label="Outstanding plan"
              value={money(stats.pendingTotal || stats.totalPlanned)}
              sub="remaining funding balance"
              tone="orange"
            />
            <PaymentStat
              icon={CalendarClock}
              label="Next charge"
              value={money(nextCharge?.amount)}
              sub={nextCharge?.date || "Not scheduled"}
              tone="white"
            />
            <PaymentStat
              icon={CheckCircle2}
              label="Total paid"
              value={money(totalPaid)}
              sub="mock payment history"
              tone="green"
            />
            <PaymentStat
              icon={WalletCards}
              label="Payment method"
              value="Not linked"
              sub="Stripe ACH/card later"
              tone="cyan"
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-0">
                <div className="border-b border-white/[0.08] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fe8200]">
                    Upcoming
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
                    Scheduled payments
                  </h2>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {MOCK_UPCOMING.map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-0">
                <div className="border-b border-white/[0.08] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fe8200]">
                    History
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
                    Payment activity
                  </h2>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {MOCK_PAYMENT_HISTORY.map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} showNote />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border-cyan-300/20 bg-cyan-300/[0.04] text-white">
              <CardContent className="p-6">
                <Shield className="mb-4 h-5 w-5 text-cyan-300" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Secure payment setup
                </p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
                  Stripe-ready wallet
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  When payments are wired, this page will show ACH/card methods,
                  Stripe subscriptions, invoices, settlement status, and retry
                  states. The app stores Stripe IDs only, never raw bank/card data.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-6">
                <AlertTriangle className="mb-4 h-5 w-5 text-[#fe8200]" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fe8200]">
                  Payment status
                </p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
                  No failed payments
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/45">
                  Failed payments, retry attempts, and payment method update
                  requests will appear here once Stripe is connected.
                </p>

                <Button
                  disabled
                  className="mt-6 h-11 rounded-2xl bg-white/10 px-5 text-white/50 hover:bg-white/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry payment later
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </UserPageShell>
  );
}

function PaymentStat({ icon: Icon, label, value, sub, tone }) {
  const toneClass =
    tone === "orange"
      ? "text-[#fe8200]"
      : tone === "green"
        ? "text-emerald-300"
        : tone === "cyan"
          ? "text-cyan-300"
          : "text-white";

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <Icon className="mb-5 h-4 w-4 text-white/40" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold tracking-[-0.04em] ${toneClass}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-white/35">{sub}</p>
    </div>
  );
}

function PaymentRow({ payment, showNote }) {
  return (
    <div className="grid gap-4 p-6 md:grid-cols-[140px_1fr_120px_120px] md:items-center">
      <div>
        <p className="font-mono text-xs font-semibold text-[#fe8200]">
          {payment.id}
        </p>
        <p className="mt-1 text-xs text-white/35">{payment.date}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-white">{payment.method}</p>
        {showNote ? (
          <p className="mt-1 text-xs text-white/40">{payment.note}</p>
        ) : (
          <p className="mt-1 text-xs text-white/40">Scheduled funding payment</p>
        )}
      </div>

      <p className="font-mono text-sm font-semibold text-white">
        {money(payment.amount)}
      </p>

      <PaymentBadge status={payment.status} />
    </div>
  );
}

function PaymentBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  const className =
    normalized === "paid"
      ? "bg-emerald-400/10 text-emerald-300"
      : normalized === "processing"
        ? "bg-[#fe8200]/10 text-[#fe8200]"
        : "bg-cyan-300/10 text-cyan-300";

  return <Badge className={`w-fit rounded-full px-3 py-1 ${className}`}>{status}</Badge>;
}