FROM node:20-alpine

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn prisma generate

RUN yarn build

ENTRYPOINT ["yarn"]
CMD ["start:migrate:prod"]