const Loki = require('lokijs');
const imageData = require('../__fixtures__/imageData.json');

// NOTE: I looked into serializing and loading a real DB but it's far
// more confusing and means the fixture would require regular updates.
function createTestDB() {
	const db = new Loki('test.db');

	const images = db.addCollection('images');

	images.insert(imageData);

	return db;
}

module.exports = { createTestDB };
