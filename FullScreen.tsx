export const FullScreen = () => {
	const fullScreenRef = useRef<HTMLElement>(null);

	const fullscreen = useRef(false);

	useEffect(() => {
		if (
			typeof document === "undefined" ||
			!("requestFullscreen" in document) ||
			!fullScreenRef.current
		)
			return;

		if (fullscreen) {
			document["requestFullscreen"](fullScreenRef.current);
		} else {
			document.exitFullscreen();
		}
	}, [fullscreen]);

	return <div ref={fullScreenRef} />;
};
