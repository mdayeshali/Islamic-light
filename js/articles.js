document.addEventListener("DOMContentLoaded", () => {
    const pageUrl = window.location.href;

    /* =========================
       ১. শেয়ার ও কপি ইউটিলিটি ফাংশন
    ========================== */
    const handleShare = (title, url) => {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).catch(err => console.log("Share failed:", err));
        } else {
            const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            window.open(fbUrl, '_blank');
        }
    };

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url)
            .then(() => alert('লিংক কপি হয়েছে ✅'))
            .catch(err => console.error('Copy failed', err));
    };


    /* =========================
       ২. আর্টিকেলের ভেতরের শেয়ার বাটন (লেখা সহ)
       আপনার ফাইলের <div class="share-buttons"></div> এখানে এটি লোড হবে
    ========================== */
    document.querySelectorAll('.share-buttons').forEach(container => {
        // বাটনগুলো তৈরি করা হচ্ছে
        container.innerHTML = `
            <div class="article-inner-share" style="display: flex; gap: 10px; margin: 15px 0;">
                <button class="inner-share-btn" style="background: #f1f1f1; border: 1px solid #ddd; padding: 8px 12px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: inherit;">
                    <i class="fa-solid fa-share-nodes"></i> শেয়ার করুন
                </button>
                <button class="inner-copy-btn" style="background: #f1f1f1; border: 1px solid #ddd; padding: 8px 12px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: inherit;">
                    <i class="fa-regular fa-copy"></i> লিংক কপি
                </button>
            </div>
        `;

        // বাটন ক্লিকের কাজ
        container.querySelector('.inner-share-btn').addEventListener('click', () => handleShare(document.title, pageUrl));
        container.querySelector('.inner-copy-btn').addEventListener('click', () => handleCopy(pageUrl));
    });


    /* =========================
       ৩. মেইন পেজের বক্স লোড (শুধু আইকন)
    ========================== */
    const container = document.getElementById('article-container');

    if (container) {
        container.innerHTML = `<p style="text-align:center; padding: 20px;">আর্টিকেল লোড হচ্ছে...</p>`;

        fetch('/data/articles.json')
            .then(res => {
                if (!res.ok) throw new Error("JSON ফাইল পাওয়া যায়নি!");
                return res.json();
            })
            .then(data => {
                let articlesHTML = "";

                data.forEach(article => {
                    let fullUrl = article.link;
                    if (!fullUrl.startsWith('http')) {
                        const cleanPath = fullUrl.startsWith('/') ? fullUrl : '/' + fullUrl;
                        // আপনার চাহিদা অনুযায়ী /articles পাথ যুক্ত করা হয়েছে
                        fullUrl = window.location.origin + '/articles' + cleanPath;
                    }

                    articlesHTML += `
                        <article class="article-box">
                            <img src="${article.image || '/images/default.webp'}" 
                                 alt="${article.title}" 
                                 class="article-image" loading="lazy">
                            
                            <h2 class="article-heading">${article.title}</h2>

                            <div class="article-meta">
                                <span class="meta-date">
                                    <i class="fa-regular fa-calendar-days"></i> পোস্ট: ${article.date}
                                </span>
                                <span class="meta-author">
                                    <i class="fa-solid fa-user"></i> ${article.author}
                                </span>
                            </div>

                            <p class="article-summary">${article.summary}</p>

                            <div class="article-footer">
                                <div class="box-icons">
                                    <span class="share-icon" data-url="${fullUrl}" data-title="${article.title}" title="শেয়ার করুন">
                                        <i class="fa-solid fa-share-nodes"></i>
                                    </span>
                                    <span class="copy-icon" data-url="${fullUrl}" title="লিংক কপি করুন">
                                        <i class="fa-regular fa-copy"></i>
                                    </span>
                                </div>
                                <a href="${article.link}" class="read-more-link">আরও পড়ুন</a>
                            </div>
                        </article>
                    `;
                });

                container.innerHTML = articlesHTML;
            })
            .catch(err => {
                container.innerHTML = `<p style="color:red; text-align:center;">আর্টিকেল লোড করতে সমস্যা হয়েছে।</p>`;
            });
    }


    /* =========================
       ৪. ইভেন্ট ডেলিগেশন (মেইন পেজের বক্সের আইকনের জন্য)
    ========================== */
    document.addEventListener("click", function(e) {
        const shareBtn = e.target.closest(".share-icon");
        const copyBtn = e.target.closest(".copy-icon");

        if (shareBtn) {
            handleShare(shareBtn.getAttribute("data-title"), shareBtn.getAttribute("data-url"));
        }
        if (copyBtn) {
            handleCopy(copyBtn.getAttribute("data-url"));
        }
    });

    window.sharePage = () => handleShare(document.title, pageUrl);
});
