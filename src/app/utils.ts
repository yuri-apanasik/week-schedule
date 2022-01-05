export function firstWeekdayOfYear(year: number): number {
  return new Date(year, 0, 1).getDay();
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
