all: $(patsubst src/%.js, lib/%.js, $(wildcard src/*.js))

lib/%.js: src/%.js
	@mkdir -p $(@D)
	node_modules/.bin/babel --optional runtime -o $@ $<
