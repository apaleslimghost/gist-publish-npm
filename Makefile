all: $(patsubst src/%.js, lib/%.js, $(wildcard src/*.js))

lib/%.js: src/%.js
	@mkdir -p $(@D)
	node_modules/.bin/async-to-gen -o $@ $<
