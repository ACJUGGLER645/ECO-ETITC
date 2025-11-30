import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import requests # Librería estándar para peticiones HTTP
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'secret-key-change-me')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///site.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# --- CONFIGURACIÓN CRÍTICA PARA COOKIES (LOGOUT/SESIÓN) ---
# Necesario porque Vercel y Render son dominios diferentes
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True # Requiere HTTPS (Render lo tiene)
# ----------------------------------------------------------

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Configurar CORS para permitir credenciales (cookies)
cors = CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})
login_manager = LoginManager(app)

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    likes = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('comments', lazy=True))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/api/health')
def health():
    return jsonify({"status": "ok", "os": "Alpine Linux Container"})

# --- RUTA PARA VER USUARIOS (ADMIN) ---
@app.route('/api/admin/users', methods=['GET'])
def list_users():
    # En producción deberías proteger esto con @login_required y verificar si es admin
    users = User.query.all()
    return jsonify([{
        "id": u.id, 
        "username": u.username, 
        "email": u.email, 
        "name": u.name
    } for u in users])
# --------------------------------------

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        username=data['username'],
        name=data['name'],
        email=data['email'],
        password=hashed_password
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created"}), 201
    except Exception as e:
        return jsonify({"message": "Registration failed"}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user, remember=True) # Remember=True ayuda a mantener la sesión
        return jsonify({"message": "Logged in", "username": user.username})
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({"message": "Logged out"})

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    data = request.get_json()
    access_token = data.get('token')
    
    if not access_token:
        return jsonify({"error": "Token missing"}), 400

    try:
        # Validar token llamando a la API de Google (UserInfo)
        # Esto funciona con el access_token que envía el frontend
        google_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if google_response.status_code != 200:
            return jsonify({"error": "Invalid Google Token"}), 401
            
        user_info = google_response.json()
        
        email = user_info.get('email')
        name = user_info.get('name')
        
        if not email:
            return jsonify({"error": "Google account has no email"}), 400
        
        # Buscar o crear usuario
        user = User.query.filter_by(email=email).first()
        if not user:
            import secrets
            random_password = secrets.token_urlsafe(16)
            hashed_password = bcrypt.generate_password_hash(random_password).decode('utf-8')
            
            user = User(
                username=email,
                name=name,
                email=email,
                password=hashed_password
            )
            db.session.add(user)
            db.session.commit()
            
        login_user(user, remember=True)
        return jsonify({
            "message": "Login exitoso", 
            "username": user.username, 
            "user": {"name": user.name, "email": user.email}
        })

    except Exception as e:
        print(f"Error en Google Auth: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/comments', methods=['GET'])
def get_comments():
    comments = Comment.query.all()
    return jsonify([{"id": c.id, "content": c.content, "username": c.user.username, "likes": c.likes} for c in comments])

@app.route('/api/comments', methods=['POST'])
@login_required
def add_comment():
    data = request.get_json()
    new_comment = Comment(content=data['content'], user_id=current_user.id)
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"message": "Comment added", "comment": {"id": new_comment.id, "content": new_comment.content, "username": current_user.username, "likes": 0}})

@app.route('/api/comments/<int:comment_id>/like', methods=['POST'])
def like_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    comment.likes += 1
    db.session.commit()
    return jsonify({"likes": comment.likes})

@app.route('/api/user', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({"username": current_user.username, "is_authenticated": True})
    return jsonify({"is_authenticated": False})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5001, debug=True)
