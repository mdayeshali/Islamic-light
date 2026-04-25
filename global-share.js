document.addEventListener("DOMContentLoaded", () => {
    // বর্তমান পেজের টাইটেল এবং ফুল লিঙ্ক অটোমেটিক নিবে
    const pageTitle = document.title;
    const pageUrl = window.location.href;

    // শেয়ার ফাংশন
    const handleGlobalShare = (title, url) => {
        if (navigator.share) {
            navigator.share({ title: title, url: url }).catch(err => console.log(err));
        } else {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        }
    };

    // কপি ফাংশন
    const handleGlobalCopy = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            alert('লিংক কপি হয়েছে ✅');
        });
    };

    // যেখানেই এই আইডি পাবে সেখানেই আইকন বসিয়ে দিবে
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

        // ইভেন্ট লিসেনার যুক্ত করা
        shareContainer.querySelector('.g-share-icon').onclick = () => handleGlobalShare(pageTitle, pageUrl);
        shareContainer.querySelector('.g-copy-icon').onclick = () => handleGlobalCopy(pageUrl);
    }
});
