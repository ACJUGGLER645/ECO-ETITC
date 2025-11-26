# Guía Paso a Paso: Despliegue en Render y Vercel

Esta guía es el manual definitivo para desplegar tu proyecto **ECO-ETITC** tal como está ahora, utilizando la opción recomendada (Gratuita y Profesional).

**Arquitectura:**
*   **Backend + Base de Datos**: Render (Usando tu Dockerfile).
*   **Frontend**: Vercel.

---

## PARTE 1: El Backend (Render)

Primero desplegaremos el backend porque necesitamos su URL para configurar el frontend.

### 1. Crear la Base de Datos
1.  Ve a [dashboard.render.com](https://dashboard.render.com/) y crea una cuenta.
2.  Haz clic en **New +** y selecciona **PostgreSQL**.
3.  **Name**: `eco-db` (o lo que quieras).
4.  **Region**: Elige la más cercana (ej. Ohio o Frankfurt).
5.  **Instance Type**: Selecciona **Free**.
6.  Haz clic en **Create Database**.
7.  **IMPORTANTE**: Cuando se cree, busca la sección **Connections** y copia la **"Internal Database URL"**. Guárdala, la necesitaremos en el paso 2.

### 2. Desplegar el Servidor Python (Docker)
1.  En el dashboard de Render, haz clic en **New +** y selecciona **Web Service**.
2.  Conecta tu cuenta de GitHub y selecciona el repositorio `ECO-ETITC`.
3.  Configura lo siguiente:
    *   **Name**: `eco-etitc-backend`
    *   **Region**: La misma que tu base de datos.
    *   **Branch**: `main`
    *   **Root Directory**: `backend` (¡Muy importante! Esto le dice a Render que busque el Dockerfile ahí).
    *   **Runtime**: Selecciona **Docker**.
    *   **Instance Type**: **Free**.
4.  **Variables de Entorno (Environment Variables)**:
    Haz clic en "Add Environment Variable" y añade estas dos:
    *   `DATABASE_URL`: Pega la **Internal Database URL** que copiaste en el paso 1.
    *   `SECRET_KEY`: Escribe una contraseña larga y segura (ej. `s3cr3t0_sup3r_s3gur0_eco_2025`).
5.  Haz clic en **Create Web Service**.

Render empezará a construir tu imagen Docker. Esto puede tardar unos 5-10 minutos la primera vez.
**Cuando termine**: Verás un check verde "Live". Copia la URL de tu servicio (ej. `https://eco-etitc-backend.onrender.com`).

---

## PARTE 2: El Frontend (Vercel)

Ahora que el backend "vive" en internet, conectaremos el frontend.

1.  Ve a [vercel.com](https://vercel.com/) y crea una cuenta.
2.  Haz clic en **Add New...** > **Project**.
3.  Importa el repositorio `ECO-ETITC`.
4.  Configura lo siguiente:
    *   **Framework Preset**: Vite (lo debería detectar automático).
    *   **Root Directory**: Haz clic en "Edit" y selecciona la carpeta `frontend`.
5.  **Variables de Entorno (Environment Variables)**:
    Despliega la sección y añade:
    *   **Name**: `VITE_API_URL`
    *   **Value**: Pega la URL de tu backend en Render que copiaste al final de la Parte 1 (ej. `https://eco-etitc-backend.onrender.com`).
    *   *Nota: Asegúrate de NO poner una barra `/` al final de la URL.*
6.  Haz clic en **Deploy**.

Vercel construirá tu sitio en menos de un minuto. Cuando termine, verás cohetes y confeti 🎉.

---

## PARTE 3: Verificación Final

1.  Abre la URL que te dio Vercel (ej. `https://eco-etitc.vercel.app`).
2.  **Prueba de Fuego**:
    *   Intenta registrar un usuario nuevo.
    *   Si funciona, significa que el Frontend se comunicó con el Backend, y el Backend guardó los datos en la Base de Datos.
    *   ¡Éxito total!

## Mantenimiento Futuro

*   **Si cambias código**: Simplemente haz `git push`. Render y Vercel detectarán el cambio y volverán a desplegar automáticamente.
*   **Base de Datos**: Los datos persistirán en la base de datos de Render aunque reinicies los servicios.
