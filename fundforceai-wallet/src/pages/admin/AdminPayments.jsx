import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Download,
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

const MOCK_PAYMENTS = [
  {
    id: "PAY-1001",
    client: "Crown Treez Landscaping",
    amount: 2450,
    method: "ACH",
    status: "Paid",
    stripeFee: 18,
    platformFee: 245,
    net: 2187,
    date: "Today",
  },
  {
    id: "PAY-1002",
    client: "Royal Touch Contractors",
    amount: 1800,
    method: "Card",
    status: "Processing",
    stripeFee: 55,
    platformFee: 180,
    net: 1565,
    date: "Today",
  },
  {
    id: "PAY-1003",
    client: "Metro Beauty Lounge",
    amount: 975,
    method: "ACH",
    status: "Failed",
    stripeFee: 0,
    platformFee: 0,
    net: 0,
    date: "Yesterday",
  },
  {
    id: "PAY-1004",
    client: "Atlas Home Services",
    amount: 3200,
    method: "ACH",
    status: "Paid",
    stripeFee: 24,
    platformFee: 320,
    net: 2856,
    date: "May 12",
  },
];

const MOCK_RECURRING = [
  {
    id: "REC-5001",
    client: "Crown Treez Landscaping",
    amount: 450,
    schedule: "Monday + Friday",
    nextCharge: "Friday",
    method: "ACH",
    status: "Active",
    collected: 3600,
  },
  {
    id: "REC-5002",
    client: "Royal Touch Contractors",
    amount: 725,
    schedule: "Weekly",
    nextCharge: "Monday",
    method: "Card",
    status: "Active",
    collected: 2900,
  },
  {
    id: "REC-5003",
    client: "Metro Beauty Lounge",
    amount: 325,
    schedule: "Friday",
    nextCharge: "Paused",
    method: "ACH",
    status: "Paused",
    collected: 1300,
  },
];

const MOCK_FAILED = [
  {
    id: "FAIL-201",
    client: "Metro Beauty Lounge",
    amount: 975,
    reason: "Insufficient funds",
    attempts: 2,
    lastAttempt: "Yesterday",
    nextRetry: "Tomorrow",
  },
  {
    id: "FAIL-202",
    client: "Northline Auto Spa",
    amount: 650,
    reason: "Card declined",
    attempts: 1,
    lastAttempt: "May 11",
    nextRetry: "May 14",
  },
];

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState("overview");
  const [query, setQuery] = useState("");

  const filteredPayments = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return MOCK_PAYMENTS;

    return MOCK_PAYMENTS.filter((payment) =>
      [payment.id, payment.client, payment.method, payment.status]
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [query]);

  const grossCollected = MOCK_PAYMENTS.filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const stripeFees = MOCK_PAYMENTS.reduce(
    (sum, item) => sum + item.stripeFee,
    0,
  );

  const platformFees = MOCK_PAYMENTS.reduce(
    (sum, item) => sum + item.platformFee,
    0,
  );

  const netRevenue = MOCK_PAYMENTS.reduce((sum, item) => sum + item.net, 0);

  const upcomingCharges = MOCK_RECURRING.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

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
                Payment operations
              </p>

              <h1 className="text-5xl font-medium tracking-[-0.065em]">
                Payments & Revenue
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                Track recurring billing, Stripe fees, failed payments, upcoming
                charges, and net revenue from one operational view.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="ghost"
                className="h-11 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 text-white/70 hover:bg-white/[0.06] hover:text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>

              <Button className="h-11 rounded-2xl bg-[#fe8200] px-5 font-semibold text-black hover:bg-[#ff9b2f]">
                <CreditCard className="mr-2 h-4 w-4" />
                Create charge
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <PaymentStat
              icon={DollarSign}
              label="Gross collected"
              value={money(grossCollected)}
              sub="paid payments"
              tone="orange"
            />
            <PaymentStat
              icon={Shield}
              label="Stripe fees"
              value={money(stripeFees)}
              sub="processor cost"
              tone="white"
            />
            <PaymentStat
              icon={WalletCards}
              label="Platform fees"
              value={money(platformFees)}
              sub="business revenue"
              tone="cyan"
            />
            <PaymentStat
              icon={CheckCircle2}
              label="Net revenue"
              value={money(netRevenue)}
              sub="after fees"
              tone="green"
            />
            <PaymentStat
              icon={CalendarClock}
              label="Upcoming"
              value={money(upcomingCharges)}
              sub="scheduled recurring"
              tone="white"
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] shadow-2xl shadow-black/40">
          <div className="border-b border-white/[0.08] p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex w-fit overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20 p-1">
                <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                  Overview
                </TabButton>
                <TabButton active={activeTab === "transactions"} onClick={() => setActiveTab("transactions")}>
                  Transactions
                </TabButton>
                <TabButton active={activeTab === "recurring"} onClick={() => setActiveTab("recurring")}>
                  Recurring
                </TabButton>
                <TabButton active={activeTab === "failed"} onClick={() => setActiveTab("failed")}>
                  Failed
                </TabButton>
              </div>

              <div className="flex w-full flex-col gap-3 md:flex-row xl:w-auto">
                <div className="relative w-full md:w-[360px]">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search payments, clients, status..."
                    className="h-11 rounded-2xl border-white/[0.08] bg-black/25 pl-11 text-white placeholder:text-white/25"
                  />
                </div>

                <Button
                  variant="ghost"
                  className="h-11 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {activeTab === "overview" && <PaymentsOverview />}
          {activeTab === "transactions" && (
            <TransactionsTable payments={filteredPayments} />
          )}
          {activeTab === "recurring" && <RecurringTable recurring={MOCK_RECURRING} />}
          {activeTab === "failed" && <FailedTable failed={MOCK_FAILED} />}
        </section>
      </div>
    </main>
  );
}

function PaymentsOverview() {
  return (
    <div className="grid gap-6 p-6 xl:grid-cols-[1fr_420px]">
      <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fe8200]">
          Revenue movement
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.055em]">
          Collected vs. scheduled
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
          Placeholder visual until Stripe transactions are wired. This will show
          gross collection, pending ACH/card payments, and settlement timing.
        </p>

        <div className="mt-8 h-72 rounded-3xl border border-white/[0.08] bg-[#161c2d]/45 p-6">
          <div className="flex h-full items-end gap-4">
            {[42, 65, 58, 75, 92, 71, 84].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex w-full items-end rounded-full bg-white/[0.06]" style={{ height: "220px" }}>
                  <div
                    className="w-full rounded-full bg-[#fe8200]"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-white/30">
                  {["M", "T", "W", "T", "F", "S", "S"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <InsightCard
          icon={CalendarClock}
          title="Recurring billing"
          body="Monday + Friday schedules should become first-class records connected to Stripe subscriptions or scheduled PaymentIntents."
        />
        <InsightCard
          icon={AlertTriangle}
          title="Failed payment queue"
          body="Failed ACH/card attempts need retry logic, account manager visibility, and a payment method update workflow."
        />
        <InsightCard
          icon={Shield}
          title="Processor visibility"
          body="Track Stripe fee, platform fee, and net revenue separately so the business knows what it actually keeps."
        />
      </div>
    </div>
  );
}

function TransactionsTable({ payments }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="border-b border-white/[0.08] text-left">
            <Th>Payment</Th>
            <Th>Client</Th>
            <Th>Amount</Th>
            <Th>Method</Th>
            <Th>Status</Th>
            <Th>Stripe fee</Th>
            <Th>Net</Th>
            <Th>Date</Th>
            <Th align="right">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-white/[0.06] transition hover:bg-white/[0.025]">
              <Td>
                <p className="font-mono text-sm font-semibold text-[#fe8200]">
                  {payment.id}
                </p>
              </Td>
              <Td>
                <p className="text-sm font-semibold text-white">
                  {payment.client}
                </p>
              </Td>
              <Td>
                <p className="font-mono text-sm font-semibold text-white">
                  {money(payment.amount)}
                </p>
              </Td>
              <Td>
                <p className="text-sm text-white/50">{payment.method}</p>
              </Td>
              <Td>
                <PaymentStatusBadge status={payment.status} />
              </Td>
              <Td>
                <p className="font-mono text-sm text-white/45">
                  {money(payment.stripeFee)}
                </p>
              </Td>
              <Td>
                <p className="font-mono text-sm font-semibold text-emerald-300">
                  {money(payment.net)}
                </p>
              </Td>
              <Td>
                <p className="text-sm text-white/45">{payment.date}</p>
              </Td>
              <Td align="right">
                <TableActions />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecurringTable({ recurring }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px]">
        <thead>
          <tr className="border-b border-white/[0.08] text-left">
            <Th>Schedule ID</Th>
            <Th>Client</Th>
            <Th>Amount</Th>
            <Th>Schedule</Th>
            <Th>Next charge</Th>
            <Th>Method</Th>
            <Th>Status</Th>
            <Th>Total collected</Th>
            <Th align="right">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {recurring.map((item) => (
            <tr key={item.id} className="border-b border-white/[0.06] transition hover:bg-white/[0.025]">
              <Td>
                <p className="font-mono text-sm font-semibold text-[#fe8200]">
                  {item.id}
                </p>
              </Td>
              <Td>{item.client}</Td>
              <Td>{money(item.amount)}</Td>
              <Td>{item.schedule}</Td>
              <Td>{item.nextCharge}</Td>
              <Td>{item.method}</Td>
              <Td>
                <PaymentStatusBadge status={item.status} />
              </Td>
              <Td>{money(item.collected)}</Td>
              <Td align="right">
                <TableActions />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FailedTable({ failed }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px]">
        <thead>
          <tr className="border-b border-white/[0.08] text-left">
            <Th>Failure ID</Th>
            <Th>Client</Th>
            <Th>Amount</Th>
            <Th>Reason</Th>
            <Th>Attempts</Th>
            <Th>Last attempt</Th>
            <Th>Next retry</Th>
            <Th align="right">Actions</Th>
          </tr>
        </thead>

        <tbody>
          {failed.map((item) => (
            <tr key={item.id} className="border-b border-white/[0.06] transition hover:bg-white/[0.025]">
              <Td>
                <p className="font-mono text-sm font-semibold text-red-300">
                  {item.id}
                </p>
              </Td>
              <Td>{item.client}</Td>
              <Td>{money(item.amount)}</Td>
              <Td>
                <p className="text-sm text-red-200">{item.reason}</p>
              </Td>
              <Td>{item.attempts}</Td>
              <Td>{item.lastAttempt}</Td>
              <Td>{item.nextRetry}</Td>
              <Td align="right">
                <Button className="h-9 rounded-xl bg-[#fe8200] px-4 text-sm font-semibold text-black hover:bg-[#ff9b2f]">
                  Retry
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

function InsightCard({ icon: Icon, title, body }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
      <Icon className="mb-4 h-4 w-4 text-[#fe8200]" />
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/45">{body}</p>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-xl px-5 text-sm font-semibold transition ${
        active
          ? "bg-[#fe8200] text-black shadow-[0_0_28px_rgba(254,130,0,0.22)]"
          : "text-white/45 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function PaymentStatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  const className =
    normalized === "paid" || normalized === "active"
      ? "bg-emerald-400/10 text-emerald-300"
      : normalized === "processing"
        ? "bg-[#fe8200]/10 text-[#fe8200]"
        : normalized === "failed"
          ? "bg-red-500/10 text-red-200"
          : normalized === "paused"
            ? "bg-white/[0.06] text-white/50"
            : "bg-cyan-300/10 text-cyan-300";

  return (
    <Badge className={`rounded-full px-3 py-1 text-xs ${className}`}>
      {status}
    </Badge>
  );
}

function TableActions() {
  return (
    <div className="flex justify-end gap-2">
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 rounded-xl text-white/45 hover:bg-white/[0.06] hover:text-white"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 rounded-xl text-white/35 hover:bg-white/[0.06] hover:text-white"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      className={`px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }) {
  return (
    <td
      className={`px-6 py-4 align-middle text-sm text-white/60 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </td>
  );
}