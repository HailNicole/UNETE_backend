import os
from werkzeug.utils import secure_filename
from flask import current_app
from datetime import datetime

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100 MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        ext = filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{timestamp}.{ext}"

        upload_folder = os.path.join(current_app.root_path, 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)

        return unique_filename
    else:
        raise ValueError('Solo se permiten imágenes (jpeg, jpg, png, gif).')