#!/bin/zsh

[[ $TRACE != 0 && $TRACE != false ]] && set -x

source scripts/environments/common.environments

pre-run () {
  pre-requisites

  [[ -z $BUILD_CAUSE ]] && rm -rf $RESULTS_PATH $REPORTS_PATH

  [[ ! -d node_modules ]] && npm install
}

automate () {
  wdio run config/$PLATFORM.ts $@
}

main () {
  pre-run

  for feature in ${(f)SPEC}; do
    automate --spec $feature $@
  done

  if [[ -z "$SPEC" ]]; then
    automate $@
  fi
}

main "$@"
