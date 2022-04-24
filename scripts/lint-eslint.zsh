#!/bin/zsh

main () {
  git diff --diff-filter=d --cached --name-only -z -- '*.ts' \
  | xargs -0 -I % sh -c 'git show ":%" | ./node_modules/.bin/eslint --stdin --stdin-filename "%";'
}

main "$@"
