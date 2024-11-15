import type { NextApiHandler } from "next";
import { env } from "./env/server";
import { isDev } from "./isDev";
import {
	getIronSession,
	type IronSession,
	type SessionOptions,
} from "iron-session";

import type { SessionUser } from "@/types";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { getAuthCookie } from "./auth/authCookies";
import logger from "./winston";

const password = env.SESSION_COOKIE_PASSWORD;
const cookieName = env.SESSION_COOKIE_NAME;

const thirtyDays = 30 * 24 * 60 * 60;
const ttl = thirtyDays;

export const sessionOptions: SessionOptions = {
	cookieName,
	password,
	ttl,
	// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
	cookieOptions: {
		secure: !isDev,
		httpOnly: true,
	},
};

declare module "iron-session" {
	interface IronSessionData {
		user?: SessionUser;
	}
}

export const getSession = async (
	cookieJar: ReadonlyRequestCookies = cookies(),
): Promise<IronSession<{ user: SessionUser | null }>> => {
	const ironSession = (await getIronSession(
		cookieJar,
		sessionOptions,
	)) as IronSession<{ user: SessionUser | null }>;

	const luciaSession = await getAuthCookie("token");

	if (
		!luciaSession ||
		(ironSession.user?.provId && ironSession.user?.sessionId !== luciaSession)
	) {
		logger.warn(
			`Invalid session, lucia does not match iron: ${luciaSession} ${ironSession.user?.sessionId}`,
		);
		ironSession.user = null;
		return ironSession;
	}

	return ironSession;
};

export const withSessionRoute = (handler: NextApiHandler) => {
	return async (req, res) => {
		const session = await getIronSession(req, res, sessionOptions);

		req.session = session;

		return handler(req, res);
	};
};
