# ---- build image -------------------------------------------------
FROM node:20-slim

# 1. Directorio de trabajo
WORKDIR /app

# 2. Copiamos primero package.json para aprovechar la caché
COPY package*.json ./
RUN npm ci

# 3. Instalamos Chromium (paquete se llama 'chromium')
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      chromium \
      curl \
      ca-certificates \
      fonts-liberation \
      libasound2 \
      libatk-bridge2.0-0 \
      libatk1.0-0 \
      libnss3 \
      libx11-xcb1 \
      libxcomposite1 \
      libxdamage1 \
      libxrandr2 \
      xdg-utils \
 && rm -rf /var/lib/apt/lists/*

# 4. Variable que Puppeteer usará
ENV GOOGLE_CHROME_SHIM=/usr/bin/chromium
ENV NODE_ENV=production

# 5. Copiamos el resto del código
COPY . .

EXPOSE 3000
CMD ["node", "src/server/index.js"]
