document.addEventListener("DOMContentLoaded", () => {
    const pageUrl = window.location.href;

    /* =========================
       ১. SHARE & COPY UTILITY (Re-usable Functions)
    ========================== */
    const handleShare = (title, url) => {
        if (navigator.share) {
            navigator.share({ title: title, url: url })
                .catch(err => console.log("Share cancelled or failed", err));
        } else {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        }
    };

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url)
            .then(() => alert('লিংক কপি হয়েছে ✅'))
            .catch(err => console.error('Copy failed', err));
    };


    /* =========================
       ২. LOAD ARTICLE PAGE BUTTONS
    ========================== */
    document.querySelectorAll('.share-buttons').forEach(container => {
        fetch('/includes/share-buttons.html')
            .then(res => res.ok ? res.text() : null)
            .then(html => {
                if (!html) return;
                container.innerHTML = html;

                container.querySelector('.share-btn')?.addEventListener('click', () => handleShare(document.title, pageUrl));
                container.querySelector('.copy-btn')?.addEventListener('click', () => handleCopy(pageUrl));
            });
    });


    /* =========================
       ৩. ARTICLE BOX LOAD FROM JSON
    ========================== */
    const container = document.getElementById('article-container');

    if (container) {
        // লোডিং মেসেজ বা স্পিনার দিতে পারেন এখানে
        container.innerHTML = `<p style="text-align:center;">আর্টিকেল লোড হচ্ছে...</p>`;

        fetch('/data/articles.json')
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                // লেটেস্ট আর্টিকেল আগে দেখানোর জন্য (Reverse)
                data.reverse();

                let articlesHTML = ""; // সব ডাটা একসাথে রাখার জন্য স্ট্রিং

                data.forEach(article => {
                    const fullUrl = article.link.startsWith('http')
                        ? article.link
                        : window.location.origin + '/' + article.link;

                    articlesHTML += `
                        <article class="article-box">
                            <img src="${article.image || '/images/default.webp'}" 
                                 alt="${article.title}" 
                                 class="article-image" loading="lazy">
                            
                            <h2 class="article-heading">${article.title}</h2>

                            <div class="article-meta">
                                <span class="meta-date">
                                    <i class="fa-regular fa-calendar-days"></i> ${article.date}
                                </span>
                                <span class="meta-author">
                                    <i class="fa-solid fa-user"></i> ${article.author}
                                </span>
                            </div>

                            <p class="article-summary">${article.summary}</p>

                            <div class="article-footer">
                                <div class="box-icons">
                                    <span class="share-icon" data-url="${fullUrl}" title="শেয়ার করুন">
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

                container.innerHTML = articlesHTML; // লুপ শেষে একবারেই রেন্ডার হবে
            })
            .catch(err => {
                container.innerHTML = `<p style="color:red; text-align:center;">আর্টিকেল লোড করতে সমস্যা হয়েছে।</p>`;
                console.error("JSON load error:", err);
            });
    }


    /* =========================
       ৪. EVENT DELEGATION (Click Icons)
    ========================== */
    document.addEventListener("click", function(e) {
        const shareBtn = e.target.closest(".share-icon");
        const copyBtn = e.target.closest(".copy-icon");

        if (shareBtn) {
            handleShare(document.title, shareBtn.getAttribute("data-url"));
        }

        if (copyBtn) {
            handleCopy(copyBtn.getAttribute("data-url"));
        }
    });


    /* =========================
       ৫. GLOBAL SHARE FUNCTION
    ========================== */
    window.sharePage = () => handleShare(document.title, pageUrl);

});
