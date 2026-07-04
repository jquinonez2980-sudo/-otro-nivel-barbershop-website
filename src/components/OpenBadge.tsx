"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Location } from "@/data/site";
import { getOpenStatus } from "@/lib/hours";

const emptySubscribe = () => () => {};

/**
 * Live "Open now / Closed" badge computed in the shop's timezone.
 * Server-renders a neutral placeholder, then computes the real status
 * after hydration (visitor clock is only available client-side).
 */
export default function OpenBadge({ location }: { location: Location }) {
  // false during SSR/hydration, true once mounted — no mismatch possible
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Re-render once a minute so the badge stays current on long visits
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!hydrated) {
    return <p className="text-sm text-muted">Open 7 days a week</p>;
  }

  const status = getOpenStatus(location);

  return (
    <p className="flex items-center gap-2 text-sm">
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${status.open ? "bg-green-500" : "bg-red"}`}
      />
      <span className={status.open ? "text-green-400" : "text-muted"}>
        {status.label}
      </span>
    </p>
  );
}
