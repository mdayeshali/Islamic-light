document.addEventListener('DOMContentLoaded', () => {
    const faqWrapper = document.getElementById('faq-wrapper');
    const searchInput = document.getElementById('faqSearch');
    let allData = [];

    // JSON ডাটা লোড করা
    fetch('data/questions-sexual-ethics.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            renderFAQ(allData);
        })
        .catch(err => {
            faqWrapper.innerHTML = `<p style="color:red; text-align:center;">ডাটা লোড করতে ব্যর্থ হয়েছে। ফোল্ডার পাথ চেক করুন।</p>`;
            console.error(err);
        });

    // ডাটা দেখানোর ফাংশন
    function renderFAQ(items) {
        if (items.length === 0) {
            faqWrapper.innerHTML = '<p style="text-align:center; padding:20px;">দুঃখিত, কোনো ফলাফল পাওয়া যায়নি।</p>';
            return;
        }

        faqWrapper.innerHTML = items.map(item => `
            <div class="faq-item">
                <div class="faq-header">
                    <h3>${item.id}. ${item.question}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-content">
                    <span class="short-ans">সারসংক্ষেপ: ${item.short_answer}</span>
                    <p class="details-text">${item.answer} ${item.details || ''}</p>
                    
                    ${item.hadith ? `
                        <div class="hadith-section">
                            <div class="arabic">${item.hadith.arabic}</div>
                            <div>${item.hadith.translation}</div>
                            <span class="ref">সূত্র: ${item.hadith.reference}</span>
                        </div>
                    ` : ''}

                    ${item.quran ? `
                        <div class="quran-section">
                            <div class="arabic">${item.quran.arabic}</div>
                            <div>${item.quran.translation}</div>
                            <span class="ref">সূত্র: ${item.quran.reference}</span>
                        </div>
                    ` : ''}

                    ${item.important_points ? `
                        <ul class="points-list">
                            ${item.important_points.map(pt => `<li>${pt}</li>`).join('')}
                        </ul>
                    ` : ''}

                    ${item.conclusion ? `<small class="conclusion">${item.conclusion}</small>` : ''}
                </div>
            </div>
        `).join('');

        // Accordion functionality
        document.querySelectorAll('.faq-header').forEach(header => {
            header.addEventListener('click', () => {
                const parent = header.parentElement;
                parent.classList.toggle('active');
            });
        });
    }

    // সার্চ ফিল্টার
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allData.filter(item => 
            item.question.toLowerCase().includes(term) || 
            item.answer.toLowerCase().includes(term) ||
            item.short_answer.toLowerCase().includes(term)
        );
        renderFAQ(filtered);
    });
});
                      
