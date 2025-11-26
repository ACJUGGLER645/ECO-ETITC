# Guía de Configuración de Autenticación con Google

Para implementar el inicio de sesión con Google ("Sign in with Google") en tu aplicación ECO-ETITC y desplegarla, necesitas seguir estos pasos.

## 1. Configurar Google Cloud Console

1.  Ve a [Google Cloud Console](https://console.cloud.google.com/).
2.  Crea un **Nuevo Proyecto** (ej. `eco-etitc-auth`).
3.  En el menú lateral, ve a **APIs & Services** > **Credentials**.
4.  Haz clic en **Create Credentials** y selecciona **OAuth client ID**.
5.  Si es la primera vez, te pedirá configurar la **Consent Screen** (Pantalla de consentimiento):
    *   Selecciona **External** (para que cualquier usuario con cuenta Google pueda entrar).
    *   Llena los datos básicos (Nombre de la App, correo de soporte, etc.).
    *   En "Scopes", añade `userinfo.email`, `userinfo.profile` y `openid`.
    *   Añade tu correo como "Test User" si la app está en modo prueba.
6.  Vuelve a crear las credenciales **OAuth client ID**:
    *   **Application type**: Web application.
    *   **Name**: Cliente Web ECO-ETITC.
    *   **Authorized JavaScript origins**:
        *   Para desarrollo local: `http://localhost:5173` y `http://localhost:5000` (o el puerto de tu backend).
        *   **IMPORTANTE**: Cuando tengas tu dominio (ej. `https://eco-etitc.com`), DEBES agregarlo aquí.
    *   **Authorized redirect URIs**:
        *   Igual que arriba, añade las URLs de callback si usas redirección.

7.  Al finalizar, obtendrás un **Client ID** y un **Client Secret**.
    *   El **Client ID** es público, va en el frontend.
    *   El **Client Secret** es SECRETO, va en el backend (si validas el token ahí).

## 2. Implementación en el Código

### Opción A: Firebase Authentication (Recomendada para Frontend)
Es la forma más fácil. Google maneja todo y te da un objeto `user` listo.

1.  Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2.  Habilita **Authentication** > **Sign-in method** > **Google**.
3.  Instala Firebase en tu frontend: `npm install firebase`.
4.  Crea un archivo `firebaseConfig.js` con las credenciales que te da Firebase.
5.  Usa `signInWithPopup` en tu componente React.

### Opción B: Google Identity Services (Directo)
Si no quieres usar Firebase.

1.  Usa la librería `@react-oauth/google` en el frontend.
2.  Envuelves tu app en `<GoogleOAuthProvider clientId="TU_CLIENT_ID">`.
3.  Usas el componente `<GoogleLogin />` o el hook `useGoogleLogin`.
4.  Al loguearse exitosamente, Google te devuelve un **Credential (JWT)**.
5.  Envías ese JWT a tu backend Python (`/api/google-login`).
6.  En Python, usas `google-auth` para verificar el token y crear/loguear al usuario en tu base de datos.

## 3. Requisitos para Despliegue

Para que Google Login funcione en producción:

1.  **Dominio HTTPS**: Google NO permite OAuth en dominios `http://` (excepto localhost). Necesitas un certificado SSL (la mayoría de hostings como Vercel/Render lo dan gratis).
2.  **Verificación de Dominio**: En Google Cloud Console, debes agregar tu dominio autorizado.
3.  **Políticas de Privacidad**: Google exige que tengas una URL con la Política de Privacidad de tu app visible.

## 4. Costos
*   **Google Identity / Firebase Auth**: Es gratuito para la mayoría de los casos de uso (hasta miles de usuarios activos mensuales).
