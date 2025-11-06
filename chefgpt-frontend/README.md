# ChefGPT Frontend

Frontend de ChefGPT construido con Next.js, TypeScript y TailwindCSS.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Configurar Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_OPENAI_API_KEY=tu_clave_openai_aqui
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── pages/           # Páginas de Next.js
│   ├── index.tsx    # Página de inicio
│   ├── chat.tsx     # Chat con IA
│   ├── recipes/     # Páginas de recetas
│   ├── favorites/   # Páginas de favoritos
│   └── profiles/    # Páginas de perfiles
├── components/      # Componentes React
├── services/        # Servicios API
└── styles/          # Estilos globales
```

## 🎨 Características

- ✅ Generación de recetas con OpenAI GPT-4
- ✅ Lista y detalle de recetas
- ✅ Sistema de favoritos
- ✅ Perfiles de usuario
- ✅ Diseño responsive con TailwindCSS
- ✅ TypeScript para type safety

## 🔧 Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Type safety
- **TailwindCSS** - Estilos
- **Axios** - Cliente HTTP
- **OpenAI API** - Generación de recetas con IA

## 📝 Scripts Disponibles

- `npm run dev` - Modo desarrollo
- `npm run build` - Build de producción
- `npm run start` - Iniciar servidor de producción
- `npm run lint` - Linter
- `npm run deploy:amplify` - Desplegar a AWS Amplify

## 🌐 Despliegue

Ver [DEPLOYMENT.md](../DEPLOYMENT.md) para instrucciones completas de despliegue en AWS.

### AWS Amplify

1. Conecta tu repositorio Git
2. Configura variables de entorno en la consola
3. Amplify detectará automáticamente Next.js y desplegará

## 🔐 Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `NEXT_PUBLIC_API_URL` | URL del backend API | Sí |
| `NEXT_PUBLIC_OPENAI_API_KEY` | Clave API de OpenAI | Sí (para chat) |

## 📖 Uso

### Generar Receta con IA

1. Ve a `/chat`
2. Ingresa ingredientes separados por comas
3. Opcionalmente, especifica un estilo culinario
4. Haz clic en "Generar Receta con IA"
5. La receta se mostrará en pantalla

### Crear Receta Manual

1. Ve a `/recipes/create`
2. Completa el formulario
3. Guarda la receta

### Ver Favoritos

1. Ve a `/favorites`
2. Verás todas tus recetas guardadas

## 🐛 Troubleshooting

### Error de conexión con backend

- Verifica que `NEXT_PUBLIC_API_URL` esté correctamente configurado
- Verifica que el backend esté corriendo
- Verifica CORS en el backend

### Error con OpenAI

- Verifica que `NEXT_PUBLIC_OPENAI_API_KEY` esté configurado
- Verifica que la clave sea válida
- Revisa la consola del navegador para más detalles

