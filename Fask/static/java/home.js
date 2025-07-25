// Optional: Check if user is logged in (simulate session)
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("registeredUser"));
});
logoutBtn.onclick = function () {
  localStorage.removeItem("registeredUser");
  alert("Logged out successfully!");
  window.location.href = "index.html";
};

document.body.appendChild(logoutBtn);