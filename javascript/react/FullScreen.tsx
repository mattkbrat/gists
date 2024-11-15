export const FullScreen = () => {
	const fullscreenRef = useRef<HTMLElement>(null);

	const fullscreen = useRef(false);

	useEffect(() => {
		if (
			typeof document === "undefined" ||
			!(
				"requestFullscreen" in document &&
				typeof document.requestFullscreen === "function"
			) ||
			!fullscreenRef.current
		)
			return;

		if (fullscreen) {
			document.requestFullscreen(fullscreenRef.current);
		} else {
			document.exitFullscreen();
		}
	}, [fullscreen]);

	return <div ref={fullscreenRef} />;
};
