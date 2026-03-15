export interface CronPreset {
  label: string;
  expression: string;
}

export const CRON_PRESETS: CronPreset[] = [
  { label: "Every minute", expression: "* * * * *" },
  { label: "Hourly", expression: "0 * * * *" },
  { label: "Daily", expression: "0 0 * * *" },
  { label: "Weekly", expression: "0 0 * * 0" },
  { label: "Monthly", expression: "0 0 1 * *" },
];

interface CronFields {
  minute: string;
  hour: string;
  dom: string;
  month: string;
  dow: string;
}

const DOW_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function parseCron(expression: string): CronFields {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error("Cron式は5つのフィールドが必要です（分 時 日 月 曜日）。");
  }
  return {
    minute: parts[0],
    hour: parts[1],
    dom: parts[2],
    month: parts[3],
    dow: parts[4],
  };
}

export function describeCron(expression: string): string {
  const fields = parseCron(expression);
  const parts: string[] = [];

  // Minute
  if (fields.minute === "*") {
    parts.push("every minute");
  } else if (fields.minute.includes("/")) {
    parts.push(`every ${fields.minute.split("/")[1]} minutes`);
  } else {
    parts.push(`at minute ${fields.minute}`);
  }

  // Hour
  if (fields.hour === "*") {
    parts.push("of every hour");
  } else if (fields.hour.includes("/")) {
    parts.push(`every ${fields.hour.split("/")[1]} hours`);
  } else {
    parts.push(`at hour ${fields.hour}`);
  }

  // DOM
  if (fields.dom !== "*") {
    if (fields.dom.includes("/")) {
      parts.push(`every ${fields.dom.split("/")[1]} days`);
    } else {
      parts.push(`on day ${fields.dom}`);
    }
  }

  // Month
  if (fields.month !== "*") {
    const m = parseInt(fields.month);
    if (!isNaN(m) && m >= 1 && m <= 12) {
      parts.push(`in ${MONTH_NAMES[m]}`);
    } else {
      parts.push(`in month ${fields.month}`);
    }
  }

  // DOW
  if (fields.dow !== "*") {
    const d = parseInt(fields.dow);
    if (!isNaN(d) && d >= 0 && d <= 6) {
      parts.push(`on ${DOW_NAMES[d]}`);
    } else {
      parts.push(`on day-of-week ${fields.dow}`);
    }
  }

  return parts.join(", ");
}

function expandField(
  field: string,
  min: number,
  max: number
): number[] {
  const results = new Set<number>();

  for (const part of field.split(",")) {
    if (part === "*") {
      for (let i = min; i <= max; i++) results.add(i);
    } else if (part.includes("/")) {
      const [range, stepStr] = part.split("/");
      const step = parseInt(stepStr);
      const start = range === "*" ? min : parseInt(range);
      for (let i = start; i <= max; i += step) results.add(i);
    } else if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= b; i++) results.add(i);
    } else {
      results.add(parseInt(part));
    }
  }

  return Array.from(results).sort((a, b) => a - b);
}

export function getNextExecutions(
  expression: string,
  from: Date,
  count: number = 5
): Date[] {
  const fields = parseCron(expression);
  const minutes = expandField(fields.minute, 0, 59);
  const hours = expandField(fields.hour, 0, 23);
  const doms = expandField(fields.dom, 1, 31);
  const months = expandField(fields.month, 1, 12);
  const dows = expandField(fields.dow, 0, 6);

  const results: Date[] = [];
  const current = new Date(from);
  current.setSeconds(0, 0);
  current.setMinutes(current.getMinutes() + 1);

  const maxIterations = 525600; // 1 year of minutes
  let iterations = 0;

  while (results.length < count && iterations < maxIterations) {
    iterations++;
    const month = current.getMonth() + 1;
    const dom = current.getDate();
    const dow = current.getDay();
    const hour = current.getHours();
    const minute = current.getMinutes();

    if (
      months.includes(month) &&
      doms.includes(dom) &&
      dows.includes(dow) &&
      hours.includes(hour) &&
      minutes.includes(minute)
    ) {
      results.push(new Date(current));
    }

    current.setMinutes(current.getMinutes() + 1);
  }

  return results;
}
