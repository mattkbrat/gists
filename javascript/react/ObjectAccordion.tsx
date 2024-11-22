import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Code,
	Flex,
	Heading,
	Stack,
	Text,
} from "@chakra-ui/react";
import React, { useMemo } from "react";

export const ObjectAccordion = ({ data, bg }: { data: object; bg: string }) => {
	const nonObjects = useMemo(() => {
		return Object.entries(data || {}).reduce(
			(acc, [k, v]) => {
				if (typeof v === "object") return acc;
				acc[k] = v;
				return acc;
			},
			{} as { [key: string]: unknown },
		);
	}, [data]);

	return (
		<Accordion>
			{Object.entries(data || {}).map(([section, sectionData]) => {
				if (Object.keys(nonObjects).includes(section)) {
					return (
						<Flex
							_hover={{
								backgroundColor: bg,
							}}
							key={`tr-${section}`}
							dir={"row"}
							width={"full"}
							borderBlock={"1px dashed"}
							py={4}
						>
							<Text colorScheme={"blue"} width={"full"} as={"span"}>
								{section}
							</Text>
							<Text colorScheme={"gray"} width={"full"} as={"span"}>
								{typeof nonObjects[section] === "string" ? (
									<span>{nonObjects[section]}</span>
								) : (
									JSON.stringify(nonObjects[section], null, 2)
								)}
							</Text>
						</Flex>
					);
				}
				return (
					<AccordionItem key={`object-accordion-${section}`}>
						<AccordionButton>
							<Heading
								fontSize={"xl"}
								textTransform={"uppercase"}
								as="span"
								flex="1"
								textAlign="left"
							>
								{section}
							</Heading>

							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel pb={4}>
							<Stack>
								{typeof sectionData === "object" ? (
									<ObjectAccordion bg={bg} data={sectionData} />
								) : (
									<Code>{JSON.stringify(sectionData, null, 2)}</Code>
								)}
							</Stack>
						</AccordionPanel>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
};
