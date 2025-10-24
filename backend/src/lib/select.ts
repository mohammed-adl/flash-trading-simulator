export const userSelect = {
  id: true,
  username: true,
  email: true,
  hasNotifications: true,

  balance: true,
  profits: true,
  initialBalance: true,

  holdings: {
    orderBy: { updatedAt: "desc" as const },
    select: {
      symbol: true,
      name: true,
      quantity: true,
      updatedAt: true,
    },
  },

  _count: {
    select: {
      holdings: true,
      trades: true,
    },
  },
} as const;

export const tradeSelect = {
  id: true,
  symbol: true,
  type: true,
  quantity: true,
  price: true,
  createdAt: true,
  profit: true,
} as const;

export const transactionSelect = {
  id: true,
  type: true,
  amount: true,
  createdAt: true,
} as const;
