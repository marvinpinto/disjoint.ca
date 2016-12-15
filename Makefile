CONTAINER_IP = $(shell hostname --ip-address)
HUGO_DATE = $(shell date +'%Y-%m-%d')
HUGO = tmp/workspace/mygo/bin/hugo
CWD = $(shell pwd)

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'

hugo_0.15_linux_amd64/hugo:
	wget --no-verbose https://github.com/spf13/hugo/releases/download/v0.15/hugo_0.15_linux_amd64.tar.gz -O /tmp/hugo.tar.gz
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
post:  ## Create a new blog post
	$(HUGO) new writing/$(HUGO_DATE)-new-post.md

.PHONY: til
til:  ## Create a new TIL post
	$(HUGO) new til/$(HUGO_DATE)-new-til.md

.PHONY: spellcheck
spellcheck:
	@echo "personal_ws-1.1 en 1" > spellcheck_ignore_words
	@find ./README.md content -name "*.md" -exec cat {} \; | aspell \
		--mode=html \
		list | sort -u >> spellcheck_ignore_words
	@echo "File spellcheck_ignore_words updated! Make sure it looks good"

.PHONY: bootlint
bootlint:
	find public/ -type f -name "*.html" -exec \
		`npm bin`/bootlint --disable "E045,W001,W002,W003,W005,E013,E028" \
		{} +

.PHONY: html5validator
html5validator:
	html5validator \
		--blacklist resume \
		--root public/

.PHONY: html-proofer
html-proofer:
	bundle exec htmlproofer \
		--allow-hash-href \
		--report-script-embeds \
		--check-html \
		--only-4xx \
		--url-swap "https...disjoint.ca:" \
		--file-ignore ./public/resume/marvin-pinto-resume.html \
		./public

.PHONY: test
test: spellcheck html-proofer html5validator bootlint  ## Perform a basic set of smoke tests
	@echo "Everything looks good!"

.PHONY: server
server: install clean assets resume  ## Run a local version of the disjoint.ca website
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
	mkdir -p build/css
	wget --no-verbose -O build/css/_selection_sharer.scss https://raw.githubusercontent.com/xdamman/selection-sharer/b32d15f1828c7e553774271f6d07599e96573975/dist/selection-sharer.css
	mkdir -p static/css
	bundle exec sass \
		--style compressed \
		--sourcemap=inline \
		assets/css/main.scss \
		static/css/disjoint-ca.min.css

.PHONY: build-js
build-js:
	mkdir -p build/js
	wget --no-verbose -O build/js/selection-sharer.js https://raw.githubusercontent.com/xdamman/selection-sharer/18cc7806c685bc01ed0b4b920a27ef7f88eee9c1/dist/selection-sharer.js
	wget --no-verbose -O build/js/analytics.js https://www.google-analytics.com/analytics.js
	wget --no-verbose -O build/js/widgets.js https://platform.twitter.com/widgets.js
	wget --no-verbose -O build/js/adsbygoogle.js https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js
	mkdir -p static/js
	`npm bin`/uglifyjs \
		node_modules/jquery/dist/jquery.js \
		node_modules/bootstrap-sass/assets/javascripts/bootstrap.js \
		build/js/analytics.js \
		node_modules/iframe-resizer/js/iframeResizer.js \
		node_modules/iframe-resizer/js/iframeResizer.contentWindow.js \
		build/js/selection-sharer.js \
		build/js/widgets.js \
		build/js/adsbygoogle.js \
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
	`npm bin`/webfont-dl \
		"https://fonts.googleapis.com/css?family=Oswald" \
		--out=build/css/_oswald.scss \
		--font-out=static/fonts/ \
		--css-rel=../fonts \
		--woff1=link \
		--woff2=link
	mkdir -p static/fonts
	cp node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.* static/fonts/
	cp node_modules/font-awesome/fonts/fontawesome-webfont.* static/fonts/

.PHONY: build-images
build-images:
	@mkdir -p static/images
	@for file in assets/images/*.jpg; do convert -strip -interlace Plane -sampling-factor 4:2:0 -define jpeg:dct-method=float -quality 85% $$file static/images/`basename $$file`; done
	@cp assets/images/*.png static/images/

.PHONY: assets
assets: build-js build-fonts build-css build-images
	@echo "Assets rebuilt!"

.PHONY: resume
resume:
	rm -rf static/resume
	mkdir -p static/resume
	mkdir -p build/resume
	python -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' < resume.yaml > build/resume/resume.json
	`npm bin`/hackmyresume BUILD build/resume/resume.json \
		TO \
			static/resume/marvin-pinto-resume.pdf \
			static/resume/marvin-pinto-resume.html \
			static/resume/marvin-pinto-resume.txt \
		-t positive \
		--pdf wkhtmltopdf
	rm -f static/resume/*.pdf.html static/resume/*.css

.PHONY: generate
generate: install clean assets resume
	$(HUGO)

.PHONY: clean
clean:
	rm -rf public
	rm -rf static
	rm -rf build

.PHONY: clean-all
clean-all: clean
	rm -rf hugo_0.15_linux_amd64
	rm -rf tmp
	rm -rf node_modules
