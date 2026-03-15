export interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export function buildCronExpression(parts: CronParts): string {
  return `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
}

export function parseCronExpression(expr: string): CronParts | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4],
  };
}

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

function describeField(value: string, fieldName: string, names?: string[]): string {
  if (value === "*") return `every ${fieldName}`;
  if (value.includes("/")) {
    const [, step] = value.split("/");
    return `every ${step} ${fieldName}(s)`;
  }
  if (value.includes(",")) {
    const parts = value.split(",").map((v) => (names ? names[parseInt(v)] || v : v));
    return `${fieldName} ${parts.join(", ")}`;
  }
  if (value.includes("-")) {
    const [start, end] = value.split("-");
    const s = names ? names[parseInt(start)] || start : start;
    const e = names ? names[parseInt(end)] || end : end;
    return `${fieldName} ${s} through ${e}`;
  }
  const display = names ? names[parseInt(value)] || value : value;
  return `at ${fieldName} ${display}`;
}

export function describeCron(parts: CronParts): string {
  const pieces: string[] = [];
  pieces.push(describeField(parts.minute, "minute"));
  pieces.push(describeField(parts.hour, "hour"));
  pieces.push(describeField(parts.dayOfMonth, "day-of-month"));
  pieces.push(describeField(parts.month, "month", MONTH_NAMES));
  pieces.push(describeField(parts.dayOfWeek, "day-of-week", DAY_NAMES));
  return pieces.join(", ");
}

function expandField(value: string, min: number, max: number): number[] {
  if (value === "*") {
    const result: number[] = [];
    for (let i = min; i <= max; i++) result.push(i);
    return result;
  }
  if (value.includes("/")) {
    const [base, stepStr] = value.split("/");
    const step = parseInt(stepStr, 10);
    const start = base === "*" ? min : parseInt(base, 10);
    const result: number[] = [];
    for (let i = start; i <= max; i += step) result.push(i);
    return result;
  }
  if (value.includes(",")) {
    return value.split(",").map((v) => parseInt(v, 10));
  }
  if (value.includes("-")) {
    const [s, e] = value.split("-").map((v) => parseInt(v, 10));
    const result: number[] = [];
    for (let i = s; i <= e; i++) result.push(i);
    return result;
  }
  return [parseInt(value, 10)];
}

export function getNextExecutions(parts: CronParts, count: number, from?: Date): Date[] {
  const results: Date[] = [];
  const start = from ? new Date(from) : new Date();
  // Start from the next minute
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  const minutes = expandField(parts.minute, 0, 59);
  const hours = expandField(parts.hour, 0, 23);
  const daysOfMonth = expandField(parts.dayOfMonth, 1, 31);
  const months = expandField(parts.month, 1, 12);
  const daysOfWeek = expandField(parts.dayOfWeek, 0, 6);

  const current = new Date(start);
  const maxIterations = 525600; // 1 year of minutes

  for (let i = 0; i < maxIterations && results.length < count; i++) {
    const m = current.getMinutes();
    const h = current.getHours();
    const dom = current.getDate();
    const mon = current.getMonth() + 1;
    const dow = current.getDay();

    if (
      minutes.includes(m) &&
      hours.includes(h) &&
      daysOfMonth.includes(dom) &&
      months.includes(mon) &&
      daysOfWeek.includes(dow)
    ) {
      results.push(new Date(current));
    }

    current.setMinutes(current.getMinutes() + 1);
  }

  return results;
}
