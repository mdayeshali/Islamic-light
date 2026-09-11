const WHATSAPP_NUMBER = "+918617316109"; // আপনার নম্বর দিন
let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    clearBtn.style.display = query ? "block" : "none";
    filterProducts(query);
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.style.display = "none";
    renderProducts(allProducts);
  });
});

async function fetchProducts() {
  try {
    const res = await fetch("/data/products.json");
    allProducts = await res.json();
    renderProducts(allProducts);
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");
  grid.innerHTML = "";

  if (products.length === 0) {
    noResults.style.display = "block";
    return;
  }
  noResults.style.display = "none";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    
    // কার্ডে ক্লিক করলে নতুন পেজ ওপেন হবে
    card.onclick = () => {
      window.location.href = `/shop/product.html?id=${p.id}`;
    };

    card.innerHTML = `
      <div class="image-wrapper">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
      </div>
      <div class="content">
        <h2 class="title">${p.title}</h2>
        <div class="author">${p.author}</div>
        <p class="desc">${p.shortDesc}</p>
        <div class="card-footer">
          <div class="price-box">
            <span class="old-price">₹${p.oldPrice}</span>
            <span class="current-price">₹${p.price}</span>
          </div>
          <button class="btn-order" onclick="handleOrderClick(event, '${p.title}', '${p.price}')">
            <i class="fa-brands fa-whatsapp"></i> অর্ডার
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// কার্ডের ক্লিক ইভেন্ট বন্ধ রেখে কেবল হোয়াটসঅ্যাপ লিঙ্ক খোলার জন্য
function handleOrderClick(event, title, price) {
  event.stopPropagation();
  const msg = encodeURIComponent(`আসসালামু আলাইকুম,\nআমি islamiclight.in থেকে এই বইটি নিতে চাই:\n\n📖 ${title}\n💰 মূল্য: ₹${price}\n\nদয়া করে পেমেন্টের UPI ডিটেইলস ও নিয়ম জানান।`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

function filterProducts(query) {
  const filtered = allProducts.filter((p) => 
    p.title.toLowerCase().includes(query) || 
    p.author.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}
