document.addEventListener("DOMContentLoaded", () => {
    const pageTitle = document.title;
    const pageUrl = window.location.href;

    const handleGlobalShare = (title, url) => {
        if (navigator.share) {
            navigator.share({ title: title, url: url }).catch(err => console.log("Share failed:", err));
        } else {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        }
    };

    const handleGlobalCopy = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            alert('লিংক কপি হয়েছে ✅');
        });
    };

    // আপনার ID অনুযায়ী আইকন বসানো
    const shareContainer = document.getElementById('global-share-system');

    if (shareContainer) {
        shareContainer.innerHTML = `
            <div class="global-share-box">
                <span class="g-share-icon" title="শেয়ার করুন">
                    <i class="fa-solid fa-share-nodes"></i>
                </span>
                <span class="g-copy-icon" title="লিংক কপি করুন">
                    <i class="fa-regular fa-copy"></i>
                </span>
            </div>
        `;

        shareContainer.querySelector('.g-share-icon').onclick = () => handleGlobalShare(pageTitle, pageUrl);
        shareContainer.querySelector('.g-copy-icon').onclick = () => handleGlobalCopy(pageUrl);
    }
});
