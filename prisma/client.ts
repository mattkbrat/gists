import { PrismaClient as AuthPrismaClient } from "@prisma/auth";
import { PrismaClient as ClientPrismaClient } from "@prisma/client";
import { isDev } from "./isDev";

const getTransaction = () => {
	return prisma.$transaction(async (cx) => cx);
};

export type DbTransaction = AsyncReturnType<typeof getTransaction>;

export const getPrismaClient = <T>(
	client: new (q?: { log: ["query"] }) => T,
	name: string,
): T => {
	if (!isDev) return new client();

	const globalPrisma = global as typeof global & Record<string, T>;

	if (!globalPrisma[name]) {
		globalPrisma[name] = new client({
			log: ["query"],
		});
	}

	return globalPrisma[name];
};

export const clientPrisma = getPrismaClient(ClientPrismaClient, "client");
export const authPrisma = getPrismaClient(AuthPrismaClient, "auth");

export default clientPrisma;
