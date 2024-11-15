import { getElement } from "./getElement";

export const focusElement = (elementId: string) => getElement<HTMLElement>(elementId)?.focus();
