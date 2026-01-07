export type TimePeriod = { start: string; end: string };

export const DEFAULT_PERIODS: TimePeriod[] = [
  { start: "08:00", end: "11:00" },
  { start: "14:00", end: "17:30" },
];

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateTimes(
  periods: TimePeriod[] = DEFAULT_PERIODS,
  step = 30
) {
  const times: string[] = [];
  for (const p of periods) {
    const start = toMinutes(p.start);
    const end = toMinutes(p.end);
    for (let t = start; t + step <= end; t += step) {
      times.push(fromMinutes(t));
    }
  }
  return times;
}

export function generateRangeSlots(
  periods: TimePeriod[] = DEFAULT_PERIODS,
  step = 30
) {
  const ranges: string[] = [];
  for (const p of periods) {
    const start = toMinutes(p.start);
    const end = toMinutes(p.end);
    for (let t = start; t + step <= end; t += step) {
      ranges.push(`${fromMinutes(t)}-${fromMinutes(t + step)}`);
    }
  }
  return ranges;
}

export const DEFAULT_TIMES = generateTimes();
export const DEFAULT_RANGE_SLOTS = generateRangeSlots();
