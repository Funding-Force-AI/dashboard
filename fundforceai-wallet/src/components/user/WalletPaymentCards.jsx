import {
  Clock3,
  CreditCard,
  DollarSign,
  Plus,
  Shield,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function WalletPaymentCards({ client, totalPlanned, pendingTotal }) {
  const lastFour = "••••";
  const nextCharge = "Not scheduled";

  return (
    <section className="mb-6 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-5">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fe8200]">
            Payment wallet
          </p>
          <h3 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
            Saved payment methods
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
            Visual placeholder for ACH/card setup. Stripe wiring comes after auth.
          </p>
        </div>

        <Button
          onClick={() =>
            alert("Payment setup will be enabled after account login is activated.")
          }
          className="h-11 rounded-2xl bg-[#fe8200] px-5 font-semibold text-black hover:bg-[#ff9a2f]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add payment method
        </Button>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[0.9fr_1fr]">
        <div className="flex justify-center xl:justify-start">
          <div className="relative aspect-[1.58/1] w-full max-w-[430px] overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-[#10131c] p-5 shadow-2xl shadow-black/40">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute right-[-4rem] top-[-5rem] h-52 w-52 rounded-full bg-[#fe8200]/25 blur-[70px]" />
              <div className="absolute bottom-[-5rem] left-[-4rem] h-52 w-52 rounded-full bg-cyan-300/10 blur-[80px]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/40" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                    Primary rail
                  </p>
                  <h4 className="mt-1.5 text-xl font-semibold tracking-[-0.04em]">
                    ACH Direct Debit
                  </h4>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.08]">
                  <CreditCard className="h-4 w-4 text-[#fe8200]" />
                </div>
              </div>

              <div>
                <p className="font-mono text-lg tracking-[0.14em] text-white">
                  {lastFour} {lastFour} {lastFour} BANK
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                      Account
                    </p>
                    <p className="mt-1 max-w-[240px] truncate text-sm font-medium text-white">
                      {client?.name}
                    </p>
                  </div>

                  <Badge className="rounded-full border border-white/[0.1] bg-white/[0.08] px-3 py-1 text-xs text-white/65">
                    Not linked
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <WalletSignal
            label="Payment method"
            value="Not linked"
            icon={CreditCard}
          />
          <WalletSignal
            label="Suggested schedule"
            value="Monday + Friday"
            icon={Clock3}
          />
          <WalletSignal
            label="Outstanding plan"
            value={money(pendingTotal || totalPlanned)}
            icon={DollarSign}
          />
          <WalletSignal
            label="Next charge"
            value={nextCharge}
            icon={Shield}
          />

          <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
            <div className="flex gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
              <p className="text-sm leading-6 text-white/60">
                After auth, this card becomes the secure Stripe ACH setup flow.
                The app stores Stripe IDs only, never raw bank details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WalletSignal({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/[0.06] bg-black/20 px-4 py-4">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-white/35" />
        <p className="text-sm text-white/45">{label}</p>
      </div>

      <p className="max-w-[180px] truncate text-right text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}