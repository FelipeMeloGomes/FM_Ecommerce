export const CEP_REGEX = /^[0-9]{5}-?[0-9]{3}$/;

export function isValidCep(cep: string): boolean {
  return CEP_REGEX.test(cep);
}

export function formatCep(value: string): string {
  // remove tudo que não for número
  const numbers = value.replace(/\D/g, "").slice(0, 8);

  // aplica máscara 12345-678
  if (numbers.length > 5) {
    return numbers.replace(/(\d{5})(\d{1,3})/, "$1-$2");
  }

  return numbers;
}
