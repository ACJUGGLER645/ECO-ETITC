# Guía de Instalación de Docker en macOS

Para ejecutar la arquitectura contenerizada de este proyecto, necesitas instalar **Docker Desktop**.

## Paso 1: Descargar Docker Desktop

1.  Ve al sitio oficial de Docker: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2.  Haz clic en el botón de descarga correspondiente a tu chip de Mac:
    *   **Mac with Apple chip**: Si tienes un procesador M1, M2, o M3.
    *   **Mac with Intel chip**: Si tienes un Mac más antiguo con procesador Intel.
    *   *Nota: Si no estás seguro, ve al menú Apple () > "Acerca de este Mac" para verificar.*

## Paso 2: Instalar la Aplicación

1.  Abre el archivo `.dmg` que descargaste (ej. `Docker.dmg`).
2.  Arrastra el icono de **Docker** a la carpeta de **Applications** (Aplicaciones).
3.  Abre la carpeta de Aplicaciones y haz doble clic en **Docker** para iniciarlo.
4.  Es posible que el sistema te pida contraseña para instalar componentes de red y permisos privilegiados. Acepta y proporciona tu contraseña.

## Paso 3: Verificar la Instalación

1.  Espera a que el icono de la ballena de Docker en la barra de menú superior deje de animarse y se quede fijo.
2.  Abre tu terminal y ejecuta los siguientes comandos para confirmar que todo está listo:

```bash
docker --version
docker-compose --version
```

Deberías ver la versión instalada (ej. `Docker version 24.0.x...`).

## Paso 4: Ejecutar el Proyecto

Una vez instalado, regresa a la carpeta del proyecto y ejecuta:

```bash
docker-compose up --build
```

Esto descargará las imágenes de Linux (Alpine), construirá el Backend y el Frontend, y levantará la base de datos.
