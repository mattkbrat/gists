type AnyObj = { [key: string]: unknown | AnyObj };

/**
 * With pure JavaScript, access an object's data multiple layers deep.
 */
const objectByString = (o: AnyObj, s: string) => {
	// convert indexes to properties and strip leading dot
	s = s.replace(/\[(\w+)]/g, ".$1");
	s = s.replace(/^\./, "");

	const a = s.split(".");
	const al = a.length;

	for (let i = 0, n = al; i < n; ++i) {
		const k = a[i];
		if (!(k in o)) {
			return;
		}
		o = o[k] as AnyObj;
	}
	return o;
};
