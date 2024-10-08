
FROM node:alpine 
WORKDIR /app
COPY . .
RUN mkdir src/data src/static src/static/home src/static/about src/static/projects && \
  echo '{"clients":[], "sections":[]}' > src/data/about.json && \
  echo '{"html":"", "whatsapp":""}' > src/data/contacts.json && \
  echo '{"html":"", "image_path":""}' > src/data/home.json && \
  echo '{"projects":[], "tags":[], "html":""}' > src/data/projects.json

RUN npm install && npm run build
CMD ["node", "src/index.js"]
EXPOSE 8080
