from flask import flash
from flask import Flask, render_template,flash, request, redirect, url_for, session, jsonify
# from flask_mysqldb import MySQL
import MySQLdb.cursors
from functools import wraps
from  decimal import Decimal


app = Flask(__name__)
app.secret_key = 'supersecretkey'

# MySQL config
app.config['MYSQL_HOST'] = 'localhost'
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


# Product detail page
@app.route('/product_detail/<int:product_id>')
@login_required
def product_detail(product_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
    product = cursor.fetchone()
    cursor.close()
    if not product:
        return "Product not found", 404
    return render_template("product_detail.html", product=product)


# Product list page
@app.route('/product')
@login_required
def product():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    cursor.close()
    return render_template('product.html', products=products)


# Men’s page
@app.route('/men')
def men():
    cursor = mysql.connection.cursor()

    selected_size = request.args.get('size')
    selected_colour = request.args.get('colour')

    query = "SELECT * FROM products WHERE category_id = %s"
    params = [1]  # 2 corresponds to 'women' category

    if selected_size:
        query += " AND size = %s"
        params.append(selected_size)

    if selected_colour:
        query += " AND colour = %s"
        params.append(selected_colour)

    query += " LIMIT 50"

    cursor.execute(query, tuple(params))
    products = cursor.fetchall()
    cursor.close()

    return render_template(
        'men.html',
        products=products,
        selected_size=selected_size,
        selected_colour=selected_colour
    )




# Women’s page
@app.route('/women')
def women():
    cursor = mysql.connection.cursor()

    selected_size = request.args.get('size')
    selected_colour = request.args.get('colour')

    query = "SELECT * FROM products WHERE category_id = %s"
    params = [2]  # 2 corresponds to 'women' category

    if selected_size:
        query += " AND size = %s"
        params.append(selected_size)

    if selected_colour:
        query += " AND colour = %s"
        params.append(selected_colour)

    query += " LIMIT 50"

    cursor.execute(query, tuple(params))
    products = cursor.fetchall()
    cursor.close()

    return render_template(
        'women.html',
        products=products,
        selected_size=selected_size,
        selected_colour=selected_colour
    )





# Kids’ page
@app.route('/kids')
def kids():
    cursor = mysql.connection.cursor()

    selected_size = request.args.get('size')
    selected_colour = request.args.get('colour')

    query = "SELECT * FROM products WHERE category_id = %s"
    params = [3]

    if selected_size:
        query += " AND size = %s"
        params.append(selected_size)

    if selected_colour:
        query += " AND colour = %s"
        params.append(selected_colour)

    query += " LIMIT 50"

    cursor.execute(query, tuple(params))
    products = cursor.fetchall()
    cursor.close()

    return render_template(
        'kids.html',
        products=products,
        selected_size=selected_size,
        selected_colour=selected_colour
    )




# Cart page
@app.route('/cart')
@login_required
def cart():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id FROM sign WHERE email = %s", (session['email'],))
    user_id = cursor.fetchone()['id']

    cursor.execute('''
        SELECT cart.id, products.name, products.image, products.price, cart.quantity
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = %s
    ''', (user_id,))
    items = cursor.fetchall()
    tax_rate = Decimal('0.18')
    cursor.close()
    return render_template('cart.html', cart_items=items, tax_rate=tax_rate)



# Add to Cart Route
@app.route('/add_to_cart', methods=['POST'])
@login_required
def add_to_cart():
    product_id = request.form['product_id']
    quantity = 1

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id FROM sign WHERE email = %s", (session['email'],))
    user_id = cursor.fetchone()[0]

    cursor.execute("SELECT * FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
    item = cursor.fetchone()

    if item:
        cursor.execute("UPDATE cart SET quantity = quantity + 1 WHERE user_id = %s AND product_id = %s",
                       (user_id, product_id))
    else:
        cursor.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)",
                       (user_id, product_id, quantity))

    mysql.connection.commit()
    cursor.close()
    return redirect(request.referrer) # go back to listing page



@app.route('/update_quantity', methods=['POST'])
@login_required
def update_quantity():
    item_id = request.form['item_id']
    action = request.form['action']
    cursor = mysql.connection.cursor()

    if action == 'increase':
        cursor.execute("UPDATE cart SET quantity = quantity + 1 WHERE id = %s", (item_id,))
    elif action == 'decrease':
        cursor.execute("UPDATE cart SET quantity = GREATEST(quantity - 1, 1) WHERE id = %s", (item_id,))

    mysql.connection.commit()
    cursor.close()
    return redirect(url_for('cart'))



@app.route('/remove_from_cart/<int:item_id>', methods=['POST'])
@login_required
def remove_from_cart(item_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id FROM sign WHERE email = %s", (session['email'],))
    user_id = cursor.fetchone()[0]

    cursor.execute("DELETE FROM cart WHERE id = %s AND user_id = %s", (item_id, user_id))
    mysql.connection.commit()
    cursor.close()
    return redirect(url_for('cart'))



# Address, Order, Payment pages
@app.route('/address', methods=['GET', 'POST'])
@login_required
def address():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id FROM sign WHERE email = %s", (session['email'],))
    user_id = cursor.fetchone()['id']

    if request.method == 'POST':
        action = request.form.get('action')

        if action == 'use_selected':
            selected_address_id = request.form.get('selected_address_id')
            cursor.execute("UPDATE address SET selected = FALSE WHERE user_id = %s", (user_id,))
            cursor.execute("UPDATE address SET selected = TRUE WHERE id = %s AND user_id = %s", (selected_address_id, user_id))
            mysql.connection.commit()
            return redirect(url_for('order_summary'))

        elif action == 'add_new':
            name = request.form['name']
            phone = request.form['phone']
            address_text = request.form['address']

            cursor.execute("INSERT INTO address (user_id, name, phone, address, selected) VALUES (%s, %s, %s, %s, %s)",
                           (user_id, name, phone, address_text, True))
            cursor.execute("UPDATE address SET selected = FALSE WHERE user_id = %s AND id != LAST_INSERT_ID()", (user_id,))
            mysql.connection.commit()
            return redirect(url_for('order_summary'))

    cursor.execute("SELECT * FROM address WHERE user_id = %s", (user_id,))
    saved_addresses = cursor.fetchall()
    return render_template('address.html', saved_addresses=saved_addresses)




@app.route('/save_address', methods=['POST'])
@login_required
def save_address():
    name = request.form['name']
    phone = request.form['phone']
    address = request.form['address']
    email = session['email']

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO address (email, name, phone, address) VALUES (%s, %s, %s, %s)",
                   (email, name, phone, address))
    mysql.connection.commit()
    cursor.close()

    return redirect(url_for('order_summary'))  # or 'payment'




@app.route('/order-summary')
@login_required
def order_summary():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id FROM sign WHERE email = %s", (session['email'],))
    user_id = cursor.fetchone()['id']

    cursor.execute("SELECT * FROM address WHERE user_id = %s AND selected = TRUE", (user_id,))
    selected_address = cursor.fetchone()

    cursor.execute('''
        SELECT products.name, products.price, cart.quantity
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = %s
    ''', (user_id,))
    cart_items = cursor.fetchall()

    subtotal = sum(float(item['price']) * int(item['quantity']) for item in cart_items)
    tax = subtotal * 0.18
    total = subtotal + tax + 50

    return render_template('order-summary.html', selected_address=selected_address, cart_items=cart_items,
                           subtotal=subtotal, tax=tax, total=total)


@app.route('/payment', methods=['GET', 'POST'])
@login_required
def payment():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    # Get user_id from session
    cursor.execute("SELECT id FROM sign WHERE email = %s", (session['email'],))
    user_id = cursor.fetchone()['id']

    # Get selected address
    cursor.execute("SELECT id FROM address WHERE user_id = %s AND selected = TRUE", (user_id,))
    address = cursor.fetchone()
    if not address:
        flash("No address selected!")
        return redirect(url_for('address'))

    address_id = address['id']

    # Get cart items
    cursor.execute('''
        SELECT product_id, quantity, products.price
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE user_id = %s
    ''', (user_id,))
    cart_items = cursor.fetchall()

    if not cart_items:
        flash("Cart is empty!")
        return redirect(url_for('cart'))

    # Calculate total
    subtotal = sum(float(item['price']) * item['quantity'] for item in cart_items)
    tax = subtotal * 0.18
    shipping = 50
    total = subtotal + tax + shipping

    if request.method == 'POST':
        # Insert into orders table
        cursor.execute('''
            INSERT INTO orders (user_id, address_id, total_amount)
            VALUES (%s, %s, %s)
        ''', (user_id, address_id, total))
        mysql.connection.commit()

        order_id = cursor.lastrowid  # Get newly inserted order ID

        # Insert into order_items table
        for item in cart_items:
            cursor.execute('''
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            ''', (order_id, item['product_id'], item['quantity'], item['price']))

        # Clear user's cart
        cursor.execute("DELETE FROM cart WHERE user_id = %s", (user_id,))
        mysql.connection.commit()
        cursor.close()

        return redirect(url_for('order_success'))

    return render_template('payment.html')



@app.route('/order_success')
@login_required
def order_success():
    return render_template('order_success.html')

@app.context_processor
def inject_cart_count():
    if 'email' in session:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT id FROM sign WHERE email = %s', (session['email'],))
        user_id = cursor.fetchone()[0]
        cursor.execute('SELECT SUM(quantity) FROM cart WHERE user_id = %s', (user_id,))
        count = cursor.fetchone()[0] or 0
        cursor.close()
        return dict(cart_count=count)
    return dict(cart_count=0)
@app.route('/account')
@login_required
def account():
    email = session['email']
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    # Get user info
    cursor.execute("SELECT id, email FROM sign WHERE email = %s", (email,))
    user_info = cursor.fetchone()

    # Get saved addresses
    cursor.execute("SELECT name, phone, address FROM address WHERE user_id = %s", (user_info['id'],))
    addresses = cursor.fetchall()

    # Get orders and products
    cursor.execute("""
        SELECT orders.id AS order_id, orders.created_at, products.name, products.price, order_items.quantity
        FROM orders
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON order_items.product_id = products.id
        WHERE orders.user_id = %s
        ORDER BY orders.created_at DESC
    """, (user_info['id'],))
    orders = cursor.fetchall()

    cursor.close()
    return render_template('account.html', user=user_info, addresses=addresses, orders=orders)

@app.after_request
def add_no_cache_headers(response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


if __name__ == '__main__':
    app.run(debug=True)
