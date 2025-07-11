FROM node:22.1.0

WORKDIR /app

# ✅ Copy files in build cache-friendly order
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src

# ✅ Install dependencies
RUN npm install

# ✅ Generate Prisma client
RUN npx prisma generate

# ✅ Build TypeScript project
RUN npm run build

# ✅ Expose port for Azure
EXPOSE 3000

# ✅ Run the app in prod mode
CMD ["npm", "start"]
