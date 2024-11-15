// /api/valid.ts

import type { NextApiRequest, NextApiResponse } from "next";

import { withSessionRoute } from "@/lib/session";
import { validateEmail } from "@/utils/client/validateEmail";
import { getExistingEmail } from "@/utils/prisma/user";
import getExistingUsername from "@/utils/prisma/user/getExistingUsername";

/**
 * Check if a username is valid by checking if it exists in the database.
 * If the user is logged in, first check
 * if the username is the same as the logged in user and return true if so.
 * @param req
 * @param res
 */
async function validUsernameHandler(
	req: NextApiRequest,
	res: NextApiResponse<{
		username: boolean;
		email: boolean;
		error?: string;
	}>,
) {
	const user = req.session?.user;

	const { username, email } = req.body;
	if (!username && !email) {
		return res.status(400).json({
			username: false,
			email: false,
			error: "Expected username and/or email in request body",
		});
	}

	const valid = {
		username: user?.username === username,
		email: user?.email === email,
	};

	if (!valid.username && username) {
		const usernameMatch = await getExistingUsername(username);
		valid.username = usernameMatch === null;
	}

	if (!valid.email && email) {
		const isEmail = validateEmail(email);
		if (isEmail) {
			const emailMatch = await getExistingEmail(email);

			valid.email = emailMatch === null;
		}
	}

	res.status(200).json(valid);
}

export default withSessionRoute(validUsernameHandler);