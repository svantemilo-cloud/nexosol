import { NextRequest, NextResponse } from "next/server";

type Suggestion = { label: string; value: string };

type NominatimResult = {
  display_name?: string;
};

type MapboxGeocode = {
  features?: { place_name?: string }[];
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) {
    return NextResponse.json({ suggestions: [] as Suggestion[] });
  }

  const mapboxToken =
    process.env.MAPBOX_ACCESS_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();

  // Prefer Mapbox when configured.
  if (mapboxToken) {
    const url =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      encodeURIComponent(q) +
      ".json?" +
      new URLSearchParams({
        access_token: mapboxToken,
        country: "se",
        language: "sv",
        autocomplete: "true",
        limit: "6",
        types: "address,place,postcode",
      }).toString();

    try {
      const res = await fetch(url, {
        headers: {
          "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.7",
        },
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const data = (await res.json()) as MapboxGeocode;
        const suggestions =
          (data.features ?? [])
            .map((f) => (typeof f.place_name === "string" ? f.place_name : ""))
            .filter(Boolean)
            .map((label) => ({ label, value: label })) ?? [];
        return NextResponse.json({ suggestions });
      }
    } catch {
      // fall through to Nominatim
    }
  }

  const url =
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      format: "jsonv2",
      addressdetails: "1",
      countrycodes: "se",
      limit: "6",
      q,
    }).toString();

  try {
    const res = await fetch(url, {
      headers: {
        // Nominatim kräver identifiering via User-Agent/Referer (vi kör via server).
        "User-Agent": "Nexosol/1.0 (kontakt@nexosol.se)",
        "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.7",
      },
      // snäll timeout via AbortSignal i edge? (Next/node stödjer signal)
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const data = (await res.json()) as NominatimResult[];
    const suggestions = data
      .map((r) => (typeof r.display_name === "string" ? r.display_name : ""))
      .filter(Boolean)
      .map((label) => ({ label, value: label }));

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}

