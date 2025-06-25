from flask import Flask
from app.routes.resume_routes import resume_bp, auth_bp
from pymongo import MongoClient
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

def create_app():
    # Load environment variables from .env file
    load_dotenv()

    app = Flask(__name__)

    # MongoDB setup
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME", "resume_screener")
    client = MongoClient(mongo_uri)
    app.config['MONGO_DB'] = client[db_name]

    # JWT configuration
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret")
    JWTManager(app)

    # Enable CORS for frontend connection
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    # Register blueprints
    app.register_blueprint(resume_bp)
    app.register_blueprint(auth_bp)

    return app
