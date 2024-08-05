import type { AsyncReturnType, SessionUser } from "@/types";
import type { Lucia } from "lucia";

export const sessionsMatch = ({
	iron,
	lucia,
}: {
	iron: { user: SessionUser | null };
	lucia: AsyncReturnType<Lucia["validateSession"]> | null;
}) => {
	const localUserId = iron.user?.authId;
	const sessionUserId = lucia?.session?.userId;

	return localUserId && sessionUserId && localUserId === sessionUserId;
};
