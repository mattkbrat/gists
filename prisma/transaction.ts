const getTransaction = () => {
	return prisma.$transaction(async (cx) => cx);
};

export type DbTransaction = AsyncReturnType<typeof getTransaction>;
