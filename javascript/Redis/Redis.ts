import { env } from "./env/server";
import { isDev } from "./isDev";
import { createClient } from "redis";

type RedisMethod =
	| "set"
	| "get"
	| "del"
	| "scan"
	| "ttl"
	| "flushall"
	| "publish";

const getUrl = (database: number) => {
	const {
		REDIS_HOST,
		REDIS_HOST_LOCAL,
		REDIS_PASS,
		REDIS_PORT_LOCAL,
		REDIS_PORT,
		REDIS_PASS_LOCAL,
	} = env;

	const host = isDev ? REDIS_HOST_LOCAL : REDIS_HOST;
	const pass = isDev ? REDIS_PASS_LOCAL : REDIS_PASS;
	const port = isDev ? REDIS_PORT_LOCAL : REDIS_PORT;

	const REDIS_STRING = `redis://:${pass}@${host}:${port}/${database}`;

	return REDIS_STRING;
};

type RedisParams = {
	value?: string;
	method?: RedisMethod;
	expire?: number;
	db?: number;
	key?: string;
};

export default class Redis {
	private key: string;
	private value?: string;
	private method?: RedisMethod;
	private expire?: number;
	private db?: number;
	private client: any; // TODO: Find the right type

	setValues(p: RedisParams) {
		for (const [k, v] of Object.entries(p)) {
			this[k] = v;
		}
		if (!this.client) {
			const url = getUrl(p.db || 0);
			this.client = createClient({
				url,
			});
		}
	}
	constructor(
		key: string,
		p: RedisParams | undefined = {
			db: 0,
		},
	) {
		this.key = key;
		this.setValues(p);
	}

	async get() {
		await this.client.connect();
		const getResult = await this.client.get(this.key);
		await this.client.disconnect();
		return getResult;
	}

	async set() {
		await this.client.connect();
		await this.client.set(this.key, this.value, {
			EX: this.expire,
		});
		await this.client.disconnect();
	}

	async del() {
		await this.client.connect();
		await this.client.del(this.key);
		await this.client.disconnect();
	}

	async scan(): Promise<unknown[] | null> {
		await this.client.connect();
		const getResult = await this.client.keys(this.key || "*");
		await this.client.disconnect();
		return getResult;
	}

	async ttl() {
		await this.client.connect();
		const getResult = await this.client.ttl(this.key);
		await this.client.disconnect();
		return getResult;
	}

	async flushall() {
		await this.client.connect();
		const getResult = await this.client.sendCommand(["FLUSHALL"]);
		await this.client.disconnect();
		return getResult;
	}

	async publish() {
		await this.client.connect();
		const getResult = await this.client.sendCommand([
			"PUBLISH",
			this.key,
			this.value,
		]);

		await this.client.disconnect();
		return getResult;
	}

	async run() {
		switch (this.method) {
			case "set":
				if (!this.value) {
					throw "Missing value";
				}

				if (typeof this.expire === "undefined") {
					this.expire = 60 * 60 * 24 * 7; // 1 week
				}

				await this.set();

				break;
			case "del":
				await this.del();
				break;
			case "scan":
				return await this.scan();
			case "ttl":
				return await this.ttl();
			case "flushall":
				return await this.flushall();
			default:
				return await this.get();
		}
	}
}

// ex: const value = new Redis('key', { method: 'get' });
