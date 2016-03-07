CONTAINER_IP = $(shell docker inspect --format '{{ .NetworkSettings.IPAddress }}' disjoint.ca)
HUGO_DATE = $(shell date +'%Y-%m-%d')

.PHONY: help
help:
	@echo Start with "make hugo" and go from there

hugo_0.15_linux_amd64/hugo:
	wget https://github.com/spf13/hugo/releases/download/v0.15/hugo_0.15_linux_amd64.tar.gz -O /tmp/hugo.tar.gz
	tar -xvf /tmp/hugo.tar.gz
	mv hugo_0.15_linux_amd64/hugo_0.15_linux_amd64 hugo_0.15_linux_amd64/hugo

.PHONY: install
install: hugo_0.15_linux_amd64/hugo
	bundle install
	pip install --user html5validator

.PHONY: post
post:
	hugo new writing/$(HUGO_DATE)-new-post.md

.PHONY: til
til:
	hugo new til/$(HUGO_DATE)-new-til.md

.PHONY: spellcheck
spellcheck:
	scripts/spellcheck.sh

.PHONY: html5validator
html5validator:
	html5validator --root public/

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
test: spellcheck html-proofer html5validator
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
