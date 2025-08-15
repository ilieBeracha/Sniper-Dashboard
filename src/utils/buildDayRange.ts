export function buildDateRange(daysBack: number = 7, refDate: Date = new Date()) {
  const end = new Date(refDate);
  const start = new Date(refDate);
  start.setDate(start.getDate() - daysBack);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { p_start: fmt(start), p_end: fmt(end) };
}
