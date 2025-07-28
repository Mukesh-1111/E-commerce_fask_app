const menProducts = [
  {
    id: 1,
    name: "Top",
    price: "₹499",
    image: "C:/Users/hp/Desktop/prototype/static/images/womens/Top.webp"
  },
  {
    id: 2,
    name: "Leggins",
    price: "₹1499",
    image: "C:/Users/hp/Desktop/prototype/static/images/womens/Leggins.webp"
  },
  {
    id: 3,
    name: "Kurti",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/womens/Kurti.webp"
  },
  {
    id: 4,
    name: "Saree",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/womens/Saree.webp"
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/womens/Denim Jacket.webp"
  },
  {
    id: 6,
    name: "Lether Jacket",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/womens/Lether Jacket.jpg"
  },
  {
    id: 7,
    name: "Gown",
    price: "₹899",
    image: "C:/Users/hp/Desktop/prototype/static/images/womens/Gown.webp"
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