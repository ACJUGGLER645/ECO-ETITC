# Guía de Despliegue (Deployment) ECO-ETITC

Esta guía detalla las dos estrategias principales para llevar tu aplicación a producción: **Nube Serverless (Recomendada para empezar)** y **Docker (Para control total)**.

---

## Opción A: Despliegue en la Nube (Vercel + Render)
**Ideal para:** Proyectos rápidos, gratuitos y escalables sin gestionar servidores.

### 1. Backend (Python/Flask) en Render
1.  Crea una cuenta en [Render](https://render.com).
2.  Crea una **Base de Datos PostgreSQL** (New > PostgreSQL).
    *   Copia la `Internal Database URL`.
3.  Crea un **Web Service** (New > Web Service) conectado a tu repositorio GitHub.
    *   **Root Directory**: `backend`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn app:app`
    *   **Environment Variables**:
        *   `DATABASE_URL`: Pega la URL de la base de datos que creaste.
        *   `SECRET_KEY`: Inventa una clave segura.

### 2. Frontend (React/Vite) en Vercel
1.  Crea una cuenta en [Vercel](https://vercel.com).
2.  Importa tu proyecto desde GitHub.
3.  Configuración del proyecto:
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
    *   **Environment Variables**:
        *   `VITE_API_URL`: La URL de tu backend en Render (ej. `https://eco-etitc-backend.onrender.com`).

---

## Opción B: Despliegue con Docker (VPS)
**Ideal para:** Control total, privacidad, o si tienes un servidor propio (DigitalOcean, AWS EC2, Azure).

### ¿Qué es Docker aquí?
Docker empaqueta tu aplicación en "contenedores" que incluyen todo lo necesario para funcionar (código, librerías, sistema operativo base).
*   **backend/Dockerfile**: Instrucciones para crear la imagen del servidor Python.
*   **frontend/Dockerfile**: Instrucciones para crear la imagen del servidor web (Nginx) con tu React app.
*   **docker-compose.yml**: El "director de orquesta" que levanta el frontend, backend y la base de datos juntos y los conecta.

### Pasos para desplegar con Docker:

1.  **Alquila un Servidor (VPS)**:
    *   Ejemplo: Un "Droplet" en DigitalOcean con Ubuntu y Docker preinstalado.
2.  **Clona el repositorio en el servidor**:
    ```bash
    git clone https://github.com/ACJUGGLER645/ECO-ETITC.git
    cd ECO-ETITC
    ```
3.  **Configura las variables**:
    *   Edita `docker-compose.yml` si necesitas cambiar contraseñas o puertos.
4.  **Ejecuta el proyecto**:
    ```bash
    docker-compose up -d --build
    ```
    *   `-d`: Ejecuta en segundo plano (detached).
    *   `--build`: Construye las imágenes desde cero.

### Estructura de Archivos Docker
*   `backend/Dockerfile`: Instala Python, dependencias y Gunicorn.
*   `frontend/Dockerfile`: Construye la app React y configura Nginx para servirla.
*   `frontend/nginx.conf`: Configuración del servidor web Nginx. Redirige `/api` al backend y el resto al frontend.
*   `docker-compose.yml`: Define 3 servicios:
    1.  `backend`: Tu API Flask.
    2.  `frontend`: Tu web React + Nginx.
    3.  `db`: Base de datos PostgreSQL.

---

## Dominio Personalizado (Para ambas opciones)

1.  Compra tu dominio (ej. `eco-etitc.com`).
2.  **Si usas Opción A (Vercel)**:
    *   Ve a Settings > Domains en Vercel y añade tu dominio.
    *   Sigue las instrucciones DNS (normalmente añadir un registro A o CNAME).
3.  **Si usas Opción B (Docker)**:
    *   Apunta el registro A de tu dominio a la IP pública de tu servidor VPS.
