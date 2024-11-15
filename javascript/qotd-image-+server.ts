import { json } from "@sveltejs/kit";
import redis from "$lib/server/redis";
import { fetchUnsplash } from "$lib/server/unsplash/fetch.js";
import { cachedQuery } from "$lib/server/unsplash/cachedQuery.js";

export async function GET({ url }) {
  const force = url.searchParams.get("force");

  const query = await cachedQuery();

  const cacheKey = `unsplash:${query}`;

  const cached = force !== "true" && (await redis(cacheKey));

  if (typeof cached === "string") {
    return json(JSON.parse(cached) as QOTD.Unsplash);
  }

  const relevant = await fetchUnsplash(query);

  await redis(cacheKey, {
    value: JSON.stringify(relevant),
    expire: 3000,
    method: "set",
  });

  return json(relevant);
}
