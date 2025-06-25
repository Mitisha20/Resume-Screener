from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from sentence_transformers import SentenceTransformer, util
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime
import fitz  # PyMuPDF
import os

from app.models.database import get_resumes_collection, get_users_collection

model = SentenceTransformer('all-MiniLM-L6-v2')

resume_bp = Blueprint("resume", __name__)
auth_bp = Blueprint("auth", __name__)

# -------------------------------------------------
# 🔹 Test Route
# -------------------------------------------------
@resume_bp.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({'message': 'Resume route working!'})

# -------------------------------------------------
# 🔹 Upload Resume Route
# -------------------------------------------------
@resume_bp.route('/api/upload_resume', methods=['POST'])
@jwt_required()
def upload_resume():
    try:
        username = get_jwt_identity()

        if 'resume' not in request.files:
            return jsonify({"error": "Resume not uploaded"}), 400

        resume_file = request.files['resume']

        if resume_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Save file locally
        upload_dir = 'uploads'
        os.makedirs(upload_dir, exist_ok=True)
        filepath = os.path.join(upload_dir, resume_file.filename)
        resume_file.save(filepath)

        # Extract text from PDF
        doc = fitz.open(filepath)
        resume_text = ''.join([page.get_text() for page in doc])

        # Store in MongoDB
        resumes_collection = get_resumes_collection()
        resumes_collection.insert_one({
            "username": username,
            "filename": resume_file.filename,
            "text": resume_text,
            "parsed_at": datetime.utcnow(),
            "uploaded_by": username
        })

        return jsonify({'resume_text': resume_text})

    except Exception as e:
        current_app.logger.error(f"Upload error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# -------------------------------------------------
# 🔹 Screen Resume (Match % based on JD)
# -------------------------------------------------
@resume_bp.route('/api/screen_resume', methods=['POST'])
def screen_resume():
    try:
        data = request.get_json()
        resumes = data.get("resumes", [])
        job_description = data.get("job_description", "")

        if not resumes or not job_description.strip():
            return jsonify({'error': 'Resumes and job description required'}), 400

        jd_embedding = model.encode(job_description, convert_to_tensor=True)
        results = []

        for resume in resumes:
            resume_embedding = model.encode(resume, convert_to_tensor=True)
            similarity = util.cos_sim(resume_embedding, jd_embedding).item()
            results.append({
                "resume_text": resume[:100] + "...",
                "match_percentage": round(similarity * 100, 2)
            })

        results.sort(key=lambda x: x["match_percentage"], reverse=True)
        return jsonify({"results": results}), 200

    except Exception as e:
        current_app.logger.error(f"Screening error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# -------------------------------------------------
# 🔹 Rank All Resumes of Logged-in User
# -------------------------------------------------
@resume_bp.route('/api/rank_resumes', methods=['POST'])
@jwt_required()
def rank_resumes():
    username = get_jwt_identity()
    job_description = request.get_json().get('job_description', '').strip()

    if not job_description:
        return jsonify({'error': 'Job description required'}), 400

    collection = get_resumes_collection()
    user_resumes = list(collection.find({"uploaded_by": username}))

    if not user_resumes:
        return jsonify({'error': 'No resumes found'}), 404

    resume_texts = [r.get('text', '') for r in user_resumes]
    filenames = [r.get('filename', 'N/A') for r in user_resumes]

    embeddings = model.encode(resume_texts + [job_description])
    resume_embeddings = embeddings[:-1]
    jd_embedding = embeddings[-1]

    scores = cosine_similarity([jd_embedding], resume_embeddings)[0]

    ranked = sorted(
        [
            {'filename': filenames[i], 'match_percentage': round(score * 100, 2)}
            for i, score in enumerate(scores)
        ],
        key=lambda x: x['match_percentage'],
        reverse=True
    )

    return jsonify({'ranked_resumes': ranked}), 200

# -------------------------------------------------
# 🔹 User Registration
# -------------------------------------------------
@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    users = get_users_collection()
    if users.find_one({"username": username}):
        return jsonify({"error": "User already exists"}), 409

    hashed = generate_password_hash(password)
    users.insert_one({"username": username, "password": hashed})
    return jsonify({"message": "Registered successfully!"}), 201

# -------------------------------------------------
# 🔹 User Login
# -------------------------------------------------
@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    users = get_users_collection()
    user = users.find_one({"username": username})

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=username)
    return jsonify({"access_token": token}), 200

# -------------------------------------------------
# 🔹 Get Logged-in User's Uploaded Resumes
# -------------------------------------------------
@resume_bp.route('/api/user_resumes', methods=['GET'])
@jwt_required()
def get_user_resumes():
    username = get_jwt_identity()
    collection = get_resumes_collection()
    resumes = list(collection.find({"uploaded_by": username}))

    for resume in resumes:
        resume["_id"] = str(resume["_id"])  # Convert ObjectId to string

    return jsonify({"resumes": resumes}), 200
