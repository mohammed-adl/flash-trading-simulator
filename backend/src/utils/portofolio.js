export function calcPnLPercent(avgPrice, currentPrice) {
  return ((Number(currentPrice) - Number(avgPrice)) / Number(avgPrice)) * 100;
}
