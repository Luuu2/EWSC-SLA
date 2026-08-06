import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats an ISO date string into a localized human-readable format.
 * @param {string | null | undefined} dateString - ISO date string from Django
 * @returns {string} Formatted date string or "N/A"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};