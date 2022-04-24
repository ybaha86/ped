#!/bin/zsh

[[ $TRACE != 0 && $TRACE != false ]] && set -x

source scripts/environments/common.environments

pre-run () {
  pre-requisites

  export RESULTS=${RESULTS_PATH:=tmp/results}/allure/$PLATFORM
  export REPORTS=${REPORTS_PATH:=tmp/reports}/allure/$PLATFORM
}

main () {
  pre-run

  ALLURE_OPTS=-Dallure.issues.tracker.pattern=$TICKET_URL \
  allure generate -c $RESULTS -o $REPORTS && allure open $REPORTS
}

main "$@"
