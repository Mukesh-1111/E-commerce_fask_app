const addressContainer = document.getElementById("address-display");
const cartContainer = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");

// Load address
const address = JSON.parse(localStorage.getItem("selectedAddress"));
if (address) {
  addressContainer.innerHTML = `
    <strong>${address.name}</strong><br>
    ${address.phone}<br>
    ${address.address}
  `;
} else {
  addressContainer.innerHTML = "<p>No address selected.</p>";
}

// Load cart
const cart = JSON.parse(localStorage.getItem("cart")) || [];
let subtotal = 0;

if (cart.length === 0) {
  cartContainer.innerHTML = "<p>Your cart is empty.</p>";
} else {
  cart.forEach(item => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, "")); // ✅ FIXED
    const itemTotal = price * item.qty;
    subtotal += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <strong>${item.name}</strong> × ${item.qty} — Rs ${itemTotal.toFixed(2)}
    `;
    cartContainer.appendChild(div);
  });
}

// Calculate and display totals
const tax = subtotal * 0.1;
const SHIPPING_COST = 5;
const total = subtotal + tax + SHIPPING_COST;

subtotalEl.textContent = `Rs ${subtotal.toFixed(2)}`;
taxEl.textContent = `Rs ${tax.toFixed(2)}`;
totalEl.textContent = `Rs ${total.toFixed(2)}`;

// Handle payment
document.getElementById("payBtn").addEventListener("click", () => {
  localStorage.removeItem("cart");
  window.location.href = "payment.html";
});
