import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts correctly.
 * This is the canonical cn() utility used by all @blog/ui components.
 *
 * @param inputs - Any number of class values (strings, arrays, objects).
 * @returns A single merged class string with Tailwind conflicts resolved.
 *
 * @example
 *   cn("px-2 py-1", isActive && "bg-blue-500", "px-4")
 *   // => "py-1 bg-blue-500 px-4"  (px-2 is overridden by px-4)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
