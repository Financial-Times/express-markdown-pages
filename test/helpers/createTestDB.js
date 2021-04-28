const Loki = require('lokijs');
const pagesData = require('../fixtures/pagesData.json');
const imagesData = require('../fixtures/imagesData.json');

// NOTE: I looked into serializing and loading a real DB but it's far
// more confusing and means the fixture would require regular updates.
function createTestDB() {
	const db = new Loki('test.db');

	const pages = db.addCollection('pages');

	pages.insert(pagesData);

	const images = db.addCollection('images');

	images.insert(imagesData);

	return db;
}

module.exports = { createTestDB };
