import { Agent, type Dispatcher, request, setGlobalDispatcher } from "undici";

import CacheableLookup from "cacheable-lookup";
const cache = new CacheableLookup();
const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
    autoSelectFamily: true,
    lookup: cache.lookupAsync,
  },
  keepAliveMaxTimeout: 100 * 1000,
  keepAliveTimeout: 100 * 1000,
});

setGlobalDispatcher(agent);

export type RequestBody = string | Buffer | Uint8Array | null;
export const handleFetch = async (
  url: string,
  {
    localServer,
    fetchAsReadable,
    body,
    dispatcher,
    ...rest
  }: { localServer: boolean; body?: RequestBody; dispatcher?: Dispatcher } & {
    [key: string]: unknown;
  },
) => {
  return request(url, {
    ...rest,
    headersTimeout: 10_000,
    bodyTimeout: 10_000,
    dispatcher,
    body: body instanceof ArrayBuffer ? Buffer.from(body) : body,
  });
};
