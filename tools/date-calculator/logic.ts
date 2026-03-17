export interface DateDifference {
  totalDays: number;
  totalWeeks: number;
  years: number;
  months: number;
  days: number;
}

export function calculateDateDifference(
  date1: string,
  date2: string
): DateDifference {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error("Invalid date format");
  }

  const start = d1 < d2 ? d1 : d2;
  const end = d1 < d2 ? d2 : d1;

  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { totalDays, totalWeeks, years, months, days };
}

export function addDaysToDate(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}
