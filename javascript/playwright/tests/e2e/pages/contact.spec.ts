import { test, expect } from "@playwright/test";
import { webserver } from "../../helpers/constants";

const pageLink = `${webserver}/contact`;

test("has title", async ({ page }) => {
	await page.goto(pageLink);

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Contact/);
});
