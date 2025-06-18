// ...existing code...

export function formatSSN(value: string): string {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, '');

  // Add hyphens after 3rd and 5th digits
  if (cleaned.length > 5) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
  } else if (cleaned.length > 3) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }

  return cleaned;
}
