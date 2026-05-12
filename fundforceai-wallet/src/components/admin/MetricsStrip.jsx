import { ArrowDownRight, ArrowUpRight, Clock3 } from "lucide-react";

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function MetricsStrip({ clients }) {
  const totalPending = clients.reduce((clientTotal, client) => {
    const vendorTotal = client.vendors
      .filter((vendor) => vendor.status !== "Completed")
      .reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0);

    return clientTotal + vendorTotal;
  }, 0);

  const totalCompleted = clients.reduce((clientTotal, client) => {
    const vendorTotal = client.vendors
      .filter((vendor) => vendor.status === "Completed")
      .reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0);

    return clientTotal + vendorTotal;
  }, 0);

  const inFlight = clients.reduce((clientTotal, client) => {
    const vendorTotal = client.vendors
      .filter((vendor) => vendor.status === "Processing")
      .reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0);

    return clientTotal + vendorTotal;
  }, 0);

  const metrics = [
    {
      label: "Available capital",
      value: "$2,840,000",
      change: "+12.4%",
      direction: "up",
      primary: true,
    },
    {
      label: "Pending disbursement",
      value: money(totalPending),
      change: `${clients.length} merchants`,
      direction: "neutral",
    },
    {
      label: "Disbursed today",
      value: money(totalCompleted || 28750),
      change: "completed capital",
      direction: "up",
    },
    {
      label: "In flight",
      value: money(inFlight || 10000),
      change: "settling now",
      direction: "neutral",
    },
  ];

  return (
    <section className="mb-6 grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </section>
  );
}

function MetricCard({ metric }) {
  return (
    <div className="bg-[#0b0d12] p-6">
      <div className="mb-10 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/35">
          {metric.label}
        </p>

        {metric.direction === "up" ? (
          <ArrowUpRight className="h-4 w-4 text-emerald-300" />
        ) : metric.direction === "neutral" ? (
          <Clock3 className="h-4 w-4 text-white/30" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-300" />
        )}
      </div>

      <h3
        className={`text-4xl font-medium tracking-[-0.045em] ${
          metric.primary ? "text-[#fe8200]" : "text-white"
        }`}
      >
        {metric.value}
      </h3>

      <p className="mt-3 text-sm text-white/40">{metric.change}</p>
    </div>
  );
}