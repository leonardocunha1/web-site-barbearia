type BookingBonusTransaction = {
  points: number;
  operation?: string | null;
};

export function calculatePointsEarned(transactions?: BookingBonusTransaction[] | null): number {
  if (!transactions?.length) return 0;

  return transactions
    .filter((transaction) => {
      if (!transaction.operation) return transaction.points > 0;
      return transaction.operation.toUpperCase() === 'CREDIT' && transaction.points > 0;
    })
    .reduce((total, transaction) => total + transaction.points, 0);
}
