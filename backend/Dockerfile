FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose port 8000 sesuai app.js Anda
EXPOSE 8000

CMD ["npm", "start"]