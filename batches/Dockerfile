FROM public.ecr.aws/lambda/nodejs:14

COPY batches/*.ts tsconfig.json /var/task/
RUN npm install axios typescript @types/node
RUN npx tsc
CMD ["index.handler"]
