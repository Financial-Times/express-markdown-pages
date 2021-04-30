# ---------------------------
# Generated by rel-engage

# This task tells make how to 'build' n-gage. It npm installs n-gage, and
# Once that's done it overwrites the file with its own contents - this
# ensures the timestamp on the file is recent, so make won't think the file
# is out of date and try to rebuild it every time
node_modules/@financial-times/rel-engage/index.mk:
	@echo "Updating rel-engage"
	@npm install --save-dev @financial-times/rel-engage
	@touch $@

# If, by the end of parsing your `Makefile`, `make` finds that any files
# referenced with `-include` don't exist or are out of date, it will run any
# tasks it finds that match the missing file. So if n-gage *is* installed
# it will just be included; if not, it will look for a task to run
-include node_modules/@financial-times/rel-engage/index.mk

# End generated by rel-engage
# ---------------------------

PROJECT_NAME=express-markdown-pages

verify:

install:

build:

run:
	npx nodemon app.js

test: unit-test

unit-test:
	npx jest $(if $(CI),--runInBand,--watch)

jsdoc:
	npx jsdoc2md -c jsdoc.json lib/MarkdownPages.js lib/sharedTypes.js > docs/jsdoc.md
