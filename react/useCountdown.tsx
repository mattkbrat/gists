import { useEffect, useMemo, useRef, useState } from "react";

export const formatTime = (time: number) => {
	return new Date(time).toISOString().slice(11, 19);
};

const period = 1_000;
type TimerId = ReturnType<typeof setInterval>;

const handleClear = (id: TimerId | null) => {
	if (!id) return;
	clearInterval(id);
};

// Custom hook to manage the countdown
const useCountdown = (timeRemaining: number) => {
	const id = useRef<TimerId>(null);

	const [elapsed, setElapsed] = useState(0);

	const remaining = useMemo(() => {
		return timeRemaining - elapsed;
	}, [elapsed, timeRemaining]);

	useEffect(() => {
		handleClear(id.current);
		const intervalId = setInterval(() => {
			setElapsed((current) => {
				return current + period;
			});
		}, period);

		id.current = intervalId;

		return () => {
			handleClear(id.current);
		};
	}, []);

	useEffect(() => {
		if (remaining > 0 || !id) return;

		handleClear(id.current);
	});

	const formattedTime = useMemo(() => {
		return formatTime(remaining);
	}, [remaining]);

	return { formattedTime };
};

export default useCountdown;
