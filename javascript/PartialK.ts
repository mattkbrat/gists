export type PartialK<T, K extends keyof T> = Partial<
	Pick<T, Extract<keyof T, K>>
> &
	Omit<T, K> extends infer O
	? { [P in keyof O]: O[P] }
	: never;

// type a = {b: string, c: number};
// type pA = PartialK<a, 'b'>;
// pA: { c: number; b?: number | undefined };
