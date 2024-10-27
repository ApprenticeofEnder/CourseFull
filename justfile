current-dir := invocation_directory()

alias test := _test-all

dev $COURSEFULL_ENV='Dev':
    bin/dev

populate:
    cd client && \
        op run --env-file={{current-dir}}/.env.tpl \
        -- pnpm populate

test-playwright-single test-name $COURSEFULL_ENV='test':
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

_test-all: _check-test-server test-backend test-frontend

_check-test-server:
    nc -z localhost 5100

_setup-test-database:
    docker compose -f test.docker-compose.yml up -d

_teardown-test-database:
    docker compose -f test.docker-compose.yml down

test-server: _setup-test-database && _teardown-test-database
    bin/test-server

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
