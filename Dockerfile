FROM node:22.1.0

WORKDIR /app

# Copy only needed files
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Copy Prisma folder only if it exists by copying everything, relying on .dockerignore
COPY . .

RUN npm install

RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; else echo "Skipping prisma generate"; fi

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]