/** Frais de transaction Maketou : 8% du prix de base (règle absolue) */
export const FEE_RATE = 0.08;

export function calcFees(price: number) {
  const fees = Math.round(price * FEE_RATE);
  const total = price + fees;
  return { price, fees, total };
}

export function formatFcfa(value: number) {
  return value.toLocaleString("fr-FR") + " FCFA";
}

export function formatEur(value: number) {
  return "€" + (value / 655.957).toFixed(2);
}
