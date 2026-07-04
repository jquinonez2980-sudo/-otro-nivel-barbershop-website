"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { locations } from "@/data/site";

/**
 * Weston / Keele pricing switcher.
 * Full ARIA tabs pattern: tablist, arrow-key navigation, labelled panels.
 */
export default function PricingTabs() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const reduceMotion = useReducedMotion();

  function focusTab(index: number) {
    setActive(index);
    document.getElementById(`${baseId}-tab-${index}`)?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        focusTab((active + 1) % locations.length);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusTab((active - 1 + locations.length) % locations.length);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(locations.length - 1);
        break;
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Choose a location"
        className="mx-auto flex w-full max-w-md rounded-lg border border-edge bg-surface p-1"
        onKeyDown={onKeyDown}
      >
        {locations.map((loc, i) => (
          <button
            key={loc.id}
            id={`${baseId}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`${baseId}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={`flex-1 rounded-md px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
              active === i
                ? "bg-red text-white"
                : "text-muted hover:text-cream"
            }`}
          >
            {loc.name}
            <span className="ml-1.5 hidden text-xs font-normal normal-case tracking-normal sm:inline">
              {loc.area}
            </span>
          </button>
        ))}
      </div>

      {locations.map((loc, i) => (
        <div
          key={loc.id}
          id={`${baseId}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={active !== i}
          className="mt-8"
        >
          {active === i && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <p className="mb-4 text-sm text-muted">
                {loc.fullAddress} · Free parking
              </p>
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  Services and pricing at the {loc.name} location
                </caption>
                <thead>
                  <tr className="border-b border-edge text-xs font-bold uppercase tracking-[0.15em] text-gold">
                    <th scope="col" className="py-3 pr-4">Service</th>
                    <th scope="col" className="py-3 pr-4 text-right">Price</th>
                    <th scope="col" className="py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {loc.services.map((service) => (
                    <tr key={service.name} className="border-b border-edge/60">
                      <td className="py-4 pr-4">
                        <span className="font-semibold text-cream">{service.name}</span>
                        {service.badge && (
                          <span className="ml-2 inline-block rounded-full border border-gold/60 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gold">
                            {service.badge}
                          </span>
                        )}
                        <span lang="es" className="block text-xs italic text-muted">
                          {service.nameEs}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right font-semibold text-cream">
                        {service.price}
                      </td>
                      <td className="py-4 text-right text-sm text-muted">
                        {service.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      ))}

      <p className="mt-6 text-center text-xs text-muted">
        Prices may vary slightly — final pricing is at the barber&apos;s discretion.
        Don&apos;t see a service? Ask in-shop or call us.
      </p>
    </div>
  );
}
