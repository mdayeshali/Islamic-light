document.addEventListener('DOMContentLoaded', () => {
    const faqWrapper = document.getElementById('faq-wrapper');
    const searchInput = document.getElementById('faqSearch');
    let allData = [];

    // ১. JSON ডাটা লোড করা
    fetch('../data/questions-sexual-ethics.json')
        .then(response => {
            if (!response.ok) throw new Error('ফাইল খুঁজে পাওয়া যায়নি');
            return response.json();
        })
        .then(data => {
            allData = data;
            renderFAQ(allData);
        })
        .catch(err => {
            faqWrapper.innerHTML = `<p style="color:red; text-align:center; padding:20px;">ডাটা লোড হতে সমস্যা হয়েছে। আপনার JSON ফাইলের পাথ এবং ফরম্যাট চেক করুন।</p>`;
            console.error("Fetch Error:", err);
        });

    // ২. ডাটা রেন্ডার করার মেইন ফাংশন
    function renderFAQ(items) {
        if (items.length === 0) {
            faqWrapper.innerHTML = '<p style="text-align:center; padding:30px; color:var(--muted);">দুঃখিত, আপনার সার্চের সাথে মিলে এমন কিছু পাওয়া যায়নি।</p>';
            return;
        }

        faqWrapper.innerHTML = items.map(item => `
            <div class="faq-item">
                <div class="faq-header">
                    <h3>${item.id}. ${item.question}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-content">
                    <div class="short-ans-box" style="background: #e0f2f1; padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #009688;">
                        <strong style="color: #004d40;">সংক্ষিপ্ত উত্তর:</strong> ${item.short_answer}
                    </div>

                    <div class="ans-body" style="margin-bottom: 15px; color: var(--text);">
                        <p style="font-weight: 500; margin-bottom: 8px;">${item.answer}</p>
                        ${item.details ? `<p style="color: #555; font-size: 0.95rem;">${item.details}</p>` : ''}
                    </div>
                    
                    ${item.quran ? `
                        <div class="ref-box quran" style="background: #f1f8e9; padding: 15px; border-radius: 8px; margin: 15px 0; border-right: 4px solid #558b2f;">
                            <div class="arabic" style="font-size: 1.4rem; text-align: right; color: #2e7d32; font-family: 'Amiri', serif; margin-bottom: 10px;">${item.quran.arabic}</div>
                            <div class="translation" style="font-size: 0.95rem;"><strong>অনুবাদ:</strong> ${item.quran.translation}</div>
                            <span class="ref-tag" style="display: block; font-size: 0.8rem; color: #689f38; margin-top: 8px;">সূত্র: ${item.quran.reference}</span>
                        </div>
                    ` : ''}

                    ${item.hadith ? `
                        <div class="ref-box hadith" style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0; border-right: 4px solid #004d40;">
                            <div class="arabic" style="font-size: 1.4rem; text-align: right; color: #1b5e20; font-family: 'Amiri', serif; margin-bottom: 10px;">${item.hadith.arabic}</div>
                            ${item.hadith.transliteration ? `<div class="transliteration" style="font-style: italic; font-size: 0.9rem; color: #444; margin-bottom: 5px;">${item.hadith.transliteration}</div>` : ''}
                            <div class="translation" style="font-size: 0.95rem;"><strong>অনুবাদ:</strong> ${item.hadith.translation}</div>
                            <span class="ref-tag" style="display: block; font-size: 0.8rem; color: #2e7d32; margin-top: 8px;">সূত্র: ${item.hadith.reference}</span>
                        </div>
                    ` : ''}

                    ${item.important_points ? `
                        <div class="points-section" style="margin-top: 15px; padding: 10px; background: #fafafa; border-radius: 8px;">
                            <strong style="color: #333;">মূল পয়েন্টসমূহ:</strong>
                            <ul class="points-list" style="margin-top: 8px; padding-left: 20px; color: #444;">
                                ${item.important_points.map(pt => `<li style="margin-bottom: 5px;">${pt}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${item.solution ? `
                        <div class="solution-section" style="margin-top: 15px;">
                            <strong style="color: #d32f2f;">করণীয়/সমাধান:</strong>
                            <ul style="margin-top: 5px; padding-left: 20px; color: #d32f2f;">
                                ${item.solution.map(sol => `<li style="margin-bottom: 3px;">${sol}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${item.conclusion ? `<div class="conclusion" style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc; font-style: italic; color: #777; font-size: 0.9rem;">${item.conclusion}</div>` : ''}
                </div>
            </div>
        `).join('');

        // ৩. আকর্ডিয়ন ফাংশনালিটি (ক্লিক করলে ওপেন হওয়া)
        document.querySelectorAll('.faq-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                // অন্যগুলো বন্ধ করতে চাইলে নিচের লাইনটি ব্যবহার করুন (ঐচ্ছিক)
                // document.querySelectorAll('.faq-item').forEach(i => { if(i !== item) i.classList.remove('active'); });
                item.classList.toggle('active');
            });
        });
    }

    // ৪. সার্চ ফিল্টার
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allData.filter(item => 
            item.question.toLowerCase().includes(term) || 
            item.short_answer.toLowerCase().includes(term) ||
            item.answer.toLowerCase().includes(term)
        );
        renderFAQ(filtered);
    });
});
