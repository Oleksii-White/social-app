FROM node:20 AS client-build
WORKDIR /app/client
COPY portfolio-social-client/package*.json ./
RUN npm install
COPY portfolio-social-client .
ARG VITE_BASE_URL=""
ENV VITE_BASE_URL=${VITE_BASE_URL}
RUN npm run build

FROM node:20 AS server-build
WORKDIR /app/server
COPY portfolio-social/package*.json ./
RUN npm install
COPY portfolio-social .
RUN npx prisma generate

FROM node:20
WORKDIR /app
COPY --from=server-build /app/server .
COPY --from=client-build /app/client/build ./public
# ENV PORT=3000
CMD ["node", "bin/www"]