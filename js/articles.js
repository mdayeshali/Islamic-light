document.addEventListener("DOMContentLoaded", () => {

    const pageUrl = window.location.href;

    /* =========================
       ১. ARTICLE PAGE BUTTONS
    ========================== */

    document.querySelectorAll('.share-buttons').forEach(container => {

        fetch('/includes/share-buttons.html')
            .then(res => res.text())
            .then(html => {
                container.innerHTML = html;

                const shareBtn = container.querySelector('.share-btn');
                const copyBtn = container.querySelector('.copy-btn');

                if (shareBtn) {
                    shareBtn.addEventListener('click', () => {
                        if (navigator.share) {
                            navigator.share({
                                title: document.title,
                                url: pageUrl
                            });
                        } else {
                            window.open(
                                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
                                '_blank'
                            );
                        }
                    });
                }

                if (copyBtn) {
                    copyBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(pageUrl);
                        alert('লিংক কপি হয়েছে ✅');
                    });
                }
            });
    });


    /* =========================
       ২. ARTICLE BOX LOAD (JSON)
    ========================== */

    const container = document.getElementById('article-container');

    if (container) {

        fetch('/data/articles.json')
            .then(res => res.json())
            .then(data => {

                // 🔥 Latest article first
                data.reverse();

                data.forEach(article => {

                    const fullUrl = article.link.startsWith('http')
                        ? article.link
                        : window.location.origin + '/' + article.link;

                    container.innerHTML += `
                        <div class="article-box">

                            <img src="${article.image || '/images/default.webp'}"
                                 alt="${article.title}"
                                 class="article-image">

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
                                    <span class="share-icon" data-url="${fullUrl}">
                                        <i class="fa-solid fa-share-nodes"></i>
                                    </span>

                                    <span class="copy-icon" data-url="${fullUrl}">
                                        <i class="fa-regular fa-copy"></i>
                                    </span>
                                </div>

                                <a href="${article.link}" class="read-more-link">
                                    আরও পড়ুন
                                </a>

                            </div>

                        </div>
                    `;
                });

            })
            .catch(err => {
                console.error("JSON load error:", err);
            });
    }


    /* =========================
       ৩. ICON CLICK EVENTS
    ========================== */

    document.addEventListener("click", function(e) {

        // SHARE ICON
        if (e.target.closest(".share-icon")) {
            const btn = e.target.closest(".share-icon");
            const url = btn.getAttribute("data-url");

            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: url
                });
            } else {
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                    '_blank'
                );
            }
        }

        // COPY ICON
        if (e.target.closest(".copy-icon")) {
            const btn = e.target.closest(".copy-icon");
            const url = btn.getAttribute("data-url");

            navigator.clipboard.writeText(url);
            alert("লিংক কপি হয়েছে ✅");
        }

    });


    /* =========================
       ৪. TOP SHARE ICON
    ========================== */

    window.sharePage = function () {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: pageUrl
            });
        } else {
            navigator.clipboard.writeText(pageUrl);
            alert("লিংক কপি হয়েছে ✅");
        }
    };

});
