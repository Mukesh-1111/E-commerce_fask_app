// Load saved addresses
const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
const container = document.getElementById("saved-addresses");

if (savedAddresses.length > 0) {
  savedAddresses.forEach((addr, index) => {
    const card = document.createElement("div");
    card.className = "address-card";
    card.innerHTML = `
      <strong>${addr.name}</strong><br>
      ${addr.phone}<br>
      ${addr.address}
    `;
    card.onclick = () => {
      localStorage.setItem("selectedAddress", JSON.stringify(addr));
      window.location.href = "order-summary.html"; // or confirmation page
    };
    container.appendChild(card);
  });
}

// Handle new address submission
document.getElementById("address-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill out all fields.");
    return;
  }

  const newAddress = { name, phone, address };
  savedAddresses.push(newAddress);
  localStorage.setItem("addresses", JSON.stringify(savedAddresses));
  localStorage.setItem("selectedAddress", JSON.stringify(newAddress));

  window.location.href = "order-summary.html";
});
