# Dockerfile para ChefGPT Backend
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src ./src

# Compilar la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Crear directorio para la base de datos
RUN mkdir -p /app/data

# Exponer el puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV PORT=3001
ENV NODE_ENV=production
ENV DATABASE_URL=sqlite:./data/chefgpt.db

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]

