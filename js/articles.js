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
            // যদি ব্রাউজার শেয়ার সাপোর্ট না করে তবে ফেসবুক শেয়ার ওপেন হবে
            const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            window.open(fbUrl, '_blank');
        }
    };

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url)
            .then(() => alert('লিংক কপি হয়েছে ✅'))
            .catch(err => console.error('Copy failed:', err));
    };


    /* =========================
       ২. আর্টিকেল বক্স লোড (JSON থেকে)
    ========================== */
    const container = document.getElementById('article-container');

    if (container) {
        container.innerHTML = `<p style="text-align:center; padding: 20px;">আর্টিকেল লোড হচ্ছে...</p>`;

        fetch('/data/articles.json')
            .then(res => {
                if (!res.ok) throw new Error("JSON ফাইল খুঁজে পাওয়া যায়নি!");
                return res.json();
            })
            .then(data => {
                // আপনি চেয়েছেন JSON-এ যেভাবে আছে সেভাবেই দেখাবে (অর্থাৎ No Reverse)
                let articlesHTML = "";

                data.forEach(article => {
                    // সঠিক এবং পূর্ণাঙ্গ URL তৈরি (শেয়ার ও কপির জন্য)
                    let fullUrl = article.link;
                    if (!fullUrl.startsWith('http')) {
                        const cleanPath = fullUrl.startsWith('/') ? fullUrl : '/' + fullUrl;
                        fullUrl = window.location.origin + cleanPath;
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
                container.innerHTML = `<p style="color:red; text-align:center; padding: 20px;">আর্টিকেল লোড করতে সমস্যা হয়েছে।</p>`;
                console.error("Error:", err);
            });
    }


    /* =========================
       ৩. ক্লিক ইভেন্ট হ্যান্ডেলার (Event Delegation)
    ========================== */
    document.addEventListener("click", function(e) {
        const shareBtn = e.target.closest(".share-icon");
        const copyBtn = e.target.closest(".copy-icon");

        if (shareBtn) {
            const url = shareBtn.getAttribute("data-url");
            const title = shareBtn.getAttribute("data-title");
            handleShare(title, url);
        }

        if (copyBtn) {
            const url = copyBtn.getAttribute("data-url");
            handleCopy(url);
        }
    });


    /* =========================
       ৪. টপ পেজ শেয়ার (গ্লোবাল ফাংশন)
    ========================== */
    window.sharePage = () => handleShare(document.title, pageUrl);

});
                          
