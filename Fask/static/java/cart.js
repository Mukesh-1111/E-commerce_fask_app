document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.querySelector(".cart-items");
  const subtotalElement = document.querySelector(".summary-row span:nth-child(2)");
  const taxElement = document.querySelectorAll(".summary-row span:nth-child(2)")[2];
  const totalElement = document.querySelector(".total-row span:nth-child(2)");

  const SHIPPING_COST = 9.99;
  const TAX_RATE = 0.1; // 10%

  function parsePrice(priceString) {
    return parseFloat(priceString.replace(/[^\d.-]/g, ""));
  }

  function updateSummary() {
    let subtotal = 0;

    cart.forEach(item => {
      const price = parsePrice(item.price);
      subtotal += price * item.qty;
    });

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + SHIPPING_COST;

    subtotalElement.textContent = `Rs${subtotal.toFixed(2)}`;
    taxElement.textContent = `Rs${tax.toFixed(2)}`;
    totalElement.textContent = `Rs${total.toFixed(2)}`;
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      document.querySelector(".cart-content").style.display = "none";
      document.querySelector(".empty-cart").style.display = "block";
      return;
    }

    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.innerHTML = `
        <div class="item-image" style="background-image: url('${item.image}'); background-size: cover;"></div>
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="item-price">Rs${parsePrice(item.price).toFixed(2)}</p>
          <div class="quantity-controls">
            <button class="qty-btn minus">-</button>
            <input type="number" value="${item.qty}" min="1" class="quantity-input" />
            <button class="qty-btn plus">+</button>
          </div>
        </div>
        <div class="item-total">
          <p class="total-price">Rs${(parsePrice(item.price) * item.qty).toFixed(2)}</p>
          <button class="remove-btn">Remove</button>
        </div>
      `;

      // Quantity handlers
      itemDiv.querySelector(".minus").addEventListener("click", () => {
        if (item.qty > 1) {
          item.qty -= 1;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateSummary();
      });

      itemDiv.querySelector(".plus").addEventListener("click", () => {
        item.qty += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateSummary();
      });

      itemDiv.querySelector(".quantity-input").addEventListener("change", (e) => {
        const newQty = parseInt(e.target.value);
        item.qty = isNaN(newQty) || newQty < 1 ? 1 : newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateSummary();
      });

      // Remove handler
      itemDiv.querySelector(".remove-btn").addEventListener("click", () => {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateSummary();
      });

      cartItemsContainer.appendChild(itemDiv);
    });

    updateSummary();
  }

  renderCart();

  // Checkout redirection
  document.querySelector(".checkout-btn")?.addEventListener("click", () => {
    window.location.href = "address.html";
  });

  // Continue shopping button
  document.querySelector(".continue-shopping")?.addEventListener("click", () => {
    window.location.href = "home.html";
  });
});
