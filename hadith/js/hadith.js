let hadithData = {};
let currentBook = "";

// 📌 বই লোড করা
function loadBook(file) {
  fetch(file)
    .then((response) => response.json())
    .then((data) => {
      hadithData = data;
      currentBook = data.book;
      document.getElementById("book-title").innerText = data.book;
      loadChapters(data.chapters);

      // 👉 সব লিস্ট থেকে active ক্লাস মুছে ফেলা
      let allLis = document.querySelectorAll(".book-list li");
      allLis.forEach((li) => li.classList.remove("active"));

      // 👉 যেটি ক্লিক করা হয়েছে সেটিতে active ক্লাস যোগ করা
      let clickedLi = Array.from(allLis).find((li) =>
        li.getAttribute("onclick").includes(file)
      );
      if (clickedLi) clickedLi.classList.add("active");
    });
}

// 📌 অধ্যায় লোড করা
function loadChapters(chapters) {
  let chapterDiv = document.getElementById("chapter-list");
  chapterDiv.innerHTML = "<h3>অধ্যায়</h3>";
  chapters.forEach((chapter) => {
    let btn = document.createElement("button");
    btn.innerText = chapter.name;
    btn.onclick = () => loadHadiths(chapter.hadiths, chapter.name);
    chapterDiv.appendChild(btn);
  });
}

// 📌 হাদিস লোড করা
function loadHadiths(hadiths, chapterName) {
  let hadithDiv = document.getElementById("hadith-list");
  hadithDiv.innerHTML = `<h3>${chapterName}</h3>`;
  hadiths.forEach((hadith) => {
    let p = document.createElement("div");
    p.classList.add("hadith-box");
    p.innerHTML = `
      <h4>হাদিস ${hadith.number}</h4>
      <p class="arabic">${hadith.arabic}</p>
      <p class="translation">${hadith.translation}</p>
    `;
    hadithDiv.appendChild(p);
  });
}
