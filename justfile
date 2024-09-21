current-dir := invocation_directory()

alias test := _test-all   

test-frontend $COURSEFULL_ENV='Test': _check-test-server
    # cd client && op run --env-file={{current-dir}}/.env.tpl -- pnpm build
    # cp -r client/out/* public/
    cd client && op run --env-file={{current-dir}}/.env.tpl -- pnpm test

test-backend $COURSEFULL_ENV='Test': _check-test-server
    op run --env-file={{current-dir}}/.env.tpl -- bundle exec rspec

_test-all: _check-test-server
    just test-backend
    just test-frontend

_check-test-server:
    nc -z localhost 5100

test-server:
    #!/usr/bin/env bash
    export COURSEFULL_ENV=Test
    export $(op inject -i .env.tpl)
    docker-compose -f docker-compose.test.yml up -d

    set -exo pipefail

    echo "Waiting for Postgres..."

    sleep 0.5

    while ! nc -z localhost 5432; do
        sleep 0.5
    done

    echo "Postgres started"

    printenv RAILS_ENV

    rails db:test:prepare
    rails db:seed

    cd client && pnpm run build
    cd ..
    cp -r client/out/* public/
    foreman start -f Procfile.test
    docker-compose -f docker-compose.test.yml down