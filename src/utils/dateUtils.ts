import { isToday, isTomorrow, isPast, parseISO, format, startOfDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  if (isToday(date)) return '今天';
  if (isTomorrow(date)) return '明天';
  return format(date, 'M月d日', { locale: zhCN });
}

export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  return isPast(date) && !isToday(date);
}

export function isBeforeToday(dateStr: string): boolean {
  return isBeforeDay(parseISO(dateStr), startOfDay(new Date()));
}

function isBeforeDay(date: Date, other: Date): boolean {
  return date.getTime() < other.getTime();
}
