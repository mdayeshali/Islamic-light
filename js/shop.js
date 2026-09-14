const WHATSAPP_NUMBER = "918617316109"; // WhatsApp API-এর জন্য '+' ছাড়া ফরম্যাট
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
    
    // কার্ডে ক্লিক করলে নির্দিষ্ট বইয়ের পেজ ওপেন হবে
    card.onclick = () => {
      window.location.href = `/shop/product.html?id=${p.id}`;
    };

    // ফ্রি ডেলিভারি ব্যাজ HTML
    const freeDeliveryHtml = p.freeDelivery 
      ? `<span class="free-delivery-badge"><i class="fa-solid fa-truck-fast"></i> ফ্রি ডেলিভারি</span>` 
      : "";

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
            ${freeDeliveryHtml}
          </div>
          <button class="btn-order" onclick="handleOrderClick(event, '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.images[0]}', '${p.id}', ${p.freeDelivery ? true : false})">
            <i class="fa-brands fa-whatsapp"></i> অর্ডার
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// কার্ডের ক্লিক ইভেন্ট বন্ধ রেখে ছবির প্রিভিউ লিংক ও ডেলিভারি তথ্যসহ হোয়াটসঅ্যাপ খোলার ফাংশন
function handleOrderClick(event, title, price, imgSrc, id, isFreeDelivery) {
  event.stopPropagation();

  // ছবির সম্পূর্ণ লিংক এবং প্রোডাক্ট পেজ লিংক তৈরি
  const absoluteImgUrl = imgSrc ? new URL(imgSrc, window.location.origin).href : "";
  const productUrl = id ? `${window.location.origin}/shop/product.html?id=${id}` : window.location.href;
  const deliveryText = isFreeDelivery ? "✅ ফ্রি ডেলিভারি" : "📦 ডেলিভারি চার্জ প্রযোজ্য";

  const msg = encodeURIComponent(
`আসসালামু আলাইকুম,
আমি islamiclight.in থেকে এই বইটি নিতে চাই:

📖 ${title}
💰 মূল্য: ₹${price} (${deliveryText})

🖼️ বইয়ের ছবি: ${absoluteImgUrl}
🔗 বিস্তারিত লিংক: ${productUrl}

দয়া করে পেমেন্টের UPI ডিটেইলস ও নিয়মটি জানাবেন।`
  );

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

function filterProducts(query) {
  const filtered = allProducts.filter((p) => 
    p.title.toLowerCase().includes(query) || 
    p.author.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}
