FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero (aprovecha cache de Docker)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY src/ ./src/

EXPOSE ${PORT:-3001}

CMD ["node", "src/index.js"]
