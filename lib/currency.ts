export function formatCurrency(
  amount: number,
  locale = "pt-BR",
  currency = "BRL",
): string {
  return new Number(amount).toLocaleString(locale, {
    currency,
    style: "currency",
    minimumFractionDigits: 2,
  });
}

export function formatNumber(value: number, locale = "pt-BR"): string {
  return new Number(value).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
