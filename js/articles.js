document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll('.share-buttons').forEach(container => {

        fetch('/includes/share-buttons.html')
            .then(res => res.text())
            .then(html => {
                container.innerHTML = html;

                const shareBtn = container.querySelector('.share-btn');
                const copyBtn = container.querySelector('.copy-btn');
                const pageUrl = window.location.href;

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

});

fetch('/data/articles.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('article-container');

    if (!container) return;

    data.forEach(article => {
      const isExternal = article.link.startsWith('http');

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
            <div class="share-buttons"></div>

            <a href="${article.link}"
               class="read-more-link"
               ${isExternal ? 'target="_blank" rel="noopener"' : ''}>
               আরও পড়ুন
            </a>

          </div>

        </div>
      `;
    });
  });

