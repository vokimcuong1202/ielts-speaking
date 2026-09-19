// Streaks, quotas and the heatmap roll over at midnight in the user's timezone (users.timezone).

export function localDateString(timezone: string, now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Prisma expects @db.Date values as a Date at UTC midnight. */
export function toDateOnly(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

export function localDate(timezone: string, now = new Date()): Date {
  return toDateOnly(localDateString(timezone, now));
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}
