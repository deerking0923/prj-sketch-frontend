FROM node:18 AS build

WORKDIR /app

COPY .env .env
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:18 AS production

WORKDIR /app

COPY .env .env
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm install --production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
