import { useEffect, useMemo, useState } from "react";
import { Building2, Save, Send, X } from "lucide-react";

import { createDisbursement } from "@/lib/disbursements";
import { updateClient } from "@/lib/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DEFAULT_VENDOR_OPTIONS = [
  "Google Ads MCC",
  "Meta Business Manager",
  "Google LSA",
  "Klaviyo",
  "Sigma Digital",
  "Astoria Creative",
];

const DEFAULT_TAG_OPTIONS = [
  "Google Ads",
  "Meta Ads",
  "Local SEO",
  "SMS/email campaign",
  "Booking page rebuild",
  "Lead generation",
  "Creative services",
  "Consulting",
  "Other",
];

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatInputNumber(value) {
  const onlyNumbers = String(value || "").replace(/[^\d]/g, "");

  if (!onlyNumbers) return "";

  return new Intl.NumberFormat("en-US").format(Number(onlyNumbers));
}

function parseMoneyInput(value) {
  return Number(String(value || "").replace(/[^\d]/g, ""));
}

function getMethodForVendor(vendor) {
  if (vendor === "Sigma Digital" || vendor === "Astoria Creative") {
    return "ACH";
  }

  return "Card";
}

function normalizeClient(client) {
  return {
    ...client,
    payloadId: client.payloadId || client.id,
    id: client.externalId || client.id,
    vendors: (client.vendors || []).map((vendor) => ({
      ...vendor,
      id: vendor.id || vendor.vendorId,
    })),
    history: (client.history || []).map((event) => ({
      ...event,
      id: event.id || event.eventId,
    })),
  };
}

export default function CapitalAllocationCard({ client, onClientUpdate }) {
  const [draftClient, setDraftClient] = useState(normalizeClient(client));
  const [showSendForm, setShowSendForm] = useState(false);

  const [sendAmount, setSendAmount] = useState("");
  const [sendVendor, setSendVendor] = useState(DEFAULT_VENDOR_OPTIONS[0]);
  const [sendTag, setSendTag] = useState(DEFAULT_TAG_OPTIONS[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setDraftClient(normalizeClient(client));
    setSubmitError("");
    setShowSendForm(false);
  }, [client]);

  const totalAllocation = useMemo(() => {
    return (draftClient.vendors || []).reduce(
      (sum, vendor) => sum + Number(vendor.amount || 0),
      0
    );
  }, [draftClient.vendors]);

  const completedTotal = useMemo(() => {
    return (draftClient.vendors || [])
      .filter((vendor) => vendor.status === "Completed")
      .reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0);
  }, [draftClient.vendors]);

  const pendingTotal = useMemo(() => {
    return (draftClient.vendors || [])
      .filter((vendor) => vendor.status !== "Completed")
      .reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0);
  }, [draftClient.vendors]);

  const completedCount = (draftClient.vendors || []).filter(
    (vendor) => vendor.status === "Completed"
  ).length;

  const progressValue =
    (completedCount / Math.max((draftClient.vendors || []).length, 1)) * 100;

  const previewAmount = parseMoneyInput(sendAmount);

  function resetSendForm() {
    setSendAmount("");
    setSendVendor(DEFAULT_VENDOR_OPTIONS[0]);
    setSendTag(DEFAULT_TAG_OPTIONS[0]);
  }

  function handleAmountChange(event) {
    const formatted = formatInputNumber(event.target.value);
    setSendAmount(formatted);
  }

  async function handleMockSend() {
    const amount = parseMoneyInput(sendAmount);

    if (!amount || amount <= 0 || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    const vendorId = crypto.randomUUID();

    const newVendorLine = {
      id: vendorId,
      vendorId,
      name: sendVendor,
      purpose: sendTag,
      amount,
      method: getMethodForVendor(sendVendor),
      status: "Pending",
    };

    const disbursementPayload = {
      clientId: draftClient.id,
      clientName: draftClient.name,
      vendorId,
      vendorName: sendVendor,
      amountCents: amount * 100,
      purpose: sendTag,
      description: `${sendTag} funding release to ${sendVendor}`,
    };

    try {
      const result = await createDisbursement(disbursementPayload);

      const eventId = result.disbursement?.id || crypto.randomUUID();

      const updatedClient = {
        ...draftClient,
        vendors: [newVendorLine, ...(draftClient.vendors || [])],
        history: [
          {
            id: eventId,
            eventId,
            action: `Capital release added: ${formatMoney(amount)} to ${sendVendor} · ${sendTag}`,
            time: "Just now",
          },
          ...(draftClient.history || []),
        ],
      };

      const updatedTotalAllocation = updatedClient.vendors.reduce(
        (sum, vendor) => sum + Number(vendor.amount || 0),
        0
      );

      const clientPatch = {
        vendors: updatedClient.vendors.map((vendor) => ({
          vendorId: vendor.vendorId || vendor.id,
          name: vendor.name,
          purpose: vendor.purpose,
          amount: vendor.amount,
          method: vendor.method,
          status: vendor.status,
        })),
        history: updatedClient.history.map((event) => ({
          eventId: event.eventId || event.id,
          action: event.action,
          time: event.time,
        })),
        totalAllocation: updatedTotalAllocation,
      };

      const savedClientResponse = await updateClient(draftClient.id, clientPatch);
      const savedClient = normalizeClient(savedClientResponse.client);

      setDraftClient(savedClient);
      onClientUpdate?.(savedClient);

      resetSendForm();
      setShowSendForm(false);
    } catch (error) {
      setSubmitError(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-white/[0.08] bg-[#0b0d12] text-white">
      <CardContent className="p-0">
        <div className="border-b border-white/[0.08] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/35">
                Selected merchant
              </p>

              <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                {draftClient.name}
              </h2>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/40">
                <span className="font-semibold text-[#fe8200]">
                  {draftClient.id}
                </span>
                <span>{draftClient.signedAt}</span>
                <span>
                  Total allocation{" "}
                  <span className="font-semibold text-white">
                    {formatMoney(totalAllocation)}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-white/[0.08] bg-white/[0.03] text-white/65 hover:bg-white/[0.08] hover:text-white"
              >
                Review
              </Button>

              <Button
                onClick={() => setShowSendForm((prev) => !prev)}
                className="rounded-xl bg-[#fe8200] px-5 font-semibold text-black hover:bg-[#ff9a2f]"
              >
                <Send className="mr-2 h-4 w-4" />
                Send capital
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MiniMoneyStat
              label="Funded amount"
              value={formatMoney(completedTotal)}
              tone="green"
            />
            <MiniMoneyStat
              label="Pending amount"
              value={formatMoney(pendingTotal)}
              tone="orange"
            />
            <MiniMoneyStat
              label="Total planned"
              value={formatMoney(totalAllocation)}
              tone="white"
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="uppercase tracking-[0.22em] text-white/30">
                Progress
              </span>
              <span className="text-white/50">
                {completedCount} / {(draftClient.vendors || []).length} sent
              </span>
            </div>

            <Progress value={progressValue} className="h-1.5 bg-white/[0.08]" />
          </div>

          {showSendForm && (
            <div className="mt-6 rounded-3xl border border-[#fe8200]/25 bg-[#fe8200]/[0.06] p-5 shadow-[0_0_40px_rgba(254,130,0,0.08)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fe8200]">
                    Capital release
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Add a pending disbursement to this merchant.
                  </p>
                </div>

                <button
                  onClick={() => setShowSendForm(false)}
                  className="rounded-full p-1 text-white/35 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 xl:grid-cols-[1.2fr_1.3fr_1.3fr_auto]">
                <div>
                  <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                    Funded amount
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-white/55">
                      $
                    </span>

                    <Input
                      inputMode="numeric"
                      value={sendAmount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className="h-12 rounded-2xl border-white/[0.1] bg-black/40 pl-9 text-lg font-semibold text-white placeholder:text-white/25 focus-visible:ring-[#fe8200]/50"
                    />
                  </div>

                  <p className="mt-2 text-xs text-white/35">
                    {previewAmount > 0
                      ? `Preview: ${formatMoney(previewAmount)}`
                      : "Enter the amount to release."}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                    Vendor
                  </label>

                  <select
                    value={sendVendor}
                    onChange={(event) => setSendVendor(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-white/[0.1] bg-black/40 px-4 text-sm font-medium text-white outline-none transition focus:border-[#fe8200]/50"
                  >
                    {DEFAULT_VENDOR_OPTIONS.map((vendor) => (
                      <option key={vendor} value={vendor}>
                        {vendor}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                    Tag / purpose
                  </label>

                  <select
                    value={sendTag}
                    onChange={(event) => setSendTag(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-white/[0.1] bg-black/40 px-4 text-sm font-medium text-white outline-none transition focus:border-[#fe8200]/50"
                  >
                    {DEFAULT_TAG_OPTIONS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleMockSend}
                    disabled={isSubmitting}
                    className="h-12 rounded-2xl bg-[#fe8200] px-6 font-semibold text-black shadow-[0_0_28px_rgba(254,130,0,0.25)] hover:bg-[#ff9a2f] disabled:opacity-50"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Confirm"}
                  </Button>
                </div>
              </div>

              {submitError && (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {submitError}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="max-h-[360px] overflow-y-auto divide-y divide-white/[0.06]">
          {(draftClient.vendors || []).map((vendor) => (
            <VendorRow key={vendor.id || vendor.vendorId} vendor={vendor} />
          ))}
        </div>

        <div className="border-t border-white/[0.08] p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-white/35">
            Merchant history
          </p>

          <div className="space-y-3">
            {(draftClient.history || []).slice(0, 5).map((event) => (
              <div
                key={event.id || event.eventId}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3"
              >
                <p className="text-sm text-white/70">{event.action}</p>
                <p className="shrink-0 text-xs text-white/35">{event.time}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniMoneyStat({ label, value, tone }) {
  const toneClass =
    tone === "green"
      ? "text-emerald-300"
      : tone === "orange"
        ? "text-[#fe8200]"
        : "text-white";

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className={`mt-2 text-xl font-semibold tracking-[-0.03em] ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

function VendorRow({ vendor }) {
  return (
    <div className="grid gap-4 p-5 md:grid-cols-[1fr_130px_100px_110px_80px] md:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#161c2d]">
          <Building2 className="h-4 w-4 text-white/65" />
        </div>

        <div>
          <p className="text-sm font-medium">{vendor.name}</p>
          <p className="mt-1 text-xs text-white/40">{vendor.purpose}</p>
        </div>
      </div>

      <p className="font-mono text-sm font-semibold text-white">
        {formatMoney(vendor.amount)}
      </p>

      <p className="text-xs text-white/45">{vendor.method}</p>

      <Badge
        className={`w-fit rounded-full border border-white/[0.08] ${
          vendor.status === "Completed"
            ? "bg-emerald-400/10 text-emerald-300"
            : vendor.status === "Processing"
              ? "bg-[#fe8200]/10 text-[#fe8200]"
              : "bg-white/[0.04] text-white/50"
        } hover:bg-white/[0.04]`}
      >
        {vendor.status}
      </Badge>

      <Button
        size="sm"
        variant="ghost"
        className="rounded-xl text-[#fe8200] hover:bg-[#fe8200]/10 hover:text-[#fe8200]"
      >
        Send
      </Button>
    </div>
  );
}