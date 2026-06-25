FROM node:18-alpine AS builder
WORKDIR /oneterm-ui
COPY . .
RUN yarn config set registry https://registry.npmmirror.com/
RUN yarn install --ignore-engines
RUN yarn build

FROM nginx:alpine
COPY --from=0 /oneterm-ui/dist /etc/nginx/html
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak 