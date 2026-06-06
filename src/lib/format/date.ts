export const monthKey = (iso: string): string => iso.slice(0, 7);

export const currentMonthKey = (): string => new Date().toISOString().slice(0, 7);

const shortDateFmt = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
});

const fullDateFmt = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const monthFmt = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' });

export const formatShortDate = (iso: string): string => shortDateFmt.format(new Date(iso));
export const formatFullDate = (iso: string): string => fullDateFmt.format(new Date(iso));
export const formatMonth = (iso: string): string => monthFmt.format(new Date(iso));

export const startOfMonth = (date: Date = new Date()): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const nextMonth = (date: Date = new Date()): Date =>
  new Date(date.getFullYear(), date.getMonth() + 1, 1);
