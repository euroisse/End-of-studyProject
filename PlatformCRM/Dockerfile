# Build Stage 1

FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy package.json and your lockfile
COPY package.json ./

# Install dependencies
RUN apk add --no-cache netcat-openbsd dos2unix openssl && \
    npm install -g prisma && \
    npm install

# Copy the entire project
COPY . ./

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Correction des fins de ligne et permissions
RUN dos2unix ./scripts/deploy.sh && \
    chmod +x ./scripts/deploy.sh

RUN npm run build


#Définir le point d'entrée
SHELL [ "/bin/sh", "-c" ]
ENTRYPOINT [ "/bin/sh", "./scripts/deploy.sh" ]

# Build Stage 2

FROM node:22-alpine AS runner
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./


# Change the port and host
ENV PORT=80
ENV HOST=0.0.0.0

EXPOSE 80

CMD ["node", "/app/server/index.mjs"]