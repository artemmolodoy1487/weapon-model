FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY ./static /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]
