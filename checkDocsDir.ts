import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export const homeDir = os.homedir();

export type CheckDocsDirParams = {
	createIfNotExists?: boolean;
	checkPath?: string;
};


/**
 * Checks that the app's documents directory exists.
 */
export const checkDocsDir = ({
	createIfNotExists = true,
	checkPath = "documents",
}: CheckDocsDirParams = {}) => {
	const expectedPath = path.join(homeDir, "/.autoflp", `/${checkPath}`);
	const doesExist = fs.existsSync(expectedPath);
	console.debug({ checkPath, doesExist, expectedPath });
	if (doesExist || !createIfNotExists) return doesExist ? expectedPath : null;
	fs.mkdirSync(expectedPath, { recursive: true });
	return expectedPath;
};
