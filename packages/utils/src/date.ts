import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { z } from "zod";

const DateInputSchema = z.union([
  z.date(),
  z.string().datetime({ offset: true }),
  z.string().date(),
  z.number().int().positive(),
]);

type DateInput = z.infer<typeof DateInputSchema>;

const FormatStringSchema = z.string().min(1).max(100);

function toDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  if (typeof input === "number") return new Date(input);
  return parseISO(input);
}

/**
 * Formats a date value into a human-readable string.
 *
 * @param input - A Date, ISO string, or Unix timestamp in milliseconds.
 * @param formatStr - A date-fns format string (default: "PPP" => "April 14, 2026").
 * @returns The formatted date string.
 * @throws {Error} If the input is not a valid date.
 */
export function formatDate(input: DateInput, formatStr = "PPP"): string {
  const parsed = DateInputSchema.parse(input);
  const validated = FormatStringSchema.parse(formatStr);
  const date = toDate(parsed);

  if (!isValid(date)) {
    throw new Error(`Invalid date value: ${String(input)}`);
  }

  return format(date, validated, { locale: ko });
}

/**
 * Returns a relative time string ("3 days ago", "in 2 hours").
 *
 * @param input - A Date, ISO string, or Unix timestamp in milliseconds.
 * @param options - date-fns formatDistanceToNow options.
 * @returns A relative time string.
 */
export function formatRelativeDate(
  input: DateInput,
  options: { addSuffix?: boolean } = { addSuffix: true }
): string {
  const parsed = DateInputSchema.parse(input);
  const date = toDate(parsed);

  if (!isValid(date)) {
    throw new Error(`Invalid date value: ${String(input)}`);
  }

  return formatDistanceToNow(date, { locale: ko, ...options });
}

/**
 * Returns a machine-readable ISO 8601 string (UTC).
 * Safe to use in <time datetime="..."> attributes.
 */
export function toISOString(input: DateInput): string {
  const parsed = DateInputSchema.parse(input);
  const date = toDate(parsed);

  if (!isValid(date)) {
    throw new Error(`Invalid date value: ${String(input)}`);
  }

  return date.toISOString();
}
