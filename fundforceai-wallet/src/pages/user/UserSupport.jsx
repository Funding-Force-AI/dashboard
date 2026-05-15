import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  Clock3,
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  Sparkles,
  User,
} from "lucide-react";

import UserPageShell from "@/components/user/UserPageShell";
import UserTopNav from "@/components/user/UserTopNav";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getClients } from "@/lib/api";
import { normalizeClient } from "@/lib/helpers";

const REQUEST_TYPES = [
  {
    title: "Profile update",
    description: "Request a change to business info, contact details, or address.",
    icon: Building2,
  },
  {
    title: "Payment help",
    description: "Ask about billing schedule, failed payments, or payment method setup.",
    icon: Shield,
  },
  {
    title: "Package change",
    description: "Request a new funding model, package tier, or growth scenario.",
    icon: Sparkles,
  },
];

const MOCK_NOTES = [
  {
    title: "Account mirror activated",
    time: "Today",
    body: "Client account dashboard is live and ready for review.",
  },
  {
    title: "Payment wallet pending",
    time: "Next step",
    body: "ACH/card setup will be enabled after Stripe wiring.",
  },
];

export default function UserSupport() {
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
      setError(error.message || "Failed to load support.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClient();
  }, []);

  if (isLoading) {
    return (
      <UserPageShell>
        <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-8">
          <div className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-8 text-white/50">
            Loading support center...
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
            {error || "No support account found."}
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
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#fe8200]">
              Support center
            </p>

            <h1 className="text-5xl font-medium tracking-[-0.065em]">
              Account help
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
              Request account updates, payment help, package changes, or support
              from your Merbi account team.
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-6">
                <User className="mb-4 h-5 w-5 text-[#fe8200]" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fe8200]">
                  Account team
                </p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
                  Merbi support
                </h2>

                <div className="mt-6 space-y-3">
                  <ContactRow icon={Building2} label="Business" value={client.name} />
                  <ContactRow icon={User} label="Contact" value={client.pointOfContact} />
                  <ContactRow icon={Mail} label="Email" value="support@merbi.ai" />
                  <ContactRow icon={Phone} label="Phone" value="Available later" />
                  <ContactRow icon={Clock3} label="Response time" value="1 business day" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-cyan-300/20 bg-cyan-300/[0.04] text-white">
              <CardContent className="p-6">
                <HelpCircle className="mb-4 h-5 w-5 text-cyan-300" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Need faster help?
                </p>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  Later this can become a real support ticket flow connected to
                  admin notifications, client notes, and email alerts.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {REQUEST_TYPES.map((item) => (
                <RequestCard key={item.title} item={item} />
              ))}
            </div>

            <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white">
              <CardContent className="p-0">
                <div className="border-b border-white/[0.08] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fe8200]">
                    Recent notes
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em]">
                    Account activity
                  </h2>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {MOCK_NOTES.map((note) => (
                    <div key={note.title} className="p-6">
                      <p className="text-sm font-semibold text-white">
                        {note.title}
                      </p>
                      <p className="mt-1 text-xs text-[#fe8200]">{note.time}</p>
                      <p className="mt-3 text-sm leading-6 text-white/45">
                        {note.body}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </UserPageShell>
  );
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-white/40" />
        <p className="text-sm text-white/45">{label}</p>
      </div>
      <p className="max-w-[220px] truncate text-right text-sm font-medium text-white">
        {value || "—"}
      </p>
    </div>
  );
}

function RequestCard({ item }) {
  const Icon = item.icon;

  return (
    <Card className="rounded-[2rem] border-white/[0.08] bg-[#0b0d12] text-white transition hover:border-[#fe8200]/35">
      <CardContent className="p-6">
        <Icon className="mb-5 h-5 w-5 text-[#fe8200]" />
        <p className="text-lg font-semibold tracking-[-0.035em]">
          {item.title}
        </p>
        <p className="mt-3 text-sm leading-6 text-white/45">
          {item.description}
        </p>

        <Button
          disabled
          variant="ghost"
          className="mt-6 h-10 rounded-xl px-0 text-[#fe8200] hover:bg-transparent hover:text-[#ff9a2f]"
        >
          Request later
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}