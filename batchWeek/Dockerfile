FROM public.ecr.aws/lambda/nodejs:14

COPY batchweek/*.ts tsconfig.json package.json /var/task/
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
