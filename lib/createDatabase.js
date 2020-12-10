const Loki = require('lokijs');
const { createPages } = require('./createPages');
const { createImages } = require('./createImages');

/**
 * Create database
 * @param {import('./index').Options} options
 * @returns {Promise<Loki>}
 */
async function createDatabase(options) {
	// Loki is a simple in-memory database designed to be similar to NoSQL.
	// https://github.com/techfort/LokiJS
	const db = new Loki();

	const pages = await createPages(options);

	const pageCollection = db.addCollection('pages', {
		unique: ['id', 'slug'],
		disableMeta: true,
	});

	pageCollection.insert(pages);

	const images = await createImages(options);

	const imageCollection = db.addCollection('images', {
		unique: ['id', 'slug'],
		disableMeta: true,
	});

	imageCollection.insert(images);

	return db;
}

module.exports = { createDatabase };
