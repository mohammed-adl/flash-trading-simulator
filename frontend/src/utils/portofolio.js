// current current trade profits in $
export function calcUnrealizedPnLD(avgPrice, currentPrice, quantity) {
  return (Number(currentPrice) - Number(avgPrice)) * Number(quantity);
}

// current current trade profits in %
export function calcUnrealizedPnLP(avgPrice, currentPrice) {
  return ((Number(currentPrice) - Number(avgPrice)) / Number(avgPrice)) * 100;
}

// current total vurrent trades profits in $
export function calcTUnrealizedPnLD(stocks) {
  return stocks.reduce((acc, stock) => {
    const pnl = calcUnrealizedPnLD(
      Number(stock.avgPrice),
      Number(stock.price),
      Number(stock.quantity)
    );
    return acc + pnl;
  }, 0);
}

// current total trades profits in %
export function calcTUnrealizedPnLP(stocks) {
  const invested = stocks.reduce((acc, stock) => {
    return acc + Number(stock.avgPrice) * Number(stock.quantity);
  }, 0);

  if (invested === 0) return 0;

  const totalPnL = stocks.reduce((acc, stock) => {
    return (
      acc +
      (Number(stock.price) - Number(stock.avgPrice)) * Number(stock.quantity)
    );
  }, 0);

  return (Number(totalPnL) / Number(invested)) * 100;
}

// current balance + value of holdings
export function calcPortfolioValue(cashBalance, stocks) {
  const holdingsValue = stocks.reduce((acc, stock) => {
    return acc + Number(stock.price) * Number(stock.quantity);
  }, 0);

  return Number(cashBalance) + Number(holdingsValue);
}
