CONTAINER_IP = $(shell docker inspect --format '{{ .NetworkSettings.IPAddress }}' disjoint.ca)
HUGO_DATE = $(shell date +'%Y-%m-%d')
HUGO = tmp/workspace/mygo/bin/hugo
CWD = $(shell pwd)

.PHONY: help
help:
	@echo Start with "make hugo" and go from there

hugo_0.15_linux_amd64/hugo:
	wget https://github.com/spf13/hugo/releases/download/v0.15/hugo_0.15_linux_amd64.tar.gz -O /tmp/hugo.tar.gz
	tar -xvf /tmp/hugo.tar.gz
	mv hugo_0.15_linux_amd64/hugo_0.15_linux_amd64 hugo_0.15_linux_amd64/hugo

.PHONY: hugo
hugo:
	mkdir -p tmp/workspace/mygo/src/github.com/spf13
	cd tmp/workspace/mygo/src/github.com/spf13 && git clone https://github.com/marvinpinto/hugo.git || true
	cd tmp/workspace/mygo/src/github.com/spf13/hugo && git checkout -f origin/fix-meta-refresh
	cd tmp/workspace/mygo/src/github.com/spf13/hugo && GOPATH=$(CWD)/tmp/workspace/mygo go get -v ./...

.PHONY: install
install: hugo_0.15_linux_amd64/hugo
	npm install
	bundle install
	pip install --user html5validator
	pip install --user Pygments

.PHONY: post
post:
	$(HUGO) new writing/$(HUGO_DATE)-new-post.md

.PHONY: til
til:
	$(HUGO) new til/$(HUGO_DATE)-new-til.md

.PHONY: spellcheck
spellcheck:
	scripts/spellcheck.sh

.PHONY: bootlint
bootlint:
	find public/ -type f -name "*.html" -exec \
		`npm bin`/bootlint --disable "E045,W001,W002,W003,W005" \
		{} +

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
test: spellcheck html-proofer html5validator bootlint
	@echo "Everything looks good!"

.PHONY: server
server: install clean assets
	@echo ===========================================================
	@echo Head over to http://$(CONTAINER_IP):8080 for a live preview
	@echo ===========================================================
	$(HUGO) server \
		--bind="0.0.0.0" \
		--port=8080 \
		--baseUrl="http://$(CONTAINER_IP)" \
		--watch

.PHONY: build-css
build-css:
	mkdir -p static/css
	bundle exec sass \
		--style compressed \
		--sourcemap=inline \
		assets/css/main.scss \
		static/css/disjoint-ca.min.css

.PHONY: build-js
build-js:
	mkdir -p build/js
	wget -O build/js/analytics.js https://www.google-analytics.com/analytics.js
	mkdir -p static/js
	`npm bin`/uglifyjs \
		node_modules/jquery/dist/jquery.js \
		node_modules/bootstrap-sass/assets/javascripts/bootstrap.js \
		build/js/analytics.js \
		assets/js/main.js \
		--compress \
		--screw-ie8 \
		--output static/js/disjoint-ca.min.js \
		--source-map static/js/disjoint-ca.min.js.map \
		--source-map-root "/js" \
		--source-map-url "/js/disjoint-ca.min.js.map" \
		--source-map-include-sources \
		-p relative

.PHONY: build-fonts
build-fonts:
	mkdir -p build/css
	`npm bin`/webfont-dl \
		"https://fonts.googleapis.com/css?family=Ubuntu:bold" \
		--out=build/css/_ubuntu.scss \
		--font-out=static/fonts/ \
		--css-rel=../fonts \
		--woff1=link \
		--woff2=link
	`npm bin`/webfont-dl \
		"https://fonts.googleapis.com/css?family=Rancho" \
		--out=build/css/_rancho.scss \
		--font-out=static/fonts/ \
		--css-rel=../fonts \
		--woff1=link \
		--woff2=link
	`npm bin`/webfont-dl \
		"https://fonts.googleapis.com/css?family=Gudea" \
		--out=build/css/_gudea.scss \
		--font-out=static/fonts/ \
		--css-rel=../fonts \
		--woff1=link \
		--woff2=link
	mkdir -p static/fonts
	cp node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff2 static/fonts/
	cp node_modules/font-awesome/fonts/fontawesome-webfont.woff2 static/fonts/

.PHONY: assets
assets: build-js build-fonts build-css
	@echo "Assets rebuilt!"

.PHONY: generate
generate: install clean assets
	$(HUGO)

.PHONY: images
images:
	aws s3 sync --acl public-read --delete media/ s3://media.disjoint.ca

.PHONY: clean
clean:
	rm -rf public
	rm -rf static
	rm -rf build

.PHONY: clean-all
clean-all: clean
	rm -rf hugo_0.15_linux_amd64
	rm -rf tmp
