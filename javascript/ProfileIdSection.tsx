"use client";

import { useUserContext } from "@/context";
import { Box, Circle, Code, Icon, Text, useClipboard } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa6";

/**
 * Displays a user's id with the ability to copy to clipboard
 * #chakra-ui #react
 */
export const UserIdDisplay = () => {
	const { user } = useUserContext();
	const clipboard = useClipboard(user?.id || "");
	return (
		user && (
			<Box display={"flex"} flexDir={"row"} gap={4} minW={"max-content"}>
				<Text>
					User ID:{" "}
					<Code cursor={"pointer"} onClick={clipboard.onCopy} as="span" px={4}>
						{user.id}
					</Code>
				</Text>
				{clipboard.hasCopied && (
					<Circle
						bg="green.300"
						border={"2px solid green"}
						alignItems={"center"}
					>
						<Icon color={"green"} as={FaCheck} />
					</Circle>
				)}
			</Box>
		)
	);
};
