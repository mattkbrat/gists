/**
 * Checks the array of values to see if some or all of them are undefined.
 * @param arrayToCheck - array of values to check
 * @param scope - type of value. This will be a value passed into the SOAP request like "imsi" or "msisdn"
 * @returns
 */
export const guardAgainstUndefined = (
	arrayToCheck: unknown[],
	scope: "all" | "some",
) => {
	return scope === "all"
		? arrayToCheck.every((value) => value === undefined)
		: arrayToCheck.some((value) => value === undefined);
};

export const allUndefined = (...args: unknown[]) =>
	args.every((arg) => typeof arg === "undefined");

export const someUndefined = (...args: unknown[]) =>
	args.some((arg) => typeof arg === "undefined");

export const noneUndefined = (...args: unknown[]) => !someUndefined(args);
