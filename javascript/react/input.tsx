import type { InputGroupProps, InputProps } from "./types";
import { forwardRef } from "react";

export const Input = ({
	id,
	label,
	name = id,
	className,
	nested,
	...input
}: InputProps) => {
	return (
		<input
			id={id}
			name={name}
			className={`${!nested ? "input" : ""} ${className || ""}`}
			{...input}
		/>
	);
};
export const InputGroup = forwardRef<HTMLButtonElement, InputGroupProps>(
	(
		{
			button: { children: buttonChildren, className, ...buttonProps },
			...input
		},
		ref,
	) => {
		return (
			<div className="input input-group">
				<Input {...input} nested={true} />
				<button
					{...buttonProps}
					className={`button m-0 ${className}`}
					ref={ref}
				>
					{buttonChildren}
				</button>
			</div>
		);
	},
);

InputGroup.displayName = "Input Group";
