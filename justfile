current-dir := invocation_directory()
env-file := current-dir / ".env.tpl"

alias test := _test-all

dev $COURSEFULL_ENV='Dev':
    bin/dev

supabase-start $COURSEFULL_ENV='Dev':
    op run --env-file={{env-file}} \
        -- supabase start

supabase-stop $COURSEFULL_ENV='Dev':
    op run --env-file={{env-file}} \
        -- supabase stop

populate:
    cd client && \
        op run --env-file={{current-dir}}/.env.tpl \
        -- pnpm populate

test-playwright-single test-name $COURSEFULL_ENV='Test':
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

test-backend $COURSEFULL_ENV='Test':
    op run --env-file={{env-file}} \
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

    foreman start -f Procfile.test
