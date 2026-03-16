export type ArticleBlock =
  | { type: "p"; content: string }
  | { type: "h2"; content: string }
  | { type: "h3"; content: string }
  | { type: "ul"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  excerpt: string;
  category: string;
  body: ArticleBlock[];
};

export const articles: Article[] = [
  {
    slug: "vad-kostar-solceller",
    title: "Vad kostar solceller? Prisguide 2025",
    description:
      "Så mycket kostar solceller för ett villaägare 2025 – inklusive installation, batteri och bidrag. Jämför pris per kWp och få tips för bästa deal.",
    date: "2025-03-01",
    excerpt:
      "En genomgång av solcellspriser 2025: vad du kan förvänta dig betala för en komplett anläggning, hur pris per kWp ser ut och vilka bidrag som finns.",
    category: "Pris & ekonomi",
    body: [
      {
        type: "p",
        content:
          "Kostnaden för solceller har sjunkit stadigt under senare år, samtidigt som elpriserna ökat. Det gör att återbetalningstiden för en solcellsanläggning ofta ligger på 8–12 år för en villa. Här får du en tydlig prisguide så du vet vad du kan förvänta dig.",
      },
      { type: "h2", content: "Prisintervall för solceller 2025" },
      {
        type: "p",
        content:
          "För en typisk villa med en anläggning på 5–10 kWp (kilowattpeak) ligger totalkostnaden oftast mellan 75 000 och 180 000 kr, inklusive installation och material. Priset per installerad kWp brukar ligga runt 15 000–22 000 kr. Större anläggningar ger ofta lägre kilowattpris på grund av skalfördelar.",
      },
      { type: "h3", content: "Vad påverkar priset?" },
      {
        type: "ul",
        items: [
          "Anläggningens storlek (antal paneler och effekt i kWp)",
          "Takets läge, lutning och eventuella skuggor",
          "Val av paneler och växelriktare (märke och effekt)",
          "Om du lägger till solcellsbatteri",
          "Installatörens pris och omfattning av garantier",
        ],
      },
      { type: "h2", content: "Bidrag och skattereduktion" },
      {
        type: "p",
        content:
          "Som hushåll kan du få 60 öre per kWh producerad solel (skattereduktion för solel). Det minskar den effektiva kostnaden och förkortar återbetalningstiden. Det kan också finnas kommunala eller regionala stöd – kolla vad som gäller i din kommun.",
      },
      {
        type: "p",
        content:
          "Genom att jämföra offerter från flera installatörer via Nexosol kan du hitta en bra balans mellan pris och kvalitet. Vi kopplar dig till upp till fyra kvalitetssäkrade installatörer – kostnadsfritt och bindningsfritt.",
      },
    ],
  },
  {
    slug: "hur-mycket-solceller-behover-jag",
    title: "Hur mycket solceller behöver jag? Guide till storlek och effekt",
    description:
      "Räkna ut hur stor solcellsanläggning du behöver utifrån elförbrukning, takyta och geografi. Enkla riktvärden och tips för villaägare.",
    date: "2025-02-28",
    excerpt:
      "En guide som hjälper dig ta fram rätt anläggningsstorlek utifrån din förbrukning och tillgänglig takyta.",
    category: "Fakta & planering",
    body: [
      {
        type: "p",
        content:
          "För att veta hur stor solcellsanläggning du behöver behöver du titta på din årliga elförbrukning (kWh), tillgänglig takyta och var i landet du bor. Med några enkla riktvärden kan du få en bra första uppskattning.",
      },
      { type: "h2", content: "Förbrukning och produktion" },
      {
        type: "p",
        content:
          "En tumregel är att en solcellsanläggning i södra och mellersta Sverige producerar cirka 900–1 000 kWh per installerad kWp och år. En familj som förbrukar 6 000 kWh/år kan alltså i teorin täcka en stor del av förbrukningen med en anläggning på cirka 6 kWp – om taket tillåter och du har någon form av lagring eller nätavtal.",
      },
      { type: "h3", content: "Takyta och effekt" },
      {
        type: "p",
        content:
          "Per kWp behövs ungefär 5–7 m² takyta (beroende på paneleffekt). För 6 kWp räknar man ofta med cirka 30–40 m². Det är viktigt att taket har lämplig lutning (gärna 25–40°) och ligger mot söder eller i sydväst/sydost för bäst utnyttjande.",
      },
      { type: "h2", content: "Nästa steg" },
      {
        type: "p",
        content:
          "Använd Nexosols kalkylator för att få en grov uppskattning utifrån din förbrukning och takyta. Sedan kan du begära offerter från installatörer som kan göra en mer exakt bedömning utifrån din adress och dina önskemål.",
      },
    ],
  },
  {
    slug: "ar-solceller-lonsamt",
    title: "Är solceller lönsamt? ROI och återbetalning 2025",
    description:
      "Är solceller värt det? Här får du svar på lönsamhet, återbetalningstid och vad som påverkar ROI för solceller i Sverige.",
    date: "2025-02-25",
    excerpt:
      "En genomgång av lönsamhet och återbetalning för solceller – vad som styr ROI och hur du tänker som villaägare.",
    category: "Pris & ekonomi",
    body: [
      {
        type: "p",
        content:
          "För de flesta villaägare med lämpligt tak är solceller idag en lönsam investering. Återbetalningstiden beror på investeringskostnad, elpris, produktion och eventuell skattereduktion – men 8–12 år är vanliga intervall.",
      },
      { type: "h2", content: "Vad styr lönsamheten?" },
      {
        type: "ul",
        items: [
          "Investeringskostnad (pris per kWp och val av installatör)",
          "Din elförbrukning och när du använder elen",
          "Elpriser och nätavgifter (nu och förväntat framåt)",
          "Skattereduktion för solel (60 öre/kWh)",
          "Om du har batteri och kan lagra överskott",
        ],
      },
      { type: "h3", content: "Livslängd och underhåll" },
      {
        type: "p",
        content:
          "Solceller har ofta 25 års garanti med bibehållen hög prestanda. Underhållskostnaderna är normalt låga (rengöring, eventuell kontroll). Det innebär att du efter återbetalning ofta har många år med netto besparing.",
      },
      {
        type: "p",
        content:
          "Vill du veta hur lönsamt det kan bli just för dig? Använd vår kalkylator och begär sedan offerter från kvalitetssäkrade installatörer via Nexosol – helt kostnadsfritt.",
      },
    ],
  },
  {
    slug: "underhall-av-solceller",
    title: "Underhåll av solceller – så håller du anläggningen i trim",
    description:
      "Behöver solceller underhåll? Här får du konkreta tips på rengöring, kontroller och livslängd så att din anläggning presterar länge.",
    date: "2025-02-20",
    excerpt:
      "Praktiska råd om underhåll av solceller: hur ofta rengöra, vad du ska titta efter och när besiktning kan vara värd.",
    category: "Fakta & planering",
    body: [
      {
        type: "p",
        content:
          "Solceller kräver relativt lite underhåll, men enkel rengöring och någon kontroll gör att anläggningen håller sig effektiv under många år. Här är vad du behöver veta.",
      },
      { type: "h2", content: "Rengöring av solpaneler" },
      {
        type: "p",
        content:
          "I Sverige bygger det ofta upp damm, pollen och alg på panelerna. En eller två rengöringar per år – särskilt på våren – kan ge några procent högre produktion. Använd mjuk borste och vatten; undvik skarpa rengöringsmedel som kan skada ytan. Vid tak som är svåra att nå säkert är det värt att anlita en professionell.",
      },
      { type: "h3", content: "Kontroller och felsökning" },
      {
        type: "p",
        content:
          "Håll koll på att växelriktaren visar normal produktion (via display eller app). Vid plötslig kraftig minskning kan det röra sig om fel på växelriktare, kabel eller panel – då är det dags att kontakta installatören eller en besiktningsfirma.",
      },
      { type: "h2", content: "Livslängd" },
      {
        type: "p",
        content:
          "Väl installerade solceller med bra komponenter håller ofta 25–30 år eller längre. Regelbundet underhåll och eventuell besiktning efter 10–15 år hjälper dig att maximera både livslängd och produktion.",
      },
    ],
  },
  {
    slug: "vilka-tak-passar-for-solceller",
    title: "Vilka tak passar för solceller? Lutning, läge och material",
    description:
      "Alla tak passar inte lika bra för solceller. Här får du svar på vilka tak som fungerar bäst, krav på lutning och väderstreck.",
    date: "2025-02-15",
    excerpt:
      "Guide till taktyper, lutning och läge – så du vet om ditt tak är lämpligt för solceller.",
    category: "Fakta & planering",
    body: [
      {
        type: "p",
        content:
          "Det som styr om ditt tak är lämpligt för solceller är framför allt lutning, väderstreck, skugga och takmaterial. Med rätt förutsättningar kan nästan alla taktyper användas.",
      },
      { type: "h2", content: "Lutning och väderstreck" },
      {
        type: "p",
        content:
          "Bäst produktion får du med tak som vetter mot söder och har en lutning på cirka 25–40°. Sydväst och sydost ger också bra resultat – ofta med något lägre toppproduktion men mer jämn fördelning över dagen. Platta tak kan fungera utmärkt med ställningar som lutar panelerna optimalt.",
      },
      { type: "h3", content: "Takmaterial" },
      {
        type: "p",
        content:
          "Vanliga material som betongpannor, lertegel, plåttak och takpapp går bra. Installationen sker med fästen som anpassas till just ditt material. Vid papptak eller speciella konstruktioner behöver installatören bedöma fästet och eventuell genomföring.",
      },
      { type: "h2", content: "Skugga och bygglov" },
      {
        type: "p",
        content:
          "Träd, skorstenar och närliggande byggnader kan ge skugga och minska produktionen. En installatör kan med kartor och erfarenhet bedöma hur mycket skugga som är acceptabelt. Kom även ihåg att kolla om bygglov behövs – ofta krävs det inte för solceller på befintligt tak, men undantag finns.",
      },
      {
        type: "p",
        content:
          "Vill du veta om ditt tak passar? Fyll i vår enkät och få offerter från installatörer som besöker din adress och ger en skräddarsydd bedömning.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return articles.map((a) => a.slug);
}

export function getLatestArticles(count: number): Article[] {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count);
}
