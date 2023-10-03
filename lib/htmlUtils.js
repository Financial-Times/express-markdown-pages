// https://www.w3.org/International/questions/qa-escapes#use
const ESCAPE_REGEXP = /["'&<>]/g;

const ESCAPE_MAP = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
};

function escapeChar(char) {
	return ESCAPE_MAP[char];
}

function escape(value) {
	if (!ESCAPE_REGEXP.test(value)) {
		return value;
	}

	return String(value).replace(ESCAPE_REGEXP, escapeChar);
}

module.exports = {
	escape,
};
