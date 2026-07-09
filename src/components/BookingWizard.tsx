"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { locations, site, type Location, type Service } from "@/data/site";
import OpenBadge from "@/components/OpenBadge";
import Reveal from "@/components/Reveal";

type Step = 1 | 2 | 3 | 4 | 5;

type Slot = {
  start: string;
  end: string;
  slot_id: string;
  label: string;
  duration_min: number;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toYmd(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function nextBookableDates(loc: Location, count = 14): string[] {
  const out: string[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  for (let i = 0; i < 45 && out.length < count; i++) {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    // Include walk-in-only Saturdays so UI can explain; slots may be empty.
    out.push(toYmd(day));
  }
  return out;
}

function formatDateLabel(ymd: string) {
  const [y, m, day] = ymd.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  return d.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function isWalkInOnly(loc: Location, ymd: string) {
  const [y, m, day] = ymd.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  const jsDay = d.getDay(); // 0=Sun
  return !loc.bookingDays.includes(jsDay);
}

function googleCalendarUrl(opts: {
  title: string;
  start: string;
  end: string;
  location: string;
  details: string;
}) {
  // Google expects UTC-ish compact form; pass local ISO with Z stripped carefully.
  const fmt = (iso: string) => {
    const d = new Date(iso);
    const y = d.getUTCFullYear();
    const mo = pad(d.getUTCMonth() + 1);
    const da = pad(d.getUTCDate());
    const h = pad(d.getUTCHours());
    const mi = pad(d.getUTCMinutes());
    const s = pad(d.getUTCSeconds());
    return `${y}${mo}${da}T${h}${mi}${s}Z`;
  };
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(opts.start)}/${fmt(opts.end)}`,
    details: opts.details,
    location: opts.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function BookingWizard() {
  const honeypotId = useId();
  const [step, setStep] = useState<Step>(1);
  const [loc, setLoc] = useState<Location | null>(null);
  const [svc, setSvc] = useState<Service | null>(null);
  const [date, setDate] = useState<string>("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [walkInOnly, setWalkInOnly] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    when?: string;
    start?: string;
    end?: string;
    location_name?: string;
    location_address?: string;
    service_name?: string;
  } | null>(null);

  const dateOptions = useMemo(
    () => (loc ? nextBookableDates(loc) : []),
    [loc],
  );

  const loadSlots = useCallback(async (locationId: string, serviceId: string, ymd: string) => {
    setLoadingSlots(true);
    setSlotsError(null);
    setSlots([]);
    setSlot(null);
    setWalkInOnly(false);
    try {
      const qs = new URLSearchParams({
        location: locationId,
        service: serviceId,
        date: ymd,
      });
      const res = await fetch(`/api/booking/availability?${qs}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not load times");
      }
      setWalkInOnly(Boolean(data.walk_in_only));
      setSlots(Array.isArray(data.slots) ? data.slots : []);
    } catch (e) {
      setSlotsError(e instanceof Error ? e.message : "Could not load times");
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (loc && svc && date) {
      if (isWalkInOnly(loc, date)) {
        setWalkInOnly(true);
        setSlots([]);
        setSlot(null);
        setLoadingSlots(false);
        setSlotsError(null);
        return;
      }
      void loadSlots(loc.id, svc.id, date);
    }
  }, [loc, svc, date, loadSlots]);

  function pickLocation(l: Location) {
    setLoc(l);
    setSvc(null);
    setDate("");
    setSlot(null);
    setSlots([]);
    setStep(2);
  }

  function pickService(s: Service) {
    setSvc(s);
    setDate("");
    setSlot(null);
    setSlots([]);
    setStep(3);
  }

  function pickDate(ymd: string) {
    setDate(ymd);
    setSlot(null);
  }

  function pickSlot(s: Slot) {
    setSlot(s);
    setStep(4);
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!loc || !svc || !slot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: loc.id,
          service: svc.id,
          start_time: slot.start,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          lang: "en",
          idempotency_key: newIdempotencyKey(),
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }
      setConfirmation({
        when: data.when,
        start: data.start || slot.start,
        end: data.end || slot.end,
        location_name: data.location_name || loc.name,
        location_address: data.location_address || loc.fullAddress,
        service_name: data.service_name || svc.name,
      });
      setStep(5);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  const stepsMeta = [
    { n: 1, label: "Location" },
    { n: 2, label: "Service" },
    { n: 3, label: "Date & time" },
    { n: 4, label: "Confirm" },
  ] as const;

  return (
    <div className="mt-12">
      {/* Step indicator */}
      {step < 5 && (
        <nav aria-label="Booking steps" className="mb-8">
          <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {stepsMeta.map((s) => {
              const active = step === s.n;
              const done = step > s.n;
              return (
                <li key={s.n} className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      active
                        ? "bg-red text-white"
                        : done
                          ? "bg-gold text-ink"
                          : "border border-edge text-muted"
                    }`}
                    aria-current={active ? "step" : undefined}
                  >
                    {s.n}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${
                      active || done ? "text-cream" : "text-muted"
                    }`}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Step 1 — Location */}
      {step === 1 && (
        <div className="grid gap-6 md:grid-cols-2">
          {locations.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.08}>
              <button
                type="button"
                onClick={() => pickLocation(l)}
                className="h-full w-full rounded-lg border border-edge bg-surface p-6 text-left transition-colors hover:border-gold focus-visible:border-gold"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="display text-2xl text-cream">{l.name}</h3>
                    <p className="mt-1 text-sm text-muted">{l.fullAddress}</p>
                  </div>
                  <OpenBadge location={l} />
                </div>
                <p className="mt-4 text-sm font-bold uppercase tracking-wide text-gold">
                  Book {l.name} →
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {/* Step 2 — Service */}
      {step === 2 && loc && (
        <div>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-4 text-sm text-muted underline-offset-2 hover:text-cream hover:underline"
          >
            ← Change location
          </button>
          <p className="mb-4 text-sm text-muted">
            Services at <strong className="text-cream">{loc.name}</strong>
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {loc.services.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => pickService(s)}
                  className="flex h-full w-full flex-col rounded-lg border border-edge bg-surface p-5 text-left transition-colors hover:border-gold"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-cream">{s.name}</span>
                    <span className="text-gold">{s.price}</span>
                  </div>
                  <span lang="es" className="mt-1 text-sm italic text-muted">
                    {s.nameEs}
                  </span>
                  <span className="mt-2 text-xs text-muted">{s.duration}</span>
                  {s.badge && (
                    <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-red">
                      {s.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 3 — Date & time */}
      {step === 3 && loc && svc && (
        <div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mb-4 text-sm text-muted underline-offset-2 hover:text-cream hover:underline"
          >
            ← Change service
          </button>
          <p className="mb-4 text-sm text-muted">
            <strong className="text-cream">{svc.name}</strong> at{" "}
            <strong className="text-cream">{loc.name}</strong>
          </p>

          <fieldset>
            <legend className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-bright">
              Pick a day
            </legend>
            <div className="flex flex-wrap gap-2">
              {dateOptions.map((ymd) => {
                const walkIn = isWalkInOnly(loc, ymd);
                const selected = date === ymd;
                return (
                  <button
                    key={ymd}
                    type="button"
                    onClick={() => pickDate(ymd)}
                    className={`rounded border px-3 py-2 text-sm transition-colors ${
                      selected
                        ? "border-gold bg-gold text-ink"
                        : walkIn
                          ? "border-edge bg-surface text-muted"
                          : "border-edge bg-surface text-cream hover:border-gold"
                    }`}
                  >
                    {formatDateLabel(ymd)}
                    {walkIn && (
                      <span className="mt-0.5 block text-[10px] uppercase tracking-wide">
                        Walk-in
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {date && (
            <div className="mt-8">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-bright">
                Available times
              </h3>
              {(walkInOnly || isWalkInOnly(loc, date)) && (
                <aside
                  className="rounded-lg border-l-4 border-gold bg-surface p-5 text-sm text-muted"
                  role="status"
                >
                  <p className="font-bold text-cream">Saturdays are walk-in only</p>
                  <p className="mt-1">
                    No appointments on Saturdays — first come, first served.{" "}
                    <span lang="es" className="italic">
                      Sábados solo sin cita.
                    </span>{" "}
                    Pick another day, or just drop by.
                  </p>
                </aside>
              )}
              {loadingSlots && (
                <p className="text-sm text-muted" role="status">
                  Loading times…
                </p>
              )}
              {slotsError && (
                <p className="text-sm text-red" role="alert">
                  {slotsError}
                  {slotsError.includes("not configured") ||
                  slotsError.includes("unreachable") ||
                  slotsError.includes("503")
                    ? " — online booking is still connecting; call or text Esmi below."
                    : null}
                </p>
              )}
              {!loadingSlots &&
                !slotsError &&
                !walkInOnly &&
                !isWalkInOnly(loc, date) &&
                slots.length === 0 && (
                  <p className="text-sm text-muted">
                    No open times this day — try another date.
                  </p>
                )}
              <div className="mt-3 flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button
                    key={s.slot_id}
                    type="button"
                    onClick={() => pickSlot(s)}
                    className="rounded border border-edge bg-surface px-4 py-2 text-sm font-bold text-cream transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                  >
                    {new Date(s.start).toLocaleTimeString("en-CA", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4 — Contact */}
      {step === 4 && loc && svc && slot && (
        <div>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="mb-4 text-sm text-muted underline-offset-2 hover:text-cream hover:underline"
          >
            ← Change time
          </button>
          <div className="mb-6 rounded-lg border border-edge bg-surface p-5 text-sm">
            <p className="font-bold text-cream">Your booking</p>
            <ul className="mt-2 space-y-1 text-muted">
              <li>
                <strong className="text-cream">{svc.name}</strong> · {svc.price}
              </li>
              <li>
                {loc.name} — {loc.fullAddress}
              </li>
              <li>
                {new Date(slot.start).toLocaleString("en-CA", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </li>
            </ul>
          </div>

          <form onSubmit={submitBooking} className="mx-auto max-w-md space-y-4">
            <div>
              <label htmlFor="bk-name" className="mb-1 block text-xs font-bold uppercase tracking-wide text-blue-bright">
                Name
              </label>
              <input
                id="bk-name"
                name="name"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-edge bg-ink px-4 py-3 text-cream outline-none focus:border-gold"
              />
            </div>
            <div>
              <label htmlFor="bk-phone" className="mb-1 block text-xs font-bold uppercase tracking-wide text-blue-bright">
                Phone
              </label>
              <input
                id="bk-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded border border-edge bg-ink px-4 py-3 text-cream outline-none focus:border-gold"
              />
              <p className="mt-1 text-xs text-muted">We&apos;ll text your confirmation here.</p>
            </div>
            <div>
              <label htmlFor="bk-email" className="mb-1 block text-xs font-bold uppercase tracking-wide text-blue-bright">
                Email <span className="font-normal normal-case tracking-normal text-muted">(optional)</span>
              </label>
              <input
                id="bk-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-edge bg-ink px-4 py-3 text-cream outline-none focus:border-gold"
              />
            </div>
            {/* Honeypot — hidden from assistive tech */}
            <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
              <label htmlFor={honeypotId}>Website</label>
              <input
                id={honeypotId}
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
            {submitError && (
              <p className="text-sm text-red" role="alert">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded bg-red px-8 py-4 text-center text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-deep disabled:opacity-60"
            >
              {submitting ? "Booking…" : "Confirm booking"}
            </button>
          </form>
        </div>
      )}

      {/* Step 5 — Success */}
      {step === 5 && confirmation && loc && svc && slot && (
        <div className="mx-auto max-w-lg text-center">
          <p className="display text-3xl text-gold">You&apos;re booked</p>
          <p className="mt-4 text-lg text-cream">
            Confirmation text on its way
          </p>
          <p lang="es" className="mt-1 text-sm italic text-muted">
            Te enviamos un mensaje de confirmación
          </p>
          <div className="mt-6 rounded-lg border border-edge bg-surface p-6 text-left text-sm text-muted">
            <p>
              <strong className="text-cream">{confirmation.service_name || svc.name}</strong>
            </p>
            <p className="mt-1">{confirmation.location_name || loc.name}</p>
            <p className="mt-1">
              {confirmation.when ||
                new Date(slot.start).toLocaleString("en-CA", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
            </p>
          </div>
          <a
            href={googleCalendarUrl({
              title: `${confirmation.service_name || svc.name} — ${site.shortName}`,
              start: confirmation.start || slot.start,
              end: confirmation.end || slot.end,
              location: confirmation.location_address || loc.fullAddress,
              details: `Booked via otronivelbarbershop.com. Questions? Call ${site.phone}.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded border border-gold px-6 py-3 text-sm font-bold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            Add to Google Calendar
          </a>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setLoc(null);
              setSvc(null);
              setDate("");
              setSlot(null);
              setConfirmation(null);
              setName("");
              setPhone("");
              setEmail("");
            }}
            className="mt-4 block w-full text-sm text-muted underline-offset-2 hover:text-cream hover:underline"
          >
            Book another appointment
          </button>
        </div>
      )}
    </div>
  );
}
