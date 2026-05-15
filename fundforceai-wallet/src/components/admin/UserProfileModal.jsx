import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";

import { updateClient, deleteClient } from "@/lib/api";
import { money } from "@/lib/helpers";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const EMPTY_CLIENT = {
  id: "",
  name: "",
  signedAt: "",
  category: "",
  status: "Ready",
  pointOfContact: "",
  email: "",
  phone: "",
  ein: "",
  address: "",
  vendors: [],
  history: [],
};

function normalizeClient(client) {
  if (!client) return EMPTY_CLIENT;

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

function toClientPatch(client) {
  return {
    name: client.name,
    signedAt: client.signedAt,
    category: client.category,
    status: client.status,
    pointOfContact: client.pointOfContact,
    email: client.email,
    phone: client.phone,
    ein: client.ein,
    address: client.address,
    totalAllocation: (client.vendors || []).reduce(
      (sum, vendor) => sum + Number(vendor.amount || 0),
      0
    ),
    vendors: (client.vendors || []).map((vendor) => ({
      vendorId: vendor.vendorId || vendor.id,
      name: vendor.name,
      purpose: vendor.purpose,
      amount: vendor.amount,
      method: vendor.method,
      status: vendor.status,
    })),
    history: (client.history || []).map((event) => ({
      eventId: event.eventId || event.id,
      action: event.action,
      time: event.time,
    })),
  };
}

export default function UserProfileModal({
  open,
  client,
  onOpenChange,
  onClientUpdate,
  onClientDelete,
}) {
  const safeClient = client || EMPTY_CLIENT;
  const [draftClient, setDraftClient] = useState(safeClient);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setDraftClient(normalizeClient(client || EMPTY_CLIENT));
    setFormError("");
  }, [client]);

  const totalFunded = useMemo(() => {
    return (draftClient.vendors || [])
      .filter((vendor) => vendor.status === "Completed")
      .reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0);
  }, [draftClient.vendors]);

  const totalPending = useMemo(() => {
    return (draftClient.vendors || [])
      .filter((vendor) => vendor.status !== "Completed")
      .reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0);
  }, [draftClient.vendors]);

  const totalPlanned = useMemo(() => {
    return (draftClient.vendors || []).reduce(
      (sum, vendor) => sum + Number(vendor.amount || 0),
      0
    );
  }, [draftClient.vendors]);

  function updateField(field, value) {
    setDraftClient((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSave() {
    if (!client || isSaving) return;

    try {
      setIsSaving(true);
      setFormError("");

      const patch = toClientPatch(draftClient);

      const result = await updateClient(draftClient.id, patch);
      const savedClient = normalizeClient(result.client);

      onClientUpdate?.(savedClient);
      onOpenChange(false);
    } catch (error) {
      setFormError(error.message || "Failed to save account changes.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!client || isDeleting) return;

    const confirmed = window.confirm(
      `Delete ${draftClient.name}? This will remove this client from Payload.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setFormError("");

      await deleteClient(draftClient.id);

      onClientDelete?.(draftClient.id);
      onOpenChange(false);
    } catch (error) {
      setFormError(error.message || "Failed to delete client.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open && Boolean(client)} onOpenChange={onOpenChange}>
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
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#fe8200]">
                User account
              </p>

              <DialogTitle className="max-w-2xl text-4xl font-medium tracking-[-0.055em] text-white">
                {draftClient.name || "Merchant profile"}
              </DialogTitle>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/40">
                <span className="font-semibold text-[#fe8200]">
                  {draftClient.id}
                </span>
                <span>{draftClient.signedAt}</span>
                <span>{draftClient.category}</span>
                <Badge className="rounded-full bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
                  {draftClient.status}
                </Badge>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="relative z-10 h-[calc(92vh-132px)] overflow-y-auto p-7">
          <section className="mb-6 grid gap-4 md:grid-cols-3">
            <MoneyCard
              label="Funded amount"
              value={money(totalFunded)}
              tone="green"
            />
            <MoneyCard
              label="Pending amount"
              value={money(totalPending)}
              tone="orange"
            />
            <MoneyCard
              label="Total planned"
              value={money(totalPlanned)}
              tone="white"
            />
          </section>

          {formError && (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {formError}
            </div>
          )}

          <section className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#161c2d]">
                    <User className="h-4 w-4 text-white/70" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Account details</h3>
                    <p className="text-xs text-white/40">
                      Manage merchant profile data.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Field label="Merchant name">
                    <Input
                      value={draftClient.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      className="h-11 rounded-2xl border-white/[0.08] bg-black/30 text-white"
                    />
                  </Field>

                  <Field label="Point of contact">
                    <Input
                      value={draftClient.pointOfContact || ""}
                      onChange={(event) =>
                        updateField("pointOfContact", event.target.value)
                      }
                      className="h-11 rounded-2xl border-white/[0.08] bg-black/30 text-white"
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Email">
                      <Input
                        value={draftClient.email || ""}
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        className="h-11 rounded-2xl border-white/[0.08] bg-black/30 text-white"
                      />
                    </Field>

                    <Field label="Phone">
                      <Input
                        value={draftClient.phone || ""}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        className="h-11 rounded-2xl border-white/[0.08] bg-black/30 text-white"
                      />
                    </Field>
                  </div>

                  <Field label="EIN">
                    <Input
                      value={draftClient.ein || ""}
                      onChange={(event) =>
                        updateField("ein", event.target.value)
                      }
                      className="h-11 rounded-2xl border-white/[0.08] bg-black/30 text-white"
                    />
                  </Field>

                  <Field label="Company address">
                    <Input
                      value={draftClient.address || ""}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                      className="h-11 rounded-2xl border-white/[0.08] bg-black/30 text-white"
                    />
                  </Field>

                  <Field label="Category">
                    <Input
                      value={draftClient.category}
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                      className="h-11 rounded-2xl border-white/[0.08] bg-black/30 text-white"
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      value={draftClient.status}
                      onChange={(event) =>
                        updateField("status", event.target.value)
                      }
                      className="h-11 w-full rounded-2xl border border-white/[0.08] bg-black/30 px-4 text-sm text-white outline-none focus:border-[#fe8200]/50"
                    >
                      <option value="Ready">Ready</option>
                      <option value="Review">Review</option>
                      <option value="Hold">Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </Field>
                </div>

                <div className="mt-5 grid gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-11 w-full rounded-2xl bg-[#fe8200] font-semibold text-black hover:bg-[#ff9a2f] disabled:opacity-50"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save account changes"}
                  </Button>

                  <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    variant="outline"
                    className="h-11 w-full rounded-2xl border-red-400/20 bg-red-400/10 font-semibold text-red-300 hover:bg-red-400/15 hover:text-red-200 disabled:opacity-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete mock account"}
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#161c2d]">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Account signals</h3>
                    <p className="text-xs text-white/40">
                      High-level account state.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <SignalRow
                    icon={User}
                    label="Point of contact"
                    value={draftClient.pointOfContact || "Not assigned"}
                  />
                  <SignalRow
                    icon={Mail}
                    label="Email"
                    value={draftClient.email || "No email"}
                  />
                  <SignalRow
                    icon={Phone}
                    label="Phone"
                    value={draftClient.phone || "No phone"}
                  />
                  <SignalRow
                    icon={MapPin}
                    label="Address"
                    value={draftClient.address || "No address"}
                  />
                  <SignalRow
                    icon={CreditCard}
                    label="Funding method"
                    value="Vendor-directed capital"
                  />
                  <SignalRow
                    icon={Clock3}
                    label="Last activity"
                    value="Just now"
                  />
                </div>
              </div>
            </div>

            <div className="grid min-w-0 gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025]">
                <div className="border-b border-white/[0.08] p-5">
                  <h3 className="text-lg font-medium">Funded vendors</h3>
                  <p className="mt-1 text-xs text-white/40">
                    All capital lines attached to this merchant.
                  </p>
                </div>

                <div className="max-h-[620px] overflow-y-auto divide-y divide-white/[0.06]">
                  {(draftClient.vendors || []).map((vendor) => (
                    <div
                      key={vendor.id || vendor.vendorId}
                      className="grid gap-3 p-5 md:grid-cols-[1fr_110px_100px]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#161c2d]">
                          <Building2 className="h-4 w-4 text-white/60" />
                        </div>

                        <div>
                          <p className="text-sm font-medium">{vendor.name}</p>
                          <p className="mt-1 text-xs text-white/40">
                            {vendor.purpose}
                          </p>
                        </div>
                      </div>

                      <p className="font-mono text-sm font-semibold">
                        {money(vendor.amount)}
                      </p>

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
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025]">
                <div className="border-b border-white/[0.08] p-5">
                  <h3 className="text-lg font-medium">Merchant history</h3>
                  <p className="mt-1 text-xs text-white/40">
                    Funding actions and account timeline.
                  </p>
                </div>

                <div className="max-h-[620px] overflow-y-auto p-5">
                  <div className="space-y-3">
                    {(draftClient.history || []).map((event) => (
                      <div
                        key={event.id || event.eventId}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3"
                      >
                        <p className="text-sm text-white/70">{event.action}</p>
                        <p className="shrink-0 text-xs text-white/35">
                          {event.time}
                        </p>
                      </div>
                    ))}
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

function MoneyCard({ label, value, tone }) {
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
      <p
        className={`mt-3 text-2xl font-semibold tracking-[-0.04em] ${toneClass}`}
      >
        {value}
      </p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
        {label}
      </label>
      {children}
    </div>
  );
}

function SignalRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-white/40" />
        <p className="text-sm text-white/50">{label}</p>
      </div>
      <p className="max-w-[220px] truncate text-right text-sm font-medium text-white">
        {value}
      </p>
    </div>
  );
}