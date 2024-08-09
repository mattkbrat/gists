export type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/*
 * Given two numbers (num1 and num2), return the number nearest to num.
 */
export function nearest(num: number, opt1: number, opt2: number) {
	const diff1 = Math.abs(num - opt1);
	const diff2 = Math.abs(num - opt2);

	return diff1 < diff2 ? opt1 : opt2;
}
