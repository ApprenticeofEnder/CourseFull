current-dir := invocation_directory()

alias test := _test-all

dev:
    #!/usr/bin/env bash
    set -euxo pipefail
    export COURSEFULL_ENV=Dev
    export $(op inject -i .env.tpl)
    rails db:prepare
    rails db:seed
    foreman start -f Procfile.local

populate:
    cd client && \
        op run --env-file={{current-dir}}/.env.tpl \
        -- pnpm populate

test-frontend-single test-name $COURSEFULL_ENV='test':
    cd client && \
        op run --env-file={{current-dir}}/.env.tpl \
        -- pnpm exec playwright test {{test-name}}.spec.ts --trace on

test-frontend $COURSEFULL_ENV='Test': _check-test-server
    cd client && \
        op run --env-file={{current-dir}}/.env.tpl \
        -- pnpm build
    cp -r client/out/* public/
    cd client && \
        op run --env-file={{current-dir}}/.env.tpl \
        -- pnpm test

test-backend $COURSEFULL_ENV='Test': _check-test-server
    op run --env-file={{current-dir}}/.env.tpl \
        -- bundle exec rspec

_test-all: _check-test-server
    just test-backend
    just test-frontend

_check-test-server:
    nc -z localhost 5100

_setup-test-database:
    docker compose -f test.docker-compose.yml up -d

_teardown-test-database:
    docker compose -f test.docker-compose.yml down

_test-server:
    echo "Waiting for Postgres..."
    sleep 3

    echo "Postgres started"

    rails db:create
    rails db:migrate
    rails db:test:prepare
    rails db:seed

    cd client && pnpm run build
    cd ..
    cp -r client/out/* public/
    foreman start -f Procfile.test

test-server $COURSEFULL_ENV='Test': _setup-test-database && _teardown-test-database
    op run --env-file={{current-dir}}/.env.tpl -- just _test-server
