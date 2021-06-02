const Loki = require('lokijs');
const pagesData = require('../fixtures/pagesData.json');
const imagesData = require('../fixtures/imagesData.json');

// NOTE: I looked into serializing and loading a real DB but it's far
// more confusing and means the fixture would require regular updates.
module.exports = function createTestDB() {
	const db = new Loki('test.db');

	db.addCollection('pages', { clone: true }).insert(pagesData);
	db.addCollection('images', { clone: true }).insert(imagesData);

	return db;
};
