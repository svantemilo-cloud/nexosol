export type PipelineStage =
  | "leads"
  | "ring_senare"
  | "booked_meeting"
  | "specialmarkerad"
  | "nej_tack";

export type PodId = "unassigned" | "leon" | "vincent" | "wilmer";

export type CustomerType = "privat" | "foretag";

export type Submission = {
  id: string;
  createdAt: string; // ISO
  source: "calculator";
  customerType: CustomerType;
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
  stage: PipelineStage;
  pod: PodId;
  callStatus?: "ej_svar" | "nej_tack" | "bokat_mote" | "ring_senare" | "specialmarkerad";
};

export type Visit = {
  id: string;
  createdAt: string;
  path?: string;
  userAgent?: string;
};

export type Partner = {
  id: string;
  createdAt: string;
  companyName: string;
  email: string;
  contactName: string;
  contactPhone: string;
  logoUrl?: string;
  address: string;
  avtalDeals?: string;
  dealsPerLeads?: string;
  notes?: string;
};

export type AdminUserId = "leon" | "vincent" | "wilmer";

export type AdminUserRecord = {
  id: string;
  createdAt: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string;
  pod?: AdminUserId;
};

declare global {
  var __submissions: Submission[] | undefined;
  var __visits: Visit[] | undefined;
  var __partners: Partner[] | undefined;
  var __profilePictures: Partial<Record<AdminUserId, string>> | undefined;
  var __adminUsers: AdminUserRecord[] | undefined;
}

function getSubmissions(): Submission[] {
  if (typeof globalThis.__submissions === "undefined") {
    globalThis.__submissions = [];
  }
  return globalThis.__submissions;
}

function getVisits(): Visit[] {
  if (typeof globalThis.__visits === "undefined") {
    globalThis.__visits = [];
  }
  return globalThis.__visits;
}

const DEMO_PARTNERS: Omit<Partner, "id" | "createdAt">[] = [
  { companyName: "Sol & Tak AB", email: "info@solochtak.se", contactName: "Erik Lindqvist", contactPhone: "08-123 45 67", address: "Sveavägen 12, 111 57 Stockholm", avtalDeals: "2", dealsPerLeads: "1/5", notes: "Demo-partner" },
  { companyName: "Grönt Bygg AB", email: "kontakt@grontbygg.se", contactName: "Maria Berg", contactPhone: "031-987 65 43", address: "Avenyn 8, 411 36 Göteborg", avtalDeals: "1", dealsPerLeads: "1/8", notes: "Demo-partner" },
  { companyName: "EnergiPartner Malmö", email: "hello@energipartner.se", contactName: "Johan Nilsson", contactPhone: "040-555 12 34", address: "Möllevångsgatan 3, 214 20 Malmö", avtalDeals: "3", dealsPerLeads: "1/4", notes: "Demo-partner" },
];

function getPartnersList(): Partner[] {
  if (typeof globalThis.__partners === "undefined") {
    globalThis.__partners = [];
  }
  const list = globalThis.__partners;
  if (list.length === 0 && DEMO_PARTNERS.length > 0) {
    DEMO_PARTNERS.forEach((p, i) => {
      list.push({
        ...p,
        id: `partner_demo_${i + 1}`,
        createdAt: new Date(Date.now() - (DEMO_PARTNERS.length - i) * 86400000).toISOString(),
      });
    });
  }
  return list;
}

const DEFAULT_PROFILE_PICTURES: Partial<Record<AdminUserId, string>> = {
  leon: "/profiles/leon.png",
};

function getProfilePicturesMap(): Partial<Record<AdminUserId, string>> {
  if (typeof globalThis.__profilePictures === "undefined") {
    globalThis.__profilePictures = { ...DEFAULT_PROFILE_PICTURES };
  }
  return globalThis.__profilePictures;
}

function getAdminUsersList(): AdminUserRecord[] {
  if (typeof globalThis.__adminUsers === "undefined") {
    globalThis.__adminUsers = [];
  }
  return globalThis.__adminUsers;
}

export const store = {
  addSubmission(
    s: Omit<Submission, "id" | "createdAt" | "stage" | "pod" | "customerType"> & {
      customerType?: CustomerType;
      id?: string;
      createdAt?: string;
    }
  ): Submission {
    const list = getSubmissions();
    const createdAt = s.createdAt ?? new Date().toISOString();
    const id = s.id ?? `sub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const submission: Submission = {
      ...s,
      customerType: s.customerType ?? "privat",
      id,
      createdAt,
      stage: "leads",
      pod: "unassigned",
    };
    list.unshift(submission);
    return submission;
  },

  setSubmissionStage(id: string, stage: PipelineStage): boolean {
    const list = getSubmissions();
    const item = list.find((x) => x.id === id);
    if (!item) return false;
    item.stage = stage;
    return true;
  },

  setSubmissionPod(id: string, pod: PodId): boolean {
    const list = getSubmissions();
    const item = list.find((x) => x.id === id);
    if (!item) return false;
    item.pod = pod;
    return true;
  },

  setSubmissionCallStatus(
    id: string,
    callStatus: "ej_svar" | "nej_tack" | "bokat_mote" | "ring_senare" | "specialmarkerad"
  ): boolean {
    const list = getSubmissions();
    const item = list.find((x) => x.id === id);
    if (!item) return false;
    item.callStatus = callStatus;
    return true;
  },

  addTestLead(): Submission {
    const list = getSubmissions();
    const submission: Submission = {
      id: `sub_test_${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: "calculator",
      customerType: "privat",
      firstName: "Test",
      lastName: "Testsson",
      email: "test@example.com",
      phone: "070-123 45 67",
      address: "Testgatan 1, 111 22 Stockholm",
      consumptionKwh: 12000,
      roofAreaM2: 60,
      roofType: "sadeltak",
      region: "mitt",
      includeBattery: true,
      offertChoices: { paneler: true, batteri: true, vaxelriktare: true, komplett: false },
      estimatedProductionKwh: 9300,
      estimatedRoiYears: 12.5,
      stage: "leads",
      pod: "unassigned",
    };
    list.unshift(submission);
    return submission;
  },

  addManualSubmission(data: {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    address: string;
    customerType?: CustomerType;
  }): Submission {
    return this.addSubmission({
      source: "calculator",
      customerType: data.customerType ?? "privat",
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
      address: data.address.trim(),
      consumptionKwh: 0,
      roofAreaM2: 0,
      roofType: "sadeltak",
      region: "mitt",
      includeBattery: false,
      offertChoices: {},
      estimatedProductionKwh: 0,
      estimatedRoiYears: 0,
    });
  },

  getSubmissions(): Submission[] {
    return getSubmissions().map((s) => ({
      ...s,
      customerType: (s as Submission).customerType ?? "privat",
      stage: s.stage ?? "leads",
      pod: s.pod ?? "unassigned",
      callStatus: s.callStatus,
    }));
  },

  addNoteToSubmission(id: string, notes: string): boolean {
    const list = getSubmissions();
    const item = list.find((x) => x.id === id);
    if (!item) return false;
    item.notes = notes;
    return true;
  },

  addVisit(data: { path?: string; userAgent?: string }): Visit {
    const list = getVisits();
    const visit: Visit = {
      id: `vis_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      path: data.path,
      userAgent: data.userAgent,
    };
    list.push(visit);
    return visit;
  },

  getVisits(): Visit[] {
    return [...getVisits()];
  },

  getPartners(): Partner[] {
    return [...getPartnersList()];
  },

  addPartner(p: Omit<Partner, "id" | "createdAt">): Partner {
    const list = getPartnersList();
    const partner: Partner = {
      ...p,
      id: `partner_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(partner);
    return partner;
  },

  updatePartner(id: string, data: Partial<Omit<Partner, "id" | "createdAt">>): boolean {
    const list = getPartnersList();
    const item = list.find((x) => x.id === id);
    if (!item) return false;
    Object.assign(item, data);
    return true;
  },

  deletePartner(id: string): boolean {
    const list = getPartnersList();
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) return false;
    list.splice(idx, 1);
    return true;
  },

  getProfilePictures(): Partial<Record<AdminUserId, string>> {
    const map = getProfilePicturesMap();
    return { ...DEFAULT_PROFILE_PICTURES, ...map };
  },

  setProfilePicture(userId: AdminUserId, imageUrl: string): void {
    const map = getProfilePicturesMap();
    if (imageUrl.trim() === "") {
      delete map[userId];
    } else {
      map[userId] = imageUrl.trim();
    }
  },

  getAdminUsers(): AdminUserRecord[] {
    return getAdminUsersList().map((u) => ({
      ...u,
      passwordHash: "",
    }));
  },

  getAdminUserWithHash(id: string): AdminUserRecord | null {
    const u = getAdminUsersList().find((x) => x.id === id);
    return u ? { ...u } : null;
  },

  getAdminUserById(id: string): Omit<AdminUserRecord, "passwordHash"> | null {
    const u = getAdminUsersList().find((x) => x.id === id);
    if (!u) return null;
    const { passwordHash: _, ...safe } = u;
    return safe;
  },

  findAdminUserByLogin(usernameOrEmail: string): AdminUserRecord | null {
    const lower = usernameOrEmail.trim().toLowerCase();
    return (
      getAdminUsersList().find(
        (u) => u.username.toLowerCase() === lower || u.email.toLowerCase() === lower
      ) ?? null
    );
  },

  addAdminUser(data: {
    username: string;
    email: string;
    passwordHash: string;
    displayName?: string;
    pod?: AdminUserId;
  }): AdminUserRecord {
    const list = getAdminUsersList();
    const existing = list.find(
      (u) =>
        u.username.toLowerCase() === data.username.toLowerCase() ||
        u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existing) throw new Error("Användarnamn eller e-post finns redan");
    const user: AdminUserRecord = {
      ...data,
      id: `admin_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(user);
    return user;
  },

  updateAdminUser(
    id: string,
    data: Partial<Pick<AdminUserRecord, "username" | "email" | "displayName">>
  ): boolean {
    const list = getAdminUsersList();
    const item = list.find((x) => x.id === id);
    if (!item) return false;
    if (data.username != null) item.username = data.username.trim();
    if (data.email != null) item.email = data.email.trim();
    if (data.displayName != null) item.displayName = data.displayName.trim() || undefined;
    return true;
  },

  setAdminUserPassword(id: string, passwordHash: string): boolean {
    const list = getAdminUsersList();
    const item = list.find((x) => x.id === id);
    if (!item) return false;
    item.passwordHash = passwordHash;
    return true;
  },

  deleteAdminUser(id: string): boolean {
    const list = getAdminUsersList();
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) return false;
    list.splice(idx, 1);
    return true;
  },
};
