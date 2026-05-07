"use client";

import Link from "next/link";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";
import {
  BadgePercent,
  Battery,
  BookOpen,
  HelpCircle,
  Menu,
  Plug,
  Sparkles,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuoteQuiz } from "@/components/quote-quiz/QuoteQuizProvider";
import { cn } from "@/lib/utils";

const iconMd = "size-5 shrink-0 text-forest";

function Ico({
  Icon,
  className,
  ...props
}: { Icon: LucideIcon } & LucideProps) {
  return <Icon className={cn(iconMd, className)} aria-hidden {...props} />;
}

type MenuLeaf = {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
};

type MenuBranch = MenuLeaf & { items?: MenuLeaf[] };

const SITE_MENU: MenuBranch[] = [
  {
    title: "Lösningar",
    url: "/#products",
    items: [
      {
        title: "Solceller",
        description: "Paneler på tak — producera din egen el",
        icon: <Ico Icon={Sun} />,
        url: "/#products",
      },
      {
        title: "Solcellsbatteri",
        description: "Lagra överskottsel för kvällar och toppar",
        icon: <Ico Icon={Battery} />,
        url: "/#products",
      },
      {
        title: "Laddbox",
        description: "Ladda elbil med smart förbrukning",
        icon: <Ico Icon={Plug} />,
        url: "/#products",
      },
      {
        title: "Kom igång",
        description: "Jämför offerter på under en minut",
        icon: <Ico Icon={Sparkles} className="text-forest-light" />,
        url: "/#compare",
      },
    ],
  },
  {
    title: "Kunskapsbank",
    url: "/artiklar",
    items: [
      {
        title: "Guider & artiklar",
        description: "Pris, lönsamhet och dimensionering",
        icon: <Ico Icon={BookOpen} />,
        url: "/artiklar",
      },
      {
        title: "Vad kostar solceller?",
        description: "Prisbild och vad som ingår",
        icon: <Ico Icon={BadgePercent} />,
        url: "/artiklar/vad-kostar-solceller",
      },
      {
        title: "Hur mycket behöver jag?",
        description: "Storlek utifrån förbrukning och tak",
        icon: <Ico Icon={HelpCircle} />,
        url: "/artiklar/hur-mycket-solceller-behover-jag",
      },
      {
        title: "Är solceller lönsamt?",
        description: "Besparing och payback",
        icon: <Ico Icon={TrendingUp} />,
        url: "/artiklar/ar-solceller-lonsamt",
      },
    ],
  },
  {
    title: "Kalkylator",
    url: "/#calculator",
  },
];

const EXTRA_MOBILE = [
  { name: "Integritetspolicy", url: "/integritetspolicy" },
  { name: "Användarvillkor", url: "/anvandarvillkor" },
  { name: "Kontakt", url: "mailto:kontakt@nexosol.se" },
] as const;

function quoteHref(url: string) {
  return url === "/#calculator" || url === "#calculator";
}

type SiteNavbarProps = {
  overlayNav: boolean;
};

export function SiteNavbar({ overlayNav }: SiteNavbarProps) {
  const { openQuiz } = useQuoteQuiz();

  const handleNavHref = (
    e: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (quoteHref(href)) {
      e.preventDefault();
      openQuiz();
    }
  };

  /** Transparent hero (startsida topp) */
  const overlayTrigger = overlayNav;

  /** 15 % större än text-sm (0,875 rem), fet text för Lösningar / Kunskapsbank / Kalkylator */
  const navTopSize = "text-[calc(0.875rem*1.15)]";

  const leafLink = cn(
    "inline-flex h-10 items-center rounded-lg px-3 py-2 font-bold transition-colors",
    navTopSize,
    overlayTrigger
      ? "text-white/95 hover:bg-white/15 hover:text-white focus-visible:ring-white/60"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  );

  const megaTrigger = cn(
    "h-10 gap-1 font-bold",
    navTopSize,
    overlayTrigger &&
      "text-white/95 hover:bg-white/15 hover:text-white data-[state=open]:bg-white/15 data-[state=open]:text-white",
  );

  const dropInner = cn(
    "flex w-full gap-3 rounded-lg p-3 text-left outline-none transition-colors no-underline",
    "hover:bg-muted hover:text-foreground focus-visible:bg-muted",
  );

  const ctaDesk = cn(
    "inline-flex shrink-0 items-center justify-center px-5 py-2.5 text-sm font-semibold shadow-soft transition-colors lg:text-[0.9375rem] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    overlayTrigger
      ? "rounded-full bg-forest text-white hover:bg-forest-light hover:shadow-soft-lg"
      : "rounded-2xl bg-forest text-white hover:bg-forest-light hover:shadow-soft-lg",
  );

  const burgerBtn = overlayTrigger
    ? "border-white/35 bg-white/10 text-white hover:bg-white/15"
    : "border-border bg-white text-forest hover:bg-muted";

  const logoFilter = overlayTrigger ? "brightness-0 invert drop-shadow-md" : "";

  return (
    <div className="w-full px-3 sm:px-6 md:flex md:h-16 md:items-center">
      {/* Desktop */}
      <div className="hidden w-full md:block">
        <nav className="flex h-14 w-full items-center justify-between lg:h-16">
          <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-10">
            <Link href="/" className="flex shrink-0 items-center gap-2 py-1">
              <img
                src="/nexosol-wordmark-transparent.png"
                alt="Nexosol"
                className={cn("h-10 w-auto transition-[filter] duration-200", logoFilter)}
                decoding="async"
                loading="eager"
              />
            </Link>
            <div className="flex min-w-0 flex-1 items-center justify-center">
              <NavigationMenu className="max-w-max">
                <NavigationMenuList>
                  {SITE_MENU.map((item) =>
                    item.items ? (
                      <NavigationMenuItem key={item.title}>
                        <NavigationMenuTrigger className={megaTrigger}>
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="flex w-max min-w-[18rem] max-w-[22rem] flex-col gap-0.5 p-2">
                            {item.items.map((sub) => (
                              <li key={sub.title}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={sub.url}
                                    className={dropInner}
                                    onClick={(e) => handleNavHref(e, sub.url)}
                                  >
                                    {sub.icon}
                                    <div className="min-w-0">
                                      <div className="text-sm font-semibold text-foreground">
                                        {sub.title}
                                      </div>
                                      {sub.description ? (
                                        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                                          {sub.description}
                                        </p>
                                      ) : null}
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    ) : (
                      <NavigationMenuItem key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.url}
                            className={leafLink}
                            onClick={(e) => handleNavHref(e, item.url)}
                          >
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ),
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <Link
            href="/#calculator"
            className={ctaDesk}
            onClick={(e) => handleNavHref(e, "/#calculator")}
          >
            Få gratis offert
          </Link>
        </nav>
      </div>

      {/* Mobil */}
      <div className="flex min-h-[3.25rem] w-full items-center justify-between gap-2 py-2 md:hidden">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 rounded-xl py-1">
          <img
            src="/nexosol-wordmark-transparent.png"
            alt="Nexosol"
            className={cn("h-7 w-auto transition-[filter] duration-200", logoFilter)}
            decoding="async"
            loading="eager"
          />
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/#calculator"
            className={cn(
              "inline-flex shrink-0 items-center justify-center px-3 py-2.5 text-xs font-semibold",
              overlayTrigger
                ? "rounded-full bg-forest text-white hover:bg-forest-light"
                : "rounded-xl bg-forest text-white hover:bg-[#054a39]",
            )}
            onClick={(e) => handleNavHref(e, "/#calculator")}
          >
            Offert
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className={cn("shrink-0", burgerBtn)}>
                <Menu className="h-5 w-5" aria-hidden />
                <span className="sr-only">Öppna meny</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <SheetHeader>
                <SheetTitle className="border-0 pb-0 text-left">
                  <SheetClose asChild>
                    <Link href="/" className="flex items-center gap-2 text-foreground">
                      <img
                        src="/nexosol-wordmark-transparent.png"
                        alt=""
                        className="h-8 w-auto opacity-95"
                        decoding="async"
                      />
                      <span className="sr-only">Nexosol – startsida</span>
                    </Link>
                  </SheetClose>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-6">
                <Accordion type="single" collapsible className="flex w-full flex-col gap-1">
                  {SITE_MENU.map((item) =>
                    item.items ? (
                      <AccordionItem
                        key={item.title}
                        value={item.title}
                        className="border-b-0 px-1"
                      >
                        <AccordionTrigger
                          className={cn(
                            "py-2 font-bold text-forest hover:no-underline",
                            navTopSize,
                          )}
                        >
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="mt-1 pb-3 pl-0">
                          <div className="flex flex-col gap-2">
                            {item.items.map((sub) => (
                              <SheetClose asChild key={sub.title}>
                                <Link
                                  href={sub.url}
                                  className="flex gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted"
                                  onClick={(e) => handleNavHref(e, sub.url)}
                                >
                                  <span className="mt-0.5">{sub.icon}</span>
                                  <div>
                                    <div className="text-sm font-semibold text-forest">
                                      {sub.title}
                                    </div>
                                    {sub.description ? (
                                      <p className="mt-1 text-xs text-muted-foreground">
                                        {sub.description}
                                      </p>
                                    ) : null}
                                  </div>
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <div key={item.title} className="px-1 py-3">
                        <SheetClose asChild>
                          <Link
                            href={item.url}
                            className={cn("font-bold text-forest", navTopSize)}
                            onClick={(e) => handleNavHref(e, item.url)}
                          >
                            {item.title}
                          </Link>
                        </SheetClose>
                      </div>
                    ),
                  )}
                </Accordion>

                <div className="border-t border-border pt-4">
                  <div className="grid grid-cols-2 gap-1">
                    {EXTRA_MOBILE.map((link) => (
                      <SheetClose asChild key={link.name}>
                        <Link
                          href={link.url}
                          className="inline-flex h-10 items-center rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>

                <SheetClose asChild>
                  <Button
                    type="button"
                    className="min-h-[52px] w-full rounded-2xl bg-forest py-4 text-base font-semibold text-white hover:bg-forest-light"
                    onClick={() => openQuiz()}
                  >
                    Få gratis offert
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
