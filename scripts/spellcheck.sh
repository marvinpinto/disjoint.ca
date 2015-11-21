#!/bin/bash

MISSPELT_WORDS=$(find ./README.md content -name "*.md" -exec cat {} \; | aspell \
  --personal=./spellcheck_ignore_words \
  --mode=html \
  list | sort -u)

if [ -n "${MISSPELT_WORDS}" ]; then
  echo "==========================="
  echo "Possible spelling mistakes?"
  echo "==========================="
  echo "${MISSPELT_WORDS}"
  exit 1
fi
