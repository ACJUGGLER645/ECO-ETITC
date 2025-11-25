import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret-key-change-me'
# Use SQLite by default for local development if DATABASE_URL is not set
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///site.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
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

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if username or email already exists
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
        login_user(user)
        return jsonify({"message": "Logged in", "username": user.username})
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"})

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
    app.run(host='0.0.0.0', debug=True)
