export const ObjectAccordion = ({ data, bg }: { data: object; bg: string }) => {
	const nonObjects: { [key: string]: any } = {};

	for (const [key, value] of Object.entries(data || {})) {
		if (typeof value === "object") {
			continue;
		}
		nonObjects[key] = value;
	}

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
						<h2>
							<AccordionButton>
								<Box
									fontSize={"xl"}
									textTransform={"uppercase"}
									as="span"
									flex="1"
									textAlign="left"
								>
									{section}
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</h2>
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
