CONTAINER_IP = $(shell docker inspect --format '{{ .NetworkSettings.IPAddress }}' disjoint.ca)

.PHONY: help
help:
	@echo Start with "make hugo" and go from there

.PHONY: go
go:
	go get -v github.com/spf13/hugo

themes: go
	mkdir -p themes
	cd themes; git clone https://github.com/mpas/hugo-multi-bootswatch.git || true
	cd themes/hugo-multi-bootswatch; git reset --hard 247e43f9266784efecb42ede900e62cdcec50c3a

.PHONY: blog-post
blog-post: themes
	hugo new post/new-blog-post.md

spellcheck:
	scripts/spellcheck.sh

travis-linkchecker:
	linkchecker http://127.0.0.1:8080

server: clean themes
	@echo ===========================================================
	@echo Head over to http://$(CONTAINER_IP):8080 for a live preview
	@echo ===========================================================
	hugo server \
		--bind="0.0.0.0" \
		--port=8080 \
		--baseUrl="http://$(CONTAINER_IP)" \
		--watch

travis-server:
	hugo server \
		--bind="127.0.0.1" \
		--port=8080 \
		--baseUrl="http://127.0.0.1" \
		--watch=false

.PHONY: generate
generate: clean themes
	hugo

images:
	aws s3 sync --acl public-read --delete media/ s3://media.disjoint.ca

.PHONY: clean
clean:
	rm -rf public
	rm -f Gemfile.lock

.PHONY: clean-all
clean-all: clean
	rm -rf themes
	rm -rf /tmp/go
