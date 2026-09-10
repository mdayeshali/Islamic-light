const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // আপনার নম্বর দিন

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    window.location.href = "/shop/shop.html";
    return;
  }

  try {
    const res = await fetch("/data/products.json");
    const products = await res.json();
    const product = products.find((p) => p.id === productId);

    if (product) {
      renderDetails(product);
    } else {
      document.getElementById("loading").innerText = "বইটি পাওয়া যায়নি!";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("loading").innerText = "ডেটা লোড করতে সমস্যা হয়েছে!";
  }
});

function renderDetails(p) {
  document.title = `${p.title} | Islamic Light`;
  document.getElementById("loading").style.display = "none";
  document.getElementById("productLayout").style.display = "grid";

  // টেক্সট রেন্ডার
  document.getElementById("pTitle").innerText = p.title;
  document.getElementById("pAuthor").innerText = p.author;
  document.getElementById("pPrice").innerText = `₹${p.price}`;
  document.getElementById("pOldPrice").innerText = `₹${p.oldPrice}`;
  document.getElementById("pDesc").innerText = p.description;

  const badge = document.getElementById("pBadge");
  if (p.badge) {
    badge.innerText = p.badge;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }

  // স্পেসিফিকেশন রেন্ডার
  const specsGrid = document.getElementById("pSpecs");
  if (p.specs) {
    specsGrid.innerHTML = Object.entries(p.specs).map(([key, val]) => `
      <div class="spec-item">
        <div class="spec-key">${key}</div>
        <div class="spec-val">${val}</div>
      </div>
    `).join("");
  }

  // ইমেজ স্লাইডার সেটআপ
  const slider = document.getElementById("imageSlider");
  const dotsContainer = document.getElementById("sliderDots");

  slider.innerHTML = p.images.map(img => `<img src="${img}" alt="${p.title}">`).join("");
  dotsContainer.innerHTML = p.images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}"></span>`).join("");

  // সোয়াইপ করলে ডট পরিবর্তন হওয়া
  slider.addEventListener("scroll", () => {
    const index = Math.round(slider.scrollLeft / slider.clientWidth);
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  });

  // অর্ডার বাটন
  const orderBtn = document.getElementById("pOrderBtn");
  orderBtn.onclick = () => {
    const msg = encodeURIComponent(`আসসালামু আলাইকুম,\nআমি islamiclight.in থেকে এই বইটি নিতে চাই:\n\n📖 ${p.title}\n💰 মূল্য: ₹${p.price}\n\nদয়া করে পেমেন্টের UPI ডিটেইলস ও ডেলিভারির নিয়মটি জানাবেন।`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  // --- শেয়ার বাটন লজিক ---
  const shareBtn = document.getElementById("shareBtn");
  const copyToast = document.getElementById("copyToast");

  if (shareBtn) {
    shareBtn.onclick = async () => {
      const shareData = {
        title: `${p.title} | Islamic Light`,
        text: `${p.title} - বইটি সংগ্রহ করতে লিংকটি দেখুন:`,
        url: window.location.href
      };

      // মোবাইলে থাকলে নেটিভ শেয়ার শিট ওপেন হবে
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // ইউজার ক্যান্সেল করলে কোনো সমস্যা নেই
        }
      } else {
        // কম্পিউটার বা আনসাপোর্টেড ব্রাউজারে লিংক কপি হবে
        try {
          await navigator.clipboard.writeText(window.location.href);
          if (copyToast) {
            copyToast.style.display = "inline-flex";
            setTimeout(() => {
              copyToast.style.display = "none";
            }, 2500);
          }
        } catch (err) {
          alert("লিংক কপি করা যায়নি, অনুগ্রহ করে ব্রাউজার অ্যাড্রেস বার থেকে কপি করুন।");
        }
      }
    };
  }
}
