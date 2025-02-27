# higher than this?
FROM postgres:16.2-bullseye AS postgres-base

FROM postgres-base AS postgres-dev
COPY ./db/init_db.sql /docker-entrypoint-initdb.d/
