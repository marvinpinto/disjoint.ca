CONTAINER_IP = $(shell docker inspect --format '{{ .NetworkSettings.IPAddress }}' disjoint.ca)
HUGO_DATE = $(shell date +'%Y-%m-%d')

.PHONY: help
help:
	@echo Start with "make hugo" and go from there

.PHONY: install
install: clean
	pip install --user linkchecker
	go get -v github.com/spf13/hugo

.PHONY: post
post:
	hugo new writing/$(HUGO_DATE)-new-post.md

.PHONY: til
til:
	hugo new til/$(HUGO_DATE)-new-til.md

spellcheck:
	scripts/spellcheck.sh

travis-linkchecker:
	linkchecker http://127.0.0.1:8080

server: install clean
	@echo ===========================================================
	@echo Head over to http://$(CONTAINER_IP):8080 for a live preview
	@echo ===========================================================
	hugo server \
		--bind="0.0.0.0" \
		--port=8080 \
		--baseUrl="http://$(CONTAINER_IP)" \
		--watch

travis-server: install
	hugo server \
		--bind="127.0.0.1" \
		--port=8080 \
		--baseUrl="http://127.0.0.1" \
		--watch=false

.PHONY: generate
generate: install clean
	hugo

images:
	aws s3 sync --acl public-read --delete media/ s3://media.disjoint.ca

.PHONY: clean
clean:
	rm -rf public
