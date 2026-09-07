FROM node:18-alpine
WORKDIR /app

# Prisma's engines need OpenSSL to be present to detect the right binary target on musl/Alpine.
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 4002
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
