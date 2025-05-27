# ---------- etapa de build -----------------------------------
FROM node:20-slim AS base
WORKDIR /app

# instala dependencias primero (mejor capa de caché)
COPY package*.json ./
RUN npm ci

# instala Chromium
RUN apt-get update && apt-get install -y chromium-browser \
    && rm -rf /var/lib/apt/lists/*

# variable que Puppeteer usará
ENV GOOGLE_CHROME_SHIM=/usr/bin/chromium-browser
ENV NODE_ENV=production

COPY . .

EXPOSE 3000
CMD ["node", "src/server/index.js"]
