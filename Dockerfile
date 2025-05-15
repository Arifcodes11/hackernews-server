FROM node:22.1.0-slim

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

COPY . .

RUN npm install --legacy-peer-deps && npm audit fix --force

RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; else echo "Skipping prisma generate"; fi

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]