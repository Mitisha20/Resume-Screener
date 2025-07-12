from flask import current_app

# Get the MongoDB client instance from the app config
def get_db():
    return current_app.config['MONGO_DB']

# Access the resumes collection
def get_resumes_collection():
    return get_db()['resumes']

# Access the users collection
def get_users_collection():
    return get_db()['users']
