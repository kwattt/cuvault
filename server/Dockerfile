FROM node:18-alpine3.16 

# Create app directory
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add --update openssl 
USER node
RUN yarn install --pure-lockfile
COPY --chown=node:node . .

# env vars
ENV PORT=3000
ENV JWT_SECRET=secret
ENV JWT_ACCESS_EXPIRATION_MINUTES=60
ENV JWT_REFRESH_EXPIRATION_DAYS=7
ENV JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
ENV JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
ENV SMTP_PORT=587

ENV SMTP_HOST=
ENV SMTP_USERNAME=
ENV SMTP_PASSWORD=
ENV EMAIL_FROM=

ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=true

ENV NODE_ENV=production

EXPOSE 3000
#  npx prisma migrate dev --
RUN npx prisma migrate dev --name init
CMD [ "yarn", "start" ]