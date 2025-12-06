const checkMinMaxAmountEligibility = (minAmount: number | null, maxAmount: number | null) => {
  const isAllValuesValid = !!minAmount && !!maxAmount;
  if (!isAllValuesValid) return true;
  return minAmount <= maxAmount;
};
export default checkMinMaxAmountEligibility;
