export const selectAll = (parent: string) => {
	const form = document.getElementById(parent);
	if (!form) {
		console.log("no parent input");
		return;
	}
	const checkboxes = Array.from(form.getElementsByTagName("input")).filter(
		(i) => i.type === "checkbox",
	);
	console.log(checkboxes);
	const someUnchecked = checkboxes.some((c) => !c.checked);
	for (const c of checkboxes) {
		c.checked = someUnchecked;
	}
};
