FROM node:22 as build 

ARG VITE_BASE_URL

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ENV VITE_BASE_URL=$VITE_BASE_URL

COPY . .

# ENV NODE_OPTIONS=--max-old-space-size=4096

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]