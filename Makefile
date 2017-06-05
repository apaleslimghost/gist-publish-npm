src-files = $(wildcard src/*.js)
lib-files = $(patsubst src/%, lib/%, $(src-files))

all: $(lib-files)

lib/%: src/% lib
	node_modules/.bin/async-to-gen $< > $@

lib:
	mkdir -p $@
