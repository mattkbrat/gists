/**
 * Map an array of 0/1 to an hsla color, based on the number of 1s.
 * The more 0s, the redder the color.
 * The more 1s, the greener the color.
 * If all green, return green.
 * @param intArr
 * @returns hsla color
 */
export const colorMapper = (intArr: number[]) => {
	if (intArr.length === 0) {
		return "hsla(0, 0%, 0%, 0)";
	} else {
		const numZeros = intArr.filter((v) => v === 0).length;
		const numOnes = intArr.filter((v) => v === 1).length;
		const numTotal = numZeros + numOnes;
		const hue = Math.floor((numOnes / numTotal) * 120);
		return `hsl(${hue}, 100%, 50%)`;
	}
};
