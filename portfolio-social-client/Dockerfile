FROM node:22 as build 

ARG VITE_BASE_URL
ARG NODE_OPTIONS

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ENV VITE_BASE_URL=$VITE_BASE_URL
ENV NODE_OPTIONS=$NODE_OPTIONS

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
