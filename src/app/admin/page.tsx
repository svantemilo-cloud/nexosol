"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  LogOut,
  Users,
  FileText,
  StickyNote,
  Calendar,
  Mail,
  Send,
  Building2,
  Handshake,
  BarChart2,
  Globe,
  MapPin,
  Smartphone,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  Trophy,
  Phone,
  CalendarCheck,
  Settings,
  UserPlus,
} from "lucide-react";
import { type Partner, store } from "@/lib/store";

type AdminSection = "privatkunder" | "foretagskunder" | "partners" | "scoreboard" | "webbtrafik" | "admin";
type AdminUser = "leon" | "vincent" | "wilmer";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "God morgon";
  if (h >= 12 && h < 18) return "God eftermiddag";
  return "God kväll";
}

const ADMIN_USER_LABELS: { id: AdminUser; label: string }[] = [
  { id: "leon", label: "Leon" },
  { id: "vincent", label: "Vincent" },
  { id: "wilmer", label: "Wilmer" },
];

const SIDEMENU_ITEMS: { id: AdminSection; label: string; icon: typeof FileText }[] = [
  { id: "privatkunder", label: "Privatkunder", icon: Users },
  { id: "foretagskunder", label: "Företagskunder", icon: Building2 },
  { id: "partners", label: "Pipeline partners", icon: Handshake },
  { id: "scoreboard", label: "Scoreboard", icon: Trophy },
  { id: "webbtrafik", label: "Webbtrafik", icon: BarChart2 },
  { id: "admin", label: "Admin", icon: Settings },
];

const CHART_COLORS = ["#065a45", "#0d7a5c", "#14a37f", "#3dd5a4", "#6ee7b7"];

function useWebbtrafikData(visits: { createdAt: string }[], submissionsCount: number) {
  return useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    const visitsByDay = last7Days.map((date) => {
      const count = visits.filter((v) => v.createdAt.startsWith(date)).length;
      return { date: date.slice(5), användare: count, besök: count };
    });
    const totalVisits = Math.max(visits.length, 1);
    const trafficSources = [
      { name: "Direkt", value: Math.max(1, Math.floor(totalVisits * 0.45)), fill: CHART_COLORS[0] },
      { name: "Organisk sök", value: Math.max(1, Math.floor(totalVisits * 0.35)), fill: CHART_COLORS[1] },
      { name: "Referral", value: Math.max(0, Math.floor(totalVisits * 0.12)), fill: CHART_COLORS[2] },
      { name: "Social", value: Math.max(0, Math.floor(totalVisits * 0.08)), fill: CHART_COLORS[3] },
    ].filter((s) => s.value > 0);
    const countries = [
      { land: "Sverige", användare: Math.max(1, Math.floor(totalVisits * 0.85)) },
      { land: "Norge", användare: Math.max(0, Math.floor(totalVisits * 0.08)) },
      { land: "Danmark", användare: Math.max(0, Math.floor(totalVisits * 0.05)) },
      { land: "Övriga", användare: Math.max(0, totalVisits - Math.floor(totalVisits * 0.98)) },
    ].filter((c) => c.användare > 0);
    const cities = [
      { stad: "Stockholm", användare: Math.max(1, Math.floor(totalVisits * 0.28)) },
      { stad: "Göteborg", användare: Math.max(0, Math.floor(totalVisits * 0.18)) },
      { stad: "Malmö", användare: Math.max(0, Math.floor(totalVisits * 0.12)) },
      { stad: "Uppsala", användare: Math.max(0, Math.floor(totalVisits * 0.08)) },
      { stad: "Övriga", användare: Math.max(0, totalVisits - Math.floor(totalVisits * 0.66)) },
    ].filter((c) => c.användare > 0);
    const devices = [
      { name: "Desktop", value: Math.max(1, Math.floor(totalVisits * 0.52)), fill: CHART_COLORS[0] },
      { name: "Mobil", value: Math.max(1, Math.floor(totalVisits * 0.40)), fill: CHART_COLORS[1] },
      { name: "Surfplatta", value: Math.max(0, totalVisits - Math.floor(totalVisits * 0.92)), fill: CHART_COLORS[2] },
    ].filter((d) => d.value > 0);
    const safeTraffic = trafficSources.length > 0 ? trafficSources : [{ name: "Direkt", value: 1, fill: CHART_COLORS[0] }];
    const safeCountries = countries.length > 0 ? countries : [{ land: "Sverige", användare: 1 }];
    const safeCities = cities.length > 0 ? cities : [{ stad: "Stockholm", användare: 1 }];
    const safeDevices = devices.length > 0 ? devices : [{ name: "Desktop", value: 1, fill: CHART_COLORS[0] }];
    return {
      usersOverTime: visitsByDay,
      trafficSources: safeTraffic,
      countries: safeCountries,
      cities: safeCities,
      devices: safeDevices,
      conversionRate: visits.length > 0 ? ((submissionsCount / visits.length) * 100).toFixed(1) : "0",
      totalConversions: submissionsCount,
      totalUsers: visits.length,
    };
  }, [visits, submissionsCount]);
}

const PIPELINE_STAGES = [
  { id: "leads" as const, label: "Leads" },
  { id: "ring_senare" as const, label: "RING SENARE" },
  { id: "booked_meeting" as const, label: "BOOKED MEETING" },
  { id: "specialmarkerad" as const, label: "SPECIALMARKERAD" },
  { id: "nej_tack" as const, label: "NEJ TACK" },
] as const;

const PODS = [
  { id: "unassigned" as const, label: "Ej tilldelad" },
  { id: "leon" as const, label: "Leon" },
  { id: "vincent" as const, label: "Vincent" },
  { id: "wilmer" as const, label: "Wilmer" },
] as const;

const OFFER_TEMPLATES = [
  {
    id: "solceller",
    label: "Solceller – standard",
    title: "Offert: Solcellsanläggning",
    body: `
<div class="offer-header">
  <div class="offer-logo">Nexosol</div>
  <p class="offer-tagline">Din väg till grön el</p>
</div>
<hr class="offer-divider"/>
<div class="offer-meta">
  <p class="offer-doc-title">OFFERT – Solcellsanläggning</p>
  <p class="offer-date"></p>
</div>
<div class="offer-to">
  <p class="offer-to-label">Till:</p>
  <p class="offer-to-name">{{firstName}} {{lastName}}</p>
  <p class="offer-to-address">{{address}}</p>
  <p class="offer-to-contact">E-post: {{email}}</p>
  <p class="offer-to-contact">Telefon: {{phone}}</p>
</div>
<div class="offer-body">
  <p>Vi har noga gått igenom era uppgifter och vill härmed presentera en offert för en solcellsanläggning anpassad efter er fastighet.</p>
  <div class="offer-section">
    <p class="offer-section-title">Uppskattat baserat på era uppgifter</p>
    <ul class="offer-list">
      <li>Beräknad takyta: <strong>{{roofAreaM2}} m²</strong></li>
      <li>Uppskattad årsproduktion: <strong>{{estimatedProductionKwh}} kWh</strong></li>
      <li>Återbetalningstid (ROI): <strong>ca {{estimatedRoiYears}} år</strong></li>
    </ul>
  </div>
  <p>Vill du ta nästa steg eller har du frågor är du varmt välkommen att höra av dig.</p>
</div>
<div class="offer-footer">
  <p>Med vänliga hälsningar,</p>
  <p class="offer-signature">Nexosol</p>
</div>`,
  },
  {
    id: "solceller-batteri",
    label: "Solceller med batteri",
    title: "Offert: Solceller med batterilagring",
    body: `
<div class="offer-header">
  <div class="offer-logo">Nexosol</div>
  <p class="offer-tagline">Din väg till grön el</p>
</div>
<hr class="offer-divider"/>
<div class="offer-meta">
  <p class="offer-doc-title">OFFERT – Solceller med batterilagring</p>
  <p class="offer-date"></p>
</div>
<div class="offer-to">
  <p class="offer-to-label">Till:</p>
  <p class="offer-to-name">{{firstName}} {{lastName}}</p>
  <p class="offer-to-address">{{address}}</p>
  <p class="offer-to-contact">E-post: {{email}}</p>
  <p class="offer-to-contact">Telefon: {{phone}}</p>
</div>
<div class="offer-body">
  <p>Enligt era önskemål inkluderar denna offert solceller samt batterilagring för ökad självförsörjning.</p>
  <div class="offer-section">
    <p class="offer-section-title">Uppskattat baserat på era uppgifter</p>
    <ul class="offer-list">
      <li>Beräknad takyta: <strong>{{roofAreaM2}} m²</strong></li>
      <li>Uppskattad årsproduktion: <strong>{{estimatedProductionKwh}} kWh</strong></li>
      <li>Återbetalningstid (ROI): <strong>ca {{estimatedRoiYears}} år</strong></li>
      <li>Batterilagring: <strong>inkluderat i denna offert</strong></li>
    </ul>
  </div>
  <p>Vi återkommer gärna med mer detaljer eller en platsbesiktning.</p>
</div>
<div class="offer-footer">
  <p>Med vänliga hälsningar,</p>
  <p class="offer-signature">Nexosol</p>
</div>`,
  },
  {
    id: "laddbox",
    label: "Laddbox",
    title: "Offert: Laddbox för elbil",
    body: `
<div class="offer-header">
  <div class="offer-logo">Nexosol</div>
  <p class="offer-tagline">Din väg till grön el</p>
</div>
<hr class="offer-divider"/>
<div class="offer-meta">
  <p class="offer-doc-title">OFFERT – Laddbox för elbil</p>
  <p class="offer-date"></p>
</div>
<div class="offer-to">
  <p class="offer-to-label">Till:</p>
  <p class="offer-to-name">{{firstName}} {{lastName}}</p>
  <p class="offer-to-address">{{address}}</p>
  <p class="offer-to-contact">E-post: {{email}}</p>
  <p class="offer-to-contact">Telefon: {{phone}}</p>
</div>
<div class="offer-body">
  <p>Härmed följer vår offert för installation av laddbox för elbil.</p>
  <p>Vi erbjuder professionell installation och kan anpassa lösningen efter era behov.</p>
  <p>Kontakta oss gärna för att boka en besiktning eller ställa frågor.</p>
</div>
<div class="offer-footer">
  <p>Med vänliga hälsningar,</p>
  <p class="offer-signature">Nexosol</p>
</div>`,
  },
] as const;

const EMAIL_TEMPLATES = [
  {
    id: "uppföljning",
    label: "Uppföljning – fråga om intresse",
    subject: "Uppföljning – solceller från Nexosol",
    body: `Hej {{firstName}},

Tack för att du visade intresse för solceller via vår hemsida. Vi skulle gärna höra om du vill ta nästa steg – t.ex. en kort genomgång eller en platsbesiktning.

Du når oss enkelt på det här mailet eller på telefon om du har frågor.

Med vänliga hälsningar,
Nexosol`,
  },
  {
    id: "påminnelse",
    label: "Påminnelse – vi återkommer",
    subject: "Påminnelse – er förfrågan om solceller",
    body: `Hej {{firstName}},

Vi återkommer med en snabb påminnelse om er förfrågan om solceller. Har du möjlighet att ta ett samtal eller vill du boka en tid för en genomgång?

Hör av er när det passar – vi finns tillgängliga.

Med vänliga hälsningar,
Nexosol`,
  },
  {
    id: "efter-samtal",
    label: "Efter samtal – sammanfattning",
    subject: "Sammanfattning av vårt samtal – Nexosol",
    body: `Hej {{firstName}},

Som vi pratade om idag – här är en kort sammanfattning. Vi återkommer med mer information enligt vad vi kom överens om.

Vid frågor, hör av er.

Med vänliga hälsningar,
Nexosol`,
  },
] as const;

function fillOfferTemplate(
  html: string,
  s: Submission
): string {
  const vars: Record<string, string> = {
    firstName: s.firstName ?? "",
    lastName: s.lastName ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    address: s.address ?? "",
    roofAreaM2: String(s.roofAreaM2 ?? 0),
    consumptionKwh: String(s.consumptionKwh ?? 0),
    estimatedRoiYears: String(s.estimatedRoiYears ?? 0),
    estimatedProductionKwh: String(s.estimatedProductionKwh ?? 0),
    date: new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" }),
  };
  let out = html;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  out = out.replace(/<p class="offer-date"><\/p>/, `<p class="offer-date">${vars.date}</p>`);
  return out;
}

function fillEmailTemplate(body: string, s: Submission): string {
  const vars: Record<string, string> = {
    firstName: s.firstName ?? "",
    lastName: s.lastName ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    address: s.address ?? "",
  };
  let out = body;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return out;
}

function offerBodyToPlainText(html: string): string {
  const div = typeof document !== "undefined" ? document.createElement("div") : null;
  if (div) {
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
  }
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

type CallStatus = "ej_svar" | "nej_tack" | "bokat_mote" | "ring_senare" | "specialmarkerad";

type CustomerType = "privat" | "foretag";

type Submission = {
  id: string;
  createdAt: string;
  source: string;
  customerType?: CustomerType;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  address: string;
  consumptionKwh: number;
  roofAreaM2: number;
  roofType: string;
  region: string;
  includeBattery: boolean;
  offertChoices: Record<string, boolean>;
  estimatedProductionKwh: number;
  estimatedRoiYears: number;
  notes?: string;
  stage?: string;
  pod?: string;
  callStatus?: CallStatus;
};

type Visit = {
  id: string;
  createdAt: string;
  path?: string;
  userAgent?: string;
};

function PartnerEditForm({
  partner,
  onSave,
  onCancel,
}: {
  partner: Partner;
  onSave: (data: Partial<Partner>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    companyName: partner.companyName ?? "",
    email: partner.email ?? "",
    contactName: partner.contactName ?? "",
    contactPhone: partner.contactPhone ?? "",
    logoUrl: partner.logoUrl ?? "",
    address: partner.address ?? "",
    avtalDeals: partner.avtalDeals ?? "",
    dealsPerLeads: partner.dealsPerLeads ?? "",
    notes: partner.notes ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      companyName: form.companyName.trim(),
      email: form.email.trim(),
      contactName: form.contactName.trim() || undefined,
      contactPhone: form.contactPhone.trim() || undefined,
      logoUrl: form.logoUrl.trim() || undefined,
      address: form.address.trim(),
      avtalDeals: form.avtalDeals.trim() || undefined,
      dealsPerLeads: form.dealsPerLeads.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={form.companyName}
        onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-white"
        placeholder="Företagsnamn"
        required
      />
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-white"
        placeholder="E-post"
        required
      />
      <input
        value={form.contactName}
        onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-white"
        placeholder="Kontaktperson (namn)"
      />
      <input
        value={form.contactPhone}
        onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-white"
        placeholder="Kontaktperson (telefon)"
      />
      <input
        value={form.logoUrl}
        onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-white"
        placeholder="Logotyp URL"
      />
      <input
        value={form.address}
        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-white"
        placeholder="Adress"
      />
      <input
        value={form.avtalDeals}
        onChange={(e) => setForm((f) => ({ ...f, avtalDeals: e.target.value }))}
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-white"
        placeholder="Avtal / Deals"
      />
      <input
        value={form.dealsPerLeads}
        onChange={(e) => setForm((f) => ({ ...f, dealsPerLeads: e.target.value }))}
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-white"
        placeholder="Deals per leads"
      />
      <textarea
        value={form.notes}
        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-white"
        placeholder="Anteckningar"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Spara
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-zinc-600 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [callOutcomeForId, setCallOutcomeForId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null); // "podId:stageId"
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [addCustomerError, setAddCustomerError] = useState("");
  const [addCustomerSending, setAddCustomerSending] = useState(false);
  const [showAddForetagCustomer, setShowAddForetagCustomer] = useState(false);
  const [newForetagCustomer, setNewForetagCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [addForetagCustomerError, setAddForetagCustomerError] = useState("");
  const [addForetagCustomerSending, setAddForetagCustomerSending] = useState(false);
  const [offerCustomer, setOfferCustomer] = useState<Submission | null>(null);
  const [offerStep, setOfferStep] = useState<"template" | "preview">("template");
  const [selectedOfferTemplateId, setSelectedOfferTemplateId] = useState<string | null>(null);
  const [mailCustomer, setMailCustomer] = useState<Submission | null>(null);
  const [mailStep, setMailStep] = useState<"template" | "preview">("template");
  const [selectedMailTemplateId, setSelectedMailTemplateId] = useState<string | null>(null);
  const [adminSection, setAdminSection] = useState<AdminSection>("privatkunder");
  const [currentUser, setCurrentUser] = useState<{
    displayName?: string;
    email: string;
    pod?: AdminUser;
  } | null>(null);
  const [isLegacyAdmin, setIsLegacyAdmin] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({
    companyName: "",
    email: "",
    contactName: "",
    contactPhone: "",
    logoUrl: "",
    address: "",
    avtalDeals: "",
    dealsPerLeads: "",
    notes: "",
  });
  const [partnerError, setPartnerError] = useState("");
  const [partnerSending, setPartnerSending] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [profilePictures, setProfilePictures] = useState<Partial<Record<AdminUser, string>>>({});
  const [editingProfilePicture, setEditingProfilePicture] = useState<AdminUser | null>(null);
  const [profilePictureDraft, setProfilePictureDraft] = useState("");
  const [adminUsers, setAdminUsers] = useState<{ id: string; createdAt: string; username: string; email: string; displayName?: string }[]>([]);
  const [showAddAdminUser, setShowAddAdminUser] = useState(false);
  const [newAdminUser, setNewAdminUser] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });
  const [addAdminUserError, setAddAdminUserError] = useState("");
  const [addAdminUserSending, setAddAdminUserSending] = useState(false);

  const fetchAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(Array.isArray(data) ? data : []);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch {
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    fetchAuth();
  }, [fetchAuth]);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/visits", { credentials: "include" })
      .then((r) => r.ok ? r.json() : [])
      .then(setVisits)
      .catch(() => setVisits([]));
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/admin/partners", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setPartners)
      .catch(() => setPartners([]));
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/admin/profile-pictures", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : {}))
      .then(setProfilePictures)
      .catch(() => setProfilePictures({}));
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/admin/users", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setAdminUsers)
      .catch(() => setAdminUsers([]));
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((data) => {
        setIsLegacyAdmin(data.isLegacyAdmin === true);
        if (data.user) {
          setCurrentUser({
            displayName: data.user.displayName,
            email: data.user.email,
            pod: data.user.pod,
          });
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => { setCurrentUser(null); setIsLegacyAdmin(false); });
  }, [authenticated]);

  const webbtrafikData = useWebbtrafikData(visits, submissions.length);

  const adminUser = (currentUser?.pod ?? "leon") as AdminUser;
  const loggedInAsLabel = currentUser
    ? (currentUser.displayName || currentUser.email)
    : "Admin";

  const saveProfilePicture = useCallback(async (userId: AdminUser, imageUrl: string) => {
    const res = await fetch("/api/admin/profile-pictures", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, imageUrl }),
    });
    if (res.ok) {
      const data = await res.json();
      setProfilePictures(data);
      setEditingProfilePicture(null);
      setProfilePictureDraft("");
    }
  }, []);

  const scoreboardStats = useMemo(() => {
    const pods: AdminUser[] = ["leon", "vincent", "wilmer"];
    const stats = pods.map((podId) => {
      const podSubs = submissions.filter((s) => (s.pod ?? "unassigned") === podId);
      const called = podSubs.filter((s) => (s.stage ?? "leads") === "called").length;
      const ringSenare = podSubs.filter((s) => (s.stage ?? "leads") === "ring_senare").length;
      const bookedMeeting = podSubs.filter((s) => (s.stage ?? "leads") === "booked_meeting").length;
      const telefonsamtal = called + ringSenare + bookedMeeting;
      const bokningsrate = telefonsamtal > 0 ? (bookedMeeting / telefonsamtal) * 100 : 0;
      const label = ADMIN_USER_LABELS.find((u) => u.id === podId)?.label ?? podId;
      const forecastLon = 35000 + bookedMeeting * 800;
      return {
        podId,
        label,
        telefonsamtal,
        bookedMeeting,
        bokningsrate,
        forecastLon,
      };
    });
    const ranked = [...stats].sort(
      (a, b) => b.bookedMeeting - a.bookedMeeting || b.telefonsamtal - a.telefonsamtal
    );
    return { stats, ranked };
  }, [submissions]);

  const refreshPartners = useCallback(() => {
    fetch("/api/admin/partners", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setPartners)
      .catch(() => setPartners([]));
  }, []);

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerError("");
    setPartnerSending(true);
    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyName: newPartner.companyName.trim(),
          email: newPartner.email.trim(),
          contactName: newPartner.contactName.trim(),
          contactPhone: newPartner.contactPhone.trim(),
          logoUrl: newPartner.logoUrl.trim() || undefined,
          address: newPartner.address.trim(),
          avtalDeals: newPartner.avtalDeals.trim() || undefined,
          dealsPerLeads: newPartner.dealsPerLeads.trim() || undefined,
          notes: newPartner.notes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPartnerError(data.error || "Kunde inte skapa partner");
        return;
      }
      setNewPartner({
        companyName: "",
        email: "",
        contactName: "",
        contactPhone: "",
        logoUrl: "",
        address: "",
        avtalDeals: "",
        dealsPerLeads: "",
        notes: "",
      });
      setShowAddPartner(false);
      refreshPartners();
    } finally {
      setPartnerSending(false);
    }
  };

  const handleUpdatePartner = async (id: string, data: Partial<Partner>) => {
    const res = await fetch(`/api/admin/partners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditingPartnerId(null);
      refreshPartners();
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm("Ta bort denna partner?")) return;
    const res = await fetch(`/api/admin/partners/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setEditingPartnerId(null);
      refreshPartners();
    }
  };

  const handleAddAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAdminUserError("");
    setAddAdminUserSending(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: newAdminUser.username.trim(),
          email: newAdminUser.email.trim(),
          password: newAdminUser.password,
          displayName: newAdminUser.displayName.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddAdminUserError(data.error || "Kunde inte skapa användare");
        return;
      }
      setAdminUsers((prev) => [
        ...prev,
        {
          id: data.id,
          createdAt: data.createdAt,
          username: data.username,
          email: data.email,
          displayName: data.displayName,
        },
      ]);
      setNewAdminUser({ username: "", email: "", password: "", displayName: "" });
      setShowAddAdminUser(false);
    } finally {
      setAddAdminUserSending(false);
    }
  };

  const handleDeleteAdminUser = async (id: string) => {
    if (!confirm("Ta bort denna användare? De kan inte logga in längre.")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Kunde inte ta bort användaren.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(
        usernameOrEmail.trim()
          ? { usernameOrEmail: usernameOrEmail.trim(), password }
          : { password }
      ),
    });
    const data = await res.json();
    if (data.ok) {
      setAuthenticated(true);
      fetch("/api/submissions", { credentials: "include" })
        .then((r) => r.json())
        .then(setSubmissions);
      fetch("/api/visits", { credentials: "include" })
        .then((r) => r.json())
        .then(setVisits);
    } else {
      setLoginError(data.error || "Inloggning misslyckades");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setAuthenticated(false);
  };

  const saveNote = async (id: string) => {
    await fetch(`/api/submissions/${id}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ notes: notesDraft }),
    });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, notes: notesDraft } : s))
    );
    setEditingNotesId(null);
    setNotesDraft("");
  };

  const appendNote = async (id: string, newText: string) => {
    const s = submissions.find((x) => x.id === id);
    if (!s) return;
    const updated = (s.notes ?? "").trim() ? `${s.notes}\n${newText}` : newText;
    const res = await fetch(`/api/submissions/${id}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ notes: updated }),
    });
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, notes: updated } : sub))
      );
    }
  };

  const registerCallOutcome = async (
    s: Submission,
    outcome: CallStatus
  ) => {
    setCallOutcomeForId(null);
    const res = await fetch(`/api/submissions/${s.id}/call-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ callStatus: outcome }),
    });
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === s.id ? { ...sub, callStatus: outcome } : sub))
      );
    }
    if (outcome === "bokat_mote") {
      await updateStage(s.id, "booked_meeting");
      return;
    }
    if (outcome === "nej_tack") {
      await updateStage(s.id, "nej_tack");
      await appendNote(s.id, "Ringt - Nej tack");
      return;
    }
    if (outcome === "specialmarkerad") {
      await updateStage(s.id, "specialmarkerad");
      return;
    }
    if (outcome === "ring_senare") {
      await updateStage(s.id, "ring_senare");
      setNotesDraft((s.notes ?? "").trim() ? `${s.notes}\nRing senare: ` : "Ring senare: ");
      setEditingNotesId(s.id);
      return;
    }
    if (outcome === "ej_svar") {
      await appendNote(s.id, "Ringt - ej svar");
    }
  };

  const updateStage = async (id: string, stage: string) => {
    const res = await fetch(`/api/submissions/${id}/stage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ stage }),
    });
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, stage } : s))
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverKey(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string, podId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverKey(`${podId}:${stageId}`);
  };

  const handleDragLeave = () => {
    setDragOverKey(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverKey(null);
    const id = e.dataTransfer.getData("text/plain");
    if (id) updateStage(id, stageId);
    setDraggingId(null);
  };

  const updatePod = async (id: string, pod: string) => {
    const res = await fetch(`/api/submissions/${id}/pod`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pod }),
    });
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, pod } : s))
      );
    }
  };

  const addTestLead = async () => {
    const res = await fetch("/api/admin/test-lead", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      const newLead = await res.json();
      setSubmissions((prev) => [newLead, ...prev]);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddCustomerError("");
    setAddCustomerSending(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...newCustomer, pod: adminUser, customerType: "privat" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddCustomerError(data.error || "Kunde inte lägga till kund");
        return;
      }
      setSubmissions((prev) => [
        {
          ...data,
          stage: data.stage ?? "leads",
          pod: data.pod ?? adminUser,
        },
        ...prev,
      ]);
      setNewCustomer({ firstName: "", lastName: "", email: "", phone: "", address: "" });
      setShowAddCustomer(false);
    } catch {
      setAddCustomerError("Något gick fel");
    } finally {
      setAddCustomerSending(false);
    }
  };

  const handleAddForetagCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddForetagCustomerError("");
    setAddForetagCustomerSending(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...newForetagCustomer,
          pod: adminUser,
          customerType: "foretag",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddForetagCustomerError(data.error || "Kunde inte lägga till kund");
        return;
      }
      setSubmissions((prev) => [
        {
          ...data,
          stage: data.stage ?? "leads",
          pod: data.pod ?? adminUser,
          customerType: "foretag",
        },
        ...prev,
      ]);
      setNewForetagCustomer({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
      });
      setShowAddForetagCustomer(false);
    } catch {
      setAddForetagCustomerError("Något gick fel");
    } finally {
      setAddForetagCustomerSending(false);
    }
  };

  const stageForPipeline = (stage: string | undefined) => {
    const s = stage ?? "leads";
    if (s === "offert_sent" || s === "called") return "ring_senare";
    if (s === "deal_done") return "nej_tack";
    return s;
  };
  const getSubmissionsByStageForPod = (list: Submission[], podId: string) =>
    PIPELINE_STAGES.map((stage) => ({
      ...stage,
      items: list.filter(
        (s) => (s.pod ?? "unassigned") === podId && stageForPipeline(s.stage) === stage.id
      ),
    }));

  const privatSubmissions = useMemo(
    () => submissions.filter((s) => (s.customerType ?? "privat") === "privat"),
    [submissions]
  );
  const foretagSubmissions = useMemo(
    () => submissions.filter((s) => s.customerType === "foretag"),
    [submissions]
  );

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-zinc-400">Laddar…</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <form
          onSubmit={handleLogin}
          className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 p-8 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold text-white mb-2">Nexo Group Admin</h1>
          <p className="text-sm text-zinc-400 mb-4">
            Enkel inloggning: skriv bara adminlösenord nedan (lämna e-post tomt).
          </p>
          <p className="text-xs text-zinc-500 mb-4">
            Eller logga in som användare med e-post och lösenord.
          </p>
          <input
            type="text"
            inputMode="email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="E-post eller användarnamn (tomt = admin-inloggning)"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 mb-3 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Lösenord (admin: nexosol om ej annat satt)"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 mb-4 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          {loginError && (
            <p className="text-sm text-red-400 mb-4">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-white text-black font-semibold py-3 hover:bg-zinc-200 transition-colors"
          >
            Logga in
          </button>
        </form>
      </div>
    );
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("sv-SE", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidomeny */}
      <aside className="w-64 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col min-h-screen">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-white shrink-0" />
            <h1 className="text-base font-bold text-white">Nexo Group Admin</h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1 ml-8">powered by Rovena Solutions</p>
        </div>
        <div className="p-4 border-b border-zinc-800">
          <p className="text-sm text-white font-medium">{getGreeting()}, {loggedInAsLabel}</p>
          <p className="text-xs text-zinc-500 mt-1">Inloggad som</p>
          <p className="mt-1 text-sm font-medium text-white truncate">{loggedInAsLabel}</p>
        </div>
        <nav className="p-2 flex-1">
          {SIDEMENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = adminSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAdminSection(item.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-zinc-800 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Till hemsidan
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Logga ut
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {adminSection === "privatkunder" && (
            <>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{submissions.length}</p>
              <p className="text-sm text-zinc-400">Kalkylator / offertförfrågningar</p>
            </div>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{visits.length}</p>
              <p className="text-sm text-zinc-400">Besökare (hemsidan)</p>
            </div>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Senaste besök</p>
              <p className="text-xs text-zinc-400">
                {visits.length
                  ? formatDate(visits[visits.length - 1].createdAt)
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Poddar: en pipeline per pod */}
        <section className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Poddar & pipeline
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddCustomer((v) => !v)}
                className="rounded-xl bg-white text-black font-medium px-4 py-2 text-sm hover:bg-zinc-200 transition-colors"
              >
                + Lägg till kund
              </button>
              <button
                type="button"
                onClick={addTestLead}
                className="rounded-xl border border-zinc-600 text-white font-medium px-4 py-2 text-sm hover:bg-zinc-800 transition-colors"
              >
                + Testkund
              </button>
            </div>
          </div>

          {showAddCustomer && (
            <form
              onSubmit={handleAddCustomer}
              className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-700"
            >
              <h3 className="text-sm font-semibold text-white mb-3">Ny kund (manuellt)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <input
                  type="text"
                  value={newCustomer.firstName}
                  onChange={(e) =>
                    setNewCustomer((c) => ({ ...c, firstName: e.target.value }))
                  }
                  placeholder="Förnamn"
                  className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
                <input
                  type="text"
                  value={newCustomer.lastName}
                  onChange={(e) =>
                    setNewCustomer((c) => ({ ...c, lastName: e.target.value }))
                  }
                  placeholder="Efternamn"
                  className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer((c) => ({ ...c, email: e.target.value }))
                  }
                  placeholder="E-post *"
                  className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer((c) => ({ ...c, phone: e.target.value }))
                  }
                  placeholder="Telefon"
                  className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
                <input
                  type="text"
                  required
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer((c) => ({ ...c, address: e.target.value }))
                  }
                  placeholder="Adress *"
                  className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
              {addCustomerError && (
                <p className="mt-2 text-sm text-red-400">{addCustomerError}</p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={addCustomerSending}
                  className="rounded-lg bg-white text-black font-medium px-4 py-2 text-sm hover:bg-zinc-200 disabled:opacity-60"
                >
                  {addCustomerSending ? "Sparar…" : "Spara kund"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCustomer(false);
                    setAddCustomerError("");
                  }}
                  className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  Avbryt
                </button>
              </div>
            </form>
          )}

          {PODS.filter((pod) => pod.id !== "unassigned" && pod.id === adminUser).map((pod) => {
            const submissionsByStage = getSubmissionsByStageForPod(privatSubmissions, pod.id);
            return (
              <div key={pod.id} className="mb-10">
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  Min pipeline ({pod.label})
                  <span className="text-xs font-normal text-zinc-400">
                    ({privatSubmissions.filter((s) => (s.pod ?? "unassigned") === pod.id).length} kunder)
                  </span>
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 min-h-[75vh]">
                  {submissionsByStage.map((col) => {
                    const dropKey = `${pod.id}:${col.id}`;
                    return (
                      <div
                        key={col.id}
                        onDragOver={(e) => handleDragOver(e, col.id, pod.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, col.id)}
                        className={`flex-shrink-0 w-[200px] sm:w-[240px] rounded-xl border-2 border-dashed transition-colors ${
                          dragOverKey === dropKey
                            ? "border-white bg-zinc-800"
                            : "border-zinc-700 bg-zinc-900/80"
                        }`}
                      >
                        <div className="p-2.5 border-b border-zinc-700 bg-zinc-800/80 rounded-t-xl">
                          <span className="font-semibold text-white text-xs">
                            {col.label}
                          </span>
                          <span className="ml-1.5 text-xs text-zinc-400">
                            ({col.items.length})
                          </span>
                        </div>
                        <div className="p-2 space-y-2 overflow-y-auto min-h-[70vh] max-h-[80vh]">
                          {col.items.map((s) => (
                            <div
                              key={s.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, s.id)}
                              onDragEnd={handleDragEnd}
                              className={`bg-zinc-800 rounded-lg border border-zinc-700 p-2.5 cursor-grab active:cursor-grabbing ${
                                draggingId === s.id ? "opacity-60" : ""
                              }`}
                            >
                              {s.callStatus && (
                                <div className="mb-2">
                                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Status
                                  </p>
                                  <p
                                    className={`text-base font-bold ${
                                      s.callStatus === "nej_tack"
                                        ? "text-red-400"
                                        : s.callStatus === "bokat_mote"
                                          ? "text-emerald-400"
                                          : s.callStatus === "specialmarkerad"
                                            ? "text-violet-400"
                                            : s.callStatus === "ej_svar"
                                              ? "text-zinc-400"
                                              : "text-amber-400"
                                    }`}
                                  >
                                    {s.callStatus === "nej_tack"
                                      ? "Nej tack"
                                      : s.callStatus === "bokat_mote"
                                        ? "Bokat möte"
                                        : s.callStatus === "specialmarkerad"
                                          ? "Specialmarkerad"
                                          : s.callStatus === "ej_svar"
                                            ? "Ej svar"
                                            : "Ring tillbaka senare"}
                                  </p>
                                </div>
                              )}
                              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                                Kund
                              </p>
                              <p className="text-white text-sm font-medium truncate">
                                {[s.firstName, s.lastName].filter(Boolean).join(" ") || "—"}
                              </p>
                              <p className="text-xs text-zinc-400 truncate mt-0.5">
                                {s.email || "—"}
                              </p>
                              <p className="text-xs text-zinc-400 truncate">
                                {s.phone || "—"}
                              </p>
                              <p className="text-xs text-zinc-400 truncate mt-0.5">
                                {s.address || "—"}
                              </p>
                              <p className="text-xs text-zinc-500 mt-1.5">
                                {s.roofAreaM2} m² · ROI {s.estimatedRoiYears} år
                              </p>
                              <div className="mt-2 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="w-full inline-flex items-center justify-center gap-1 rounded border border-zinc-600 bg-zinc-700 px-2 py-1.5 text-xs text-white hover:bg-zinc-600 transition-colors"
                                  onClick={() => setCallOutcomeForId(callOutcomeForId === s.id ? null : s.id)}
                                >
                                  <Phone className="w-3 h-3 shrink-0" />
                                  Ring samtal
                                </button>
                                {callOutcomeForId === s.id && (
                                  <div className="rounded border border-zinc-600 bg-zinc-900 p-1.5 space-y-1">
                                    <p className="text-xs text-zinc-500 px-1">Registrera utfall:</p>
                                    <button
                                      type="button"
                                      className="block w-full text-left rounded px-2 py-1.5 text-xs text-white hover:bg-zinc-700"
                                      onClick={() => registerCallOutcome(s, "ej_svar")}
                                    >
                                      Ej svar
                                    </button>
                                    <button
                                      type="button"
                                      className="block w-full text-left rounded px-2 py-1.5 text-xs text-white hover:bg-zinc-700"
                                      onClick={() => registerCallOutcome(s, "nej_tack")}
                                    >
                                      Nej tack
                                    </button>
                                    <button
                                      type="button"
                                      className="block w-full text-left rounded px-2 py-1.5 text-xs text-emerald-300 hover:bg-zinc-700"
                                      onClick={() => registerCallOutcome(s, "bokat_mote")}
                                    >
                                      Bokat möte
                                    </button>
                                    <button
                                      type="button"
                                      className="block w-full text-left rounded px-2 py-1.5 text-xs text-white hover:bg-zinc-700"
                                      onClick={() => registerCallOutcome(s, "ring_senare")}
                                    >
                                      Ring senare (skriv i anteckningar)
                                    </button>
                                    <button
                                      type="button"
                                      className="block w-full text-left rounded px-2 py-1.5 text-xs text-violet-300 hover:bg-zinc-700"
                                      onClick={() => registerCallOutcome(s, "specialmarkerad")}
                                    >
                                      Specialmarkera
                                    </button>
                                  </div>
                                )}
                              </div>
                              {s.email && (
                                <div className="mt-2 flex gap-1.5">
                                  <button
                                    type="button"
                                    className="flex-1 inline-flex items-center justify-center gap-1 rounded border border-zinc-600 bg-zinc-700 px-2 py-1.5 text-xs text-white hover:bg-zinc-600 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOfferCustomer(s);
                                      setOfferStep("template");
                                      setSelectedOfferTemplateId(null);
                                    }}
                                  >
                                    <Send className="w-3 h-3 shrink-0" />
                                    Skicka offert
                                  </button>
                                  <button
                                    type="button"
                                    className="flex-1 inline-flex items-center justify-center gap-1 rounded border border-zinc-600 bg-zinc-700 px-2 py-1.5 text-xs text-white hover:bg-zinc-600 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMailCustomer(s);
                                      setMailStep("template");
                                      setSelectedMailTemplateId(null);
                                    }}
                                  >
                                    <Mail className="w-3 h-3 shrink-0" />
                                    Skicka mail
                                  </button>
                                </div>
                              )}
                              {isLegacyAdmin && (
                                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                                  <label className="block text-xs text-zinc-500 mb-0.5">Ansvarig</label>
                                  <select
                                    value={s.pod ?? "unassigned"}
                                    onChange={(e) => updatePod(s.id, e.target.value)}
                                    className="w-full rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-500"
                                  >
                                    {PODS.map((p) => (
                                      <option key={p.id} value={p.id}>
                                        {p.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              <div className="mt-2 pt-2 border-t border-zinc-700">
                                {editingNotesId === s.id ? (
                                  <div className="space-y-1">
                                    <input
                                      type="text"
                                      value={notesDraft}
                                      onChange={(e) => setNotesDraft(e.target.value)}
                                      placeholder="Anteckning"
                                      className="w-full rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                                    />
                                    <div className="flex gap-1">
                                      <button
                                        type="button"
                                        onClick={() => saveNote(s.id)}
                                        className="rounded bg-white text-black px-2 py-1 text-xs hover:bg-zinc-200"
                                      >
                                        Spara
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingNotesId(null);
                                          setNotesDraft("");
                                        }}
                                        className="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                                      >
                                        Avbryt
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <StickyNote className="w-3 h-3 text-zinc-500 shrink-0" />
                                    <span className="text-xs text-zinc-400 truncate flex-1">
                                      {s.notes || "Ingen anteckning"}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNotesId(s.id);
                                        setNotesDraft(s.notes ?? "");
                                      }}
                                      className="text-xs text-white hover:underline shrink-0"
                                    >
                                      {s.notes ? "Redigera" : "Lägg till"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
            </>
          )}

          {adminSection === "foretagskunder" && (
            <section className="space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Företagskunder
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddForetagCustomer((v) => !v)}
                  className="rounded-xl bg-white text-black font-medium px-4 py-2 text-sm hover:bg-zinc-200 transition-colors"
                >
                  + Lägg till företagskund
                </button>
              </div>

              {showAddForetagCustomer && (
                <form
                  onSubmit={handleAddForetagCustomer}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
                >
                  <h3 className="text-sm font-semibold text-white mb-3">Ny företagskund</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <input
                      type="text"
                      value={newForetagCustomer.firstName}
                      onChange={(e) => setNewForetagCustomer((c) => ({ ...c, firstName: e.target.value }))}
                      placeholder="Förnamn"
                      className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                    />
                    <input
                      type="text"
                      value={newForetagCustomer.lastName}
                      onChange={(e) => setNewForetagCustomer((c) => ({ ...c, lastName: e.target.value }))}
                      placeholder="Efternamn"
                      className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                    />
                    <input
                      type="email"
                      value={newForetagCustomer.email}
                      onChange={(e) => setNewForetagCustomer((c) => ({ ...c, email: e.target.value }))}
                      placeholder="E-post *"
                      className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                      required
                    />
                    <input
                      type="tel"
                      value={newForetagCustomer.phone}
                      onChange={(e) => setNewForetagCustomer((c) => ({ ...c, phone: e.target.value }))}
                      placeholder="Telefon"
                      className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                    />
                    <input
                      type="text"
                      value={newForetagCustomer.address}
                      onChange={(e) => setNewForetagCustomer((c) => ({ ...c, address: e.target.value }))}
                      placeholder="Adress *"
                      className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 sm:col-span-2 lg:col-span-1"
                      required
                    />
                  </div>
                  {addForetagCustomerError && <p className="mt-2 text-sm text-red-400">{addForetagCustomerError}</p>}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="submit"
                      disabled={addForetagCustomerSending}
                      className="rounded-lg bg-white text-black font-medium px-4 py-2 text-sm hover:bg-zinc-200 disabled:opacity-60"
                    >
                      {addForetagCustomerSending ? "Sparar…" : "Spara företagskund"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddForetagCustomer(false); setAddForetagCustomerError(""); }}
                      className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                    >
                      Avbryt
                    </button>
                  </div>
                </form>
              )}

              {PODS.filter((pod) => pod.id !== "unassigned" && pod.id === adminUser).map((pod) => {
                const submissionsByStage = getSubmissionsByStageForPod(foretagSubmissions, pod.id);
                return (
                  <div key={`f-${pod.id}`} className="mb-10">
                    <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                      Min pipeline – Företag ({pod.label})
                      <span className="text-xs font-normal text-zinc-400">
                        ({foretagSubmissions.filter((s) => (s.pod ?? "unassigned") === pod.id).length} kunder)
                      </span>
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 min-h-[75vh]">
                      {submissionsByStage.map((col) => {
                        const dropKey = `${pod.id}:${col.id}`;
                        return (
                          <div
                            key={col.id}
                            onDragOver={(e) => handleDragOver(e, col.id, pod.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, col.id)}
                            className={`flex-shrink-0 w-[200px] sm:w-[240px] rounded-xl border-2 border-dashed transition-colors ${
                              dragOverKey === dropKey ? "border-white bg-zinc-800" : "border-zinc-700 bg-zinc-900/80"
                            }`}
                          >
                            <div className="p-2.5 border-b border-zinc-700 bg-zinc-800/80 rounded-t-xl">
                              <span className="font-semibold text-white text-xs">{col.label}</span>
                              <span className="ml-1.5 text-xs text-zinc-400">({col.items.length})</span>
                            </div>
                            <div className="p-2 space-y-2 overflow-y-auto min-h-[70vh] max-h-[80vh]">
                              {col.items.map((s) => (
                                <div
                                  key={s.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, s.id)}
                                  onDragEnd={handleDragEnd}
                                  className={`bg-zinc-800 rounded-lg border border-zinc-700 p-2.5 cursor-grab active:cursor-grabbing ${
                                    draggingId === s.id ? "opacity-60" : ""
                                  }`}
                                >
                                  {s.callStatus && (
                                    <div className="mb-2">
                                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Status</p>
                                      <p className={`text-base font-bold ${
                                        s.callStatus === "nej_tack" ? "text-red-400" :
                                        s.callStatus === "bokat_mote" ? "text-emerald-400" :
                                        s.callStatus === "specialmarkerad" ? "text-violet-400" :
                                        s.callStatus === "ej_svar" ? "text-zinc-400" : "text-amber-400"
                                      }`}>
                                        {s.callStatus === "nej_tack" ? "Nej tack" : s.callStatus === "bokat_mote" ? "Bokat möte" : s.callStatus === "specialmarkerad" ? "Specialmarkerad" : s.callStatus === "ej_svar" ? "Ej svar" : "Ring tillbaka senare"}
                                      </p>
                                    </div>
                                  )}
                                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Företag</p>
                                  <p className="text-white text-sm font-medium truncate">{[s.firstName, s.lastName].filter(Boolean).join(" ") || "—"}</p>
                                  <p className="text-xs text-zinc-400 truncate mt-0.5">{s.email || "—"}</p>
                                  <p className="text-xs text-zinc-400 truncate">{s.phone || "—"}</p>
                                  <p className="text-xs text-zinc-400 truncate mt-0.5">{s.address || "—"}</p>
                                  <div className="mt-2 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      className="w-full inline-flex items-center justify-center gap-1 rounded border border-zinc-600 bg-zinc-700 px-2 py-1.5 text-xs text-white hover:bg-zinc-600"
                                      onClick={() => setCallOutcomeForId(callOutcomeForId === s.id ? null : s.id)}
                                    >
                                      <Phone className="w-3 h-3 shrink-0" /> Ring samtal
                                    </button>
                                    {callOutcomeForId === s.id && (
                                      <div className="rounded border border-zinc-600 bg-zinc-900 p-1.5 space-y-1">
                                        <p className="text-xs text-zinc-500 px-1">Registrera utfall:</p>
                                        <button type="button" className="block w-full text-left rounded px-2 py-1.5 text-xs text-white hover:bg-zinc-700" onClick={() => registerCallOutcome(s, "ej_svar")}>Ej svar</button>
                                        <button type="button" className="block w-full text-left rounded px-2 py-1.5 text-xs text-white hover:bg-zinc-700" onClick={() => registerCallOutcome(s, "nej_tack")}>Nej tack</button>
                                        <button type="button" className="block w-full text-left rounded px-2 py-1.5 text-xs text-emerald-300 hover:bg-zinc-700" onClick={() => registerCallOutcome(s, "bokat_mote")}>Bokat möte</button>
                                        <button type="button" className="block w-full text-left rounded px-2 py-1.5 text-xs text-white hover:bg-zinc-700" onClick={() => registerCallOutcome(s, "ring_senare")}>Ring senare (skriv i anteckningar)</button>
                                        <button type="button" className="block w-full text-left rounded px-2 py-1.5 text-xs text-violet-300 hover:bg-zinc-700" onClick={() => registerCallOutcome(s, "specialmarkerad")}>Specialmarkera</button>
                                      </div>
                                    )}
                                  </div>
                                  {s.email && (
                                    <div className="mt-2 flex gap-1.5">
                                      <button type="button" className="flex-1 inline-flex items-center justify-center gap-1 rounded border border-zinc-600 bg-zinc-700 px-2 py-1.5 text-xs text-white hover:bg-zinc-600" onClick={(e) => { e.stopPropagation(); setOfferCustomer(s); setOfferStep("template"); setSelectedOfferTemplateId(null); }}><Send className="w-3 h-3 shrink-0" /> Skicka offert</button>
                                      <button type="button" className="flex-1 inline-flex items-center justify-center gap-1 rounded border border-zinc-600 bg-zinc-700 px-2 py-1.5 text-xs text-white hover:bg-zinc-600" onClick={(e) => { e.stopPropagation(); setMailCustomer(s); setMailStep("template"); setSelectedMailTemplateId(null); }}><Mail className="w-3 h-3 shrink-0" /> Skicka mail</button>
                                    </div>
                                  )}
                                  {isLegacyAdmin && (
                                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                                      <label className="block text-xs text-zinc-500 mb-0.5">Ansvarig</label>
                                      <select value={s.pod ?? "unassigned"} onChange={(e) => updatePod(s.id, e.target.value)} className="w-full rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-500">
                                        {PODS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                                      </select>
                                    </div>
                                  )}
                                  <div className="mt-2 pt-2 border-t border-zinc-700">
                                    {editingNotesId === s.id ? (
                                      <div className="space-y-1">
                                        <input type="text" value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} placeholder="Anteckning" className="w-full rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-xs text-white placeholder:text-zinc-500" />
                                        <div className="flex gap-1">
                                          <button type="button" onClick={() => saveNote(s.id)} className="rounded bg-white text-black px-2 py-1 text-xs hover:bg-zinc-200">Spara</button>
                                          <button type="button" onClick={() => { setEditingNotesId(null); setNotesDraft(""); }} className="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700">Avbryt</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <StickyNote className="w-3 h-3 text-zinc-500 shrink-0" />
                                        <span className="text-xs text-zinc-400 truncate flex-1">{s.notes || "Ingen anteckning"}</span>
                                        <button type="button" onClick={() => { setEditingNotesId(s.id); setNotesDraft(s.notes ?? ""); }} className="text-xs text-white hover:underline shrink-0">{s.notes ? "Redigera" : "Lägg till"}</button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {adminSection === "partners" && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Handshake className="w-5 h-5" />
                  Pipeline partners
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddPartner((v) => !v)}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  <Plus className="w-4 h-4" />
                  Lägg till partner
                </button>
              </div>

              {showAddPartner && (
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                  <h3 className="text-sm font-medium text-white mb-4">Ny partner</h3>
                  <form onSubmit={handleAddPartner} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Företagsnamn *</label>
                      <input
                        value={newPartner.companyName}
                        onChange={(e) => setNewPartner((p) => ({ ...p, companyName: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">E-post *</label>
                      <input
                        type="email"
                        value={newPartner.email}
                        onChange={(e) => setNewPartner((p) => ({ ...p, email: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Kontaktperson (namn)</label>
                      <input
                        value={newPartner.contactName}
                        onChange={(e) => setNewPartner((p) => ({ ...p, contactName: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Kontaktperson (telefon)</label>
                      <input
                        value={newPartner.contactPhone}
                        onChange={(e) => setNewPartner((p) => ({ ...p, contactPhone: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-zinc-400">Logotyp (URL)</label>
                      <input
                        value={newPartner.logoUrl}
                        onChange={(e) => setNewPartner((p) => ({ ...p, logoUrl: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-zinc-400">Adress</label>
                      <input
                        value={newPartner.address}
                        onChange={(e) => setNewPartner((p) => ({ ...p, address: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Avtal / Deals</label>
                      <input
                        value={newPartner.avtalDeals}
                        onChange={(e) => setNewPartner((p) => ({ ...p, avtalDeals: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Deals per leads</label>
                      <input
                        value={newPartner.dealsPerLeads}
                        onChange={(e) => setNewPartner((p) => ({ ...p, dealsPerLeads: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-zinc-400">Anteckningar</label>
                      <textarea
                        value={newPartner.notes}
                        onChange={(e) => setNewPartner((p) => ({ ...p, notes: e.target.value }))}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                        rows={2}
                      />
                    </div>
                    <div className="sm:col-span-2 flex gap-2">
                      <button
                        type="submit"
                        disabled={partnerSending}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                      >
                        {partnerSending ? "Sparar..." : "Spara partner"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddPartner(false)}
                        className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                      >
                        Avbryt
                      </button>
                    </div>
                  </form>
                  {partnerError && <p className="mt-2 text-sm text-red-400">{partnerError}</p>}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {partners.map((p) => (
                  <div
                    key={p.id}
                    className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex flex-col"
                  >
                    {editingPartnerId === p.id ? (
                      <PartnerEditForm
                        partner={p}
                        onSave={(data) => handleUpdatePartner(p.id, data)}
                        onCancel={() => setEditingPartnerId(null)}
                      />
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            {p.logoUrl ? (
                              <img
                                src={p.logoUrl}
                                alt=""
                                className="h-10 w-10 shrink-0 rounded object-contain bg-zinc-800"
                              />
                            ) : (
                              <div className="h-10 w-10 shrink-0 rounded bg-zinc-800 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-zinc-500" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-white truncate">{p.companyName || "—"}</p>
                              <p className="text-sm text-zinc-400 truncate">{p.email || "—"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingPartnerId(p.id)}
                              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                              title="Redigera"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePartner(p.id)}
                              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400"
                              title="Ta bort"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-zinc-400">
                          {(p.contactName || p.contactPhone) && (
                            <p className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              {[p.contactName, p.contactPhone].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          {p.address && (
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              {p.address}
                            </p>
                          )}
                          {(p.avtalDeals ?? p.dealsPerLeads) && (
                            <p>
                              Avtal: {p.avtalDeals || "—"} · Deals/leads: {p.dealsPerLeads || "—"}
                            </p>
                          )}
                          {p.notes && (
                            <p className="text-zinc-500 line-clamp-2">{p.notes}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {partners.length === 0 && !showAddPartner && (
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center text-zinc-400">
                  <p>Inga partners ännu. Klicka på &quot;Lägg till partner&quot; för att lägga in en manuell partner.</p>
                </div>
              )}
            </section>
          )}

          {adminSection === "scoreboard" && (
            <section className="space-y-8">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">Scoreboard</h2>
              </div>
              <p className="text-sm text-zinc-400 max-w-xl">
                Rangordning efter telefonsamtal och bokade möten. Bokningsrate = bokade möten / antal samtal. Forecast baserat på möten och affärer.
              </p>

              {/* Podium: vänster 2:a, mitten 1:a, höger 3:a */}
              <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-2xl mx-auto">
                {[
                  { rankIdx: 1, place: 2 },
                  { rankIdx: 0, place: 1 },
                  { rankIdx: 2, place: 3 },
                ].map(({ rankIdx, place }) => {
                  const r = scoreboardStats.ranked[rankIdx];
                  if (!r) return null;
                  const isFirst = place === 1;
                  const height = isFirst ? "h-52" : place === 2 ? "h-40" : "h-36";
                  const medal = place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
                  const bg = isFirst ? "bg-amber-500/20 border-amber-500/50" : "bg-zinc-800 border-zinc-600";
                  const imageUrl = profilePictures[r.podId as AdminUser];
                  const isEditing = editingProfilePicture === r.podId;
                  const draft = isEditing ? profilePictureDraft : (imageUrl ?? "");
                  return (
                    <div
                      key={r.podId}
                      className={`flex-1 rounded-t-xl border-2 ${bg} ${height} flex flex-col items-center justify-end pb-3 pt-2 min-w-0`}
                    >
                      <span className="text-lg text-zinc-500 font-bold mb-0.5">#{place}</span>
                      <span className="text-2xl mb-1" aria-hidden>{medal}</span>
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-zinc-600 bg-zinc-700 shrink-0 flex items-center justify-center mb-2">
                        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-zinc-400">
                          {r.label.charAt(0)}
                        </span>
                        {draft.trim() ? (
                          <img
                            src={draft}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : null}
                      </div>
                      {isEditing ? (
                        <div className="w-full px-2 space-y-1.5 mb-2">
                          <input
                            type="url"
                            value={profilePictureDraft}
                            onChange={(e) => setProfilePictureDraft(e.target.value)}
                            placeholder="Bild-URL"
                            className="w-full rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-xs text-white placeholder:text-zinc-500"
                          />
                          <div className="flex gap-1 justify-center">
                            <button
                              type="button"
                              onClick={() => saveProfilePicture(r.podId as AdminUser, profilePictureDraft)}
                              className="rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-500"
                            >
                              Spara
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingProfilePicture(null); setProfilePictureDraft(""); }}
                              className="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300"
                            >
                              Avbryt
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProfilePicture(r.podId as AdminUser);
                            setProfilePictureDraft(imageUrl ?? "");
                          }}
                          className="text-xs text-zinc-500 hover:text-white mb-1"
                        >
                          Ändra bild
                        </button>
                      )}
                      <span className="font-bold text-white text-sm sm:text-base truncate w-full text-center px-1">{r.label}</span>
                      <span className="text-2xl sm:text-3xl font-black text-white mt-1">{r.bookedMeeting}</span>
                      <span className="text-xs text-zinc-400">bokade möten</span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-800/50">
                      <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">#</th>
                      <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Säljare</th>
                      <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">
                        <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Telefonsamtal</span>
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">
                        <span className="inline-flex items-center gap-1"><CalendarCheck className="w-3.5 h-3.5" /> Bokade möten</span>
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Bokningsrate</th>
                      <th className="py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Forecast lön</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreboardStats.ranked.map((row, idx) => (
                      <tr key={row.podId} className="border-b border-zinc-800/80 hover:bg-zinc-800/30">
                        <td className="py-3 px-4 text-zinc-500 font-medium">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-white">{row.label}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-white">{row.telefonsamtal}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-amber-400">{row.bookedMeeting}</span>
                        </td>
                        <td className="py-3 px-4 text-center text-zinc-300">
                          {row.telefonsamtal > 0 ? `${row.bokningsrate.toFixed(0)} %` : "—"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-emerald-400">
                            {new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(row.forecastLon)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {adminSection === "webbtrafik" && (
            <section className="space-y-8">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5" />
                Webbtrafik
              </h2>
              <p className="text-sm text-zinc-500">
                Översikt baserad på besöksdata. Koppla Google Analytics för fullständig data.
              </p>

              {/* KPI-kort */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                  <div className="flex items-center gap-3">
                    <Users className="w-10 h-10 text-zinc-500" />
                    <div>
                      <p className="text-2xl font-bold text-white">{webbtrafikData.totalUsers}</p>
                      <p className="text-sm text-zinc-400">Besökare (total)</p>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-10 h-10 text-zinc-500" />
                    <div>
                      <p className="text-2xl font-bold text-white">{webbtrafikData.totalConversions}</p>
                      <p className="text-sm text-zinc-400">Konverteringar (offert)</p>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-10 h-10 text-zinc-500" />
                    <div>
                      <p className="text-2xl font-bold text-white">{webbtrafikData.conversionRate}%</p>
                      <p className="text-sm text-zinc-400">Konverteringsgrad</p>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-10 h-10 text-zinc-500" />
                    <div>
                      <p className="text-sm font-medium text-white">Senaste 7 dagar</p>
                      <p className="text-xs text-zinc-400">Användare per dag i grafen</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Användare över tid */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                <h3 className="text-base font-semibold text-white mb-4">Användare över tid</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={webbtrafikData.usersOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                      <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} />
                      <YAxis stroke="#a1a1aa" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Line type="monotone" dataKey="användare" stroke="#065a45" strokeWidth={2} dot={{ fill: "#065a45" }} name="Besökare" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trafikkällor */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Trafikkällor
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={webbtrafikData.trafficSources}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                          {webbtrafikData.trafficSources.map((_, i) => (
                            <Cell key={i} fill={webbtrafikData.trafficSources[i].fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px" }}
                          formatter={(value: unknown) => [typeof value === "number" ? value : 0, "Besök"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Enheter */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Enheter
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={webbtrafikData.devices}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                          {webbtrafikData.devices.map((_, i) => (
                            <Cell key={i} fill={webbtrafikData.devices[i].fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px" }}
                          formatter={(value: unknown) => [typeof value === "number" ? value : 0, "Besök"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Länder */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Länder
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={webbtrafikData.countries} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                        <XAxis type="number" stroke="#a1a1aa" fontSize={12} />
                        <YAxis type="category" dataKey="land" stroke="#a1a1aa" fontSize={12} width={70} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px" }}
                        />
                        <Bar dataKey="användare" fill="#065a45" name="Användare" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Städer */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Städer
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={webbtrafikData.cities} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                        <XAxis type="number" stroke="#a1a1aa" fontSize={12} />
                        <YAxis type="category" dataKey="stad" stroke="#a1a1aa" fontSize={12} width={70} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px" }}
                        />
                        <Bar dataKey="användare" fill="#0d7a5c" name="Användare" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Konverteringsstatistik + tabell senaste besök */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <h3 className="text-base font-semibold text-white p-4 border-b border-zinc-800">Senaste besök</h3>
                {visits.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400">Inga besök registrerade ännu.</div>
                ) : (
                  <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-800 sticky top-0">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-zinc-300">Tid</th>
                          <th className="text-left py-3 px-4 font-medium text-zinc-300">Sida</th>
                          <th className="text-left py-3 px-4 font-medium text-zinc-300 hidden sm:table-cell">User-Agent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {[...visits].reverse().slice(0, 100).map((v) => (
                          <tr key={v.id}>
                            <td className="py-2 px-4 text-zinc-300 whitespace-nowrap">{formatDate(v.createdAt)}</td>
                            <td className="py-2 px-4 text-zinc-400">{v.path ?? "/"}</td>
                            <td className="py-2 px-4 text-zinc-500 truncate max-w-[200px] hidden sm:table-cell">{v.userAgent ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {adminSection === "admin" && (
            <section className="space-y-8">
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-zinc-400" />
                <h2 className="text-lg font-semibold text-white">Admin</h2>
              </div>

              {/* Ej tilldelade leads */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <h3 className="text-base font-semibold text-white p-4 border-b border-zinc-800 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Ej tilldelade leads
                  <span className="text-sm font-normal text-zinc-400">
                    ({submissions.filter((s) => (s.pod ?? "unassigned") === "unassigned").length})
                  </span>
                </h3>
                {submissions.filter((s) => (s.pod ?? "unassigned") === "unassigned").length === 0 ? (
                  <div className="p-6 text-center text-zinc-500">Inga ej tilldelade leads just nu.</div>
                ) : (
                  <div className="overflow-x-auto max-h-72 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-800 sticky top-0">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-zinc-300">Namn</th>
                          <th className="text-left py-3 px-4 font-medium text-zinc-300">E-post</th>
                          <th className="text-left py-3 px-4 font-medium text-zinc-300">Telefon</th>
                          <th className="text-left py-3 px-4 font-medium text-zinc-300 hidden sm:table-cell">Adress</th>
                          {isLegacyAdmin && (
                            <th className="text-left py-3 px-4 font-medium text-zinc-300">Tilldela till</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {submissions
                          .filter((s) => (s.pod ?? "unassigned") === "unassigned")
                          .map((s) => (
                            <tr key={s.id}>
                              <td className="py-2 px-4 text-white">
                                {[s.firstName, s.lastName].filter(Boolean).join(" ") || "—"}
                              </td>
                              <td className="py-2 px-4 text-zinc-400">{s.email ?? "—"}</td>
                              <td className="py-2 px-4 text-zinc-400">{s.phone ?? "—"}</td>
                              <td className="py-2 px-4 text-zinc-500 truncate max-w-[200px] hidden sm:table-cell">{s.address ?? "—"}</td>
                              {isLegacyAdmin && (
                                <td className="py-2 px-4">
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      const pod = e.target.value as "leon" | "vincent" | "wilmer";
                                      if (!pod) return;
                                      updatePod(s.id, pod);
                                    }}
                                    className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-500"
                                  >
                                    <option value="">Välj användare</option>
                                    {PODS.filter((p) => p.id !== "unassigned").map((p) => (
                                      <option key={p.id} value={p.id}>{p.label}</option>
                                    ))}
                                  </select>
                                </td>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="text-xs text-zinc-500 p-4 border-t border-zinc-800">
                  {isLegacyAdmin
                    ? "Tilldela leads till en användare med menyn ovan. Endast admin kan tilldela."
                    : "Endast admin kan tilldela ej tilldelade leads till användare."}
                </p>
              </div>

              {/* Användare */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Användare
                  </h3>
                  {isLegacyAdmin ? (
                    <button
                      type="button"
                      onClick={() => setShowAddAdminUser((v) => !v)}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                    >
                      <UserPlus className="w-4 h-4" />
                      Registrera ny användare
                    </button>
                  ) : (
                    <p className="text-xs text-zinc-500">Endast admin kan lägga till eller ta bort användare.</p>
                  )}
                </div>

                {isLegacyAdmin && showAddAdminUser && (
                  <div className="p-4 border-b border-zinc-800 bg-zinc-800/30">
                    <h4 className="text-sm font-medium text-white mb-3">Ny användare</h4>
                    <form onSubmit={handleAddAdminUser} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        value={newAdminUser.username}
                        onChange={(e) => setNewAdminUser((p) => ({ ...p, username: e.target.value }))}
                        placeholder="Användarnamn"
                        className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white"
                        required
                      />
                      <input
                        type="email"
                        value={newAdminUser.email}
                        onChange={(e) => setNewAdminUser((p) => ({ ...p, email: e.target.value }))}
                        placeholder="E-post"
                        className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white"
                        required
                      />
                      <input
                        type="password"
                        value={newAdminUser.password}
                        onChange={(e) => setNewAdminUser((p) => ({ ...p, password: e.target.value }))}
                        placeholder="Lösenord (minst 6 tecken)"
                        className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white"
                        required
                        minLength={6}
                      />
                      <input
                        value={newAdminUser.displayName}
                        onChange={(e) => setNewAdminUser((p) => ({ ...p, displayName: e.target.value }))}
                        placeholder="Visningsnamn (valfritt)"
                        className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white"
                      />
                      <div className="sm:col-span-2 flex gap-2">
                        <button
                          type="submit"
                          disabled={addAdminUserSending}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                          {addAdminUserSending ? "Skapar…" : "Skapa användare"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddAdminUser(false)}
                          className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300"
                        >
                          Avbryt
                        </button>
                      </div>
                    </form>
                    {addAdminUserError && <p className="mt-2 text-sm text-red-400">{addAdminUserError}</p>}
                  </div>
                )}

                {adminUsers.length === 0 ? (
                  <div className="p-6 text-center text-zinc-500">
                    {isLegacyAdmin
                      ? "Inga användare registrerade. Lägg till en så kan de logga in med användarnamn/e-post och lösenord."
                      : "Inga användare att visa."}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-800">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-zinc-300">Användarnamn</th>
                          <th className="text-left py-3 px-4 font-medium text-zinc-300">E-post</th>
                          <th className="text-left py-3 px-4 font-medium text-zinc-300">Visningsnamn</th>
                          {isLegacyAdmin && <th className="text-right py-3 px-4 font-medium text-zinc-300">Åtgärd</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {adminUsers.map((u) => (
                          <tr key={u.id}>
                            <td className="py-2 px-4 text-white">{u.username}</td>
                            <td className="py-2 px-4 text-zinc-400">{u.email}</td>
                            <td className="py-2 px-4 text-zinc-400">{u.displayName ?? "—"}</td>
                            {isLegacyAdmin && (
                              <td className="py-2 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAdminUser(u.id)}
                                  className="rounded px-2 py-1 text-xs text-red-400 hover:bg-zinc-700"
                                >
                                  Ta bort
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Offert-modal: välj mall → förhandsgranska → skicka */}
      {offerCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => {
            setOfferCustomer(null);
            setOfferStep("template");
            setSelectedOfferTemplateId(null);
          }}
        >
          <div
            className={`bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl flex flex-col ${
              offerStep === "preview" ? "w-full max-w-5xl h-[92vh] max-h-[920px]" : "w-full max-w-2xl max-h-[90vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-700 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-white">
                {offerStep === "template" ? "Välj offertmall" : "Förhandsgranska offert"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setOfferCustomer(null);
                  setOfferStep("template");
                  setSelectedOfferTemplateId(null);
                }}
                className="text-zinc-400 hover:text-white text-2xl leading-none"
                aria-label="Stäng"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 min-h-0">
              {offerStep === "template" ? (
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400 mb-4">
                    Till: {[offerCustomer.firstName, offerCustomer.lastName].filter(Boolean).join(" ") || offerCustomer.email}
                  </p>
                  {OFFER_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedOfferTemplateId(t.id);
                        setOfferStep("preview");
                      }}
                      className="w-full text-left rounded-xl border border-zinc-600 bg-zinc-800 px-4 py-3 text-white hover:bg-zinc-700 transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              ) : selectedOfferTemplateId ? (
                (() => {
                  const t = OFFER_TEMPLATES.find((x) => x.id === selectedOfferTemplateId);
                  if (!t) return null;
                  const filledHtml = fillOfferTemplate(t.body, offerCustomer);
                  const plainBody = offerBodyToPlainText(filledHtml);
                  const mailtoHref = `mailto:${encodeURIComponent(offerCustomer.email)}?subject=${encodeURIComponent(t.title)}&body=${encodeURIComponent(plainBody)}`;
                  return (
                    <>
                      <style>{`
                        .offer-doc {
                          background: #fff;
                          color: #1a1a1a;
                          box-shadow: 0 4px 24px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1);
                          border-radius: 8px;
                          overflow: hidden;
                          min-height: 0;
                          display: flex;
                          flex-direction: column;
                        }
                        .offer-doc-inner {
                          padding: 48px 56px 56px;
                          font-size: 15px;
                          line-height: 1.55;
                          flex: 1;
                          overflow-y: auto;
                        }
                        .offer-header { margin-bottom: 8px; }
                        .offer-logo { font-size: 28px; font-weight: 700; color: #065a45; letter-spacing: -0.02em; }
                        .offer-tagline { font-size: 13px; color: #6b7280; margin-top: 2px; }
                        .offer-divider { border: none; border-top: 2px solid #065a45; margin: 20px 0 24px; }
                        .offer-meta { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
                        .offer-doc-title { font-size: 18px; font-weight: 700; color: #111; text-transform: uppercase; letter-spacing: 0.03em; }
                        .offer-date { font-size: 14px; color: #6b7280; }
                        .offer-to { background: #f8fafc; padding: 20px 24px; border-radius: 8px; margin-bottom: 28px; border-left: 4px solid #065a45; }
                        .offer-to-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 6px; }
                        .offer-to-name { font-weight: 600; font-size: 16px; color: #111; margin: 0 0 4px; }
                        .offer-to-address, .offer-to-contact { margin: 0; font-size: 14px; color: #374151; }
                        .offer-body { margin-bottom: 32px; }
                        .offer-body p { margin: 0 0 14px; }
                        .offer-section { margin: 20px 0; padding: 20px 0; border-top: 1px solid #e5e7eb; }
                        .offer-section-title { font-weight: 600; color: #374151; margin-bottom: 12px !important; font-size: 14px; text-transform: uppercase; letter-spacing: 0.03em; }
                        .offer-list { margin: 0; padding-left: 22px; }
                        .offer-list li { margin-bottom: 8px; }
                        .offer-footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
                        .offer-footer p { margin: 0 0 4px; font-size: 14px; color: #374151; }
                        .offer-signature { font-weight: 700; font-size: 16px; color: #065a45 !important; margin-top: 8px !important; }
                      `}</style>
                      <div className="offer-doc flex-1 min-h-[60vh] flex flex-col">
                        <div className="offer-doc-inner" dangerouslySetInnerHTML={{ __html: filledHtml }} />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 shrink-0">
                        <a
                          href={mailtoHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-white text-black font-medium px-4 py-2.5 text-sm hover:bg-zinc-200"
                        >
                          <Mail className="w-4 h-4" />
                          Skicka e-post med offert
                        </a>
                        <button
                          type="button"
                          onClick={() => setOfferStep("template")}
                          className="rounded-xl border border-zinc-600 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
                        >
                          Tillbaka till mallar
                        </button>
                      </div>
                    </>
                  );
                })()
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Mail-modal: välj mall → förhandsgranska → öppna e-post */}
      {mailCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => {
            setMailCustomer(null);
            setMailStep("template");
            setSelectedMailTemplateId(null);
          }}
        >
          <div
            className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl flex flex-col w-full max-w-2xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-700 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-white">
                {mailStep === "template" ? "Välj mailmall" : "Förhandsgranska e-post"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setMailCustomer(null);
                  setMailStep("template");
                  setSelectedMailTemplateId(null);
                }}
                className="text-zinc-400 hover:text-white text-2xl leading-none"
                aria-label="Stäng"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 min-h-0">
              {mailStep === "template" ? (
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400 mb-4">
                    Till: {[mailCustomer.firstName, mailCustomer.lastName].filter(Boolean).join(" ") || mailCustomer.email}
                  </p>
                  {EMAIL_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedMailTemplateId(t.id);
                        setMailStep("preview");
                      }}
                      className="w-full text-left rounded-xl border border-zinc-600 bg-zinc-800 px-4 py-3 text-white hover:bg-zinc-700 transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              ) : selectedMailTemplateId ? (
                (() => {
                  const t = EMAIL_TEMPLATES.find((x) => x.id === selectedMailTemplateId);
                  if (!t) return null;
                  const filledBody = fillEmailTemplate(t.body, mailCustomer);
                  const filledSubject = fillEmailTemplate(t.subject, mailCustomer);
                  const mailtoHref = `mailto:${encodeURIComponent(mailCustomer.email)}?subject=${encodeURIComponent(filledSubject)}&body=${encodeURIComponent(filledBody)}`;
                  return (
                    <>
                      <div className="space-y-3 rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Ämne</p>
                          <p className="text-white font-medium">{filledSubject}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Meddelande</p>
                          <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans">{filledBody}</pre>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 shrink-0">
                        <a
                          href={mailtoHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-white text-black font-medium px-4 py-2.5 text-sm hover:bg-zinc-200"
                        >
                          <Mail className="w-4 h-4" />
                          Öppna e-post
                        </a>
                        <button
                          type="button"
                          onClick={() => setMailStep("template")}
                          className="rounded-xl border border-zinc-600 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
                        >
                          Tillbaka till mallar
                        </button>
                      </div>
                    </>
                  );
                })()
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
