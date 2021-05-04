const subject = require('../describeEmoji');

describe('lib/markdown/describeEmoji', () => {
	it('wraps emoji characters with descriptive text', () => {
		const result = subject.describeEmoji('Hello 🐶');
		expect(result).toContain('aria-label="dog">🐶</');
	});

	it('replaces underscores in emoji name with a space', () => {
		const result = subject.describeEmoji('Hello 🦊');
		expect(result).toContain('aria-label="fox face">🦊</');
	});
});
