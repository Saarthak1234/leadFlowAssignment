FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Install dependencies, including production ones
RUN npm install
COPY . .
EXPOSE 5000
# Run the server directly (nodemon is for dev)
CMD ["node", "server.js"]