#!/bin/bash
#
# Copy files into _site folder, and deploy site.
#
# Usage:
#   ./deploy.sh

# Delete all previous build files inside _site directory
rm -rf _site

# Run gulp to build sass files
gulp build

# Move files over to the _site deploy directory
mkdir _site
mkdir _site/css
mkdir _site/scripts
mkdir _site/images

cp -r src/css _site/
cp -r src/scripts _site/
cp -r src/images _site/
cp src/*.html _site/

# Create a commit and deploy to netlify
now=$(date)
git add -A
git commit --allow-empty -m "Deploying @ ${now}"
git push origin master
