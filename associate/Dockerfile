FROM public.ecr.aws/lambda/nodejs:14

COPY associate/*.ts package.json tsconfig.json /var/task/

RUN npm install

RUN npx tsc

ARG USER
ARG HOST
ARG PASSWORD
ARG DATABASE

ENV PGUSER=${USER}
ENV PGHOST=${HOST}
ENV PGPASSWORD=${PASSWORD}
ENV PGDATABASE=${DATABASE}
ENV PGPORT=5432

CMD ["index.handler"]
