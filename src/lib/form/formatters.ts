export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** DDD oficiais da Anatel. */
export const BRAZILIAN_AREA_CODES = new Set([
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "21",
  "22",
  "24",
  "27",
  "28",
  "31",
  "32",
  "33",
  "34",
  "35",
  "37",
  "38",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "51",
  "53",
  "54",
  "55",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
  "71",
  "73",
  "74",
  "75",
  "77",
  "79",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
]);

export const BRAZIL_PHONE_PLACEHOLDER = "(00) 00000-0000";

/**
 * Extrai DDD + número nacional (11 dígitos).
 * Remove zeros à esquerda e o DDI 55 quando a pessoa cola +55 / 55.
 * Não remove 55 quando ele é o DDD (Mato Grosso do Sul).
 */
export function nationalPhoneDigits(value: string) {
  let digits = digitsOnly(value).replace(/^0+/, "");

  while (digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2);
  }

  return digits.slice(0, 11);
}

export function isValidBrazilianDdd(ddd: string) {
  return BRAZILIAN_AREA_CODES.has(ddd);
}

/** (00) 00000-0000 — só DDD + celular, sem DDI. */
export function formatBrazilianPhone(value: string) {
  const digits = nationalPhoneDigits(value);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function brazilianPhoneValidationError(value: string): string | null {
  const digits = nationalPhoneDigits(value);

  if (digits.length === 0) {
    return "Informe o DDD e o número do WhatsApp.";
  }

  if (digits.length < 2) {
    return "Informe um DDD válido, com 2 dígitos.";
  }

  const ddd = digits.slice(0, 2);
  if (!isValidBrazilianDdd(ddd)) {
    return "Esse DDD não é válido. Confira o código da sua cidade.";
  }

  const subscriber = digits.slice(2);

  if (subscriber.length === 0) {
    return "Agora informe o número após o DDD.";
  }

  if (subscriber.length < 9) {
    return "O celular precisa ter 9 dígitos após o DDD.";
  }

  if (!subscriber.startsWith("9")) {
    return "O número do celular precisa começar com 9.";
  }

  return null;
}

export function isValidBrazilianPhone(value: string) {
  return brazilianPhoneValidationError(value) === null;
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
