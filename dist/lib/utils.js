import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
export function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return twMerge(clsx(inputs));
}
export function formatDate(date) {
    if (!date)
        return "N/A";
    try {
        return format(new Date(date), "PPP");
    }
    catch (error) {
        return "Invalid Date";
    }
}
export function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
