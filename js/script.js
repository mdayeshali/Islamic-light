// articles.js - শুধুমাত্র Read More, Native Share, এবং Copy Link ফাংশনালিটি

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // ১. রিড মোর / কম পড়ুন ফাংশনালিটি
    // =========================================
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', () => {
            const articleBox = button.closest('.article-box');
            const fullContent = articleBox.querySelector('.article-full');

            // .article-full এর ডিসপ্লে স্টাইল টগল করা
            if (fullContent.style.display === 'block') {
                fullContent.style.display = 'none';
                button.textContent = 'আরও পড়ুন';
            } else {
                fullContent.style.display = 'block';
                button.textContent = 'কম পড়ুন';
            }
        });
    });

    // =========================================
    // ২. নেটিভ শেয়ার ফাংশনালিটি (Web Share API)
    // =========================================
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            
            const articleUrl = button.getAttribute('data-url');
            const articleBox = button.closest('.article-box');
            
            // ডেটা সংগ্রহ করা
            const articleTitle = articleBox.querySelector('.article-heading').textContent;
            const articleSummary = articleBox.querySelector('.article-summary').textContent;

            // নেটিভ শেয়ার API উপলব্ধ কি না তা পরীক্ষা করা
            if (navigator.share) {
                
                // নেটিভ শেয়ার শীট চালু করা
                navigator.share({
                    title: articleTitle,
                    text: `পড়ুন: ${articleTitle} - ${articleSummary.substring(0, 70)}...`,
                    url: articleUrl,
                })
                .then(() => {
                    // শেয়ার সফল হলে কোনো অ্যাকশন
                    console.log('সফলভাবে শেয়ার করা হয়েছে');
                })
                .catch((error) => {
                    // যদি ইউজার শেয়ার বাতিল করে বা ত্রুটি হয়
                    console.log('শেয়ার করার সময় ত্রুটি বা ব্যবহারকারী বাতিল করেছে:', error);
                });
                
            } else {
                // যদি Web Share API উপলব্ধ না থাকে (ফ্যালব্যাক)
                // এই ক্ষেত্রে আপনি কপি লিংক বাটনটি সক্রিয় করতে বলতে পারেন
                
                // সরাসরি ক্লিপবোর্ডে লিংক কপি করে ফ্যালব্যাক হিসেবে ব্যবহার
                navigator.clipboard.writeText(articleUrl).then(() => {
                    alert(`নেটিভ শেয়ার অপশনটি কাজ করছে না। লিংক কপি করা হয়েছে: ${articleUrl}`);
                }).catch(err => {
                    alert('কপি করা সম্ভব হয়নি। অনুগ্রহ করে URL ম্যানুয়ালি কপি করুন।');
                });
            }
        });
    });

    // =========================================
    // ৩. কপি লিংক ফাংশনালিটি
    // =========================================
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const articleUrl = button.getAttribute('data-url');

            // ক্লিপবোর্ডে লিংক কপি করা
            navigator.clipboard.writeText(articleUrl).then(() => {
                alert('✅ আর্টিকেলের লিংক কপি করা হয়েছে!');
            }).catch(err => {
                console.error('কপি করতে ব্যর্থ:', err);
                alert('লিংক কপি করা যায়নি।');
            });
        });
    });

});
