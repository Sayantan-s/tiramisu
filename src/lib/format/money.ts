export const paiseToRupees = (paise: number): number => paise / 100;

export const rupeesToPaise = (rupees: number): number => Math.round(rupees * 100);

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatINR = (paise: number): string => inrFormatter.format(paiseToRupees(paise));

export const formatINRCompact = (paise: number): string => {
  const rupees = paiseToRupees(paise);
  if (Math.abs(rupees) >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
  if (Math.abs(rupees) >= 1000) return `₹${(rupees / 1000).toFixed(1)}k`;
  return formatINR(paise);
};

export const parseRupeesInput = (input: string): number | null => {
  const cleaned = input.replace(/[^0-9.]/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (Number.isNaN(n)) return null;
  return rupeesToPaise(n);
};
