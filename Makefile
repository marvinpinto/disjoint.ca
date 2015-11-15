CONTAINER_IP = $(shell docker inspect --format '{{ .NetworkSettings.IPAddress }}' blog)

.PHONY: help
help:
	@echo Start with "make hugo" and go from there

.PHONY: go
go:
	mkdir -p /tmp/go
	GOPATH=/tmp/go go get -v github.com/spf13/hugo

themes:
	mkdir -p themes
	cd themes; git clone https://github.com/mpas/hugo-multi-bootswatch.git
	cd themes/hugo-multi-bootswatch; git reset --hard 247e43f9266784efecb42ede900e62cdcec50c3a

.PHONY: blog-post
blog-post: go themes
	/tmp/go/bin/hugo new post/new-blog-post.md

server: clean themes
	@echo ===========================================================
	@echo Head over to http://$(CONTAINER_IP):8080 for a live preview
	@echo ===========================================================
	/tmp/go/bin/hugo server \
		--bind="0.0.0.0" \
		--port=8080 \
		--baseUrl="http://$(CONTAINER_IP)" \
		--watch

.PHONY: clean
clean:
	rm -rf public

.PHONY: clean-all
clean-all: clean
	rm -rf themes
	rm -rf /tmp/go