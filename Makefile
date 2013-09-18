test:
	npm config set stylobate:whatToTest $(test) && \
	npm test && \
	npm config set stylobate:whatToTest '**'

.PHONY: test
