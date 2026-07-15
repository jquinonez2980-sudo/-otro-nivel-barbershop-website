"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { locations, site, type Location, type Service } from "@/data/site";
import OpenBadge from "@/components/OpenBadge";
import Reveal from "@/components/Reveal";

type Step = 1 | 2 | 3 | 4 | 5;
type Locale = "en" | "es";

type Slot = {
  start: string;
  end: string;
  slot_id: string;
  label: string;
  duration_min: number;
};

const COPY = {
  en: {
    steps: [
      { n: 1 as const, label: "Location" },
      { n: 2 as const, label: "Service" },
      { n: 3 as const, label: "Date & time" },
      { n: 4 as const, label: "Confirm" },
    ],
    langToggle: "Español",
    bookLoc: (name: string) => `Book ${name} →`,
    changeLocation: "← Change location",
    changeService: "← Change service",
    changeTime: "← Change time",
    servicesAt: (name: string) => (
      <>
        Services at <strong className="text-cream">{name}</strong>
      </>
    ),
    pickDay: "Pick a day",
    walkIn: "Walk-in",
    availableTimes: "Available times",
    satWalkInTitle: "Saturdays are walk-in only",
    satWalkInBody:
      "No appointments on Saturdays — first come, first served. Pick another day, or just drop by.",
    satWalkInEs: "Sábados solo sin cita.",
    loadingTimes: "Loading times…",
    slotsConnectHint:
      " — online booking is still connecting; call or text Esmi below.",
    noTimes: "No open times this day — try another date.",
    yourBooking: "Your booking",
    name: "Name",
    phone: "Phone",
    phoneHint: "We'll text your confirmation here.",
    email: "Email",
    optional: "(optional)",
    confirm: "Confirm booking",
    booking: "Booking…",
    booked: "You're booked",
    confText: "Confirmation text on its way",
    confTextEs: "Te enviamos un mensaje de confirmación",
    addCalendar: "Add to Google Calendar",
    bookAnother: "Book another appointment",
    stepsAria: "Booking steps",
  },
  es: {
    steps: [
      { n: 1 as const, label: "Ubicación" },
      { n: 2 as const, label: "Servicio" },
      { n: 3 as const, label: "Fecha y hora" },
      { n: 4 as const, label: "Confirmar" },
    ],
    langToggle: "English",
    bookLoc: (name: string) => `Reservar ${name} →`,
    changeLocation: "← Cambiar ubicación",
    changeService: "← Cambiar servicio",
    changeTime: "← Cambiar hora",
    servicesAt: (name: string) => (
      <>
        Servicios en <strong className="text-cream">{name}</strong>
      </>
    ),
    pickDay: "Elige un día",
    walkIn: "Sin cita",
    availableTimes: "Horarios disponibles",
    satWalkInTitle: "Los sábados son solo sin cita",
    satWalkInBody:
      "No hay citas los sábados — por orden de llegada. Elige otro día, o ven sin cita.",
    satWalkInEs: "Sábados solo sin cita.",
    loadingTimes: "Cargando horarios…",
    slotsConnectHint:
      " — la reserva en línea se está conectando; llama o escribe a Esmi abajo.",
    noTimes: "No hay horarios este día — prueba otra fecha.",
    yourBooking: "Tu reserva",
    name: "Nombre",
    phone: "Teléfono",
    phoneHint: "Te enviamos la confirmación por mensaje aquí.",
    email: "Correo",
    optional: "(opcional)",
    confirm: "Confirmar reserva",
    booking: "Reservando…",
    booked: "¡Listo, estás reservado!",
    confText: "Te enviamos un mensaje de confirmación",
    confTextEs: "Confirmation text on its way",
    addCalendar: "Agregar a Google Calendar",
    bookAnother: "Reservar otra cita",
    stepsAria: "Pasos de la reserva",
  },
} as const;

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

function formatDateLabel(ymd: string, locale: Locale) {
  const [y, m, day] = ymd.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  return d.toLocaleDateString(locale === "es" ? "es-CA" : "en-CA", {
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
  const [locale, setLocale] = useState<Locale>("en");
  const t = COPY[locale];
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
          lang: locale,
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
        service_name: data.service_name || (locale === "es" ? svc.nameEs : svc.name),
      });
      setStep(5);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  const serviceLabel = (s: Service) => (locale === "es" ? s.nameEs : s.name);

  return (
    <div className="mt-12" lang={locale}>
      {/* EN / ES toggle — conversion path bilingual */}
      <div className="mb-6 flex justify-center">
        <div
          className="inline-flex rounded-full border border-edge bg-surface p-1 text-xs font-bold uppercase tracking-wide"
          role="group"
          aria-label="Language / Idioma"
        >
          <button
            type="button"
            onClick={() => setLocale("en")}
            aria-pressed={locale === "en"}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              locale === "en" ? "bg-gold text-ink" : "text-muted hover:text-cream"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLocale("es")}
            aria-pressed={locale === "es"}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              locale === "es" ? "bg-gold text-ink" : "text-muted hover:text-cream"
            }`}
          >
            ES
          </button>
        </div>
      </div>

      {/* Step indicator */}
      {step < 5 && (
        <nav aria-label={t.stepsAria} className="mb-8">
          <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {t.steps.map((s) => {
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
                  {t.bookLoc(l.name)}
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
            {t.changeLocation}
          </button>
          <p className="mb-4 text-sm text-muted">{t.servicesAt(loc.name)}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {loc.services.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => pickService(s)}
                  className="flex h-full w-full flex-col rounded-lg border border-edge bg-surface p-5 text-left transition-colors hover:border-gold"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-cream">{serviceLabel(s)}</span>
                    <span className="text-gold">{s.price}</span>
                  </div>
                  {locale === "en" && (
                    <span lang="es" className="mt-1 text-sm italic text-muted">
                      {s.nameEs}
                    </span>
                  )}
                  {locale === "es" && (
                    <span lang="en" className="mt-1 text-sm italic text-muted">
                      {s.name}
                    </span>
                  )}
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
            {t.changeService}
          </button>
          <p className="mb-4 text-sm text-muted">
            <strong className="text-cream">{serviceLabel(svc)}</strong>{" "}
            {locale === "es" ? "en" : "at"}{" "}
            <strong className="text-cream">{loc.name}</strong>
          </p>

          <fieldset>
            <legend className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-bright">
              {t.pickDay}
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
                    {formatDateLabel(ymd, locale)}
                    {walkIn && (
                      <span className="mt-0.5 block text-[10px] uppercase tracking-wide">
                        {t.walkIn}
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
                {t.availableTimes}
              </h3>
              {(walkInOnly || isWalkInOnly(loc, date)) && (
                <aside
                  className="rounded-lg border-l-4 border-gold bg-surface p-5 text-sm text-muted"
                  role="status"
                >
                  <p className="font-bold text-cream">{t.satWalkInTitle}</p>
                  <p className="mt-1">
                    {t.satWalkInBody}{" "}
                    {locale === "en" && (
                      <span lang="es" className="italic">
                        {t.satWalkInEs}
                      </span>
                    )}
                  </p>
                </aside>
              )}
              {loadingSlots && (
                <p className="text-sm text-muted" role="status">
                  {t.loadingTimes}
                </p>
              )}
              {slotsError && (
                <p className="text-sm text-red" role="alert">
                  {slotsError}
                  {slotsError.includes("not configured") ||
                  slotsError.includes("unreachable") ||
                  slotsError.includes("503")
                    ? t.slotsConnectHint
                    : null}
                </p>
              )}
              {!loadingSlots &&
                !slotsError &&
                !walkInOnly &&
                !isWalkInOnly(loc, date) &&
                slots.length === 0 && (
                  <p className="text-sm text-muted">{t.noTimes}</p>
                )}
              <div className="mt-3 flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button
                    key={s.slot_id}
                    type="button"
                    onClick={() => pickSlot(s)}
                    className="rounded border border-edge bg-surface px-4 py-2 text-sm font-bold text-cream transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                  >
                    {new Date(s.start).toLocaleTimeString(
                      locale === "es" ? "es-CA" : "en-CA",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      },
                    )}
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
            {t.changeTime}
          </button>
          <div className="mb-6 rounded-lg border border-edge bg-surface p-5 text-sm">
            <p className="font-bold text-cream">{t.yourBooking}</p>
            <ul className="mt-2 space-y-1 text-muted">
              <li>
                <strong className="text-cream">{serviceLabel(svc)}</strong> · {svc.price}
              </li>
              <li>
                {loc.name} — {loc.fullAddress}
              </li>
              <li>
                {new Date(slot.start).toLocaleString(
                  locale === "es" ? "es-CA" : "en-CA",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  },
                )}
              </li>
            </ul>
          </div>

          <form onSubmit={submitBooking} className="mx-auto max-w-md space-y-4">
            <div>
              <label htmlFor="bk-name" className="mb-1 block text-xs font-bold uppercase tracking-wide text-blue-bright">
                {t.name}
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
                {t.phone}
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
              <p className="mt-1 text-xs text-muted">{t.phoneHint}</p>
            </div>
            <div>
              <label htmlFor="bk-email" className="mb-1 block text-xs font-bold uppercase tracking-wide text-blue-bright">
                {t.email}{" "}
                <span className="font-normal normal-case tracking-normal text-muted">
                  {t.optional}
                </span>
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
              {submitting ? t.booking : t.confirm}
            </button>
          </form>
        </div>
      )}

      {/* Step 5 — Success */}
      {step === 5 && confirmation && loc && svc && slot && (
        <div className="mx-auto max-w-lg text-center">
          <p className="display text-3xl text-gold">{t.booked}</p>
          <p className="mt-4 text-lg text-cream">{t.confText}</p>
          <p
            lang={locale === "en" ? "es" : "en"}
            className="mt-1 text-sm italic text-muted"
          >
            {t.confTextEs}
          </p>
          <div className="mt-6 rounded-lg border border-edge bg-surface p-6 text-left text-sm text-muted">
            <p>
              <strong className="text-cream">
                {confirmation.service_name || serviceLabel(svc)}
              </strong>
            </p>
            <p className="mt-1">{confirmation.location_name || loc.name}</p>
            <p className="mt-1">
              {confirmation.when ||
                new Date(slot.start).toLocaleString(
                  locale === "es" ? "es-CA" : "en-CA",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  },
                )}
            </p>
          </div>
          <a
            href={googleCalendarUrl({
              title: `${confirmation.service_name || serviceLabel(svc)} — ${site.shortName}`,
              start: confirmation.start || slot.start,
              end: confirmation.end || slot.end,
              location: confirmation.location_address || loc.fullAddress,
              details: `Booked via otronivelbarbershop.com. Questions? Call ${site.phone}.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded border border-gold px-6 py-3 text-sm font-bold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            {t.addCalendar}
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
            {t.bookAnother}
          </button>
        </div>
      )}
    </div>
  );
}
