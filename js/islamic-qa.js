let qaData = [];

// JSON ফাইল থেকে ডেটা লোড করা
async function loadQAData() {
    try {
        const response = await fetch('data/islamic-qa.json'); 
        qaData = await response.json();
        
        // পেজ লোড হওয়ার পর ইউআরএল-এ কোনো নির্দিষ্ট ID আছে কিনা চেক করা (Direct Link Feature)
        checkDirectLink();
    } catch (error) {
        console.error("ডেটা লোড করতে সমস্যা হয়েছে:", error);
    }
}

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (query === '') {
        resultsContainer.innerHTML = '';
        // সার্চ খালি হলে ইউআরএল থেকে আইডি প্যারামিটার সরিয়ে দেওয়া
        window.history.pushState({}, '', window.location.pathname);
        return;
    }

    const filteredData = qaData.filter(item => 
        (item.question && item.question.toLowerCase().includes(query)) || 
        (item.answer && item.answer.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.keywords && item.keywords.some(kw => kw.toLowerCase().includes(query)))
    );

    displayResults(filteredData);
});

// ফলাফল স্ক্রিনে দেখানো
function displayResults(data) {
    if (data.length === 0) {
        resultsContainer.innerHTML = '<p class="no-result">কোনো ফলাফল পাওয়া যায়নি। সঠিক শব্দ দিয়ে আবার চেষ্টা করুন।</p>';
        return;
    }

    resultsContainer.innerHTML = data.map(item => {
        // নতুন array এবং পুরোনো string উভয় ধরণের রেফারেন্স সাপোর্ট করার লজিক
        let refText = 'নেই';
        if (item.references && Array.isArray(item.references)) {
            refText = item.references.join(', ');
        } else if (item.reference) {
            refText = item.reference;
        }

        return `
            <div class="qa-card" id="qa-${item.id}">
                <div class="question">প্রশ্ন: ${item.question}</div>
                <div class="answer">উত্তর: ${item.answer}</div>
                <div class="meta-info">
                    <span class="category">📁 ${item.category || 'সাধারণ'}</span>
                    <span class="reference">📖 সূত্র: ${refText}</span>
                </div>
                
                <div class="qa-actions">
                    <button class="action-btn" onclick="copyQA(${item.id})">
                        <i class="fa-regular fa-copy"></i> কপি করুন
                    </button>
                    <button class="action-btn" onclick="shareWhatsApp(${item.id})">
                        <i class="fa-brands fa-whatsapp"></i> হোয়াটসঅ্যাপ
                    </button>
                    <button class="action-btn" onclick="shareWeb(${item.id})">
                        <i class="fa-solid fa-share-nodes"></i> অন্যান্য
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ১. ডাইনামিক শেয়ার লিঙ্ক তৈরি করার লজিক
function getShareLink(id) {
    return `${window.location.origin}${window.location.pathname}?id=${id}`;
}

// ২. হেল্পার ফাংশন: কপি বা শেয়ারের সময় টেক্সট ফরম্যাট তৈরি করা
function getFormattedQA(item) {
    let refText = 'নেই';
    if (item.references && Array.isArray(item.references)) {
        refText = item.references.join('\n• ');
        refText = '\n• ' + refText; // সুন্দর লিস্ট ফরম্যাট করার জন্য
    } else if (item.reference) {
        refText = ' ' + item.reference;
    }
    return `প্রশ্ন: ${item.question}\n\nউত্তর: ${item.answer}\n\nসূত্র:${refText}\n\nবিস্তারিত পড়ুন: ${getShareLink(item.id)}`;
}

// ৩. টেক্সট এবং লিঙ্ক একসাথে কপি করার ফাংশন
function copyQA(id) {
    const item = qaData.find(q => q.id === id);
    if (!item) return;

    const textToCopy = getFormattedQA(item);
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("✓ প্রশ্ন ও উত্তর কপি হয়েছে!");
    }).catch(err => {
        console.error("কপি করা যায়নি: ", err);
    });
}

// ৪. হোয়াটসঅ্যাপে ডিরেক্ট শেয়ার
function shareWhatsApp(id) {
    const item = qaData.find(q => q.id === id);
    if (!item) return;

    // হোয়াটসঅ্যাপ মেসেজের জন্য একটু বোল্ড ও সুন্দর ফরম্যাট
    let refText = 'নেই';
    if (item.references && Array.isArray(item.references)) {
        refText = item.references.join('\n_• _');
        refText = '\n_• _' + refText;
    } else if (item.reference) {
        refText = ' ' + item.reference;
    }

    const whatsappText = `*প্রশ্ন:* ${item.question}\n\n*উত্তর:* ${item.answer}\n\n*সূত্র:* ${refText}\n\nলিঙ্ক: ${getShareLink(id)}`;
    const message = encodeURIComponent(whatsappText);
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
}

// ৫. ব্রাউজারের নেটিভ শেয়ার (মোবাইলে ফেসবুক, মেসেঞ্জার ইত্যাদি সব অপশন আসবে)
function shareWeb(id) {
    const item = qaData.find(q => q.id === id);
    if (!item) return;

    if (navigator.share) {
        navigator.share({
            title: item.question,
            text: `প্রশ্ন: ${item.question}\nউত্তর: ${item.answer}`,
            url: getShareLink(id)
        }).catch(console.error);
    } else {
        // যদি ব্রাউজার নেটিভ শেয়ার সাপোর্ট না করে তবে মূল শেয়ার লিঙ্ক কপি করে নিবে
        navigator.clipboard.writeText(getShareLink(id));
        showToast("✓ শেয়ার লিঙ্ক কপি করা হয়েছে!");
    }
}

// ৬. টোস্ট নোটিফিকেশন দেখানোর ফাংশন
function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2300);
}

// ৭. ডিরেক্ট লিঙ্কের মাধ্যমে নির্দিষ্ট প্রশ্ন খুঁজে বের করা
function checkDirectLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    
    if (idParam) {
        const targetId = parseInt(idParam);
        const matchedItem = qaData.filter(q => q.id === targetId);
        
        if (matchedItem.length > 0) {
            displayResults(matchedItem);
        }
    }
}

// পেজ লোড হওয়ার সাথে সাথে ডেটা ফেচ হবে
window.onload = loadQAData;
