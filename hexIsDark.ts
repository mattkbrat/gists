import hexRgb from "hex-rgb";

export const hexIsDark = (hex: string) => {
	const { red, green, blue } = hexRgb(hex);
	const o = Math.round((red * 299 + green * 587 + blue * 114) / 1000);

	return o <= 180;
};
