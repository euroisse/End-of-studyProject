# Build Stage 1

FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy package.json and your lockfile
COPY package.json ./

# Install dependencies
RUN npm install -g prisma && \
    npm install

# Copy the entire project
COPY . ./

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Correction des fins de ligne et permissions
RUN dos2unix ./scripts/deploy.sh && \
    chmod +x ./scripts/deploy.sh

# Declare build arguments
ARG PORT
ARG HOST

# Set environment variables from build arguments
ENV PORT=${PORT}
ENV HOST=${HOST}
ENV NODE_ENV="prod"

EXPOSE ${PORT}

#Définir le point d'entrée
SHELL [ "/bin/sh", "-c" ]
ENTRYPOINT [ "/bin/sh", "./scripts/deploy.sh" ]