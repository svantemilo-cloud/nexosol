export const metadata = {
  title: "Användarvillkor",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1 className="text-3xl font-bold text-forest mb-4">Användarvillkor</h1>
      <p className="text-forest/80 leading-relaxed">
        Genom att använda Nexosol godkänner du dessa villkor. Tjänsten hjälper dig att skicka en
        offertförfrågan och matchas med installatörer. Innehållet kan uppdateras löpande.
      </p>
      <div className="mt-8 space-y-4 text-forest/80 leading-relaxed">
        <p>
          <strong className="text-forest">Tjänstens omfattning</strong>: Nexosol är en
          jämförelse-/förmedlingstjänst och ansvarar inte för installatörers offerter, avtal eller
          arbete.
        </p>
        <p>
          <strong className="text-forest">Ansvar</strong>: vi strävar efter korrekt information men
          garanterar inte att allt innehåll alltid är felfritt eller uppdaterat.
        </p>
        <p>
          <strong className="text-forest">Kontakt</strong>:{" "}
          <a className="underline hover:text-forest-light" href="mailto:kontakt@nexosol.se">
            kontakt@nexosol.se
          </a>
        </p>
      </div>
    </main>
  );
}

