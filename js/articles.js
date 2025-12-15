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
