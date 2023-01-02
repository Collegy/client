export function formatAsCurrency(
  amount: number | string,
  inCents = false
): string {
  let num: number;
  if (typeof amount === "string") {
    num = parseFloat(amount);
  } else {
    num = amount;
  }
  if (inCents) {
    num /= 100;
  }
  return "$" + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}