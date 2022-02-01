const emojiRegex = require('emoji-regex/RGI_Emoji');
// NOTE: gemoji v7 uses ESM so stick to v6 which is just JSON for now
const emojiToName = require('gemoji/emoji-to-name');

function describeEmoji(text) {
	const pattern = emojiRegex();

	return text.replace(pattern, emoji => {
		const name = emojiToName[emoji]?.replace(/_/g, ' ');
		return `<span role="img" aria-label="${name}">${emoji}</span>`;
	});
}

module.exports = { describeEmoji };
