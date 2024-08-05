const getClaims = () => {
	let buttondivs = Array.from(
		document.getElementsByClassName("item-card__claim-button"),
	);
	let claimButtons = buttondivs.map((div) => div.children[0]);
	let claims = claimButtons.filter(
		(b) =>
			b.getAttribute("aria-label").startsWith("Claim") &&
			b.tagName === "BUTTON",
	);
	claims.forEach((b) => b.click());
};

getClaims();
