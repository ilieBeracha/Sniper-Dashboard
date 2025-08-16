export function getWeekRange(referenceDate: Date = new Date(), lastCompletedWeek = true): { start: string; end: string } {
  const d = new Date(referenceDate);

  if (lastCompletedWeek) {
    d.setDate(d.getDate() - 7);
  }

  const day = d.getDay();

  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}
