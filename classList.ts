import { el, getElement } from '.';

export const addClass = (elementId: string, className: string) => {
	const element = getElement<HTMLElement>(elementId);
	if (!element) return;
	element.classList.add(className);
};

export const removeClass = (elementId: string, className: string) => {
	const element = getElement<HTMLElement>(elementId);
	if (!element) return;
	element.classList.remove(className);
};
