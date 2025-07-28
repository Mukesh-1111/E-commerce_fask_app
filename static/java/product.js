// Dummy data
const products = {
  1: {
    name: "Summer T-Shirt",
    description: "Lightweight and breathable cotton t-shirt.",
    price: "Rs1119.99",
    image: ""
  }
};

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Validate product
if (!products[productId]) {
  document.querySelector(".product-details-container").innerHTML = "<h2>Product not found.</h2>";
} else {
  const product = products[productId];
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-description").textContent = product.description;
  document.getElementById("product-price").textContent = product.price;
  document.getElementById("product-image").src = product.image;

  // Add to cart button
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === productId);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showCartPopup();
  });
}

// Popup
function showCartPopup() {
  const popup = document.createElement("div");
  popup.className = "cart-popup";
  popup.innerHTML = `
    <p>Product added to cart!</p>
    <button onclick="window.location.href='cart.html'">View Cart</button>
    <button onclick="window.location.href='home.html'">Continue Shopping</button>
  `;
  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 5000);
}

