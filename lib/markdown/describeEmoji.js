const emojiRegex = require('emoji-regex')();
// NOTE: gemoji v7+ uses ESM so stick to v6 which is just JSON
const emojiToName = require('gemoji/emoji-to-name.json');

function describeEmoji(text) {
	return text.replace(emojiRegex, emoji => {
		const name = emojiToName[emoji]?.replace(/_/g, ' ');
		return `<span role="img" aria-label="${name}">${emoji}</span>`;
	});
}

module.exports = { describeEmoji };
