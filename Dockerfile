FROM node:22.1.0

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src


COPY . .

# COPY .env .env 

RUN npm install

# Set environment variables from runtime (Azure Injects them)
ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}
ENV DATABASE_URL=${DATABASE_URL}
ENV DIRECT_URL=${DIRECT_URL}

RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; else echo "Skipping prisma generate"; fi

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]