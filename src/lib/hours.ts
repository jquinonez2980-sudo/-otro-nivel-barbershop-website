import type { Location } from "@/data/site";

export type OpenStatus = {
  open: boolean;
  label: string;
};

const DAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Current weekday + time-of-day in the shop's timezone, regardless of the visitor's. */
function nowInToronto(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  let day = 0;
  let hour = 0;
  let minute = 0;
  for (const part of parts) {
    if (part.type === "weekday") day = DAY_INDEX[part.value] ?? 0;
    if (part.type === "hour") hour = Number(part.value);
    if (part.type === "minute") minute = Number(part.value);
  }
  return { day, minutes: hour * 60 + minute };
}

function formatHour(decimalHour: number): string {
  const h = Math.floor(decimalHour);
  const m = Math.round((decimalHour - h) * 60);
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:${m.toString().padStart(2, "0")} ${suffix}`;
}

export function getOpenStatus(location: Location): OpenStatus {
  const { day, minutes } = nowInToronto();
  const today = location.weekHours[day];
  const openMin = today.open * 60;
  const closeMin = today.close * 60;

  if (minutes >= openMin && minutes < closeMin) {
    return { open: true, label: `Open now · closes ${formatHour(today.close)}` };
  }
  if (minutes < openMin) {
    return { open: false, label: `Closed · opens today at ${formatHour(today.open)}` };
  }
  const tomorrow = location.weekHours[(day + 1) % 7];
  return {
    open: false,
    label: `Closed · opens tomorrow at ${formatHour(tomorrow.open)}`,
  };
}
