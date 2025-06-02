from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = MySQL()
jwt = JWTManager()
cors = CORS()
