// ============================
// Islamic Light — Aqeedah Section Scripts
// ============================

// Smooth scroll to internal links
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Highlight current TOC link on scroll
  const sections = document.querySelectorAll('section');
  const tocLinks = document.querySelectorAll('.toc a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});

// Copy current page link (for sharing)
function copyPageLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert('লিংক কপি হয়েছে ✅');
  }).catch(() => {
    alert('লিংক কপি করতে সমস্যা হয়েছে');
  });
}
