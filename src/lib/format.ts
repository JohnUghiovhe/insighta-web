export const formatDateTime = (value: string): string =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));

export const formatNumber = (value: number): string => new Intl.NumberFormat("en").format(value);

export const formatPercent = (value: number): string => `${Math.round(value * 100)}%`;

export const formatAge = (value: number): string => `${value} yrs`;