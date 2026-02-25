import { differenceInCalendarDays, format, parseISO, isAfter, isBefore, isEqual } from "date-fns";

export function formatRange(startISO: string, endISO: string) {
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  // Example: "12–18 March" (same month) or "28 Feb – 03 Mar" (different month)
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${format(start, "d")}–${format(end, "d MMMM")}`;
  }
  return `${format(start, "d MMM")} – ${format(end, "d MMM")}`;
}

export function durationDays(startISO: string, endISO: string) {
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  return Math.max(1, differenceInCalendarDays(end, start) + 1);
}

export function isUpcoming(startISO: string) {
  const start = parseISO(startISO);
  const today = new Date();
  // treat "today" as upcoming
  return isAfter(start, today) || isEqual(start, today);
}

export function isPast(endISO: string) {
  const end = parseISO(endISO);
  const today = new Date();
  return isBefore(end, today);
}


