const getParents = (el: ParentNode) => {
	for (var parents = []; el; el = el.parentNode) {
		if (!(el instanceof HTMLElement)) continue;
		parents.push(el);
	}
	return parents;
};

const getIdiomatics = () => {
	const idiomatics = Array.from(document.getElementsByTagName("I"));
	return idiomatics.filter(
		(i) => i instanceof HTMLElement && i.classList.contains("char"),
	);
};

const isValidCode = (element: HTMLElement) => {
	// return element.dataset.class?.startsWith("23");
	return element.tagName === "CODE" && element.dataset.class?.startsWith("23");
};

const isValidDiv = (element: HTMLElement) => {
	// return element.dataset.tag?.endsWith("93");
	return element.tagName === "DIV" && element.dataset.tag?.endsWith("93");
};

/**
 * @returns true if the passed element has a
 * dataset with an attribute of 'id' and the id's value includes 21
 */
const isValidSpan = (element: HTMLElement) => {
	return element.tagName === "SPAN" && element.dataset.id?.includes("21");
};

/**
 * Decodes the current document to match criteria specified
 */
const getText = (idiomatics: ReturnType<typeof getIdiomatics>) => {
	let text = "";
	for (const i of idiomatics) {
		const parents = getParents(i);
		let checkStep = 3;
		checkparents: for (let i = parents.length - 3; i >= 0; i--) {
			if (checkStep === 0) {
				break checkparents;
			}
			const checkElement = parents[i];
			if (checkStep === 1) {
				if (!isValidSpan(checkElement)) {
					continue checkparents;
				}
				checkStep--;
				continue checkparents;
			}
			if (checkStep === 2) {
				if (!isValidDiv(checkElement)) {
					continue checkparents;
				}
				checkStep--;
				continue checkparents;
			}
			if (checkStep === 3) {
				if (!isValidCode(checkElement)) {
					continue checkparents;
				}
				checkStep--;
				continue checkparents;
			}
		}
		if (checkStep !== 0) {
			continue;
		}
		text += i.getAttribute("value");
	}

	return text;
};

const idiomatics = getIdiomatics();
const body = document.getElementsByTagName("body")[0];
const p = document.createElement("p");

const text = getText(idiomatics);

body?.appendChild(p);
p.innerHTML = text;
p.id = "decoded";

console.log(p);

console.log("decoded", text);

// console.log(getText());
