# Guía de Despliegue - ChefGPT

Esta guía explica cómo desplegar el proyecto ChefGPT (backend y frontend) en AWS.

## 📋 Prerequisitos

- Cuenta de AWS con permisos necesarios
- AWS CLI instalado y configurado
- Docker instalado (para pruebas locales)
- Node.js 18+ instalado
- Git instalado

## 🔧 Configuración de Variables de Entorno

### Backend

Crea un archivo `.env` en la raíz del backend con:

```env
PORT=3001
DATABASE_URL=sqlite:./chefgpt.db
DATABASE_PATH=./chefgpt.db
OPENAI_API_KEY=tu_clave_openai_aqui
NODE_ENV=production
```

### Frontend

Crea un archivo `.env.local` en la raíz del frontend con:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_OPENAI_API_KEY=tu_clave_openai_aqui
```

## 🐳 Despliegue con Docker (Local/Producción)

### Backend

1. Construir la imagen:
```bash
cd /Users/a0/Downloads/ChefGPT
npm run docker:build
```

2. Ejecutar con docker-compose:
```bash
npm run docker:run
```

3. Detener:
```bash
npm run docker:stop
```

O manualmente:
```bash
docker-compose up -d
```

## 🚀 Despliegue en AWS

### Backend - AWS Elastic Beanstalk

1. **Instalar EB CLI**:
```bash
pip install awsebcli
```

2. **Inicializar Elastic Beanstalk** (si es la primera vez):
```bash
cd /Users/a0/Downloads/ChefGPT
eb init -p "Node.js 18" chefgpt-backend --region us-east-1
```

3. **Crear entorno**:
```bash
eb create chefgpt-backend-env
```

4. **Configurar variables de entorno**:
```bash
eb setenv PORT=3001 \
  DATABASE_URL=sqlite:./data/chefgpt.db \
  DATABASE_PATH=./data/chefgpt.db \
  OPENAI_API_KEY=tu_clave_aqui \
  NODE_ENV=production
```

5. **Desplegar**:
```bash
npm run deploy:eb
```

O manualmente:
```bash
npm run build
eb deploy
```

6. **Ver logs**:
```bash
eb logs
```

7. **Abrir aplicación**:
```bash
eb open
```

**Nota**: Para producción, considera usar RDS o una base de datos externa en lugar de SQLite.

### Frontend - AWS Amplify

#### Opción 1: Desde la Consola de AWS

1. Ve a AWS Amplify Console
2. Haz clic en "New app" > "Host web app"
3. Conecta tu repositorio Git (GitHub, GitLab, Bitbucket)
4. Selecciona la rama `main` o `master`
5. En "Build settings", Amplify detectará automáticamente Next.js
6. Agrega las variables de entorno:
   - `NEXT_PUBLIC_API_URL`: URL de tu backend (ej: `https://tu-backend.elasticbeanstalk.com`)
   - `NEXT_PUBLIC_OPENAI_API_KEY`: Tu clave de OpenAI
7. Guarda y despliega

#### Opción 2: Desde la CLI

1. **Instalar Amplify CLI**:
```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. **Inicializar proyecto**:
```bash
cd chefgpt-frontend
amplify init
```

3. **Agregar hosting**:
```bash
amplify add hosting
```

4. **Configurar variables de entorno**:
```bash
amplify env add
# Configura las variables de entorno cuando se solicite
```

5. **Publicar**:
```bash
amplify publish
```

#### Opción 3: Build manual y deploy

1. **Construir la aplicación**:
```bash
cd chefgpt-frontend
npm run build
```

2. **Subir a S3 y CloudFront**:
   - Crea un bucket S3
   - Sube el contenido de `.next/` y `public/`
   - Configura CloudFront para distribución

## 📝 Configuración de CORS

El backend ya tiene CORS habilitado. Si necesitas configurar dominios específicos, edita `src/main.ts`:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

## 🔒 Seguridad

### Variables de Entorno Sensibles

- **Nunca** commits archivos `.env` o `.env.local`
- Usa AWS Systems Manager Parameter Store o Secrets Manager para producción
- Configura variables de entorno en AWS directamente

### Para Elastic Beanstalk:

```bash
eb setenv OPENAI_API_KEY=tu_clave_secreta
```

### Para Amplify:

Configura en la consola de AWS Amplify o usa:
```bash
amplify env add
```

## 🔍 Troubleshooting

### Backend no inicia

1. Verifica logs:
```bash
eb logs
# o
docker logs chefgpt-backend
```

2. Verifica variables de entorno:
```bash
eb printenv
```

3. Verifica que el puerto 3001 esté disponible

### Frontend no conecta con backend

1. Verifica `NEXT_PUBLIC_API_URL` apunta a la URL correcta
2. Verifica CORS en el backend
3. Verifica que el backend esté corriendo y accesible

### Base de datos SQLite

- SQLite funciona bien para desarrollo
- Para producción, considera migrar a PostgreSQL (RDS) o MySQL
- La base de datos se crea automáticamente en la primera ejecución

## 📊 Monitoreo

### Elastic Beanstalk

- Usa CloudWatch para monitorear logs
- Configura alarmas para errores
- Monitorea uso de CPU y memoria

### Amplify

- Revisa logs en la consola de Amplify
- Configura alertas para builds fallidos
- Monitorea métricas de tráfico

## 🎯 Próximos Pasos

1. Configurar dominio personalizado
2. Implementar SSL/HTTPS
3. Configurar CDN para assets estáticos
4. Implementar autenticación (JWT, OAuth)
5. Migrar a base de datos relacional (PostgreSQL/MySQL)
6. Implementar CI/CD con GitHub Actions o CodePipeline

