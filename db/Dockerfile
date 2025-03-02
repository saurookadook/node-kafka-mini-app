# higher than this?
FROM postgres:16.2-bullseye AS postgres-base

FROM postgres-base AS postgres-dev
COPY ../.env /docker-entrypoint-initdb.d/
COPY ./db/init_db.sql /docker-entrypoint-initdb.d/
# TODO: figure out why value of POSTGRES_PORT isn't being correctly interpolated
# CMD [ "-p", "${POSTGRES_PORT:-5435}" ]
CMD [ "-p", "5435" ]
