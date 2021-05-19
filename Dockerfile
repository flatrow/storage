FROM node:12 AS builder
WORKDIR /app
COPY . .
RUN npm i && npm run build && rm -rf node_modules


FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN npm i --production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
