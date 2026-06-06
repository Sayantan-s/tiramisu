export type OcrResult = {
  amount?: number;
  merchant?: string;
  paidAtIso?: string;
  confidence: number;
};

const MERCHANT_POOL = [
  'Nature Basket',
  'Big Bazaar',
  'Reliance Fresh',
  'BlueTokai',
  'Swiggy Instamart',
  'BBDaily',
];

const seededRand = (seed: string): number => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export async function extractFromImage(uri: string): Promise<OcrResult> {
  await new Promise<void>((res) => setTimeout(() => res(), 600));
  const r = seededRand(uri);
  return {
    amount: 50000 + (r % 350000),
    merchant: MERCHANT_POOL[r % MERCHANT_POOL.length],
    paidAtIso: new Date().toISOString(),
    confidence: 0.55 + ((r % 100) / 100) * 0.4,
  };
}
