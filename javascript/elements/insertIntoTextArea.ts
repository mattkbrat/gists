export type InsertIntoTextAreaProps = {
	text: string;
	isTag: boolean;
	textArea: HTMLTextAreaElement;
};

export const insertIntoTextArea = ({
	text,
	isTag,
	textArea,
}: InsertIntoTextAreaProps) => {
	const cursorPosition = textArea?.selectionStart || 0;
	const cursorEnd = textArea?.selectionEnd || 0;
	const isReplace = cursorPosition !== cursorEnd;

	const newLog = isReplace
		? textArea?.value.substring(0, cursorPosition) +
			`${isTag ? "#" : "[["}` +
			`${text}` +
			`${isTag ? "" : "]]"}` +
			textArea?.value.substring(cursorEnd)
		: textArea?.value.substring(0, cursorPosition) +
			`${isTag ? "#" : "[["}` +
			`${text}` +
			`${isTag ? "" : "]]"}` +
			textArea?.value.substring(cursorPosition) +
			" ";

	const newSelectionRange = cursorPosition + text.length + (isTag ? 2 : 5);

	textArea.value = newLog;

	textArea.focus();

	textArea.setSelectionRange(newSelectionRange, newSelectionRange);
};
