export type DivProps = React.HTMLAttributes<HTMLDivElement>;

type HTMLInputProps = React.HTMLAttributes<HTMLInputElement>;

export type InputGroupProps = InputProps & {
	button: {
		children: React.ReactNode;
	} & ButtonProps;
};

export type ButtonProps = React.HTMLProps<HTMLButtonElement> & {
	type: HTMLButtonElement["type"];
};
type CustomInputProps = {
	id: string;
	name?: string;
	className?: string;
	label?: string;
	type?: HTMLInputElement["type"];
	nested?: boolean;
};

export type InputProps = CustomInputProps &
	Exclude<HTMLInputProps, keyof CustomInputProps>;
