const PUSHOVER_TOKEN = process.env.PUSHOVER_TOKEN;
const PUSHOVER_USER = process.env.PUSHOVER_USER;

/*
POST /1/messages.json HTTP/1.1
Host: api.pushover.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 180

POST an HTTPS request to https://api.pushover.net/1/messages.json with the following parameters:

    token - your application's API token (required)
    user - your user/group key (or that of your target user), viewable when logged into our dashboard; often referred to as USER_KEY in our documentation and code examples (required)
    message - your message (required) 

Some optional parameters may also be included:

    attachment - an image attachment to send with the message (documentation)
    device - the name of one of your devices to send just to that device instead of all devices (documentation)
    html - set to 1 to enable HTML parsing (documentation)
    priority - a value of -2, -1, 0 (default), 1, or 2 (documentation)
    sound - the name of a supported sound to override your default sound choice (documentation)
    timestamp - a Unix timestamp of a time to display instead of when our API received it (documentation)
    title - your message's title, otherwise your app's name is used
    url - a supplementary URL to show with your message (documentation)
    url_title - a title for the URL specified as the url parameter, otherwise just the URL is shown (documentation) 

*/

const sounds = [
	"pushover",
	"bike",
	"bugle",
	"cashregister",
	"classical",
	"cosmic",
	"falling",
	"gamelan",
	"incoming",
	"intermission",
	"magic",
	"mechanical",
	"pianobar",
	"siren",
	"spacealarm",
	"tugboat",
	"alien",
	"climb",
	"persistent",
	"echo",
	"updown",
	"vibrate",
	"none",
] as const;

export const sendMessage = async ({
	message,
	title,
	url,
	url_title,
	sound,
	priority,
}: {
	message: string;
	title?: string;
	url?: string;
	url_title?: string;
	sound?: (typeof sounds)[number];
	priority?: -2 | -1 | 0 | 1 | 2;
}) => {
	if (typeof window !== "undefined" || typeof document !== "undefined") {
		console.error("Will not send pushover message from client side");
		return;
	}

	if (!PUSHOVER_TOKEN || !PUSHOVER_USER) {
		return;
	}

	if (typeof message === "undefined") {
		return;
	}

	if (typeof sound !== "undefined" && !sounds.includes(sound)) {
		console.error("Invalid sound", sound, "defaulting to pushover");
		sound = undefined;
	}

	const params: {
		[key: string]: string | number;
	} = {
		message: message.trim().replaceAll(/\s+/g, " "),
	};

	if (title) {
		params.title = title;
	}

	if (url && url_title) {
		params.url_title = url_title;
		params.url = url;
	}

	if (sound) {
		params.sound = sound;
	}

	if (priority) {
		params.priority = priority;
		if (priority === 2) {
			params.retry = 60;
			params.expire = 3600;
		}
	}

	const response = await fetch("https://api.pushover.net/1/messages.json", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			token: PUSHOVER_TOKEN,
			user: PUSHOVER_USER,
			...params,
		}),
	});

	const responseJson: {
		status: number;
		request: string;
	} = await response.json();

	const isSuccess = responseJson.status === 1 && response.status === 200;

	if (!isSuccess) {
		console.error("Pushover failed", responseJson);
		return false;
	}

	return true;
};
