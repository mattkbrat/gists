const channels = [...document.querySelectorAll("#main-link.channel-link")].map(e => {
	const [, a, b] = e.href.match("/((?:user)|(?:channel))/(.*)$");
	const feed = "https://www.youtube.com/feeds/videos.xml?" + (a === "user" ? "user=" : "channel_id=") + b;
	const channelName = e.querySelector("yt-formatted-string.ytd-channel-name").innerText;
	return [feed, channelName];
});
if (channels.length == 0) {
	alert("Couldn't find any subscriptions");
} else {
	console.log(channels.map(([feed, _]) => feed).join("\n"));
	let opmlText = `<opml version="1.0"><head><title>YouTube Subscriptions as RSS</title></head><body><outline text="YouTube Subscriptions" title="YouTube Subscriptions"></outline>${channels
		.map(([feed, channelName]) => `<outline type="rss" text="${channelName}" title="${channelName}" xmlUrl="${feed}"/>`)
		.join("")}</outline></body></opml>`;
	const blob = new Blob([opmlText], { type: "text/plain" });
	const url = window.URL.createObjectURL(blob);
	const anchorTag = document.createElement("a");
	anchorTag.setAttribute("download", "youtube_subs.opml");
	anchorTag.setAttribute("href", url);
	anchorTag.dataset.downloadurl = `text/plain:youtube_subs.opml:${url}`;
	anchorTag.click();
}