document.addEventListener('DOMContentLoaded', () => {
    const faqWrapper = document.getElementById('faq-wrapper');
    const searchInput = document.getElementById('faqSearch');
    let allData = [];

    // JSON ডাটা লোড করা
    fetch('../data/questions-sexual-ethics.json')
        .then(response => {
            if (!response.ok) throw new Error('ফাইল পাওয়া যায়নি');
            return response.json();
        })
        .then(data => {
            allData = data;
            renderFAQ(allData);
        })
        .catch(err => {
            faqWrapper.innerHTML = `<p style="color:red; text-align:center; padding:20px;">ডাটা লোড হতে সমস্যা হয়েছে।</p>`;
            console.error(err);
        });

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
                            ${item.hadith.transliteration ? `<div class="trans-text"><i>${item.hadith.transliteration}</i></div>` : ''}
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

                    ${item.harmful_effects ? `
                        <div class="points-label label-red">ক্ষতিকর দিকসমূহ:</div>
                        <ul class="points-list harmful">
                            ${item.harmful_effects.map(effect => `<li>${effect}</li>`).join('')}
                        </ul>
                    ` : ''}

                    ${item.important_points ? `
                        <div class="points-label">গুরুত্বপূর্ণ পয়েন্ট:</div>
                        <ul class="points-list">
                            ${item.important_points.map(pt => `<li>${pt}</li>`).join('')}
                        </ul>
                    ` : ''}

                    ${item.solution ? `
                        <div class="points-label label-blue">সমাধান ও করণীয়:</div>
                        <ul class="points-list solution">
                            ${item.solution.map(sol => `<li>${sol}</li>`).join('')}
                        </ul>
                    ` : ''}

                    ${item.conclusion ? `<small class="conclusion">${item.conclusion}</small>` : ''}
                </div>
            </div>
        `).join('');

        // Accordion Action
        document.querySelectorAll('.faq-header').forEach(header => {
            header.onclick = function() {
                const parent = this.parentElement;
                parent.classList.toggle('active');
            };
        });
    }

    // Search Filter
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allData.filter(item => 
            item.question.toLowerCase().includes(term) || 
            item.short_answer.toLowerCase().includes(term)
        );
        renderFAQ(filtered);
    });
});
