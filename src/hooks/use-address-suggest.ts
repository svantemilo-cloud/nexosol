"use client";

import { useCallback, useEffect, useState } from "react";

type SuggestPayload = { suggestions?: { label?: string }[] };

/** Fetch mot `/api/address-suggest` med ~180 ms debounce (Mapbox om nyckel finns, annars Nominatim). */
export function useAddressSuggest(search: string, enabled = true) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setSuggestions([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    const q = search.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(() => {
      fetch(`/api/address-suggest?q=${encodeURIComponent(q)}`)
        .then((r) => r.json() as Promise<SuggestPayload>)
        .then((json) => {
          if (cancelled) return;
          const s = (json.suggestions ?? [])
            .map((x) => (typeof x.label === "string" ? x.label : ""))
            .filter(Boolean)
            .slice(0, 6);
          setSuggestions(s);
          if (!locked) setOpen(true);
        })
        .catch(() => {
          if (cancelled) return;
          setSuggestions([]);
        })
        .finally(() => {
          if (cancelled) return;
          setLoading(false);
        });
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [search, locked, enabled]);

  const pickSuggestion = useCallback(() => {
    setLocked(true);
    setOpen(false);
    setSuggestions([]);
  }, []);

  const unlock = useCallback(() => {
    setLocked(false);
  }, []);

  return {
    suggestions,
    open,
    setOpen,
    loading,
    locked,
    setLocked,
    pickSuggestion,
    unlock,
  } as const;
}
