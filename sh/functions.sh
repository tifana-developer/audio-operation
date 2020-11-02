#!/usr/bin/env bash

function error {
  echo "$@" 1>&2
}

function abort {
  echo "$@" 1>&2
  exit 1
}
