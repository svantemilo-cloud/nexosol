/**
 * Steg för ”Så fungerar det” – delas av UI och HowTo JSON-LD.
 * Ikon hanteras separat i klientkomponenten (lucide-react).
 */
export const howItWorksHeading = "Så fungerar det";

/** Samma formulering som i UI (ingress under rubriken). */
export const howItWorksLead =
  "Med Nexosol hittar du enkelt bästa priset på solenergi från pålitliga installatörer.";

export const howItWorksSteps = [
  {
    step: 1,
    title: "Fyll i en förfrågan",
    description:
      "Berätta om dina krav och önskemål – vi matchar dig med de bäst lämpade installatörerna.",
  },
  {
    step: 2,
    title: "Få svar från installatörer",
    description:
      "Upp till 4 kvalitetssäkrade installatörer kontaktar dig med skräddarsydda offerter.",
  },
  {
    step: 3,
    title: "Välj ditt erbjudande",
    description:
      "Jämför erbjudandena och välj den bästa lösningen – tryggt och utan förpliktelser.",
  },
] as const;
