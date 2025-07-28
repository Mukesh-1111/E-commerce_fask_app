const menProducts = [
  {
    id: 1,
    name: "T-Shirt",
    price: "₹499",
    image: "C:/Users/hp/Desktop/prototype/static/images/mens/61kHoFE8mAL._UY1100_.jpg"
  },
  {
    id: 2,
    name: "Full Sleeves T-Shirt",
    price: "₹1499",
    image: "C:/Users/hp/Desktop/prototype/static/images/mens/Full Sleeves T-Shirt.webp"
  },
  {
    id: 3,
    name: "Shirt",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/mens/Shirt.jpg"
  },
  {
    id: 4,
    name: "Kurta",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/mens/Kurta.jpg"
  },
  {
    id: 5,
    name: "Sherwani",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/mens/Sherwani.jpeg"
  },
  {
    id: 6,
    name: "Blezer",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/mens/Blezer.webp"
  },
  {
    id: 7,
    name: "Leather Jacket",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/mens/Leather Jacket.avif"
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
      <a href="/product_detail/${product.id}">View Details</a>

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