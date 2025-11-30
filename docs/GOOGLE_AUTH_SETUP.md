# 🔐 Guía de Implementación: Google Auth en Render y Vercel

Esta guía explica cómo configurar la autenticación con Google para que funcione perfectamente con tu **Frontend en Vercel** y tu **Backend en Render**.

---

## 🏗️ Arquitectura de Autenticación

1.  **Frontend (Vercel)**: El usuario hace clic en "Login con Google". Google le devuelve un token (JWT).
2.  **Backend (Render)**: El frontend envía ese token a tu API (`/api/auth/google`).
3.  **Validación**: El backend verifica con Google que el token sea real.
4.  **Sesión**: Si es válido, el backend crea/busca al usuario en la base de datos y le inicia sesión.

---

## 1. Configurar Google Cloud Console

Para que Google acepte peticiones de tus dominios de Vercel y Render, debes configurarlo así:

1.  Ve a [Google Cloud Console](https://console.cloud.google.com/).
2.  Crea un proyecto nuevo (ej. `eco-etitc-prod`).
3.  Ve a **APIs & Services** > **OAuth consent screen**.
    *   **User Type**: External.
    *   Llena los datos obligatorios (Nombre, correos).
    *   No necesitas verificar la app por ahora (mientras esté en modo "Testing").
4.  Ve a **Credentials** > **Create Credentials** > **OAuth client ID**.
    *   **Application type**: Web application.
    *   **Name**: `ECO-ETITC Production`.

### ⚠️ Configuración de URLs (¡CRÍTICO!)

En la sección de URLs autorizadas, debes poner EXACTAMENTE esto:

**Authorized JavaScript origins (Orígenes de JavaScript autorizados):**
Aquí van las URLs desde donde se abre la ventana de login (tu Frontend).
*   `http://localhost:5173` (Para pruebas locales)
*   `https://eco-etitc.vercel.app` (Tu URL de Vercel - **Sin barra al final**)

**Authorized redirect URIs (URIs de redireccionamiento autorizados):**
*   `http://localhost:5173`
*   `https://eco-etitc.vercel.app`

> **Nota**: Si tienes un dominio personalizado (ej. `www.eco-etitc.com`), agrégalo también.

5.  Al terminar, copia dos valores:
    *   **Client ID**: (Público, empieza por `xxxx.apps.googleusercontent.com`)
    *   **Client Secret**: (Privado, empieza por `GOCSPX-xxxx`)

---

## 2. Configuración en Vercel (Frontend)

El frontend necesita el **Client ID** para mostrar el botón de Google.

1.  Ve a tu proyecto en **Vercel**.
2.  **Settings** > **Environment Variables**.
3.  Agrega la variable:
    *   **Key**: `VITE_GOOGLE_CLIENT_ID`
    *   **Value**: (Pega tu Client ID aquí)
4.  **Redespliega** tu proyecto para que tome el cambio.

---

## 3. Configuración en Render (Backend)

El backend necesita validar el token. Aunque técnicamente solo necesita el Client ID para validar, es buena práctica tener ambos si planeas usar más funciones de Google.

1.  Ve a tu servicio en **Render**.
2.  **Environment**.
3.  Agrega las variables:
    *   **Key**: `GOOGLE_CLIENT_ID`
    *   **Value**: (Pega tu Client ID aquí)
    *   **Key**: `GOOGLE_CLIENT_SECRET` (Opcional para validación simple, pero recomendado)
    *   **Value**: (Pega tu Client Secret aquí)

---

## 4. Código Necesario

### A. Frontend (React + @react-oauth/google)

Instala la librería:
```bash
npm install @react-oauth/google
```

En tu `main.jsx` (o donde envuelvas la app):
```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
```

En tu componente de Login:
```jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from '../config/axios'; // Tu instancia de axios configurada

// ... dentro de tu componente
<GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      const res = await axios.post('/api/auth/google', {
        token: credentialResponse.credential
      });
      console.log('Login exitoso:', res.data);
      // Guardar usuario y redirigir
    } catch (error) {
      console.error('Error en login:', error);
    }
  }}
  onError={() => {
    console.log('Login fallido');
  }}
/>
```

### B. Backend (Python/Flask)

Instala la librería:
```bash
pip install google-auth
```
(Asegúrate de agregar `google-auth` a tu `requirements.txt`)

En tu `app.py`:
```python
from google.oauth2 import id_token
from google.auth.transport import requests
import os

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    data = request.get_json()
    token = data.get('token')
    
    try:
        # Validar el token con Google
        id_info = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            os.environ.get('GOOGLE_CLIENT_ID')
        )

        # Si llegamos aquí, el token es válido.
        # id_info contiene: email, name, picture, etc.
        email = id_info['email']
        name = id_info['name']
        
        # Lógica de tu DB:
        # 1. Buscar usuario por email
        # 2. Si no existe, crearlo
        # 3. Iniciar sesión (login_user)
        
        user = User.query.filter_by(email=email).first()
        if not user:
            # Crear usuario nuevo (quizás con password aleatorio o nulo)
            user = User(username=email, email=email, name=name, password="GOOGLE_LOGIN")
            db.session.add(user)
            db.session.commit()
            
        login_user(user)
        return jsonify({"message": "Login exitoso", "user": user.username})

    except ValueError:
        # Token inválido
        return jsonify({"error": "Token inválido"}), 401
```

---

## 5. Solución de Problemas Comunes

### Error: "The given origin is not allowed"
*   **Causa**: No pusiste la URL exacta de Vercel en "Authorized JavaScript origins" en Google Cloud.
*   **Solución**: Revisa que sea `https://eco-etitc.vercel.app` (sin `/` al final).

### Error: "popup_closed_by_user"
*   **Causa**: El usuario cerró la ventana antes de terminar.
*   **Solución**: Maneja este error en el `onError` del componente.

### Error 401 en el Backend
*   **Causa**: El `GOOGLE_CLIENT_ID` en el backend no coincide con el del frontend.
*   **Solución**: Verifica las variables de entorno en Render y Vercel.
