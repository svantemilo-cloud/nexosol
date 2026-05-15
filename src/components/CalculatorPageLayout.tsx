"use client";

import type { ReactNode } from "react";

/**
 * Startsidanskalkylator: vänster #fcfcfc (smal spalt ~520px som referensen),
 * höger #e4ebe2 med resultatkort — mönster nära solarcalculator.com.au home-widget.
 */
export function CalculatorPageLayout(props: {
  brand: ReactNode;
  eyebrow: ReactNode;
  leftColumn: ReactNode;
  aside: ReactNode;
}) {
  return (
    <div className="nx-sc-split mx-auto w-full min-w-0 max-w-[1280px] overflow-x-hidden px-3 sm:px-5 lg:px-6">
      {props.brand}
      {props.eyebrow}
      <div className="flex min-w-0 flex-col items-stretch overflow-hidden rounded-2xl border border-neutral-900/[0.08] shadow-[0_1px_3px_rgba(49,74,61,0.08)] lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:overflow-visible lg:rounded-none lg:border-0 lg:shadow-none">
        <div className="relative flex min-h-0 w-full min-w-0 flex-col bg-[#fcfcfc] px-4 py-5 sm:px-7 sm:py-7 lg:h-full lg:min-h-0 lg:px-9 lg:py-8 lg:pl-10 lg:pr-9">
          {props.leftColumn}
        </div>
        <aside className="relative flex min-h-0 flex-col bg-[#e4ebe2] px-4 py-5 sm:px-6 sm:py-7 lg:h-full lg:min-h-0 lg:border-l lg:border-neutral-900/10 lg:px-9 lg:py-8">
          {props.aside}
        </aside>
      </div>
    </div>
  );
}
