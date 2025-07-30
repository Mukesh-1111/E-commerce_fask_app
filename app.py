from flask import flash
from flask import Flask, render_template,flash, request, redirect, url_for, session, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
from functools import wraps
from  decimal import Decimal


app = Flask(__name__)
app.secret_key = 'supersecretkey'

# MySQL config
app.config['MYSQL_HOST'] = 'db'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'ecommerce'

mysql = MySQL(app)


@app.route('/')
def index():
    return render_template('index.html')


# Registration
@app.route('/register', methods=['POST'])
def register():
    email = request.form['username']
    password = request.form['password']
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM sign WHERE email = %s", (email,))
    account = cursor.fetchone()

    if account:
        return "Email already registered. Please login."
    else:
        cursor.execute("INSERT INTO sign (email, password) VALUES (%s, %s)", (email, password))
        mysql.connection.commit()
        return redirect(url_for('index'))


# Login
@app.route('/login', methods=['POST'])
def login():
    email = request.form['username']
    password = request.form['password']
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM sign WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()

    if user:
        session['email'] = email
        return redirect(url_for('product'))
    else:
        return "Invalid email or password"


# Logout
@app.route('/logout')
def logout():
    session.pop('email', None)
    return redirect(url_for('index'))


# Login required decorator
def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'email' not in session:
            return redirect(url_for('index'))
        return func(*args, **kwargs)

    return wrapper


# Home page
@app.route('/home')
def home():
    return render_template('home.html')










if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
