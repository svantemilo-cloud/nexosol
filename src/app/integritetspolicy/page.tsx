export const metadata = {
  title: "Integritetspolicy",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1 className="text-3xl font-bold text-forest mb-4">Integritetspolicy</h1>
      <p className="text-forest/80 leading-relaxed">
        Här beskriver vi hur Nexosol behandlar personuppgifter när du använder vår tjänst och
        begär offerter. Innehållet kan uppdateras löpande.
      </p>
      <div className="mt-8 space-y-4 text-forest/80 leading-relaxed">
        <p>
          <strong className="text-forest">Personuppgifter vi kan samla in</strong>: namn,
          kontaktuppgifter, adress och uppgifter du anger i offertflödet.
        </p>
        <p>
          <strong className="text-forest">Syfte</strong>: att matcha dig med relevanta installatörer,
          administrera din offertförfrågan och förbättra tjänsten.
        </p>
        <p>
          <strong className="text-forest">Delning</strong>: vi delar uppgifter med installatörer du
          matchas med, i den utsträckning det krävs för att de ska kunna lämna offert.
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

