import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Clock3 } from "lucide-react";

import { getMetrics } from "@/lib/api";
import { money, normalizeStatus } from "@/lib/helpers";



function getFallbackMetrics(clients = []) {
  const firmAvailableCapital = 25840000;

  let totalPlannedCapital = 0;
  let pendingDisbursement = 0;
  let completedCapital = 0;
  let inFlight = 0;

  let pendingCount = 0;
  let completedCount = 0;
  let processingCount = 0;
  let vendorLineCount = 0;

  for (const client of clients) {
    const vendors = client.vendors || [];

    for (const vendor of vendors) {
      const amount = Number(vendor.amount || 0);
      const status = normalizeStatus(vendor.status);

      totalPlannedCapital += amount;
      vendorLineCount += 1;

      if (status === "completed") {
        completedCapital += amount;
        completedCount += 1;
      } else if (status === "processing") {
        inFlight += amount;
        processingCount += 1;
      } else {
        pendingDisbursement += amount;
        pendingCount += 1;
      }
    }
  }

  return {
    firmAvailableCapital,
    availableCapital: firmAvailableCapital,
    availableAfterPlanned: firmAvailableCapital - totalPlannedCapital,
    availableAfterCompleted: firmAvailableCapital - completedCapital,

    totalPlannedCapital,
    pendingDisbursement,
    inFlight,
    completedCapital,
    disbursedToday: completedCapital,

    merchantCount: clients.length,
    vendorLineCount,
    pendingCount,
    processingCount,
    completedCount,
  };
}

export default function MetricsStrip({ clients = [] }) {
  const [backendMetrics, setBackendMetrics] = useState(null);
  const [metricsError, setMetricsError] = useState("");

  async function loadMetrics() {
    try {
      setMetricsError("");

      const data = await getMetrics();
      setBackendMetrics(data.metrics);
    } catch (error) {
      setMetricsError(error.message || "Failed to load metrics.");
    }
  }

  useEffect(() => {
    loadMetrics();

    const intervalId = window.setInterval(() => {
      loadMetrics();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  const fallbackMetrics = useMemo(() => {
    return getFallbackMetrics(clients);
  }, [clients]);

  const liveMetrics = backendMetrics || fallbackMetrics;

  const metrics = [
    {
      label: "Available capital",
      value: money(liveMetrics.availableAfterPlanned),
      change: metricsError
        ? "fallback data"
        : `${money(liveMetrics.firmAvailableCapital)} firm pool`,
      direction: "up",
      primary: true,
    },
    {
      label: "Pending disbursement",
      value: money(liveMetrics.pendingDisbursement),
      change: `${liveMetrics.pendingCount || 0} pending lines`,
      direction: "neutral",
    },
    {
      label: "Disbursed today",
      value: money(liveMetrics.disbursedToday),
      change: `${liveMetrics.completedCount || 0} completed lines`,
      direction: "up",
    },
    {
      label: "In flight",
      value: money(liveMetrics.inFlight),
      change: `${liveMetrics.processingCount || 0} settling now`,
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