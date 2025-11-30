# 🚀 Guía Completa de Despliegue: ECO-ETITC en Render y Vercel

Esta es la guía definitiva y detallada para desplegar tu proyecto **ECO-ETITC** en producción, utilizando servicios gratuitos y profesionales.

## 📋 Tabla de Contenidos
1. [Arquitectura del Proyecto](#arquitectura)
2. [Requisitos Previos](#requisitos)
3. [Parte 1: Backend en Render](#parte-1-backend)
4. [Parte 2: Frontend en Vercel](#parte-2-frontend)
5. [Parte 3: Verificación y Pruebas](#parte-3-verificacion)
6. [Troubleshooting](#troubleshooting)
7. [Mantenimiento](#mantenimiento)

---

## 🏗️ Arquitectura del Proyecto {#arquitectura}

```
┌─────────────────┐
│   USUARIOS      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│  VERCEL         │─────▶│  RENDER          │
│  (Frontend)     │ API  │  (Backend)       │
│  - React/Vite   │      │  - Flask/Docker  │
└─────────────────┘      └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  PostgreSQL      │
                         │  (Base de Datos) │
                         └──────────────────┘
```

**Componentes:**
- **Frontend**: Aplicación React desplegada en Vercel
- **Backend**: API Flask en contenedor Docker desplegada en Render
- **Base de Datos**: PostgreSQL gestionada por Render

---

## ✅ Requisitos Previos {#requisitos}

Antes de comenzar, asegúrate de tener:

- [ ] Cuenta de GitHub con el repositorio `ECO-ETITC` actualizado
- [ ] Cuenta en [Render.com](https://render.com) (puedes usar GitHub para registrarte)
- [ ] Cuenta en [Vercel.com](https://vercel.com) (puedes usar GitHub para registrarte)
- [ ] El código más reciente subido a GitHub (ejecuta `git push` si tienes cambios pendientes)

**Verificación rápida:**
```bash
cd /Users/alejocorreal/ProyectosAC/ECO-ETITC
git status  # Verifica que no haya cambios sin commitear
git push    # Sube los últimos cambios
```

---

## 🔧 PARTE 1: Desplegar el Backend en Render {#parte-1-backend}

### 📁 Verificación de Estructura Backend

Antes de empezar, confirma que tu carpeta `backend` tiene estos archivos **OBLIGATORIOS**:

| Archivo | Función | ¿Es obligatorio? |
|---------|---------|------------------|
| `Dockerfile` | Instrucciones para construir el contenedor | ✅ **SÍ** |
| `requirements.txt` | Lista de librerías Python necesarias | ✅ **SÍ** |
| `app.py` | El código principal de tu servidor | ✅ **SÍ** |
| `init_db.py` | Script para iniciar la base de datos | ✅ **SÍ** |
| `Procfile` | Comando de arranque (opcional si usas Docker) | ⚠️ Recomendado |

👉 **Carpeta a "amarrar" en Render (Root Directory):** `backend`

---

### Paso 1.1: Crear la Base de Datos PostgreSQL

1. **Acceder a Render**
   - Ve a [dashboard.render.com](https://dashboard.render.com/)
   - Si es tu primera vez, haz clic en **"Get Started for Free"**
   - Inicia sesión con tu cuenta de GitHub (recomendado)

2. **Crear Nueva Base de Datos**
   - En el dashboard, haz clic en el botón **"New +"** (esquina superior derecha)
   - Selecciona **"PostgreSQL"**

3. **Configurar la Base de Datos**
   - **Name**: `eco-etitc-db` (o el nombre que prefieras)
   - **Database**: `eco_db` (déjalo como está o personaliza)
   - **User**: `eco_user` (déjalo como está o personaliza)
   - **Region**: Selecciona la región más cercana a tu ubicación:
     - **Oregon (US West)** - Recomendado para América
     - **Frankfurt (EU Central)** - Recomendado para Europa
     - **Singapore** - Recomendado para Asia
   - **PostgreSQL Version**: 15 (o la más reciente disponible)
   - **Instance Type**: Selecciona **"Free"**
     - ⚠️ **Nota**: El plan gratuito expira después de 90 días, pero puedes crear una nueva

4. **Crear la Base de Datos**
   - Haz clic en **"Create Database"**
   - Espera 1-2 minutos mientras Render provisiona la base de datos
   - Verás una pantalla de progreso

5. **Copiar la URL de Conexión** ⭐ **MUY IMPORTANTE**
   - Una vez creada, busca la sección **"Connections"** en la página de la base de datos
   - Encontrarás dos URLs:
     - **External Database URL**: Para conexiones desde fuera de Render
     - **Internal Database URL**: Para servicios dentro de Render (¡Esta es la que necesitamos!)
   - Copia la **"Internal Database URL"** completa
   - Ejemplo: `postgresql://eco_user:xxxxx@dpg-xxxxx-a/eco_db`
   - **Guárdala en un lugar seguro** (la necesitarás en el siguiente paso)

---

### Paso 1.2: Desplegar el Servidor Backend (Flask + Docker)

1. **Crear Nuevo Web Service**
   - Regresa al dashboard de Render
   - Haz clic en **"New +"** > **"Web Service"**

2. **Conectar el Repositorio**
   - Si es tu primera vez, haz clic en **"Connect GitHub"** y autoriza a Render
   - Busca y selecciona tu repositorio **`ECO-ETITC`**
   - Haz clic en **"Connect"**

3. **Configuración del Servicio**
   
   **Información Básica:**
   - **Name**: `eco-etitc-backend` (será parte de tu URL: `eco-etitc-backend.onrender.com`)
   - **Region**: ⚠️ **Selecciona LA MISMA región que tu base de datos** (muy importante para latencia)
   - **Branch**: `main` (o `master` si ese es tu branch principal)
   - **Root Directory**: `backend` 
     - ⭐ **CRÍTICO**: Esto le dice a Render dónde encontrar el `Dockerfile`
     - Haz clic en el campo y escribe exactamente: `backend`

   **Runtime:**
   - **Environment**: Selecciona **"Docker"**
     - Render detectará automáticamente tu `Dockerfile` en la carpeta `backend`

   **Instance Type:**
   - Selecciona **"Free"**
     - ⚠️ **Limitaciones del plan gratuito**:
       - El servicio se "duerme" después de 15 minutos de inactividad
       - La primera petición después de dormir tardará ~30 segundos
       - 750 horas de uso por mes (suficiente para un proyecto personal)

4. **Configurar Variables de Entorno** ⭐ **PASO CRÍTICO**
   
   Desplázate hasta la sección **"Environment Variables"** y añade las siguientes:

   **Variable 1:**
   - **Key**: `DATABASE_URL`
   - **Value**: Pega la **Internal Database URL** que copiaste en el Paso 1.1
   - Ejemplo: `postgresql://eco_user:xxxxx@dpg-xxxxx-a/eco_db`

   **Variable 2:**
   - **Key**: `SECRET_KEY`
   - **Value**: Genera una clave secreta segura (mínimo 32 caracteres)
   - Ejemplo: `eco_2025_super_secret_key_change_this_in_production_xyz123`
   - 💡 **Tip**: Puedes generar una con: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

   **Variable 3 (Opcional pero Recomendada):**
   - **Key**: `FLASK_ENV`
   - **Value**: `production`

5. **Opciones Avanzadas (Opcional)**
   - **Auto-Deploy**: Déjalo en **"Yes"** para que se redespliegue automáticamente con cada `git push`
   - **Build Command**: (Déjalo vacío, Docker lo maneja)
   - **Start Command**: (Déjalo vacío, el `Dockerfile` ya lo especifica)

6. **Crear el Servicio**
   - Revisa toda la configuración
   - Haz clic en **"Create Web Service"**

7. **Monitorear el Despliegue**
   - Render comenzará a construir tu imagen Docker
   - Verás los logs en tiempo real
   - **Tiempo estimado**: 5-10 minutos (la primera vez)
   - Busca estos mensajes en los logs:
     ```
     ==> Building...
     ==> Deploying...
     ==> Your service is live 🎉
     ```

8. **Obtener la URL del Backend** ⭐ **GUARDA ESTA URL**
   - Cuando el despliegue termine, verás un estado **"Live"** con un check verde ✅
   - En la parte superior de la página, encontrarás tu URL pública
   - Ejemplo: `https://eco-etitc-backend.onrender.com`
   - **Copia esta URL completa** (la necesitarás para configurar el frontend)

9. **Verificar que el Backend Funciona**
   - Abre en tu navegador: `https://eco-etitc-backend.onrender.com/api/health`
   - Deberías ver algo como: `{"status": "ok", "os": "Alpine Linux Container"}`
   - ✅ Si ves esto, ¡tu backend está funcionando correctamente!

---

## 🎨 PARTE 2: Desplegar el Frontend en Vercel {#parte-2-frontend}

### 📁 Verificación de Estructura Frontend

Antes de empezar, confirma que tu carpeta `frontend` tiene estos archivos **OBLIGATORIOS**:

| Archivo | Función | ¿Es obligatorio? |
|---------|---------|------------------|
| `package.json` | Configuración del proyecto y dependencias | ✅ **SÍ** |
| `vite.config.js` | Configuración del empaquetador Vite | ✅ **SÍ** |
| `vercel.json` | Configuración de rutas para Vercel | ✅ **SÍ** |
| `index.html` | Archivo base de la página web | ✅ **SÍ** |
| `src/` | Carpeta con todo el código fuente (React) | ✅ **SÍ** |

👉 **Carpeta a "amarrar" en Vercel (Root Directory):** `frontend`

---

### Paso 2.1: Preparar Vercel

1. **Acceder a Vercel**
   - Ve a [vercel.com](https://vercel.com/)
   - Haz clic en **"Sign Up"** o **"Log In"**
   - **Recomendado**: Usa **"Continue with GitHub"** para facilitar la integración

2. **Crear Nuevo Proyecto**
   - En el dashboard, haz clic en **"Add New..."** (esquina superior derecha)
   - Selecciona **"Project"**

3. **Importar Repositorio**
   - Verás una lista de tus repositorios de GitHub
   - Busca **`ECO-ETITC`**
   - Haz clic en **"Import"**

---

### Paso 2.2: Configurar el Proyecto

1. **Configuración del Framework**
   
   **Framework Preset:**
   - Vercel debería detectar automáticamente **"Vite"**
   - Si no lo detecta, selecciónalo manualmente del dropdown

   **Root Directory:** ⭐ **MUY IMPORTANTE**
   - Por defecto, Vercel buscará en la raíz del repositorio
   - Necesitamos cambiar esto a la carpeta `frontend`
   - Haz clic en **"Edit"** junto a "Root Directory"
   - Selecciona la carpeta **`frontend`** de la lista
   - Confirma que aparece: `frontend`

2. **Build Settings** (Vercel los detecta automáticamente, pero verifica):
   - **Build Command**: `npm run build` o `vite build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - (Normalmente no necesitas cambiar nada aquí)

3. **Configurar Variables de Entorno** ⭐ **PASO CRÍTICO**
   
   - Despliega la sección **"Environment Variables"**
   - Añade la siguiente variable:

   **Variable:**
   - **Name**: `VITE_API_URL`
   - **Value**: La URL del backend que copiaste en el Paso 1.2
   - Ejemplo: `https://eco-etitc-backend.onrender.com`
   - ⚠️ **IMPORTANTE**: 
     - **NO** incluyas una barra `/` al final
     - **NO** incluyas `/api` al final
     - Correcto: `https://eco-etitc-backend.onrender.com`
     - Incorrecto: `https://eco-etitc-backend.onrender.com/`
     - Incorrecto: `https://eco-etitc-backend.onrender.com/api`

   - **Environment**: Selecciona **"Production"**, **"Preview"**, y **"Development"** (todas)

4. **Desplegar**
   - Revisa toda la configuración
   - Haz clic en **"Deploy"**

5. **Monitorear el Despliegue**
   - Vercel comenzará a construir tu aplicación
   - Verás los logs en tiempo real
   - **Tiempo estimado**: 1-3 minutos
   - Busca el mensaje: **"Your project is ready!"** 🎉

6. **Obtener la URL del Frontend**
   - Cuando termine, verás confeti y cohetes 🎊
   - Vercel te mostrará la URL de tu aplicación
   - Ejemplo: `https://eco-etitc.vercel.app`
   - Haz clic en **"Visit"** para abrir tu aplicación

---

## ✅ PARTE 3: Verificación y Pruebas {#parte-3-verificacion}

### Paso 3.1: Pruebas Funcionales

1. **Abrir la Aplicación**
   - Abre la URL de Vercel en tu navegador
   - Ejemplo: `https://eco-etitc.vercel.app`

2. **Verificar que Carga Correctamente**
   - ✅ Deberías ver la página principal de ECO-ETITC
   - ✅ El diseño debe verse correcto (modo claro/oscuro funcional)
   - ✅ La navegación debe funcionar

3. **Probar el Registro de Usuario** (Prueba de Integración Completa)
   - Haz clic en **"Ingresar"** o **"Registrarse"**
   - Completa el formulario de registro:
     - Nombre de usuario
     - Nombre completo
     - Documento de identidad
     - Email
     - Contraseña
   - Haz clic en **"Registrarse"**
   - ✅ **Si ves el mensaje "¡Registro exitoso!"**: 
     - ✨ ¡Felicidades! Tu aplicación está completamente funcional
     - El frontend se comunicó con el backend
     - El backend guardó los datos en PostgreSQL
     - Todo el stack está funcionando correctamente

4. **Probar el Login**
   - Inicia sesión con el usuario que acabas de crear
   - ✅ Deberías ver tu nombre de usuario en la esquina superior derecha

5. **Probar Funcionalidades Adicionales**
   - Navega a **"Foro"** y crea un comentario
   - Navega a **"Juegos"** y prueba los juegos interactivos
   - Navega a **"Audiovisual"** y verifica que los videos cargan

### Paso 3.2: Verificar la Conexión Backend-Database

1. **Acceder a los Logs del Backend**
   - Ve al dashboard de Render
   - Abre tu servicio `eco-etitc-backend`
   - Haz clic en la pestaña **"Logs"**

2. **Buscar Confirmaciones**
   - Deberías ver logs de peticiones POST cuando te registraste
   - Ejemplo: `POST /api/register - 201`

3. **Verificar la Base de Datos (Opcional)**
   - En Render, ve a tu base de datos `eco-etitc-db`
   - Haz clic en **"Connect"** > **"External Connection"**
   - Usa un cliente SQL (como pgAdmin o DBeaver) para conectarte
   - Verifica que la tabla `user` tiene tu registro

---

## 🔧 Troubleshooting {#troubleshooting}

### Problema 1: El Backend no Despliega

**Síntoma**: Error durante el build en Render

**Soluciones**:
- ✅ Verifica que el **Root Directory** sea exactamente `backend`
- ✅ Verifica que el **Environment** sea **Docker**
- ✅ Revisa los logs de build para errores específicos
- ✅ Asegúrate de que el `Dockerfile` existe en `backend/Dockerfile`

### Problema 2: Error de Base de Datos

**Síntoma**: Error 500 al registrar usuario, logs muestran error de conexión a DB

**Soluciones**:
- ✅ Verifica que copiaste la **Internal Database URL** (no la External)
- ✅ Asegúrate de que la variable `DATABASE_URL` esté configurada correctamente
- ✅ Verifica que el backend y la base de datos estén en la **misma región**

### Problema 3: Frontend no se Conecta al Backend

**Síntoma**: Errores de CORS, o "Network Error" al registrarse

**Soluciones**:
- ✅ Verifica que `VITE_API_URL` esté configurada en Vercel
- ✅ Asegúrate de que la URL del backend **NO** tenga `/` al final
- ✅ Verifica que el backend esté "Live" en Render
- ✅ Abre la consola del navegador (F12) y busca errores específicos
- ✅ Prueba acceder directamente a `https://tu-backend.onrender.com/api/health`

### Problema 4: El Backend se "Duerme"

**Síntoma**: La primera petición tarda mucho (~30 segundos)

**Explicación**: 
- El plan gratuito de Render pone el servicio en "sleep" después de 15 minutos de inactividad
- Esto es normal y esperado

**Soluciones**:
- ✅ Espera 30 segundos en la primera petición
- ✅ Considera usar un servicio de "ping" como [UptimeRobot](https://uptimerobot.com/) para mantenerlo activo
- ✅ O actualiza a un plan de pago ($7/mes) para tener el servicio siempre activo

### Problema 5: Variables de Entorno no se Aplican

**Síntoma**: Cambios en variables de entorno no tienen efecto

**Solución**:
- ✅ Después de cambiar variables en Render o Vercel, debes **redesplegar manualmente**
- En Render: Haz clic en **"Manual Deploy"** > **"Deploy latest commit"**
- En Vercel: Ve a **"Deployments"** > **"Redeploy"**

---

## 🔄 Mantenimiento y Actualizaciones {#mantenimiento}

### Actualizar el Código

**Proceso Automático** (Recomendado):
1. Haz cambios en tu código local
2. Commitea los cambios: `git add . && git commit -m "descripción"`
3. Sube a GitHub: `git push`
4. ✨ Render y Vercel detectarán automáticamente el cambio y redesplegarán

**Proceso Manual**:
- En Render: **"Manual Deploy"** > **"Deploy latest commit"**
- En Vercel: **"Deployments"** > **"Redeploy"**

### Monitorear el Estado

**Render**:
- Dashboard > Tu servicio > Pestaña **"Events"** para ver historial de despliegues
- Pestaña **"Logs"** para ver logs en tiempo real
- Pestaña **"Metrics"** para ver uso de recursos

**Vercel**:
- Dashboard > Tu proyecto > **"Deployments"** para ver historial
- **"Analytics"** para ver tráfico (requiere plan de pago)

### Backup de Base de Datos

**Importante**: El plan gratuito de Render **NO** incluye backups automáticos

**Solución Manual**:
```bash
# Desde tu terminal local
pg_dump -h [host] -U [user] -d [database] > backup.sql
```

**Recomendación**: Considera configurar backups automáticos con un script o actualizar al plan de pago.

### Costos y Límites

**Plan Gratuito Actual**:
- ✅ Render Backend: Gratis (con limitaciones de sleep)
- ✅ Render Database: Gratis por 90 días
- ✅ Vercel Frontend: Gratis (100GB bandwidth/mes)

**Después de 90 días**:
- Opción 1: Crear una nueva base de datos gratuita y migrar datos
- Opción 2: Actualizar a plan de pago (~$7/mes para DB + $7/mes para backend sin sleep)

---

## 🎉 ¡Felicidades!

Si llegaste hasta aquí y todas las pruebas pasaron, tu aplicación **ECO-ETITC** está completamente desplegada y funcional en producción.

**URLs Finales**:
- 🌐 Frontend: `https://eco-etitc.vercel.app`
- 🔧 Backend: `https://eco-etitc-backend.onrender.com`
- 🗄️ Database: Gestionada internamente por Render

**Próximos Pasos Recomendados**:
1. Configura un dominio personalizado (opcional)
2. Implementa Google Analytics para monitorear tráfico
3. Configura alertas de uptime con UptimeRobot
4. Considera implementar autenticación con Google OAuth (ver `GOOGLE_AUTH_SETUP.md`)

---

**¿Necesitas ayuda?** Revisa la sección de [Troubleshooting](#troubleshooting) o consulta la documentación oficial:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
