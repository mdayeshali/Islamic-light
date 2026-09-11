const WHATSAPP_NUMBER = "+918617316109"; // আপনার নম্বর দিন

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
            // রিলেটিভ পাথকে ব্রাউজার অনুযায়ী সম্পূর্ণ (Absolute) URL এ রূপান্তর
            const absoluteImgUrl = new URL(p.images[0], window.location.href).href;
            
            const imgResponse = await fetch(absoluteImgUrl);
            const blob = await imgResponse.blob();
            
            // ফাইলের নাম ও এক্সটেনশন নির্ধারণ
            const fileType = blob.type || "image/webp";
            const ext = fileType.includes("png") ? "png" : fileType.includes("jpeg") || fileType.includes("jpg") ? "jpg" : "webp";
            const file = new File([blob], `book-cover.${ext}`, { type: fileType });

            // ডিভাইসটি যদি ফটো শেয়ার করতে সমর্থ হয়
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              sharePayload.files = [file];
            }
          } catch (fileErr) {
            console.log("ছবি প্রসেস করা সম্ভব হয়নি, টেক্সট শেয়ার চালু থাকবে:", fileErr);
          }
        }

        // ছবিসহ অথবা শুধু লিংক দিয়ে শেয়ার ডায়ালগ ওপেন
        try {
          // ফাইল যুক্ত থাকলে কিছু ব্রাউজারে 'url' ফিল্ড এরর দেয়, তাই শুধু টেক্সটের ভেতরে লিংক রাখা নিরাপদ
          if (!sharePayload.files) {
            sharePayload.url = shareUrl;
          }
          await navigator.share(sharePayload);
        } catch (err) {
          // ব্যবহারকারী নিজে উইন্ডো কেটে দিলে কোনো এরর যাতে না দেখায়
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
