export const transactions = Array.from({ length: 1200 }).map((_, i) => ({
  hash: `0x${(Math.random() * 1e64).toString(16)}`,
  wallet: `0x${(Math.random() * 1e40).toString(16)}`,
  amount: (Math.random() * 5).toFixed(3),
  timestamp: Date.now() - i * 1000 * 60 * 60,
}));

export const contributors = Array.from({ length: 15 }).map((_, i) => ({
  wallet: `0x${(Math.random() * 1e40).toString(16)}`,
  total: Number((Math.random() * 10).toFixed(3)),
  timeStamp: Date.now() - i * 1000 * 60 * 60 * 24,
}));
