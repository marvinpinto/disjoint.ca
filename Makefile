CONTAINER_IP = $(shell docker inspect --format '{{ .NetworkSettings.IPAddress }}' disjoint.ca)
HUGO_DATE = $(shell date +'%Y-%m-%d')

.PHONY: help
help:
	@echo Start with "make hugo" and go from there

.PHONY: install
install:
	bundle install
	go get -v github.com/spf13/hugo

.PHONY: post
post:
	hugo new writing/$(HUGO_DATE)-new-post.md

.PHONY: til
til:
	hugo new til/$(HUGO_DATE)-new-til.md

.PHONY: spellcheck
spellcheck:
	scripts/spellcheck.sh

.PHONY: html-proofer
html-proofer:
	bundle exec htmlproofer \
		--allow-hash-href \
		--report-script-embeds \
		--check-html \
		--only-4xx \
		--url-swap "https...disjoint.ca:" \
		./public

.PHONY: test
test: spellcheck html-proofer
	@echo "Everything looks good!"

.PHONY: server
server: install clean
	@echo ===========================================================
	@echo Head over to http://$(CONTAINER_IP):8080 for a live preview
	@echo ===========================================================
	hugo server \
		--bind="0.0.0.0" \
		--port=8080 \
		--baseUrl="http://$(CONTAINER_IP)" \
		--watch

.PHONY: generate
generate: install clean
	hugo

.PHONY: images
images:
	aws s3 sync --acl public-read --delete media/ s3://media.disjoint.ca

.PHONY: clean
clean:
	rm -rf public
