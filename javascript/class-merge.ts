import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Concatenates multiple class names into a single string.
 *
 * This function takes a variable number of arguments, each of which can be a string, an array of strings, or an object.
 * It uses the `clsx` library to merge the inputs into a single string of class names.
 *
 * @param inputs - A variable number of arguments, each of which can be a string, an array of strings, or an object.
 * @returns A string of concatenated class names.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
