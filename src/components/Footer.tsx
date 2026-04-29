"use client";

import { Sun, Facebook, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/nexosol", icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/nexosol", icon: Linkedin },
  { label: "Twitter", href: "https://twitter.com/nexosol", icon: Twitter },
];

const footerSections = [
  {
    title: "Kontakt",
    links: [
      { label: "08-XXX XX XX", href: "tel:08XXXXXXXX" },
      { label: "kontakt@nexosol.se", href: "mailto:kontakt@nexosol.se" },
    ],
  },
  {
    title: "Generell information",
    links: [
      { label: "Bli samarbetspartner", href: "#" },
      { label: "Kunskapsbank", href: "/artiklar" },
      { label: "Integritetspolicy", href: "#" },
      { label: "Om oss", href: "#" },
    ],
  },
  {
    title: "Produkter",
    links: [
      { label: "Solceller", href: "#calculator" },
      { label: "Solcellsbatterier", href: "#calculator" },
      { label: "Besiktning", href: "#" },
      { label: "Elavtal för solceller", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-forest text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h5 className="font-semibold text-neon-lime mb-4">
                {section.title}
              </h5>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/85 hover:text-neon-lime transition-colors inline-block py-2 -my-1 min-h-[44px] leading-snug"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4">
          <span className="font-bold text-lg flex items-center gap-2">
            <Sun className="w-6 h-6 text-neon-lime" aria-hidden />
            Nexosol
          </span>
          <nav className="flex items-center gap-4" aria-label="Sociala medier">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 hover:text-neon-lime transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl hover:bg-white/10"
                aria-label={label}
              >
                <Icon className="w-6 h-6" aria-hidden />
              </a>
            ))}
          </nav>
          <p className="text-sm text-white/60">
            © 2025 Nexosol – Org.nr: XXXXXX-XXXX
          </p>
        </div>
      </div>
    </footer>
  );
}
