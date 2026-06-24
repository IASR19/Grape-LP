export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** (00) 0000-0000 ou (00) 00000-0000 */
export function formatBrazilianPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function isValidBrazilianPhone(value: string) {
  const digits = digitsOnly(value);
  return digits.length === 10 || digits.length === 11;
}

export function normalizeSpaces(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

/** Capitaliza palavras em nomes próprios (preserva acentos). */
export function formatPersonName(value: string) {
  const normalized = normalizeSpaces(value);
  if (!normalized) return "";

  return normalized.replace(
    /(^|[\s'-])([\p{L}\p{M}])/gu,
    (_, separator: string, letter: string) => separator + letter.toUpperCase(),
  );
}

export function formatCityName(value: string) {
  const normalized = normalizeSpaces(value);
  if (!normalized) return "";

  const lowercaseWords = new Set(["de", "da", "do", "das", "dos", "e"]);

  return normalized
    .split(" ")
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && lowercaseWords.has(lower)) return lower;
      return lower.replace(/^[\p{L}\p{M}]/u, (letter) => letter.toUpperCase());
    })
    .join(" ");
}
