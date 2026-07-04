"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const STATS = [
  { value: 2, suffix: "", label: "Locations", labelEs: "Locales" },
  { value: 7, suffix: "", label: "Days a Week", labelEs: "Días a la semana" },
  { value: 60, suffix: "s", label: "To Book with Esmi", labelEs: "Para reservar" },
  { value: 24, suffix: "/7", label: "Calls Answered", labelEs: "Siempre contestamos" },
];

function CountUp({ to, suffix, start }: { to: number; suffix: string; start: boolean }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? to : 0);

  useEffect(() => {
    if (!start || reduceMotion) return;
    let raf: number;
    const t0 = performance.now();
    const dur = 1200;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setDisplay(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, reduceMotion]);

  return (
    <span className="display text-5xl text-gold sm:text-6xl">
      <span aria-hidden="true">
        {display}
        <span className="text-3xl sm:text-4xl">{suffix}</span>
      </span>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
    </span>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <ul
      ref={ref}
      className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-edge bg-edge lg:grid-cols-4"
    >
      {STATS.map((stat) => (
        <li
          key={stat.label}
          className="flex flex-col items-center gap-1 bg-surface px-4 py-10 text-center"
        >
          <CountUp to={stat.value} suffix={stat.suffix} start={inView} />
          <span className="mt-1 text-sm font-semibold uppercase tracking-wider text-cream">
            {stat.label}
          </span>
          <span lang="es" className="text-xs italic text-muted">
            {stat.labelEs}
          </span>
        </li>
      ))}
    </ul>
  );
}
