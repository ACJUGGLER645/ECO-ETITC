# Guía de Despliegue (Deployment) ECO-ETITC

Esta guía detalla cómo llevar tu aplicación a producción. La arquitectura consiste en un **Frontend (React/Vite)** y un **Backend (Python/Flask)**.

## Estrategia de Despliegue

Recomendamos separar el frontend y el backend en dos servicios distintos para mayor escalabilidad y facilidad de mantenimiento.

### 1. Backend (Python/Flask)
**Plataforma recomendada:** [Render](https://render.com) o [Railway](https://railway.app). Ambas tienen planes gratuitos o muy económicos.

**Pasos:**
1.  **Base de Datos**:
    *   Tu código actual usa SQLite (`site.db`). SQLite es un archivo local y **se borrará** cada vez que el servidor se reinicie en servicios como Render/Heroku (sistema de archivos efímero).
    *   **Solución**: Debes usar **PostgreSQL**.
    *   En Render/Railway, crea una nueva base de datos PostgreSQL. Obtendrás una `DATABASE_URL`.
    *   Tu código ya está listo para esto:
        ```python
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///site.db')
        ```
2.  **Preparar el Repositorio**:
    *   Asegúrate de que `requirements.txt` tenga `gunicorn` y `psycopg2-binary` (para Postgres).
    *   Crea un archivo `Procfile` (opcional para Render, necesario para Heroku) en la raíz o carpeta backend:
        ```
        web: gunicorn app:app
        ```
3.  **Desplegar en Render**:
    *   Conecta tu GitHub.
    *   Selecciona "Web Service".
    *   Root Directory: `backend`.
    *   Build Command: `pip install -r requirements.txt`.
    *   Start Command: `gunicorn app:app`.
    *   **Variables de Entorno**: Añade `DATABASE_URL` (la de Postgres) y `SECRET_KEY`.

### 2. Frontend (React/Vite)
**Plataforma recomendada:** [Vercel](https://vercel.com) o [Netlify](https://netlify.com). Son líderes para frontends y gratuitos.

**Pasos:**
1.  Conecta tu GitHub a Vercel.
2.  Importa el proyecto.
3.  Configuración:
    *   **Root Directory**: `frontend`.
    *   **Build Command**: `npm run build`.
    *   **Output Directory**: `dist`.
4.  **Configurar Proxy / API URL**:
    *   En desarrollo, usamos `vite.config.js` para el proxy. En producción, esto no funciona igual.
    *   Debes configurar la URL de tu backend en el código del frontend.
    *   Crea un archivo `.env.production` en `frontend/`:
        ```
        VITE_API_URL=https://tu-backend-en-render.onrender.com
        ```
    *   Actualiza tus llamadas `axios` para usar esta variable:
        ```javascript
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        axios.get(`${API_URL}/user`);
        ```
5.  **Redirecciones (SPA)**:
    *   En Vercel, añade un archivo `vercel.json` en `frontend/` para que las rutas de React funcionen al recargar:
        ```json
        {
          "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
        }
        ```

### 3. Dominio Personalizado (Ideal: Comprar Dominio)

Para darle seriedad al proyecto, compra un dominio (ej. `eco-etitc.com`).

1.  **Dónde comprar**: Namecheap, GoDaddy, Google Domains (ahora Squarespace), o directamente en Vercel/Render.
2.  **Configuración DNS**:
    *   Si compras el dominio en Namecheap, ve a la configuración DNS.
    *   **Frontend**: Apunta el dominio principal (`eco-etitc.com`) a los servidores de Vercel (CNAME o A Record según te indiquen).
    *   **Backend**: Usa un subdominio (ej. `api.eco-etitc.com`) y apúntalo a tu servicio en Render.
3.  **SSL (HTTPS)**: Vercel y Render generan certificados SSL automáticamente.

## Resumen de Cambios Necesarios Antes de Desplegar

1.  [ ] **Backend**: Añadir `gunicorn` y `psycopg2-binary` a `backend/requirements.txt`.
2.  [ ] **Frontend**: Crear `.env.production` y actualizar las llamadas a la API para usar la URL completa del backend.
3.  [ ] **Frontend**: Añadir `vercel.json` para el enrutamiento.

¿Quieres que realice estos cambios de preparación ahora mismo?
