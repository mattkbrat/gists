import { getElement } from "./getElement";

export const clickElement = (elementId: string) => getElement<HTMLElement>(elementId)?.click();
