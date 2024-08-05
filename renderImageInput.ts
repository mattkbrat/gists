export const renderImageInput = (
	event: Event & { currentTarget: EventTarget & HTMLInputElement },
) => {
	const files = event.currentTarget.files;
	if (!files || files.length !== 1) {
		return;
	}

	const reader = new FileReader();
	reader.onload = (e) => {
		const result = e.target?.result;
		if (!result || typeof result !== "string") return;
		el<HTMLImageElement>`new-image`.setAttribute("src", result);
	};

	reader.readAsDataURL(files[0]);
};
