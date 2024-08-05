import { env } from "@/lib/env/server";
import type {
	AsyncReturnType,
	MSAuthGroup,
	MSAuthMe,
	MSProfile,
	Override,
} from "@/types";
import {
	generateCodeVerifier,
	generateState,
	MicrosoftEntraId,
	type MicrosoftEntraIdTokens,
} from "arctic";

export const entraId = new MicrosoftEntraId(
	env.MS_AUTH_DIRECTORY_ID,
	env.MS_AUTH_CLIENT_ID,
	env.MS_AUTH_CLIENT_SECRET,
	env.MS_AUTH_REDIRECT_URI,
);

export const msAuthScopes = ["User.Read", "GroupMember.Read.All"];
export const msGraphFetcher = async (
	route: string,
	accessToken: MicrosoftEntraIdTokens["accessToken"],
) => {
	const routeBase = `https://graph.microsoft.com/${route.startsWith("oidc") ? "" : "v1.0/"}`;
	const fullRoute = `${routeBase}${route}`;

	return await fetch(fullRoute, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
};

export const getMsAuthorizationUrl = async () => {
	const state = generateState();
	const verifier = generateCodeVerifier();
	const url = await entraId.createAuthorizationURL(state, verifier, {
		scopes: msAuthScopes,
	});

	return { state, verifier, url };
};

export type MSAuthUrl = Override<
	AsyncReturnType<typeof getMsAuthorizationUrl>,
	{ url: string | null }
>;

export const verifyMSToken = async (code: string, verifier: string) =>
	entraId.validateAuthorizationCode(code, verifier);

export const refreshMsAccess = async (refreshToken: string) =>
	entraId.refreshAccessToken(refreshToken);

export const getUserProfile = async (accessToken: string) => {
	const response = await msGraphFetcher("oidc/userinfo", accessToken);
	return (await response.json()) as MSProfile;
};

export const getUserGroups = async ({
	accessToken,
	msID,
}: { accessToken: string; msID?: string }) => {
	if (!accessToken && !msID) {
		console.error("Must provide an access token");
		return;
	}

	const urlSearch = msID ? `users/${msID}` : "me";
	const url = `${urlSearch}/memberOf?%24select=displayName%2Cid`;

	const response = await msGraphFetcher(url, accessToken);
	return (await response.json()) as { value: MSAuthGroup[] };
};

export const getMSUserData = async (accessToken: string) => {
	const [profile, me, groups] = await Promise.all([
		getUserProfile(accessToken),
		getUserMe(accessToken),
		getUserGroups({ accessToken }),
	]);

	return { profile, me, groups: groups?.value || [] };
};

export const getUserMe = async (accessToken: string) => {
	const response = await msGraphFetcher("me", accessToken);
	return (await response.json()) as MSAuthMe;
};
