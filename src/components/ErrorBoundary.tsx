"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Fångar kraschar i barn-komponenter (t.ex. SwedenMap) så att resten av sidan fortsätter att visas.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <section className="py-16 px-4 sm:px-6 bg-surface">
            <div className="max-w-2xl mx-auto rounded-2xl border border-forest/10 bg-white shadow-soft-lg p-8 text-center text-forest/70">
              <p className="mb-2">Kartan kunde inte laddas.</p>
              <a href="#calculator" className="text-forest underline hover:text-forest-light">
                Gå till kalkylatorn →
              </a>
            </div>
          </section>
        )
      );
    }
    return this.props.children;
  }
}
