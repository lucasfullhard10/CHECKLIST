export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatPlate(value: string): string {
  // Allow uppercase letters, numbers and hyphens
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  if (clean.length > 3) {
    // If user is typing old format (3 letters + numbers only after 3rd char)
    const isOldFormat = /^[A-Z]{3}[0-9]{1,4}$/.test(clean);
    if (isOldFormat) {
      return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    }
  }
  return clean;
}

export function isValidPlate(plate: string): boolean {
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (clean.length !== 7) return false;
  // Old format: ABC1234 (often written ABC-1234)
  const oldRegex = /^[A-Z]{3}[0-9]{4}$/;
  // Mercosul format: ABC1D23
  const mercosulRegex = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/;
  return oldRegex.test(clean) || mercosulRegex.test(clean);
}

export function formatKM(value: string): string {
  // Only numbers
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('pt-BR').format(Number(digits));
}
