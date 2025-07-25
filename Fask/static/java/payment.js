document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("payment-form");
  const successPopup = document.getElementById("successPopup");
  const cardDetails = document.getElementById("card-details");

  // Hide card details if not selected
  const selectedMethod = document.querySelector('input[name="method"]:checked');
  if (selectedMethod && selectedMethod.value !== "card") {
    cardDetails.style.display = "none";
  }

  // Show/hide card fields
  document.querySelectorAll('input[name="method"]').forEach(input => {
    input.addEventListener("change", () => {
      cardDetails.style.display = input.value === "card" ? "block" : "none";
    });
  });

  // Handle submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show popup
    successPopup.style.display = "flex";

    // Optional: Clear cart and address
    localStorage.removeItem("cart");
    localStorage.removeItem("selectedAddress");
  });
});

