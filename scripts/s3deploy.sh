#!/bin/bash
s3cmd del --recursive --force s3://disjoint.ca
s3cmd sync --verbose --delete-removed ./public/ s3://disjoint.ca/
