/// !-----------------------------------------------------------------------------------------------------------
//  |  `digest-fetch` is a wrapper of `node-fetch` or `fetch` to provide http digest authentication boostraping.
//  |  I have prepared this class class as a solution for the problem of http digest authentication in nodejs
//  |  and import issues with digest-fetch. Able to ignore cert issues with the help of undici.
/// !-----------------------------------------------------------------------------------------------------------

import type { AnyObject } from "../types/AnyObject";
// import type { HTTP_METHOD } from "next/dist/server/web/http";
import base64 from "base-64";
import md5 from "md5";
import { handleFetch, type RequestBody } from "./undiciFetcher";
import type { Dispatcher } from "undici";
// import type { HttpHeaders } from "@elastic/elasticsearch/lib/api/types";
type Headers = Request["headers"] & { Authorization: unknown };

const algorithm = "MD5";

type HTTP_METHOD = "GET" | "POST" | "OPTIONS" | "PUT";

type AuthOptions = {
	method?: HTTP_METHOD;
	headers?: Headers;
	factory?: () => AnyObject;
};

const parse = (raw: string, field: string, trim = true) => {
	const regex = new RegExp(`${field}=("[^"]*"|[^,]*)`, "i");
	const match = regex.exec(raw);
	if (!match || !match[1]) return null;
	if (match) return trim ? match[1].replace(/[\s"]/g, "") : match[1];
	return null;
};

/**
 * DigestClient is a wrapper of undici's fetch to provide http digest authentication boostraping.
 */
export default class DigestClient {
	get lastAuth(): unknown {
		return this._lastAuth;
	}

	set lastAuth(value: unknown) {
		this._lastAuth = value;
	}

	private readonly user: string;
	private readonly password: string;
	private readonly nonceRaw: string;
	private readonly hashFunc: typeof md5;
	private readonly logger: AnyObject;
	private readonly precomputedHash: unknown;
	private digest: AnyObject;
	private hasAuth: boolean;
	private readonly cnonceSize: number;
	private readonly statusCode: number;
	private readonly basic: boolean;
	private _lastAuth: unknown;

	constructor(user: string, password: string, options: AnyObject = {}) {
		this.user = user;
		this.hashFunc = md5;
		this.password = password;
		this.nonceRaw = "abcdef0123456789";
		this.logger = options.logger as AnyObject;
		this.precomputedHash = options.precomputedHash;

		this.digest = { nc: 0, algorithm, realm: "" };
		this.hasAuth = false;
		const _cnonceSize = Number.parseInt(options.cnonceSize);
		this.cnonceSize = Number.isNaN(_cnonceSize) ? 32 : _cnonceSize; // cnonce length 32 as default

		// Custom authentication failure code for avoiding browser prompt:
		// https://stackoverflow.com/questions/9859627/how-to-prevent-browser-to-invoke-basic-auth-popup-and-handle-401-error-using-jqu
		this.statusCode = options.statusCode;
		this.basic = options.basic || false;
	}

	async fetch(
		url: string,
		options: AuthOptions = {},
		body?: RequestBody,
		dispatcher?: Dispatcher,
		headers?: HttpHeaders,
		localServer = true,
	) {
		const resp = await handleFetch(url, {
			...(this.basic ? this.addBasicAuth(options) : this.addAuth(url, options)),
			body,
			localServer,
			fetchAsReadable: url.includes("?mode=text"),
			dispatcher,
			headers,
		}).catch((e) => {
			console.error("Failed to fetch", e);
		});

		if (!resp) return;

		if (this.basic) {
			return resp;
		}

		const hasStatusCode = "statusCode" in resp;
		const status = hasStatusCode ? resp.statusCode : resp.status;
		const auth =
			(hasStatusCode
				? resp.headers["www-authenticate"]
				: resp.headers.get("www-authenticate")) || null;

		if (
			!Array.isArray(auth) &&
			(status === 401 || (status === this.statusCode && this.statusCode))
		) {
			this.hasAuth = false;
			this.parseAuth(auth);
			if (this.hasAuth) {
				const respFinal = await fetch(url, {
					...this.addAuth(url, options),
					body,
				});
				if (respFinal.status === 401 || respFinal.status === this.statusCode) {
					this.hasAuth = false;
				} else {
					this.digest.nc++;
				}
				return respFinal;
			}
		} else this.digest.nc++;

		return resp;
	}

	addBasicAuth(options: AuthOptions = {}) {
		let _options: AuthOptions;
		if (typeof options.factory === "function") {
			_options = options.factory();
		} else {
			_options = options;
		}

		const auth = `Basic ${base64.encode(`${this.user}:${this.password}`)}`;
		_options.headers = _options.headers || ({} as Headers);
		_options.headers.Authorization = auth;
		if (typeof _options.headers.set === "function") {
			_options.headers.set("Authorization", auth);
		}

		if (this.logger) this.logger.debug(options);
		return _options;
	}

	computeHash(user: string, realm: string, password: string) {
		return this.hashWithAlgorithm(`${user}:${realm}:${password}`);
	}

	hashWithAlgorithm(data: string) {
		return this.hashFunc(data);
	}

	addAuth(
		url:
			| {
					url?: string;
			  }
			| string,
		options: AuthOptions,
	) {
		if (typeof options.factory === "function") options = options.factory();
		if (!this.hasAuth) return options;
		if (this.logger) this.logger.info("requesting with auth carried");

		const isRequest = typeof url === "object" && typeof url.url === "string";
		const urlStr = isRequest ? url.url : (url as string);
		if (!urlStr) throw new Error("url is required");
		const _url = urlStr?.replace("//", "");
		const uri = _url.indexOf("/") === -1 ? "/" : _url.slice(_url.indexOf("/"));
		const method = options.method ? options.method.toUpperCase() : "GET";

		let ha1 = this.precomputedHash
			? this.password
			: this.computeHash(this.user, this.digest.realm, this.password);
		if (this.digest.algorithm.endsWith("-sess")) {
			ha1 = this.hashWithAlgorithm(
				`${ha1}:${this.digest.nonce}:${this.digest.cnonce}`,
			);
		}

		// optional Hash(entityBody) for 'auth-int'
		const _ha2 = "";
		if (this.digest.qop === "auth-int") {
			// not implemented for auth-int
			if (this.logger)
				this.logger.warn("Sorry, auth-int is not implemented in this plugin");
			// const entityBody = xxx
			// _ha2 = ':' + hash(entityBody)
		}
		const ha2 = this.hashWithAlgorithm(`${method}:${uri}${_ha2}`);

		const ncString = `00000000${this.digest.nc}`.slice(-8);

		let _response = `${ha1}:${this.digest.nonce}:${ncString}:${this.digest.cnonce}:${this.digest.qop}:${ha2}`;
		if (!this.digest.qop) _response = `${ha1}:${this.digest.nonce}:${ha2}`;
		const response = this.hashWithAlgorithm(_response);

		const opaqueString =
			this.digest.opaque !== null ? `opaque="${this.digest.opaque}",` : "";
		const qopString = this.digest.qop ? `qop=${this.digest.qop},` : "";
		const digest = `${this.digest.scheme} username="${this.user}",realm="${this.digest.realm}",\
nonce="${this.digest.nonce}",uri="${uri}",${opaqueString}${qopString}\
algorithm=${this.digest.algorithm},response="${response}",nc=${ncString},cnonce="${this.digest.cnonce}"`;
		options.headers = options.headers || ({} as Headers);
		options.headers.Authorization = digest;
		if (typeof options.headers.set === "function") {
			options.headers.set("Authorization", digest);
		}

		// const {factory, ..._options} = options
		const _options: AuthOptions = {};
		Object.assign(_options, options);
		_options.factory = undefined;
		return _options;
	}

	parseAuth(h: string | null) {
		this._lastAuth = h;

		if (!h || h.length < 5) {
			this.hasAuth = false;
			return;
		}

		this.hasAuth = true;

		this.digest.scheme = h.split(/\s/)[0];

		this.digest.realm = (parse(h, "realm", false) || "").replace(/["]/g, "");

		this.digest.qop = this.parseQop(h);

		this.digest.opaque = parse(h, "opaque");

		this.digest.nonce = parse(h, "nonce") || "";

		this.digest.cnonce = this.makeNonce();
		this.digest.nc++;
	}

	parseQop(rawAuth: string) {
		// Following https://en.wikipedia.org/wiki/Digest_access_authentication
		// to parse valid qop
		// Samples
		// : qop="auth,auth-init",realm=
		// : qop=auth,realm=
		const _qop = parse(rawAuth, "qop");

		if (_qop !== null) {
			const qops = _qop.split(",");
			if (qops.includes("auth")) return "auth";
			if (qops.includes("auth-int")) return "auth-int";
		}
		// when not specified
		return null;
	}

	makeNonce() {
		let uid = "";
		for (let i = 0; i < this.cnonceSize; ++i) {
			uid += this.nonceRaw[Math.floor(Math.random() * this.nonceRaw.length)];
		}
		return uid;
	}

	static parse(...args: [string, string, boolean]) {
		return parse(...args);
	}
}
