#!/bin/sh

# this script assumes that you've cloned the project to the server with a git clone and have your
# github credentials and remotes set up.

echo "Pulling latest code..."
git reset --hard HEAD
git pull

# assuming you're using node-dev as recommended, the server should restart as needed to pick up changes

# if you're using git submodules, uncomment this line to ensure you get latest.
# (newer git does this by default - older git does not)
# git submodule update --init --recursive