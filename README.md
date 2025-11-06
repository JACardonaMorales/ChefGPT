# ChefGPT Backend

API REST desarrollada con NestJS y TypeScript para gestionar usuarios, perfiles, recetas y favoritos.

## 🚀 Características

- **Base de datos SQLite** con TypeORM
- **CRUD completo** para usuarios, perfiles, recetas y favoritos
- **Generación de recetas con IA** usando OpenAI GPT
- **Validación automática** con ValidationPipe global
- **Arquitectura modular** siguiendo las mejores prácticas de NestJS

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- API Key de OpenAI

## 🔧 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con:
```
PORT=3001
DATABASE_URL=sqlite:./chefgpt.db
DATABASE_PATH=./chefgpt.db
OPENAI_API_KEY=tu_api_key_de_openai
```

## 🏃 Ejecutar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

La aplicación estará disponible en `http://localhost:3001`

## 🐳 Docker

### Construir y ejecutar con Docker Compose

```bash
# Construir y ejecutar
npm run docker:run

# O manualmente
docker-compose up -d

# Detener
npm run docker:stop
# O
docker-compose down
```

### Construir imagen Docker

```bash
npm run docker:build
```

## ☁️ Despliegue en AWS

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones completas.

### Desplegar en Elastic Beanstalk

```bash
npm run deploy:eb
```

Requiere EB CLI instalado y configurado.

## 📚 Endpoints

### Users
- `POST /users` - Crear usuario (también crea un perfil por defecto)
- `GET /users` - Listar todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Profiles
- `GET /profiles` - Listar todos los perfiles
- `GET /profiles/:id` - Obtener perfil por ID
- `GET /profiles/user/:userId` - Obtener perfil por ID de usuario
- `PATCH /profiles/:id` - Actualizar perfil
- `DELETE /profiles/:id` - Eliminar perfil

### Recipes
- `POST /recipes` - Crear receta
- `POST /recipes/ai` - Generar receta con IA (requiere ingredientes, userId y estilo opcional)
- `GET /recipes` - Listar todas las recetas
- `GET /recipes?userId=1` - Listar recetas de un usuario
- `GET /recipes/:id` - Obtener receta por ID
- `PATCH /recipes/:id` - Actualizar receta
- `DELETE /recipes/:id` - Eliminar receta

### Favorites
- `POST /favorites` - Agregar a favoritos (requiere userId y recipeId en body)
- `GET /favorites` - Listar todos los favoritos
- `GET /favorites?userId=1` - Listar favoritos de un usuario
- `GET /favorites/:id` - Obtener favorito por ID
- `DELETE /favorites/:id` - Eliminar favorito
- `DELETE /favorites/user/:userId/recipe/:recipeId` - Eliminar favorito específico

## 🤖 Generación de Recetas con IA

El endpoint `POST /recipes/ai` genera recetas usando OpenAI GPT-3.5-turbo.

**Ejemplo de request:**
```json
POST /recipes/ai
{
  "ingredients": "pollo, tomates, cebolla, ajo",
  "style": "italiano",
  "userId": 1
}
```

**Respuesta:**
```json
{
  "title": "Pollo al estilo italiano",
  "ingredients": "1. Pollo 500g\n2. Tomates 3 unidades\n3. Cebolla 1 unidad\n4. Ajo 3 dientes",
  "steps": "1. Cortar el pollo en cubos\n2. Sofreír la cebolla y el ajo\n..."
}
```

## 🛠️ Tecnologías

- **NestJS** - Framework Node.js
- **TypeScript** - Lenguaje de programación
- **TypeORM** - ORM para bases de datos
- **SQLite** - Base de datos
- **OpenAI API** - Generación de recetas con IA
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de objetos

## 📝 Notas

- La base de datos SQLite se crea automáticamente en la primera ejecución
- Al crear un usuario, se crea automáticamente un perfil por defecto
- El ValidationPipe valida automáticamente todos los DTOs
- CORS está habilitado por defecto

