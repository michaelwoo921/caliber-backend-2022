FROM public.ecr.aws/lambda/nodejs:14

COPY tsconfig.json authorizer/*.ts /var/task/

COPY authorizer/serviceAccountKey.json /var/task/

RUN npm init -y
RUN npm install firebase-admin typescript

RUN npx tsc

CMD ["index.handler"]