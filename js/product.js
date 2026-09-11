const WHATSAPP_NUMBER = "918617316109"; // WhatsApp API-এর জন্য '+' ছাড়া ফরম্যাট রাখা নিরাপদ

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

  // --- ইমেজ স্লাইডার ও কন্ট্রোল সেটআপ (কম্পিউটার ও মোবাইল উভয় ডিভাইসের জন্য) ---
  const slider = document.getElementById("imageSlider");
  const dotsContainer = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("prevSlideBtn");
  const nextBtn = document.getElementById("nextSlideBtn");

  slider.innerHTML = p.images.map(img => `<img src="${img}" alt="${p.title}" draggable="false">`).join("");
  dotsContainer.innerHTML = p.images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join("");

  const dots = dotsContainer.querySelectorAll(".dot");

  // ডটে ক্লিক করলে নির্দিষ্ট ছবিতে যাওয়া
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.getAttribute("data-index"));
      slider.scrollTo({
        left: slider.clientWidth * idx,
        behavior: "smooth"
      });
    });
  });

  // তীর (Next / Prev) বাটনে ক্লিক করলে ছবি পরিবর্তন হওয়া
  if (prevBtn && nextBtn) {
    prevBtn.onclick = () => {
      slider.scrollBy({ left: -slider.clientWidth, behavior: "smooth" });
    };
    nextBtn.onclick = () => {
      slider.scrollBy({ left: slider.clientWidth, behavior: "smooth" });
    };
  }

  // ছবি পরিবর্তন হলে স্বয়ংক্রিয়ভাবে সক্রিয় ডট আপডেট হওয়া
  slider.addEventListener("scroll", () => {
    const index = Math.round(slider.scrollLeft / slider.clientWidth);
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  });

  // কম্পিউটারে মাউস দিয়ে টেনে স্লাইড (Mouse Drag to Swipe) করার ফিচার
  let isDown = false;
  let startX;
  let scrollLeftPos;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeftPos = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => { isDown = false; });
  slider.addEventListener("mouseup", () => { isDown = false; });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeftPos - walk;
  });

  // অর্ডার বাটন
  const orderBtn = document.getElementById("pOrderBtn");
  orderBtn.onclick = () => {
    const msg = encodeURIComponent(`আসসালামু আলাইকুম,\nআমি islamiclight.in থেকে এই বইটি নিতে চাই:\n\n📖 ${p.title}\n💰 মূল্য: ₹${p.price}\n\nদয়া করে পেমেন্টের UPI ডিটেইলস ও ডেলিভারির নিয়মটি জানাবেন।`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  // --- ফটোসহ নিরাপদ শেয়ার বাটন লজিক ---
  const shareBtn = document.getElementById("shareBtn");
  const copyToast = document.getElementById("copyToast");

  if (shareBtn) {
    shareBtn.onclick = async () => {
      const shareUrl = window.location.href;
      const shareTitle = `${p.title} | Islamic Light`;
      const shareText = `${p.title} - বইটি সংগ্রহ করতে লিংকটি দেখুন:\n${shareUrl}`;

      // মোবাইলে নেটিভ শেয়ার সাপোর্ট থাকলে
      if (navigator.share) {
        let sharePayload = {
          title: shareTitle,
          text: shareText
        };

        // ১. ছবি ফেচ করে ফাইল অ্যাটাচ করার চেষ্টা
        if (p.images && p.images.length > 0) {
          try {
            const absoluteImgUrl = new URL(p.images[0], window.location.href).href;
            const imgResponse = await fetch(absoluteImgUrl);
            const blob = await imgResponse.blob();

            const fileType = blob.type || "image/webp";
            const ext = fileType.includes("png") ? "png" : fileType.includes("jpeg") || fileType.includes("jpg") ? "jpg" : "webp";
            const file = new File([blob], `book-cover.${ext}`, { type: fileType });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              sharePayload.files = [file];
            }
          } catch (fileErr) {
            console.log("ছবি প্রসেস করা সম্ভব হয়নি, টেক্সট শেয়ার চালু থাকবে:", fileErr);
          }
        }

        // ছবিসহ অথবা লিংক দিয়ে শেয়ার ডায়ালগ ওপেন
        try {
          if (!sharePayload.files) {
            sharePayload.url = shareUrl;
          }
          await navigator.share(sharePayload);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("শেয়ারিং ব্যর্থ:", err);
          }
        }
      } else {
        // কম্পিউটার বা আনসাপোর্টেড ব্রাউজারে লিংক কপি হওয়া
        try {
          await navigator.clipboard.writeText(shareUrl);
          if (copyToast) {
            copyToast.style.display = "inline-flex";
            setTimeout(() => {
              copyToast.style.display = "none";
            }, 2500);
          }
        } catch (err) {
          alert("লিংকটি কপি করা সম্ভব হয়নি, দয়া করে ব্রাউজারের অ্যাড্রেস বার থেকে কপি করুন।");
        }
      }
    };
  }
          
}
      
