"use client";

import { forwardRef, useMemo } from "react";
import { useFormStatus } from "react-dom";

import {
	Button,
	IconButton,
	Tooltip,
	type ButtonProps,
} from "@chakra-ui/react";

type SubmitButtonProps = (
	| { children: React.ReactElement; "aria-label"?: string }
	| { icon: React.ReactElement; "aria-label": string }
) & {
	tooltip?: string;
} & Omit<ButtonProps, "children">;

export function SubmitButton({ tooltip, ...props }: SubmitButtonProps) {
	const { pending } = useFormStatus();

	const ThisButton = useMemo(() => {
		return "icon" in props ? (
			<IconButton
				isLoading={pending}
				type="submit"
				{...props}
				aria-disabled={pending}
				icon={props.icon}
				aria-label={props["aria-label"]}
			/>
		) : (
			<Button
				isLoading={pending}
				type="submit"
				aria-disabled={pending}
				{...props}
			>
				{props.children || "Submit"}
			</Button>
		);
	}, [props, pending]);

	if (!tooltip) return ThisButton;

	return <Tooltip label={tooltip}>{ThisButton}</Tooltip>;
}

export const ForwardRefSubmitButton = forwardRef(
	(
		props: Exclude<SubmitButtonProps, "icon">,
		ref: React.ForwardedRef<HTMLButtonElement>,
	) => {
		const { pending } = useFormStatus();

		return (
			<Button
				isLoading={pending}
				aria-disabled={pending}
				type="submit"
				{...props}
				ref={ref}
			>
				{"children" in props ? props.children : "Submit"}
			</Button>
		);
	},
);
