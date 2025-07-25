const menProducts = [
  {
    id: 1,
    name: "Kid's T-Shirt(10 years)",
    price: "₹499",
    image: "C:/Users/hp/Desktop/prototype/static/images/kids/Kid's T-Shirt(10 years).webp"
  },
  {
    id: 2,
    name: " Kid's Denim Jacket(10 years)",
    price: "₹1499",
    image: "C:/Users/hp/Desktop/prototype/static/images/kids/Kid's Denim Jacket(10 years).webp"
  },
  {
    id: 3,
    name: "Kid's Kurta(10 years)",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/kids/Kid's Kurta(10 years).webp"
  },
  {
    id: 4,
    name: "Kid's Full Sleeve Shirt(10 years)",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/kids/Kid's Full Sleeve Shirt(10 years).webp"
  },
  {
    id: 5,
    name: "Kid's Shorts(10 years)",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/kids/Kid's Shorts(10 years).jpg"
  },
  {
    id: 6,
    name: "Kid's Serwani(10 years)",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/kids/Kid's Serwani(10 years).webp"
  },
  {
    id: 7,
    name: "Kid's Leather Jacket(10 years)",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/kids/Kid's Leather Jacket(10 years).jpg"
  },
];

const productList = document.getElementById('product-list');
let loadCount = 0; // Track how many times products were added
const maxLoads = 10; // Limit how many times to repeat

function renderProducts() {
  menProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price}</p>
      <a href="product_detail.html?id=${product.id}">View Details</a>
    `;

    productList.appendChild(productCard);
  });
  loadCount++;
}

// Initial products (at least once to allow scroll)
renderProducts();
renderProducts(); // Optional: pre-load more

// Scroll event listener
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 50) {
    if (loadCount < maxLoads) {
      renderProducts();
    }
  }
});