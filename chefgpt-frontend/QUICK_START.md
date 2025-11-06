# 🚀 Inicio Rápido - ChefGPT Frontend

## ⚠️ Importante: URLs Correctas

- **Frontend (Next.js)**: `http://localhost:3000/chat` ✅
- **Backend (NestJS)**: `http://localhost:3001` ❌ (No accedas directamente)

## 🏃 Pasos para Iniciar

### 1. Asegúrate de que el backend esté corriendo

```bash
# Terminal 1 - Backend
cd /Users/a0/Downloads/ChefGPT
npm run start:dev
```

El backend debe estar en `http://localhost:3001`

### 2. Inicia el frontend

```bash
# Terminal 2 - Frontend
cd /Users/a0/Downloads/ChefGPT/chefgpt-frontend
npm run dev
```

### 3. Accede a la página correcta

Abre tu navegador en:
```
http://localhost:3000/chat
```

**NO** accedas a `http://localhost:3001/chat` (ese es el backend)

## 🔍 Solución de Problemas

### Error 404 en `/chat`

Si ves el error `{"message":"Cannot GET /chat","error":"Not Found","statusCode":404}`:

1. **Verifica que estés en el puerto correcto:**
   - Frontend: `http://localhost:3000/chat` ✅
   - Backend: `http://localhost:3001` (solo para API)

2. **Reinicia el servidor de desarrollo:**
   ```bash
   # Detén el servidor (Ctrl+C)
   # Luego vuelve a iniciar
   npm run dev
   ```

3. **Limpia el cache de Next.js:**
   ```bash
   rm -rf .next
   npm run dev
   ```

### El backend no responde

Verifica que:
- El backend esté corriendo en `http://localhost:3001`
- Tengas el archivo `.env.local` con `NEXT_PUBLIC_API_URL=http://localhost:3001`

## 📝 Estructura de Rutas

### App Router (Nuevo)
- `/chat` → `src/app/chat/page.tsx` ✅

### Pages Router (Antiguo, pero aún funciona)
- `/` → `src/pages/index.tsx`
- `/recipes` → `src/pages/recipes/index.tsx`
- `/favorites` → `src/pages/favorites/index.tsx`

## ✅ Verificación

1. Backend corriendo: `http://localhost:3001` (debe mostrar error de NestJS si no hay ruta)
2. Frontend corriendo: `http://localhost:3000` (debe mostrar la página de inicio)
3. Chat funcionando: `http://localhost:3000/chat` (debe mostrar el formulario)

