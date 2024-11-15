import qotd from "$lib/server/qotd";

import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = () => {
  return qotd().then(json);
};
