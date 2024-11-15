function createFileFromString({
	content,
	fileName,
}: {
	content: string;
	fileName: string;
}) {
	// https://stackoverflow.com/a/50230647
	const mySmartTextarea = document.createElement("textarea");
	mySmartTextarea.style.position = "absolute";
	mySmartTextarea.style.left = "-9999px";
	mySmartTextarea.innerHTML = content;

	if (content) {
		const innerHtml = mySmartTextarea.value;
		const blob = new Blob([innerHtml], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		const fileExtension = fileName.split(".").pop();
		a.download = fileExtension ? fileName : `${fileName}.txt`;

		a.href = url;
		a.click();
	}

	navigator.clipboard.writeText(mySmartTextarea.value);
}

/**
 * @example
 *		download({
 *			url: URL.createObjectURL(b64toBlob(result.data as string, "image/jpeg")),
 *			filename: `${host}-${new Date().toISOString()}.jpg`,
 *		});
 */
export async function download({
	url,
	filename,
	text,
}: { url?: string; filename: string; text?: string }) {
	if (text) {
		createFileFromString({ content: text, fileName: filename });
	}

	if (url) {
		return fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.download = filename;
				link.click();
			})
			.catch(console.error);
	}
}
