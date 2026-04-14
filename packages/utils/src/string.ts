import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);
const SlugInputSchema = z.string().min(1).max(500);
const TruncateOptionsSchema = z.object({
  maxLength: z.number().int().positive().max(10_000).default(160),
  ellipsis: z.string().max(10).default("..."),
});

/**
 * Converts a string to a URL-safe slug.
 * Strips diacritics, lowercases, replaces non-alphanumeric with hyphens,
 * and trims leading/trailing hyphens.
 *
 * @example slugify("Hello, World!") => "hello-world"
 */
export function slugify(input: string): string {
  const validated = SlugInputSchema.parse(input);

  return validated
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncates a string to maxLength characters, appending an ellipsis if needed.
 * Does not split words — truncates at the last complete word boundary.
 *
 * @example truncate("Hello world", { maxLength: 8 }) => "Hello..."
 */
export function truncate(
  input: string,
  options: Partial<z.input<typeof TruncateOptionsSchema>> = {}
): string {
  const validated = NonEmptyStringSchema.parse(input);
  const { maxLength, ellipsis } = TruncateOptionsSchema.parse(options);

  if (validated.length <= maxLength) return validated;

  const truncated = validated.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${truncated}${ellipsis}`;
}

/**
 * Capitalizes the first letter of a string. Leaves the rest unchanged.
 *
 * @example capitalize("hello world") => "Hello world"
 */
export function capitalize(input: string): string {
  const validated = NonEmptyStringSchema.parse(input);
  return `${validated.charAt(0).toUpperCase()}${validated.slice(1)}`;
}

/**
 * Converts a string to title case.
 * Capitalizes first and last word; lowercases articles, conjunctions, and prepositions.
 *
 * @example toTitleCase("the quick brown fox") => "The Quick Brown Fox"
 */
export function toTitleCase(input: string): string {
  const validated = NonEmptyStringSchema.parse(input);
  const lowercase = new Set([
    "a", "an", "the", "and", "but", "or", "for", "nor",
    "on", "at", "to", "by", "in", "of", "up",
  ]);

  const words = validated.toLowerCase().split(/\s+/);

  return words
    .map((word, index) => {
      if (index === 0 || index === words.length - 1) {
        return capitalize(word);
      }
      return lowercase.has(word) ? word : capitalize(word);
    })
    .join(" ");
}

/**
 * Strips HTML tags from a string, returning plain text.
 * Intended for content from trusted CMS sources only.
 */
export function stripHtml(input: string): string {
  const validated = NonEmptyStringSchema.parse(input);
  return validated.replace(/<[^>]*>/g, "");
}
