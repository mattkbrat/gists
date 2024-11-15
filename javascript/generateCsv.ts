export const generateCsv = (
	rows: (string | number)[][],
	headers: string[],
	filename: string,
	as: "download" | "contents" | "downloadInPlace",
): string | undefined => {
	if (typeof document === "undefined" && as !== "contents") {
		throw new Error(
			"This method does not support being used in a non-browser environment.",
		);
	}

	const csvContent = [headers, ...rows]
		.map((rowArray) => rowArray.join(","))
		.join("\r\n");

	if (as === "contents") return csvContent;
	if (as === "download") return `data:text/csv;charset=utf-8,${csvContent}`;
	const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", `${filename}.csv`);
	document.body.appendChild(link); // Required for FF

	link.click();
	document.body.removeChild(link); // Clean up the DOM

	return undefined;
};