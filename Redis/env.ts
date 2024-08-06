import { z } from "zod";

import { createEnv } from "@t3-oss/env-nextjs";
import { isDev } from "../isDev";

const envNumber = z
	.string()
	.transform((s) => Number.parseInt(s, 10))
	.pipe(z.number());

export const env = createEnv({
	server: {
		REDIS_HOST_LOCAL: z.string(),
		REDIS_HOST: z.string(),
		REDIS_PORT: envNumber,
		REDIS_PORT_LOCAL: envNumber,
		REDIS_PASS: z.string(),
		REDIS_PASS_LOCAL: z.string(),
		REDIS_DB: envNumber,
		REDIS_DB_2: envNumber,
	},
});
