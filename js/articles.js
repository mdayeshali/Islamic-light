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
    ========================== */
    document.querySelectorAll('.share-buttons').forEach(container => {
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

        container.querySelector('.inner-share-btn').addEventListener('click', () => handleShare(document.title, pageUrl));
        container.querySelector('.inner-copy-btn').addEventListener('click', () => handleCopy(pageUrl));
    });


    /* =========================
       ৩. মেইন পেজের বক্স লোড (বামে ফিচারড + ডানে লিস্ট)
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
                if (!data || data.length === 0) {
                    container.innerHTML = `<p style="text-align:center;">কোনো আর্টিকেল পাওয়া যায়নি।</p>`;
                    return;
                }

                // ইউআরএল সঠিক করার ফাংশন
                const getFullUrl = (path) => {
                    if (path.startsWith('http')) return path;
                    const cleanPath = path.startsWith('/') ? path : '/' + path;
                    return window.location.origin + '/articles' + cleanPath;
                };

                let layoutHTML = `<div class="desktop-layout-wrapper">`;

                // --- ১. সর্বশেষ (প্রথম) পোস্ট - ফিচারড আর্টিকেল (বাম পাশ) ---
                const featured = data[0];
                const featuredUrl = getFullUrl(featured.link);

                layoutHTML += `
                    <div class="featured-column">
                        <article class="article-box featured-box">
                            <a href="${featured.link}">
                                <img src="${featured.image || '/images/default.webp'}" 
                                     alt="${featured.title}" 
                                     class="article-image" loading="lazy">
                            </a>
                            
                            <h2 class="article-heading">${featured.title}</h2>

                            <div class="article-meta">
                                <span class="meta-date">
                                    <i class="fa-regular fa-calendar-days"></i> পোস্ট: ${featured.date}
                                </span>
                                <span class="meta-author">
                                    <i class="fa-solid fa-user"></i> ${featured.author}
                                </span>
                            </div>

                            <p class="article-summary">${featured.summary}</p>

                            <div class="article-footer">
                                <div class="box-icons">
                                    <span class="share-icon" data-url="${featuredUrl}" data-title="${featured.title}" title="শেয়ার করুন">
                                        <i class="fa-solid fa-share-nodes"></i>
                                    </span>
                                    <span class="copy-icon" data-url="${featuredUrl}" title="লিংক কপি করুন">
                                        <i class="fa-regular fa-copy"></i>
                                    </span>
                                </div>
                                <a href="${featured.link}" class="read-more-link">আরও পড়ুন</a>
                            </div>
                        </article>
                    </div>
                `;

                // --- ২. অন্যান্য বাকি পোস্টসমূহ - সাইডবার লিস্ট (ডান পাশ) ---
                layoutHTML += `<div class="sidebar-column">`;

                for (let i = 1; i < data.length; i++) {
                    const article = data[i];
                    const articleUrl = getFullUrl(article.link);

                    layoutHTML += `
                        <article class="article-box sidebar-card">
                            <div class="sidebar-thumb">
                                <a href="${article.link}">
                                    <img src="${article.image || '/images/default.webp'}" alt="${article.title}" loading="lazy">
                                </a>
                            </div>
                            <div class="sidebar-info">
                                <h3 class="article-heading sidebar-title">
                                    <a href="${article.link}">${article.title}</a>
                                </h3>
                                <div class="article-meta sidebar-meta">
                                    <span class="meta-date"><i class="fa-regular fa-calendar-days"></i> ${article.date}</span>
                                </div>
                                <p class="article-summary sidebar-summary-hidden" style="display:none;">${article.summary}</p>
                            </div>
                        </article>
                    `;
                }

                layoutHTML += `</div></div>`; // wrappers close

                container.innerHTML = layoutHTML;
            })
            .catch(err => {
                console.error(err);
                container.innerHTML = `<p style="color:red; text-align:center;">আর্টিকেল লোড করতে সমস্যা হয়েছে।</p>`;
            });
    }


    /* =========================
       ৪. ইভেন্ট ডেলিগেশন (আইকনের জন্য)
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


/* =========================
   ৫. সাজেশন বক্স (আরও পড়ুন)
========================== */
const suggestionsBox = document.getElementById('more-read-container');

if (suggestionsBox) {
    fetch('/data/articles.json')
        .then(res => res.json())
        .then(data => {
            let currentUrl = window.location.pathname;
            let urlParts = currentUrl.split('/');
            let folderName = urlParts.length > 2 ? urlParts[urlParts.length - 2] : "";

            let relatedData = data.filter(article => {
                let isNotCurrent = !currentUrl.includes(article.link);
                let isRelated = folderName && article.link.includes(folderName);
                return isNotCurrent && isRelated;
            });

            if (relatedData.length === 0) {
                relatedData = data.filter(article => !currentUrl.includes(article.link));
            }

            let finalSelection = relatedData.sort(() => 0.5 - Math.random()).slice(0, 10);

            let html = `<h3>আরও পড়ুন</h3><ul class="more-read-list">`;

            finalSelection.forEach(article => {
                let finalLink = article.link.startsWith('http') 
                                ? article.link 
                                : `/articles/${article.link}`;

                html += `
                    <li>
                        <a href="${finalLink}">
                            <i class="fa-solid fa-arrow-right"></i> ${article.title}
                        </a>
                    </li>
                `;
            });

            html += `</ul>`;
            
            if (relatedData.length > 10) {
                html += `<a href="/articles/article.html" class="view-all-link">সবগুলো আর্টিকেল দেখুন...</a>`;
            }

            suggestionsBox.innerHTML = html;
        })
        .catch(err => console.error("Suggestions error:", err));
}


/* =========================
   ৬. সার্চ সিস্টেম (Real-time Search)
========================== */
const searchInput = document.getElementById('article-search');
const clearBtn = document.getElementById('clear-search');

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase().trim();

        if (query.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }

        const articleBoxes = document.querySelectorAll('.article-box');

        articleBoxes.forEach(box => {
            const title = box.querySelector('.article-heading')?.textContent.toLowerCase() || '';
            const summary = box.querySelector('.article-summary')?.textContent.toLowerCase() || '';

            if (title.includes(query) || summary.includes(query)) {
                box.style.display = box.classList.contains('sidebar-card') ? 'flex' : 'block';
            } else {
                box.style.display = 'none';
            }
        });
    });
}

if (clearBtn) {
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        searchInput.focus();

        const articleBoxes = document.querySelectorAll('.article-box');
        articleBoxes.forEach(box => {
            box.style.display = box.classList.contains('sidebar-card') ? 'flex' : 'block';
        });
    });
}
