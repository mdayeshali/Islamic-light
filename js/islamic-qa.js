let qaData = [];

// আপনার সঠিক JSON পাথ (data/islamic-qa.json) থেকে ডেটা লোড করা
async function loadQAData() {
    try {
        const response = await fetch('data/islamic-qa.json'); 
        qaData = await response.json();
    } catch (error) {
        console.error("ডেটা লোড করতে সমস্যা হয়েছে:", error);
    }
}

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    // সার্চ বক্স ফাঁকা থাকলে স্ক্রিন সম্পূর্ণ খালি দেখাবে
    if (query === '') {
        resultsContainer.innerHTML = '';
        return;
    }

    // প্রশ্ন, উত্তর, ক্যাটাগরি এবং কি-ওয়ার্ডের মধ্যে ফিল্টার করা
    const filteredData = qaData.filter(item => 
        (item.question && item.question.toLowerCase().includes(query)) || 
        (item.answer && item.answer.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.keywords && item.keywords.some(kw => kw.toLowerCase().includes(query)))
    );

    displayResults(filteredData);
});

// ফলাফল স্ক্রিনে দেখানো (ক্যাটাগরি এবং রেফারেন্স সহ)
function displayResults(data) {
    if (data.length === 0) {
        resultsContainer.innerHTML = '<p class="no-result">কোনো ফলাফল পাওয়া যায়নি। সঠিক শব্দ দিয়ে আবার চেষ্টা করুন।</p>';
        return;
    }

    resultsContainer.innerHTML = data.map(item => `
        <div class="qa-card">
            <div class="question">প্রশ্ন: ${item.question}</div>
            <div class="answer">উত্তর: ${item.answer}</div>
            <div class="meta-info">
                <span class="category">📁 ${item.category || 'সাধারণ'}</span>
                <span class="reference">📖 সূত্র: ${item.reference || 'নেই'}</span>
            </div>
        </div>
    `).join('');
}

// পেজ লোড হওয়ার সাথে সাথে JSON ডেটা ফেচ হবে
window.onload = loadQAData;
