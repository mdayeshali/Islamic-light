document.addEventListener('DOMContentLoaded', () => {
    const faqWrapper = document.getElementById('faq-wrapper');
    const searchInput = document.getElementById('faqSearch');
    let allData = [];

    // সাহায্যকারী ফাংশন: রেফারেন্স টেক্সট বা অ্যারে হলে তা হ্যান্ডেল করার জন্য
    function formatReference(ref) {
        if (!ref) return '';
        if (Array.isArray(ref)) {
            return ref.join(', ');
        }
        return ref;
    }

    // ডাটা রেন্ডার করার মূল ফাংশন
    function renderFAQ(items) {
        if (!items || items.length === 0) {
            faqWrapper.innerHTML = '<p style="text-align:center; padding:20px;">দুঃখিত, কোনো ফলাফল পাওয়া যায়নি।</p>';
            return;
        }

        faqWrapper.innerHTML = items.map(item => {
            const id = item.id || '';
            const question = item.question || '';
            const shortAnswer = item.short_answer || '';
            const answer = item.answer || '';
            const details = item.details || '';
            const conclusion = item.conclusion || '';
            const medicalNote = item.medical_note || '';

            // কোরআন ব্লকের প্রসেসিং
            let quranHtml = '';
            if (item.quran) {
                const quranItems = Array.isArray(item.quran) ? item.quran : [item.quran];
                quranHtml = quranItems.map(q => `
                    <div class="quran-section" style="margin: 15px 0; padding: 12px; border-right: 4px solid #4a5568; background: #f7fafc;">
                        ${q.arabic ? `<div class="arabic" style="font-size: 1.4rem; font-weight: bold; margin-bottom: 8px; direction: rtl; text-align: right;">${q.arabic}</div>` : ''}
                        ${q.translation ? `<div style="color: #2d3748; font-size: 1rem;">${q.translation}</div>` : ''}
                        ${q.reference ? `<span class="ref" style="font-size: 0.85rem; color: #718096; display: block; margin-top: 5px;">সূত্র: ${formatReference(q.reference)}</span>` : ''}
                    </div>
                `).join('');
            }

            // হাদিস ব্লকের প্রসেসিং
            let hadithHtml = '';
            if (item.hadith) {
                const hadithItems = Array.isArray(item.hadith) ? item.hadith : [item.hadith];
                hadithHtml = hadithItems.map(h => `
                    <div class="hadith-section" style="margin: 15px 0; padding: 12px; border-right: 4px solid #319795; background: #f7fafc;">
                        ${h.arabic ? `<div class="arabic" style="font-size: 1.4rem; font-weight: bold; margin-bottom: 8px; direction: rtl; text-align: right;">${h.arabic}</div>` : ''}
                        ${h.transliteration ? `<div class="trans-text" style="color: #4a5568; font-style: italic; margin-bottom: 4px;"><i>${h.transliteration}</i></div>` : ''}
                        ${h.text ? `<div class="details-text" style="margin-top:0; color: #2d3748;">${h.text}</div>` : ''}
                        ${h.translation ? `<div style="color: #2d3748;">${h.translation}</div>` : ''}
                        ${h.reference ? `<span class="ref" style="font-size: 0.85rem; color: #718096; display: block; margin-top: 5px;">সূত্র: ${formatReference(h.reference)}</span>` : ''}
                    </div>
                `).join('');
            }

            // দোয়া ব্লকের প্রসেসিং
            let duaHtml = '';
            if (item.dua) {
                const duaItems = Array.isArray(item.dua) ? item.dua : [item.dua];
                duaHtml = duaItems.map(d => `
                    <div class="se-dua" style="margin: 20px 0; background: #f0fdfa; border: 1px dashed #009688; padding: 20px; border-radius: 10px; text-align: center;">
                        ${d.arabic ? `<div class="arabic" style="font-size: 1.5rem; color: #004d40; margin-bottom: 10px; line-height: 1.8; direction: rtl; text-align: right;">${d.arabic}</div>` : ''}
                        ${d.transliteration ? `<div class="transliteration" style="color: #475569; font-style: italic; margin-bottom: 6px;"><strong>উচ্চারণ:</strong> ${d.transliteration}</div>` : ''}
                        ${d.translation ? `<div class="meaning" style="color: #004d40;"><strong>অর্থ:</strong> ${d.translation}</div>` : ''}
                    </div>
                `).join('');
            }

            // বিভিন্ন প্রকার লিস্ট বা তালিকার প্রসেসিং
            const listsHtml = [
                { data: item.harmful_effects, label: 'ক্ষতিকর দিকসমূহ:', class: 'harmful label-red' },
                { data: item.forbidden_actions, label: 'নিষিদ্ধ কাজসমূহ:', class: 'harmful label-red' },
                { data: item.why_discouraged, label: 'অনুৎসাহিত করার কারণসমূহ:', class: 'harmful label-red' },
                { data: item.wrong_sources, label: 'ভুল বা বর্জনীয় উৎসসমূহ:', class: 'harmful label-red' },
                { data: item.important_points, label: 'গুরুত্বপূর্ণ পয়েন্ট:', class: '' },
                { data: item.important_topics, label: 'গুরুত্বপূর্ণ বিষয়সমূহ:', class: '' },
                { data: item.solution, label: 'সমাধান ও করণীয়:', class: 'solution label-blue' },
                { data: item.practical_steps, label: 'বাস্তবমুখী পদক্ষেপ বা আমল:', class: 'solution label-blue' },
                { data: item.correct_sources, label: 'সঠিক ও নির্ভরযোগ্য উৎসসমূহ:', class: 'solution label-blue' },
                { data: item.islamic_guidance, label: 'ইসলামিক নির্দেশনা বা পরামর্শ:', class: 'solution label-blue' }
            ].map(list => {
                if (list.data && Array.isArray(list.data) && list.data.length > 0) {
                    const cleanClass = list.class.split(' ')[0] || '';
                    const labelClass = list.class || '';
                    return `
                        <div style="margin-top: 12px; font-weight: bold;" class="points-label ${labelClass}">${list.label}</div>
                        <ul class="points-list ${cleanClass}">
                            ${list.data.map(li => `<li>${li}</li>`).join('')}
                        </ul>
                    `;
                }
                return '';
            }).join('');

            // চূড়ান্ত HTML স্ট্রাকচার
            return `
                <div class="faq-item">
                    <div class="faq-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                        <h3>${id}. ${question}</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-content">
                        ${shortAnswer ? `<span class="short-ans" style="display: block; font-weight: bold; margin-bottom: 8px; color: #2c5282;">সারসংক্ষেপ: ${shortAnswer}</span>` : ''}
                        
                        ${answer || details ? `
                            <p class="details-text" style="color: #2d3748;">
                                ${answer ? `<strong>উত্তর:</strong> ${answer}` : ''}
                                ${details ? `<br><br>${details}` : ''}
                            </p>
                        ` : ''}
                        
                        ${quranHtml}
                        ${hadithHtml}
                        ${duaHtml} 
                        ${listsHtml}

                        ${medicalNote ? `
                            <div class="hadith-section" style="margin: 15px 0; padding: 12px; border-right: 4px solid #009688; background: #f0fdfa;">
                                <strong style="color: #00796b;">চিকিৎসাবিজ্ঞান ও স্বাস্থ্যগত তথ্য:</strong>
                                <p class="details-text" style="margin-top: 5px; color: #2d3748;">${medicalNote}</p>
                            </div>
                        ` : ''}

                        ${conclusion ? `<small class="conclusion" style="display: block; margin-top: 10px; color: #718096; font-style: italic;">উপসংহার: ${conclusion}</small>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // আকর্ডিয়ন চালুর লজিক (ইভেন্ট ডেলিগেশন)
        faqWrapper.onclick = function(e) {
            const header = e.target.closest('.faq-header');
            if (header) {
                header.parentElement.classList.toggle('active');
            }
        };
    }

    // ডাটা লোড করার প্রফেশনাল ফাংশন
    function loadFAQData() {
        fetch('../data/questions-sexual-ethics.json', { cache: 'no-cache' })
            .then(response => {
                if (!response.ok) throw new Error('JSON ফাইল পাওয়া যায়নি।');
                return response.json();
            })
            .then(data => {
                allData = data;
                renderFAQ(allData); // ডেটা লোড হওয়া মাত্রই প্রথমবার স্ক্রিনে পুরো লিস্ট দেখাবে
            })
            .catch(err => {
                faqWrapper.innerHTML = `<p style="color:red; text-align:center; padding:20px;">ডাটা লোড হতে সমস্যা হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।</p>`;
                console.error(err);
            });
    }

    // লাইভ সার্চ ফিল্টারিং সিস্টেম
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (!term) {
            renderFAQ(allData);
            return;
        }
        const filtered = allData.filter(item => 
            (item.question && item.question.toLowerCase().includes(term)) || 
            (item.short_answer && item.short_answer.toLowerCase().includes(term)) ||
            (item.answer && item.answer.toLowerCase().includes(term))
        );
        renderFAQ(filtered);
    });

    // পেজ ওপেন হওয়ার সাথে সাথেই ফাংশনটি চালু হবে
    loadFAQData();
});
                 
