import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  if (!date) return "N/A";
  try {
    return format(new Date(date), "PPP");
  } catch (error) {
    return "Invalid Date";
  }
}

export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}